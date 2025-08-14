import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Home, FileText } from "lucide-react";

export default function Documentation() {
  return (
    <>
      <nav className="bg-black/90 backdrop-blur-sm sticky top-0 z-[100]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-black text-white tracking-tight hover:text-gray-200 transition-colors flex items-center">
                <span className="mr-2">🧼</span>
                Project SOAP
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-gray-200 transition-colors flex items-center">
                <Home size={20} />
              </Link>
              <Link href="/documentation" className="text-white hover:text-gray-200 transition-colors font-medium flex items-center">
                <FileText size={20} />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto max-w-6xl space-y-8 py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <div className="max-w-none">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">How It Works</h2>
            
                         <div className="space-y-10">
               <div>
                 <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                   <span className="bg-gray-600 dark:bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">1</span>
                   Generate SOAP Note
                 </h3>
                 <div className="ml-11 space-y-4">
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300"><strong>Input</strong>: Paste a full patient encounter transcript formatted as user, assistant. Be sure to include all relevant modules.</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">The app parses the dialogue into clinician/patient turns using <code className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">src/lib/parseCsv.ts</code>.</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">A <strong>system prompt</strong> (<code className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">src/lib/prompts.ts</code>) instructs the AI to produce a concise, markdown-formatted SOAP note.</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">The transcript + prompt are sent to the <strong><code className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">/api/generate</code></strong> endpoint, which calls the OpenAI API.</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">The AI-generated SOAP note is stored in memory (<code className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">src/lib/store.ts</code>) and displayed to the user.</p>
                     </div>
                   </div>
                 </div>
                 
                 {/* Expandable code block for prompts.ts */}
                 <div className="ml-11 mt-6">
                   <details className="group">
                     <summary className="cursor-pointer text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                       <span className="mr-3 text-lg">▶</span>
                       <span className="group-open:hidden">Show SOAP generation prompt</span>
                       <span className="hidden group-open:inline">Hide SOAP generation prompt</span>
                     </summary>
                     <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                       <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                         <p className="text-xs font-mono text-gray-600 dark:text-gray-400">src/lib/prompts.ts</p>
                       </div>
                       <div className="max-h-80 overflow-y-auto">
                         <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-4 whitespace-pre-wrap">{`export const systemSOAP = \`
You are a meticulous medical scribe. From the **patient's statements _and_ all actions ALREADY performed in this encounter** (ignore clinician questions), craft a concise **markdown** SOAP note.

## S – Subjective

**HPI (paragraph)** – Chief complaint, onset/chronology, quality, radiation, aggravating & relieving factors, pertinent positives **and** negatives, medication & risk-factor context.  
**ROS (≤ 6 bullets)** – Focused positives/negatives not already in HPI.

## O – Objective (≤ 6 bullets total)

• **Vitals**: write all provided vitals or "—"  
• **Physical Exam**: focused findings or "—"  
• **Diagnostics**: include **every** EKG/lab/imaging result mentioned; collapse duplicates (e.g., "ECG: ST-elevation V2–V4, T-wave inversion III"). Use "—" if none.

## A – Assessment

1–2 sentences: patient profile, pivotal findings, **ranked** leading differential (e.g., "ACS > unstable angina > pericarditis").

## P – Plan

### Completed (what _has already been done_)  
• List interventions that the transcript shows were **ordered _and_ acknowledged as carried out** (keywords: *administered, started, given, established, attached, initiated*).  
*Do **not** list these again in "Next".*

### Next (what is still pending)  
• Diagnostics, therapeutics, disposition **not yet performed** (≤ 6 bullets combined with "Completed").  
Use "—" if nothing remains.

---

### Formatting rules
• Third-person throughout ("Mr. Jones states …").  
• ≤ 6 bullets in ROS, Objective, and **combined** Plan sections.  
• Use "—" when information is absent; never invent data.  
• Resolve conflicting patient statements by preferring the **most specific or recent** information.  
• Preserve clinically important wording (e.g., "heart attack," not "heart failure," if that's what was said).  
• Keep the entire note ≤ 250 words.
\`;`}</pre>
                       </div>
                     </div>
                   </details>
                 </div>
               </div>

               <div>
                 <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                   <span className="bg-gray-600 dark:bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">2</span>
                   Edit & Submit
                 </h3>
                 <div className="ml-11 space-y-4">
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Users can click <strong>&quot;Edit &amp; Review&quot;</strong> to refine the SOAP note.</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Their edits are saved as the <strong>student note</strong> for the encounter.</p>
                     </div>
                   </div>
                 </div>
               </div>

               <div>
                 <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                   <span className="bg-gray-600 dark:bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">3</span>
                   AI Review & Grading
                 </h3>
                 <div className="ml-11 space-y-4">
                   <p className="text-gray-700 dark:text-gray-300 mb-4">On submission, the <strong><code className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">/api/review</code></strong> endpoint:</p>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Retrieves the original AI note and the student-edited note.</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Uses a <strong>PDQI-9 scoring rubric</strong> with clinical appropriateness rules (<code className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">src/app/api/review/route.ts</code>).</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Compares both notes against the encounter transcript.</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300 mb-2">Returns JSON with:</p>
                       <div className="ml-6 space-y-2">
                         <div className="flex items-start space-x-3">
                           <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2.5 flex-shrink-0"></div>
                           <p className="text-gray-600 dark:text-gray-400"><strong>Scores</strong> for each PDQI-9 dimension</p>
                         </div>
                         <div className="flex items-start space-x-3">
                           <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2.5 flex-shrink-0"></div>
                           <p className="text-gray-600 dark:text-gray-400"><strong>Delta scores</strong> (student vs. AI)</p>
                         </div>
                         <div className="flex items-start space-x-3">
                           <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2.5 flex-shrink-0"></div>
                           <p className="text-gray-600 dark:text-gray-400"><strong>Per-dimension change comments</strong></p>
                         </div>
                         <div className="flex items-start space-x-3">
                           <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2.5 flex-shrink-0"></div>
                           <p className="text-gray-600 dark:text-gray-400"><strong>Overall feedback</strong></p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Expandable code block for review route */}
                 <div className="ml-11 mt-6">
                   <details className="group">
                     <summary className="cursor-pointer text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                       <span className="mr-3 text-lg">▶</span>
                       <span className="group-open:hidden">Show AI review & grading code</span>
                       <span className="hidden group-open:inline">Hide AI review & grading code</span>
                     </summary>
                     <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                       <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                         <p className="text-xs font-mono text-gray-600 dark:text-gray-400">src/app/api/review/route.ts</p>
                       </div>
                       <div className="max-h-80 overflow-y-auto">
                         <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-4 whitespace-pre-wrap">{`import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/store";
import { clipText } from "@/lib/clipText";

const reviewPrompt = \`

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
      – \\\`dimension\\\` name (exact PDQI-9 dimension that changed)  
      – \\\`impact\\\` improved | worsened | neutral  
      – \\\`snippet\\\` ≤20 words (specific text that caused the change)  
      – \\\`comment\\\` coaching ≤25 words explaining WHY the score changed

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
}\\\`;

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
        "Full encounter transcript (User & Assistant turns):\\n\\"\\"\\"\\n" +
        transcript +
        "\\n\\"\\"\\"",
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
}`}</pre>
                       </div>
                     </div>
                   </details>
                 </div>
                 
                 {/* Custom grading prompt subsection */}
                 <div className="ml-11 mt-6">
                   <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Custom Grading Prompts</h4>
                   <div className="space-y-3">
                     <div className="flex items-start space-x-3">
                       <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                       <div>
                         <p className="text-gray-700 dark:text-gray-300">You can open <strong>Edit grading prompt</strong> on the note page to customize how your SOAP notes are evaluated.</p>
                       </div>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                       <div>
                         <p className="text-gray-700 dark:text-gray-300">Custom prompts are saved per encounter and persist during your session. Use <strong>Reset to default</strong> to return to the standard PDQI-9 rubric.</p>
                       </div>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                       <div>
                         <p className="text-gray-700 dark:text-gray-300">The default rubric focuses on <strong>PDQI-9 clinical appropriateness</strong>, emphasizing safe and evidence-based care that matches the patient encounter.</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               <div>
                 <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                   <span className="bg-gray-600 dark:bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">4</span>
                   Feedback Display
                 </h3>
                 <div className="ml-11 space-y-4">
                   <p className="text-gray-700 dark:text-gray-300 mb-4">The UI presents a detailed breakdown:</p>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Scores and deltas per dimension</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Specific snippets causing score changes</p>
                     </div>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                     <div>
                       <p className="text-gray-700 dark:text-gray-300">Global comments for improvement</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </Card>
      </main>
    </>
  );
} 