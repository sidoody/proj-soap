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
  const sectionNames = {
    S: "Subjective",
    O: "Objective", 
    A: "Assessment",
    P: "Plan"
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getSectionScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Overall Score */}
      <div className={`p-4 rounded-lg border ${getScoreColor(review.overall_score)}`}>
        <h3 className="font-semibold text-lg">Overall Score</h3>
        <div className="text-3xl font-bold">{review.overall_score}/100</div>
      </div>

      {/* Section Feedback */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Section Feedback</h3>
        {Object.entries(review.section_feedback || {}).map(([section, feedback]: [string, any]) => (
          <div key={section} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">
                {section} - {sectionNames[section as keyof typeof sectionNames]}
              </h4>
              <span className={`font-semibold ${getSectionScoreColor(feedback.score)}`}>
                {feedback.score}/5
              </span>
            </div>
            <p className="text-gray-700 text-sm">{feedback.comment}</p>
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