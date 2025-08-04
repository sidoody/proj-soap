import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/store";

const reviewPrompt = `
You are an attending. Compare NOTE_A (AI) with NOTE_B (student).
For each section S/O/A/P:
• Accuracy 0-5
• Completeness 0-5
• Clarity 0-5

Return valid JSON:
{
  "overall_score": 0-100,
  "section_feedback": {
    "S": { "score": int, "comment": str },
    "O": { ... },
    "A": { ... },
    "P": { ... }
  },
  "global_comment": str
}`;

export async function POST(req: Request) {
  const { id, studentNote } = await req.json();
  const enc = db.get(id);
  if (!enc?.aiNote) {
    return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
  }
  enc.studentNote = studentNote;

  const messages = [
    { role: "system" as const, content: reviewPrompt },
    { role: "user" as const, content: `NOTE_A: ${enc.aiNote}` },
    { role: "user" as const, content: `NOTE_B: ${studentNote}` },
  ];

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const rubric = JSON.parse(res.choices[0].message.content ?? "{}");
  enc.reviewJson = rubric;
  return NextResponse.json(rubric);
} 