import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/store";
import { clipText } from "@/lib/clipText";
import { defaultReviewPrompt } from "@/lib/reviewPrompt";

export async function POST(req: Request) {
  const { id, studentNote, gradingPrompt } = await req.json();
  const enc = db.get(id);
  if (!enc?.aiNote) {
    return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
  }
  enc.studentNote = studentNote;

  // Resolve prompt in order: inline → saved → default
  let promptToUse = defaultReviewPrompt;
  
  if (gradingPrompt) {
    // Inline override - apply same validation
    const trimmedInlinePrompt = gradingPrompt.trim();
    if (trimmedInlinePrompt.length > 12_000) {
      return NextResponse.json({ error: "Grading prompt exceeds 12,000 character limit" }, { status: 413 });
    }
    promptToUse = trimmedInlinePrompt;
  } else if (enc.reviewPrompt) {
    // Use saved prompt for this encounter
    promptToUse = enc.reviewPrompt;
  }

  const transcript = clipText(enc.csv);
  console.log("Transcript chars:", transcript.length);

  const messages = [
    {
      role: "system" as const,
      content: promptToUse,
    },
    {
      role: "user" as const,
      name: "CONTEXT",
      content:
        "Full encounter transcript (User & Assistant turns):\n\"\"\"\n" +
        transcript +
        "\n\"\"\"",
    },
    {
      role: "user" as const,
      name: "NOTE_A",
      content: enc.aiNote,
    },
    {
      role: "user" as const,
      name: "NOTE_B",
      content: studentNote,

    },
  ];

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const rubric = JSON.parse(res.choices[0].message.content ?? "{}");
  enc.reviewJson = rubric;
  return NextResponse.json(rubric);
} 