"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SOAPNote } from "@/components/ui/soap-note";
import { toast } from "sonner";
import { ReviewUnion, Review, ReviewChange, PDQIReview, SOAPReview, SoapChange } from "@/types";
import { RUBRIC_REGISTRY, RubricKey, getDefaultRubricKey } from "@/lib/rubrics";
import Link from "next/link";
import { Home, FileText } from "lucide-react";

// Review component for displaying feedback
function ReviewDisplay({ review }: { review: Review | ReviewUnion }) {
  // Check if this is a new discriminated union review or legacy review
  const isUnionReview = 'schema_version' in review;
  
  if (isUnionReview) {
    if (review.schema_version === "pdqi9_v1") {
      return <PDQIReviewDisplay review={review} />;
    } else if (review.schema_version === "soap_rubric_v1") {
      return <SOAPReviewDisplay review={review} />;
    }
  }
  
  // Fallback to legacy PDQI display for old reviews
  return <PDQIReviewDisplay review={review as Review} />;
}

function PDQIReviewDisplay({ review }: { review: Review | PDQIReview }) {
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
    if (delta >= 2) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
    if (delta >= 0) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "improved") return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    if (impact === "worsened") return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
  };

  // Group changes by dimension
  const changesByDimension = (review.changes || []).reduce((acc: Record<string, ReviewChange[]>, change: ReviewChange) => {
    if (!acc[change.dimension]) acc[change.dimension] = [];
    acc[change.dimension].push(change);
    return acc;
  }, {} as Record<string, ReviewChange[]>);

  return (
    <div className="mt-6 space-y-4">
      {/* PDQI-9 Detailed Scoring */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">PDQI-9 Detailed Scoring</h3>
        
        {/* Score Summary Table */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <div key={key} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
                  <div className="text-center text-gray-600 dark:text-gray-400">{baselineScore}/5</div>
                  <div className="text-center text-gray-600 dark:text-gray-400">{studentScore}/5</div>
                  <div className={`text-center font-semibold px-2 py-1 rounded ${getDeltaColor(deltaScore)}`}>
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
            <div key={key} className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${getDeltaColor(deltaScore)}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{name}</h4>
                <span className="font-semibold text-lg">
                  {deltaScore > 0 ? '+' : ''}{deltaScore}
                </span>
              </div>
              
              {/* Changes for this dimension */}
              <div className="space-y-2">
                {dimensionChanges.map((change: ReviewChange, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800/50 bg-opacity-50 rounded p-3 border-l-4 border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm px-2 py-1 rounded ${getImpactColor(change.impact)}`}>
                        {change.impact}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        &quot;{change.snippet}&quot;
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{change.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Comment */}
      {review.global_comment && (
        <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">Overall Feedback</h3>
          <p className="text-gray-700 dark:text-gray-300">{review.global_comment}</p>
        </div>
      )}
    </div>
  );
}

function SOAPReviewDisplay({ review }: { review: SOAPReview }) {
  const sectionNames = {
    subjective: "Subjective",
    objective: "Objective",
    assessment: "Assessment",
    plan: "Plan"
  };

  const getDeltaColor = (delta: number) => {
    if (delta >= 2) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
    if (delta >= 0) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "improved") return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    if (impact === "worsened") return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
  };

  // Group changes by section
  const changesBySection = (review.changes || []).reduce((acc: Record<string, SoapChange[]>, change: SoapChange) => {
    if (!acc[change.section]) acc[change.section] = [];
    acc[change.section].push(change);
    return acc;
  }, {} as Record<string, SoapChange[]>);

  return (
    <div className="mt-6 space-y-4">
      {/* SOAP Rubric Detailed Scoring */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">SOAP Rubric (1–6)</h3>
        
        {/* Score Summary Table */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div>Section</div>
              <div className="text-center">Baseline</div>
              <div className="text-center">Student</div>
              <div className="text-center">Delta</div>
            </div>
          </div>
          {Object.entries(sectionNames).map(([key, name]) => {
            const baselineScore = review.baseline_scores?.[key as keyof typeof review.baseline_scores] || 0;
            const studentScore = review.student_scores?.[key as keyof typeof review.student_scores] || 0;
            const deltaScore = review.delta_scores?.[key as keyof typeof review.delta_scores] || 0;
            
            return (
              <div key={key} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
                  <div className="text-center text-gray-600 dark:text-gray-400">{baselineScore}/6</div>
                  <div className="text-center text-gray-600 dark:text-gray-400">{studentScore}/6</div>
                  <div className={`text-center font-semibold px-2 py-1 rounded ${getDeltaColor(deltaScore)}`}>
                    {deltaScore > 0 ? '+' : ''}{deltaScore}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rationales */}
        {review.rationale && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Section Rationales</h4>
                         {Object.entries(sectionNames).map(([key, name]) => {
               const rationale = review.rationale?.[key as keyof typeof review.rationale];
               if (!rationale) return null;
              
              return (
                <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                  <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">{name}</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{rationale}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Individual Section Changes */}
        {Object.entries(sectionNames).map(([key, name]) => {
          const deltaScore = review.delta_scores?.[key as keyof typeof review.delta_scores] || 0;
          const sectionChanges = changesBySection[key] || [];
          
          if (sectionChanges.length === 0) return null;
          
          return (
            <div key={key} className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${getDeltaColor(deltaScore)}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{name}</h4>
                <span className="font-semibold text-lg">
                  {deltaScore > 0 ? '+' : ''}{deltaScore}
                </span>
              </div>
              
              {/* Changes for this section */}
              <div className="space-y-2">
                                 {sectionChanges.map((change: SoapChange, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800/50 bg-opacity-50 rounded p-3 border-l-4 border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm px-2 py-1 rounded ${getImpactColor(change.impact)}`}>
                        {change.impact}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        &quot;{change.snippet}&quot;
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{change.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Comment */}
      {review.global_comment && (
        <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">Overall Feedback</h3>
          <p className="text-gray-700 dark:text-gray-300">{review.global_comment}</p>
        </div>
      )}
    </div>
  );
}

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [student, setStudent] = useState("");
  const [review, setReview] = useState<Review | ReviewUnion | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Rubric selection state
  const [selectedRubricKey, setSelectedRubricKey] = useState<RubricKey>(getDefaultRubricKey());
  
  // Grading prompt state
  const [gradingPrompt, setGradingPrompt] = useState("");
  const [gradingPromptOpen, setGradingPromptOpen] = useState(false);
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState("");

  // Load rubric-specific prompt when rubric selection changes
  useEffect(() => {
    if (selectedRubricKey) {
      fetch(`/api/review-prompt?id=${id}&rubricKey=${selectedRubricKey}`)
        .then((r) => r.ok ? r.json() : Promise.reject("Prompt not found"))
        .then((promptData) => {
          setDefaultPrompt(promptData.defaultPrompt);
          setGradingPrompt(promptData.prompt ?? promptData.defaultPrompt);
        })
        .catch(() => {
          // If fetch fails, use registry default
          const rubricDef = RUBRIC_REGISTRY[selectedRubricKey];
          setDefaultPrompt(rubricDef.prompt);
          setGradingPrompt(rubricDef.prompt);
        });
    }
  }, [id, selectedRubricKey]);

  // fetch encounter once
  useEffect(() => {
    fetch(`/api/debug?id=${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject("Not found"))
      .then((encounterData) => {
        setAiNote(encounterData.aiNote);
        setStudent(encounterData.studentNote ?? encounterData.aiNote);
        setReview(encounterData.reviewJson ?? null);
        
        // Set rubric from last review if available
        if (encounterData.reviewRubricKey) {
          setSelectedRubricKey(encounterData.reviewRubricKey);
        }
      })
      .catch(() => toast.error("Encounter not found"));
  }, [id]);

  async function handleSavePrompt() {
    try {
      setSavingPrompt(true);
      const r = await fetch("/api/review-prompt", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, prompt: gradingPrompt, rubricKey: selectedRubricKey }),
      });
      if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || "Save failed");
      }
      toast.success("Grading prompt saved");
      setGradingPromptOpen(false);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSavingPrompt(false);
    }
  }

  async function handleResetPrompt() {
    if (!confirm("This will discard your custom grading prompt for this rubric.")) {
      return;
    }
    
    try {
      setSavingPrompt(true);
      const r = await fetch("/api/review-prompt", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rubricKey: selectedRubricKey }),
      });
      if (!r.ok) throw new Error("Reset failed");
      
      setGradingPrompt(defaultPrompt);
      toast.success("Reset to default grading prompt");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSavingPrompt(false);
    }
  }

  async function handleSubmit() {
    try {
      setSaving(true);
      const r = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          studentNote: student, 
          rubricKey: selectedRubricKey 
        }),
      });
      if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || "Review failed");
      }
      setReview(await r.json());
      toast.success("Review completed!");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const selectedRubric = RUBRIC_REGISTRY[selectedRubricKey];

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
              <Link href="/documentation" className="text-white hover:text-gray-200 transition-colors flex items-center">
                <FileText size={20} />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto max-w-6xl space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      {!aiNote ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-auto">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">AI SOAP (read-only)</h2>
            <SOAPNote content={aiNote} />
          </Card>

          <Card>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Your SOAP (edit)</h2>
            <Textarea
              rows={18}
              value={student}
              onChange={(e) => setStudent(e.target.value)}
            />

            {/* Rubric Selection and Controls */}
            <div className="mt-4 space-y-4">
              {/* Rubric Dropdown */}
              <div className="flex items-center gap-4">
                <label htmlFor="rubric-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                  Grading Rubric:
                </label>
                <select
                  id="rubric-select"
                  value={selectedRubricKey}
                  onChange={(e) => setSelectedRubricKey(e.target.value as RubricKey)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-0 max-w-xs truncate"
                >
                  {Object.entries(RUBRIC_REGISTRY).map(([key, rubric]) => (
                    <option key={key} value={key}>
                      {rubric.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button loading={saving} onClick={handleSubmit}>
                  Submit for Review
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setGradingPromptOpen(true)}
                >
                  Edit grading prompt
                </Button>
              </div>

              {/* Show which rubric will be used */}
              {review && 'schema_version' in review && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                                         Graded with {review.schema_version === "pdqi9_v1" ? "PDQI-9" : "COMLEX Oral Presentation Rating Draft Rubric"}
                  </span>
                </div>
              )}
            </div>

            {/* Grading Prompt Editor */}
            {gradingPromptOpen && (
              <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                  Edit Grading Prompt ({selectedRubric.name})
                </h3>
                <div className="space-y-3">
                  <Textarea
                    rows={18}
                    value={gradingPrompt}
                    onChange={(e) => setGradingPrompt(e.target.value)}
                    className="font-mono text-sm"
                  />
                  
                  {/* Helper text and character count */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This prompt guides grading for the {selectedRubric.name} rubric only. It does not change your SOAP text.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Characters: {gradingPrompt.length} / 12,000
                        {gradingPrompt.length > 0 && (
                          <span className="ml-2">
                            (≈{Math.ceil(gradingPrompt.length / 4)} tokens)
                          </span>
                        )}
                      </span>
                      {gradingPrompt.length > 12000 && (
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Exceeds limit!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      loading={savingPrompt}
                      onClick={handleSavePrompt}
                      disabled={gradingPrompt.length > 12000}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleResetPrompt}
                      disabled={savingPrompt}
                    >
                      Reset to default
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => setGradingPromptOpen(false)}
                      disabled={savingPrompt}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {review && <ReviewDisplay review={review} />}
          </Card>
        </div>
      )}
    </main>
    </>
  );
} 