"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SOAPNote } from "@/components/ui/soap-note";
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
    if (impact === "improved") return "text-green-600 bg-green-100";
    if (impact === "worsened") return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  // Group changes by dimension
  const changesByDimension = (review.changes || []).reduce((acc: any, change: any) => {
    if (!acc[change.dimension]) acc[change.dimension] = [];
    acc[change.dimension].push(change);
    return acc;
  }, {});

  return (
    <div className="mt-6 space-y-4">

      {/* PDQI-9 Detailed Scoring */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">PDQI-9 Detailed Scoring</h3>
        
        {/* Score Summary Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700">
              <div>Dimension</div>
              <div className="text-center">Baseline</div>
              <div className="text-center">Student</div>
              <div className="text-center">Delta</div>

            </div>
          </div>
          {Object.entries(dimensionNames).map(([key, name]) => {
            const baselineScore = review.baseline_scores?.[key] || 0;
            const studentScore = review.student_scores?.[key] || 0;
            const deltaScore = review.delta_scores?.[key] || 0;
            
            return (
              <div key={key} className="p-3 border-b border-gray-100 last:border-b-0">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium">{name}</div>
                  <div className="text-center text-gray-600">{baselineScore}/5</div>
                  <div className="text-center text-gray-600">{studentScore}/5</div>
                  <div className={`text-center font-semibold ${getDeltaColor(deltaScore)}`}>
                    {deltaScore > 0 ? '+' : ''}{deltaScore}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Individual Dimension Details */}
        {Object.entries(dimensionNames).map(([key, name]) => {
          const deltaScore = review.delta_scores?.[key] || 0;
          const dimensionChanges = changesByDimension[key] || [];
          
          if (dimensionChanges.length === 0) return null;
          
          return (
            <div key={key} className={`border rounded-lg p-4 ${getDeltaColor(deltaScore)}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{name}</h4>
                <span className="font-semibold text-lg">
                  {deltaScore > 0 ? '+' : ''}{deltaScore}
                </span>
              </div>
              
              {/* Changes for this dimension */}
              <div className="space-y-2">
                {dimensionChanges.map((change: any, index: number) => (
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
            </div>
          );
        })}
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
    <main className="container mx-auto max-w-6xl space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      {!aiNote ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-auto">
            <h2 className="mb-2 text-lg font-semibold">AI SOAP (read-only)</h2>
            <SOAPNote content={aiNote} />
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