"use client";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Review component for displaying feedback
function ReviewDisplay({ review }: { review: any }) {
  const dimensionNames = {
    up_to_date: "Up-to-Date",
    accurate: "Accurate", 
    thorough: "Thorough",
    useful: "Useful",
    organized: "Organized",
    comprehensible: "Comprehensible",
    succinct: "Succinct",
    synthesized: "Synthesized",
    consistent: "Consistent"
  };

  const getDeltaColor = (delta: number) => {
    if (delta >= 2) return "text-green-600 bg-green-50";
    if (delta >= 0) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getOverallDeltaColor = (delta: number) => {
    if (delta >= 10) return "text-green-600 bg-green-50";
    if (delta >= 0) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "improved") return "text-green-600";
    if (impact === "worsened") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Overall Delta Score */}
      <div className={`p-4 rounded-lg border ${getOverallDeltaColor(review.overall_delta || 0)}`}>
        <h3 className="font-semibold text-lg">Overall Delta Score</h3>
        <div className="text-3xl font-bold">
          {review.overall_delta > 0 ? '+' : ''}{review.overall_delta || 0}/45
        </div>
        <p className="text-sm mt-1">Range: -45 (much worse) to +45 (much better)</p>
      </div>

      {/* PDQI-9 Dimension Feedback */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">PDQI-9 Dimension Feedback</h3>
        {Object.entries(review.dimension_feedback || {}).map(([dimension, feedback]: [string, any]) => (
          <div key={dimension} className={`border rounded-lg p-4 ${getDeltaColor(feedback.delta || 0)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">
                {dimensionNames[dimension as keyof typeof dimensionNames]}
              </h4>
              <span className="font-semibold text-lg">
                {feedback.delta > 0 ? '+' : ''}{feedback.delta || 0}
              </span>
            </div>
            
            {/* Changes for this dimension */}
            {feedback.changes && feedback.changes.length > 0 && (
              <div className="space-y-2">
                {feedback.changes.map((change: any, index: number) => (
                  <div key={index} className="bg-white bg-opacity-50 rounded p-3 border-l-4 border-gray-300">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm px-2 py-1 rounded ${getImpactColor(change.impact)}`}>
                        {change.impact}
                      </span>
                      <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        "{change.snippet}"
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{change.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global Comment */}
      {review.global_comment && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold text-lg mb-2">Overall Feedback</h3>
          <p className="text-gray-700">{review.global_comment}</p>
        </div>
      )}
    </div>
  );
}

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [student, setStudent] = useState("");
  const [review, setReview] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // fetch encounter once
  useEffect(() => {
    fetch(`/api/debug?id=${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject("Not found"))
      .then((d) => {
        setAiNote(d.aiNote);
        setStudent(d.studentNote ?? d.aiNote);
        setReview(d.reviewJson ?? null);
      })
      .catch(() => toast.error("Encounter not found"));
  }, [id]);

  async function handleSubmit() {
    try {
      setSaving(true);
      const r = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, studentNote: student }),
      });
      if (!r.ok) throw new Error("Review failed");
      setReview(await r.json());
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container mx-auto max-w-6xl space-y-8 py-8">
      {!aiNote ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-auto">
            <h2 className="mb-2 text-lg font-semibold">AI SOAP (read-only)</h2>
            <ReactMarkdown className="prose max-w-none">{aiNote}</ReactMarkdown>
          </Card>

          <Card>
            <h2 className="mb-2 text-lg font-semibold">Your SOAP (edit)</h2>
            <Textarea
              rows={18}
              value={student}
              onChange={(e) => setStudent(e.target.value)}
            />
            <Button loading={saving} className="mt-4" onClick={handleSubmit}>
              Submit for Review
            </Button>

            {review && <ReviewDisplay review={review} />}
          </Card>
        </div>
      )}
    </main>
  );
} 