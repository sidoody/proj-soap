import { z } from "zod";

// PDQI schemas
const ReviewDimensionSchema = z.object({
  up_to_date: z.number().optional(),
  accurate: z.number().optional(),
  thorough: z.number().optional(),
  useful: z.number().optional(),
  organized: z.number().optional(),
  comprehensible: z.number().optional(),
  succinct: z.number().optional(),
  synthesized: z.number().optional(),
  consistent: z.number().optional(),
}).catchall(z.number().optional());

const ReviewChangeSchema = z.object({
  dimension: z.string(),
  impact: z.string(),
  snippet: z.string(),
  comment: z.string(),
});

export const PDQIReviewSchema = z.object({
  schema_version: z.literal("pdqi9_v1"),
  baseline_scores: ReviewDimensionSchema,
  student_scores: ReviewDimensionSchema,
  delta_scores: ReviewDimensionSchema,
  overall_delta: z.number(),
  changes: z.array(ReviewChangeSchema),
  global_comment: z.string(),
});

// SOAP schemas
const SoapSectionScoresSchema = z.object({
  subjective: z.number().int().min(1).max(6),
  objective: z.number().int().min(1).max(6),
  assessment: z.number().int().min(1).max(6),
  plan: z.number().int().min(1).max(6),
});

// Delta scores can be negative (student worse than baseline) or positive (student better than baseline)
// Range is -5 to +5 for a 1-6 scale (min: 1-6=-5, max: 6-1=+5)
const SoapDeltaScoresSchema = z.object({
  subjective: z.number().int().min(-5).max(5),
  objective: z.number().int().min(-5).max(5),
  assessment: z.number().int().min(-5).max(5),
  plan: z.number().int().min(-5).max(5),
});

const SoapChangeSchema = z.object({
  section: z.enum(["subjective", "objective", "assessment", "plan"]),
  impact: z.string(),
  snippet: z.string(),
  comment: z.string(),
});

const SoapRationaleSchema = z.object({
  subjective: z.string(),
  objective: z.string(),
  assessment: z.string(),
  plan: z.string(),
});

export const SOAPReviewSchema = z.object({
  schema_version: z.literal("soap_rubric_v1"),
  baseline_scores: SoapSectionScoresSchema,
  student_scores: SoapSectionScoresSchema,
  delta_scores: SoapDeltaScoresSchema,
  overall_delta: z.number(),
  changes: z.array(SoapChangeSchema),
  rationale: SoapRationaleSchema,
  global_comment: z.string(),
});

// Union schema
export const ReviewUnionSchema = z.discriminatedUnion("schema_version", [
  PDQIReviewSchema,
  SOAPReviewSchema,
]);

export function validateReviewResponse(data: unknown): { success: true; data: z.infer<typeof ReviewUnionSchema> } | { success: false; error: string } {
  try {
    const result = ReviewUnionSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      return { success: false, error: `Validation failed: ${issues}` };
    }
    return { success: false, error: 'Unknown validation error' };
  }
} 