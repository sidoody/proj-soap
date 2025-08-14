import { defaultReviewPrompt } from "./reviewPrompt";
import { soapRubricPrompt } from "./reviewPromptSoap";

export type RubricKey = "pdqi9" | "soap_v1";

export interface RubricDefinition {
  key: RubricKey;
  schema_version: string;
  prompt: string;
  name: string;
}

export const RUBRIC_REGISTRY: Record<RubricKey, RubricDefinition> = {
  pdqi9: { 
    key: "pdqi9", 
    schema_version: "pdqi9_v1", 
    prompt: defaultReviewPrompt,
    name: "PDQI-9"
  },
  soap_v1: { 
    key: "soap_v1", 
    schema_version: "soap_rubric_v1", 
    prompt: soapRubricPrompt,
    name: "COMLEX Oral Presentation Rating Draft Rubric"
  },
};

export function getRubricByKey(key: RubricKey): RubricDefinition {
  return RUBRIC_REGISTRY[key];
}

export function getDefaultRubricKey(): RubricKey {
  return "pdqi9";
} 