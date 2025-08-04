import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/store";

const reviewPrompt = `
You are an attending physician asked to grade **only the student's edits** to a baseline SOAP note.

• NOTE_A = baseline AI-generated note (reference only – do NOT grade it)  
• NOTE_B = student-edited version (the changes to grade)

For each section S / O / A / P:
1. Detect every change (addition, deletion, modification) from NOTE_A to NOTE_B
2. Evaluate if the changes improved, worsened, or had neutral impact on clinical quality
3. Score the changes: 5 = major improvement, 4 = minor improvement, 3 = neutral/no change, 2 = minor worsening, 1 = major worsening, 0 = critical errors
4. Provide coaching feedback on the changes made

IMPORTANT: Calculate overall_score by adding all section scores together:
overall_score = S_score + O_score + A_score + P_score
Example: If sections get 3, 3, 3, 1 then overall_score = 3+3+3+1 = 10

Return strict JSON:

{
  "overall_score": int,           // MUST equal S+O+A+P scores (0-20 scale)
  "section_feedback": {
    "S": { "score": int, "comment": str },
    "O": { "score": int, "comment": str },
    "A": { "score": int, "comment": str },
    "P": { "score": int, "comment": str }
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
    {
      role: "user" as const,
      content:
        `NOTE_A (baseline):\n"""\n${enc.aiNote}\n"""\n\n` +
        `NOTE_B (student edited):\n"""\n${studentNote}\n"""`
    },
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