export interface ReviewChange {
  dimension: string;
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

export interface Review {
  changes: ReviewChange[];
  dimensions: ReviewDimension;
  baseline_scores?: ReviewDimension;
  student_scores?: ReviewDimension;
  delta_scores?: ReviewDimension;
  global_comment?: string;
} 