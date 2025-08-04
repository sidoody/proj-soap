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
    <main className="container mx-auto max-w-4xl space-y-8 py-12">
      <Card>
        <h1 className="mb-4 text-xl font-semibold">Paste encounter CSV</h1>
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
