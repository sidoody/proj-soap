"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SOAPNote } from "@/components/ui/soap-note";
import { toast } from "sonner";
import Link from "next/link";
import { Home as HomeIcon, FileText } from "lucide-react";

export default function Home() {
  const [csv, setCsv] = useState("");
  const [aiNote, setAiNote] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const exampleContent = `--- Module: History ---
[10:28:26 PM] User: When did it start?
[10:28:27 PM] Assistant: Well, it began about a week ago.
[10:28:42 PM] User: Describe the pain
[10:28:42 PM] Assistant: It's a heavy, tight pressure right in the center of my chest.
[10:28:54 PM] User: How long does it last?
[10:28:55 PM] Assistant: It lasts for around 5 to 10 minutes before it eases up with rest.
[10:29:54 PM] User: What's your medical history
[10:29:54 PM] Assistant: Umm, can you be more specific about what you're asking?
[10:30:42 PM] User: Do you have any ongoing disease?
[10:30:43 PM] Assistant: I've been managing hypertension and cholesterol with medication.
[10:31:05 PM] User: Ever had an MI?
[10:31:06 PM] Assistant: I'm not quite sure what "MI" means. Could you explain that to me?
[10:31:17 PM] User: Ever had a heart attack?
[10:31:18 PM] Assistant: No, I've never had a heart attack before.
[10:31:34 PM] User: Ever had surgery?
[10:31:34 PM] Assistant: No, I've never had any surgery.
[10:31:41 PM] User: Allergies?
[10:31:42 PM] Assistant: No, I don't have any known allergies.
[10:32:08 PM] User: Which meds are you currently taking?
[10:32:08 PM] Assistant: I'm taking Hydrochlorothiazide for blood pressure and Atorvastatin for cholesterol.
[10:32:33 PM] User: What are your vitals?
[10:32:34 PM] Assistant: I'm not sure exactly. The doctors usually check them during my appointments, but I don't remember the specific numbers.
[10:33:17 PM] User: Any relevant family history?
[10:33:18 PM] Assistant: Yeah, my father had a heart attack at the age of 52.
[10:33:41 PM] User: Do you regularly consult with a cardiologist?
[10:33:41 PM] Assistant: I try to follow up regularly with my doctor, but it's been about six months since my last check-up.
[10:34:05 PM] User: Does the pain irradiate?
[10:34:06 PM] Assistant: Yes, sometimes it spreads and radiates into my left arm.
[10:34:24 PM] User: What are you doing when the pain appears?
[10:34:25 PM] Assistant: It usually happens during physical activity, like climbing stairs or hurrying somewhere.
[10:35:26 PM] User: Have you had any recent lab workup
[10:35:27 PM] Assistant: No, I haven't had any recent lab work done.
[10:36:09 PM] User: What does your diet look like
[10:36:10 PM] Assistant: Well, I try to eat healthy, but there are days when I skip meals or grab something quick and unhealthy because of work.
[10:36:23 PM] User: What are your habits?
[10:36:24 PM] Assistant: I jog regularly in the mornings before work, and I'm also a moderate smoker.
--- Module: Differential Diagnosis ---
[10:37:27 PM] User: Unstable angina
[10:37:28 PM] Assistant: Why do you think unstable angina is on your differential for Mr. Jones?
[10:38:33 PM] User: The pain lasts less than 40min, it alleviates with rest, he has a history of high cholesterol
[10:38:36 PM] Assistant: Yes, unstable angina is a strong consideration here. The chest pain lasting 5 to 10 minutes and resolving with rest is characteristic of angina. His history of high cholesterol and hypertension, along with a family history of heart disease, puts him at increased risk for coronary artery disease. What is the second condition on your differential?
[10:39:45 PM] User: We should rule out a myocardial infarction
[10:39:48 PM] Assistant: Consider using broad terms. "Acute Coronary Syndrome", which includes Myocardial Infarction or Unstable Angina, is a good way to phrase this possibility. Since you've already mentioned Unstable Angina, let's focus on another separate condition that could be causing his symptoms. What's another differential diagnosis you are considering?
[10:42:33 PM] User: Should we be considering a pulmonary embolism?
[10:42:35 PM] Assistant: Yes, a pulmonary embolism is a valid consideration. Given his recent travel history and periods of immobility, combined with smoking, they are risk factors for venous thromboembolism. Sudden onset chest pain could point towards a pulmonary embolism. What's the third condition on your differential?
[10:43:11 PM] User: Panic attacks
[10:43:13 PM] Assistant: While panic attacks can present with chest pain, in this scenario, we should prioritize ruling out potentially life-threatening cardiac or pulmonary conditions first. Could you suggest another condition that could be causing his symptoms?
[10:43:38 PM] User: Can you guide my thought?
[10:43:40 PM] Assistant: Certainly. Consider conditions that could involve inflammation around the heart or increases in pressure on the heart. These could be attributed to recent respiratory symptoms or a history of chronic tension and stress, affecting the heart or its surrounding structures. What's another diagnosis you might consider?
[10:43:56 PM] User: Myocarditis
[10:43:58 PM] Assistant: Myocarditis is a reasonable consideration given his recent cold, as viral infections can sometimes lead to inflammation of the heart muscle. This could cause chest pain and explain his symptoms. Now that we've discussed three conditions, let's proceed with the case.
--- Module: Results Interpretation ---
[10:46:44 PM] User: Normal rate - between 100 and 75, maybe high 80s.
[10:46:45 PM] Assistant: Hmm, I would suggest double-checking that rate. Try to determine it more precisely.
[10:48:26 PM] User: 75 bpm
[10:48:27 PM] Assistant: Good, that rate is within normal range. What about the rhythm? Do you notice anything specific?
[10:48:38 PM] User: Sinus rhythm
[10:48:39 PM] Assistant: Correct, it is a regular sinus rhythm. Are there any noticeable ST changes on the EKG?
[10:48:48 PM] User: No ST changes
[10:48:49 PM] Assistant: Great, that's correct: there are no ST changes. Please continue to the next step to continue with the case.
--- Module: Re-Evaluation ---
[10:50:14 PM] User: Looks like and anterior STEMI
[10:50:15 PM] Assistant: Alright, recognizing those changes on the EKG is important. What would you like us to do next for Mr. Jones?
[10:50:40 PM] User: Prep him for cath lab
[10:50:41 PM] Assistant: Understood, I'll notify the cath lab and ensure they're ready for Mr. Jones. What else would you like to address while we're preparing him?
[10:50:58 PM] User: What's his BP?
[10:50:59 PM] Assistant: Let me check that for you. Mr. Jones's blood pressure is currently 160/95. What would you like to do next?
[10:51:19 PM] User: Let's give him labetalol to lower it
[10:51:20 PM] Assistant: We can certainly work on managing his blood pressure. I'll prepare the labetalol for administration. Is there anything else you would like to address for Mr. Jones right now?
[10:51:46 PM] User: Do we have the troponin value?
[10:51:47 PM] Assistant: Let's see... Mr. Jones's initial troponin level is elevated, indicating cardiac involvement. What would you like to do with this information?
[10:52:47 PM] User: Let's hook him to a monitor
[10:52:49 PM] Assistant: We'll get Mr. Jones on the monitor right away to keep a close eye on his vitals. What would you like to do next?
[10:53:04 PM] User: What are his vitals now?
[10:53:05 PM] Assistant: Okay, let me check that for you. Mr. Jones's current vitals are:
- Blood pressure: 160/95
- Heart rate: 100 beats per minute
- Respiratory rate: 20 breaths per minute
- Oxygen saturation: 96% on room air
Is there anything specific you'd like to do with this information?
[10:53:46 PM] User: Let's give his sublingual nitro
[10:53:48 PM] Assistant: Alright, I'll administer the sublingual nitroglycerin to help with his chest pain. What would you like us to focus on next?
[10:54:15 PM] User: Let's have a crash cart ready
[10:54:16 PM] Assistant: We'll make sure the crash cart is at the ready, just in case. What other steps would you like us to take for Mr. Jones?
[10:55:34 PM] User: Guide my thought
[10:55:35 PM] Assistant: I understand this can feel like a lot to manage. Your focus on ensuring Mr. Jones's stability is key. Please let me know how you'd like to proceed with his care.
[10:55:58 PM] User: Should we give him some fluids?
[10:55:59 PM] Assistant: We can start an IV line for Mr. Jones, which will allow us to give fluids if needed. Would you like us to proceed with establishing IV access and anything else?
[10:56:18 PM] User: Stablish an IV
[10:56:19 PM] Assistant: I'll go ahead and establish IV access for Mr. Jones. Is there anything else you'd like to address for his ongoing care?
[10:56:36 PM] User: Notify family
[10:56:37 PM] Assistant: I'll arrange for someone to notify Mr. Jones's family about his condition and that he's being prepared for further treatment. Is there anything else you'd like to do right now?
[10:57:09 PM] User: Take another ekg
[10:57:11 PM] Assistant: Alright, we'll go ahead and perform another EKG to monitor any changes. Meanwhile, is there anything else you would like to address with Mr. Jones?
[10:57:45 PM] User: Do an echo
[10:57:46 PM] Assistant: An echo can provide valuable information about Mr. Jones's heart function. I'll make arrangements for an echocardiogram. In the meantime, is there anything else you'd like to do?
[10:58:02 PM] User: Any suggestions?
[10:58:03 PM] Assistant: I'm here to assist with what you decide is best for Mr. Jones. You've made some important decisions so far. Please let me know how you'd like to continue with his care.
[10:59:04 PM] User: Let's control the rate
[10:59:05 PM] Assistant: To control Mr. Jones's heart rate, we can consider medications like beta-blockers which you've already mentioned, we'll continue with that approach. Is there anything else you'd like us to do for him?
[10:59:47 PM] User: Give him aspirin
[10:59:48 PM] Assistant: I'll administer aspirin to Mr. Jones as part of his treatment plan. Is there anything else you'd like us to focus on?
[11:01:34 PM] User: Fibrinolytic
[11:01:35 PM] Assistant: Given Mr. Jones's condition, administering a fibrinolytic can be considered if he's not immediately headed for the cath lab. Please clarify if there's something more you'd like to do at this stage?
[11:01:55 PM] User: Anticoagulation
[11:01:56 PM] Assistant: Alright, we'll start anticoagulation therapy for Mr. Jones. What would you like to do next?`;

  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(exampleContent);
      toast.success("Example copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      });
      if (!res.ok) throw new Error("OpenAI error");
      const { id, aiNote } = await res.json();
      setId(id);
      setAiNote(aiNote);
    } catch (e) {
      toast.error((e as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
              <Link href="/" className="text-white hover:text-gray-200 transition-colors font-medium flex items-center">
                <HomeIcon size={20} />
              </Link>
              <Link href="/documentation" className="text-white hover:text-gray-200 transition-colors flex items-center">
                <FileText size={20} />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto max-w-4xl space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      
      <Card>
        <h1 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Paste encounter log</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Paste the complete patient interaction into the space below.
        </p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example of expected input:</p>
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-blue-400 dark:border-blue-500 relative">
          <button
            onClick={handleCopyExample}
            className="absolute top-3 right-3 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors z-10"
            title="Copy example to clipboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
            </svg>
          </button>
          <div className="relative">
            <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap break-words overflow-y-scroll max-h-32 pr-8">
{exampleContent}
            </pre>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50 dark:from-gray-800 to-transparent pointer-events-none"></div>
          </div>
        </div>
        <Textarea
          rows={10}
          placeholder="--- Module: History --- …"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          className="mb-4"
        />
        <Button loading={loading} onClick={handleGenerate} disabled={!csv}>
          Generate SOAP
        </Button>
      </Card>

      {loading && <Skeleton className="h-48 w-full" />}

      {aiNote && (
        <Card>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">AI-Generated SOAP</h2>
          <SOAPNote content={aiNote} />
          {id && (
            <Link href={`/note/${id}`} className="mt-4 inline-block underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Edit & Review →
            </Link>
          )}
        </Card>
      )}
    </main>
    </>
  );
}
