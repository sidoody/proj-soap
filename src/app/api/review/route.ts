import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/store";

const reviewPrompt = `
You are an attending physician using the **PDQI-9** rubric.

• NOTE_A = baseline AI-generated SOAP (reference; do NOT grade it)  
• NOTE_B = student-edited version (grade ONLY the edits)

PDQI-9 dimensions:
  1. up-to-date 2. accurate 3. thorough 4. useful 5. organized
  6. comprehensible 7. succinct 8. synthesized 9. consistent

For EACH detected edit:
  • Decide which single PDQI dimension it impacts most.  
  • Label "impact": improved | worsened | neutral.  
  • Give a ≤25-word coaching "comment".  
  • Provide a ≤20-word "snippet" of the changed text.

After listing edits, compute **delta scores** per dimension
(−5 worse … +5 better) then sum → overall_delta (range −45→+45).

Return STRICT JSON **matching exactly**:

{
  "overall_delta": int,
  "dimension_feedback": {
    "up_to_date":     { "delta": int, "changes": [ { "impact": str, "snippet": str, "comment": str } ] },
    "accurate":       { "delta": int, "changes": [ ... ] },
    "thorough":       { ... },
    "useful":         { ... },
    "organized":      { ... },
    "comprehensible": { ... },
    "succinct":       { ... },
    "synthesized":    { ... },
    "consistent":     { ... }
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