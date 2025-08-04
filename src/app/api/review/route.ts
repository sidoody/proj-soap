import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/store";
import { clipText } from "@/lib/clipText";

const reviewPrompt = `
You are an attending physician using the **PDQI-9** rubric with emphasis on **clinical appropriateness**.

Notes:
• NOTE_A = baseline AI-generated SOAP (reference)  
• NOTE_B = student-edited version

**CRITICAL: Use the CONTEXT transcript to judge clinical appropriateness. Inappropriate treatments/medications for the actual clinical scenario should receive LOW scores (1-2).**

Step 1 – Score BOTH notes (Likert 1-5 scale)
  • **Scoring Guidelines:**
    - **5**: Excellent, clinically appropriate, evidence-based
    - **4**: Good, mostly appropriate with minor issues
    - **3**: Adequate, some concerns but not harmful
    - **2**: Poor, inappropriate for clinical scenario or potentially harmful
    - **1**: Dangerous, contraindicated, or completely inappropriate

  • **Key Dimensions with Clinical Focus:**
    - **accurate**: Factually correct AND clinically appropriate for the case
    - **useful**: Helpful for patient care AND safe/appropriate treatments
    - **thorough**: Complete relevant info WITHOUT inappropriate additions
    - **up_to_date**: Current guidelines AND appropriate for this patient
    - **organized/comprehensible/succinct/synthesized/consistent**: Standard PDQI-9

  • **PENALIZE HEAVILY**: 
    - Wrong medications for the condition (e.g., antibiotics for MI)
    - Inappropriate treatments that don't match the clinical scenario
    - Dangerous or contraindicated interventions

Step 2 – Delta  
  • delta = score_B − score_A (range −4→+4).  
  • overall_delta = sum of deltas (range −36→+36).

Step 3 – Edit analysis  
  • **REQUIRED**: Create a "changes" entry for EVERY dimension with a non-zero delta.  
  • If delta ≠ 0, you MUST explain why that dimension score changed.  
  • For each non-zero delta:  
      – \`dimension\` name (exact PDQI-9 dimension that changed)  
      – \`impact\` improved | worsened | neutral  
      – \`snippet\` ≤20 words (specific text that caused the change)  
      – \`comment\` coaching ≤25 words explaining WHY the score changed

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

  const transcript = clipText(enc.csv);
  console.log("Transcript chars:", transcript.length);

  const messages = [
    {
      role: "system" as const,
      content: reviewPrompt,
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