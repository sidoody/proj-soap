import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/store";

const reviewPrompt = `
You are an attending physician using the **PDQI-9** rubric.

Notes:
• NOTE_A = baseline AI-generated SOAP (reference)  
• NOTE_B = student-edited version

Step 1 – Score BOTH notes  
  • For each PDQI dimension (up-to-date, accurate, thorough, useful, organized, comprehensible, succinct, synthesized, consistent)  
    – Give a Likert 1-5 score to NOTE_A.  
    – Give a Likert 1-5 score to NOTE_B.

Step 2 – Delta  
  • delta = score_B − score_A (range −4→+4).  
  • overall_delta = sum of deltas (range −36→+36).

Step 3 – Edit analysis  
  • Detect each textual change.  
  • For each change:  
      – \`dimension\` it impacts most  
      – \`impact\` improved | worsened | neutral  
      – \`snippet\` ≤20 words  
      – \`comment\` coaching ≤25 words

Return STRICT JSON only:

{
  "baseline_scores":    { "up_to_date":int, "accurate":int, "thorough":int, "useful":int, "organized":int, "comprehensible":int, "succinct":int, "synthesized":int, "consistent":int },
  "student_scores":     { "up_to_date":int, "accurate":int, "thorough":int, "useful":int, "organized":int, "comprehensible":int, "succinct":int, "synthesized":int, "consistent":int },
  "delta_scores":       { "up_to_date":int, "accurate":int, "thorough":int, "useful":int, "organized":int, "comprehensible":int, "succinct":int, "synthesized":int, "consistent":int },
  "overall_delta": int,
  "changes": [
     { "dimension":str, "impact":str, "snippet":str, "comment":str }
  ],
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
        `NOTE_A:\n"""\n${enc.aiNote}\n"""\n\n` +
        `NOTE_B:\n"""\n${studentNote}\n"""`
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