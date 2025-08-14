export type SchemaVersion = "pdqi9_v1" | "soap_rubric_v1";

export interface ReviewChange {
  dimension: string;
  impact: string;
  snippet: string;
  comment: string;
}

// SOAP-specific change type
export interface SoapChange {
  section: "subjective" | "objective" | "assessment" | "plan";
  impact: string;
  snippet: string;
  comment: string;
}

export interface ReviewDimension {
  [key: string]: number | undefined;
  up_to_date?: number;
  accurate?: number;
  thorough?: number;
  useful?: number;
  organized?: number;
  comprehensible?: number;
  succinct?: number;
  synthesized?: number;
  consistent?: number;
}

export interface SoapSectionScores {
  subjective: number;
  objective: number;
  assessment: number;
  plan: number;
}

// PDQI review (existing shape)
export interface PDQIReview {
  schema_version: "pdqi9_v1";
  baseline_scores: ReviewDimension;
  student_scores: ReviewDimension;
  delta_scores: ReviewDimension;
  overall_delta: number;
  changes: ReviewChange[];
  global_comment: string;
}

// SOAP review (from your prompt & fixtures)
export interface SOAPReview {
  schema_version: "soap_rubric_v1";
  baseline_scores: SoapSectionScores;
  student_scores: SoapSectionScores;
  delta_scores: SoapSectionScores;
  overall_delta: number;
  changes: SoapChange[];
  rationale: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  global_comment: string;
}

export type ReviewUnion = PDQIReview | SOAPReview;

// Legacy interface for backward compatibility - can be removed after refactor
export interface Review {
  changes: ReviewChange[];
  dimensions: ReviewDimension;
  baseline_scores?: ReviewDimension;
  student_scores?: ReviewDimension;
  delta_scores?: ReviewDimension;
  global_comment?: string;
} 