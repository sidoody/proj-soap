"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

export default function Home() {
  const [csv, setCsv] = useState("");
  const [aiNote, setAiNote] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <main className="container mx-auto max-w-4xl space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">SOAP Note Q3 Project</h1>
      </div>
      
      <Card>
        <h1 className="mb-4 text-xl font-semibold">Paste encounter log</h1>
        <p className="mb-4 text-gray-600">
          Paste the complete patient interaction into the space below.
        </p>
        <div className="mb-4 p-3 bg-gray-50 rounded-md border-l-4 border-blue-400">
          <p className="text-sm font-medium text-gray-700 mb-2">Example of expected input:</p>
          <pre className="text-xs text-gray-600 font-mono">
{`--- Module: History ---
[11:28:17 AM] User: have you ever felt this chest pain before
[11:28:18 AM] Assistant: No, it feels unlike anything I've experienced before.`}
          </pre>
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
          <h2 className="mb-2 text-lg font-semibold">AI-Generated SOAP</h2>
          <ReactMarkdown className="prose max-w-none">{aiNote}</ReactMarkdown>
          {id && (
            <Link href={`/note/${id}`} className="mt-4 inline-block underline">
              Edit & Review →
            </Link>
          )}
        </Card>
      )}
    </main>
  );
}
