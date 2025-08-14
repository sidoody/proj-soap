import { v4 as uuid } from "uuid";
import { Review, ReviewUnion } from "@/types";
import { RubricKey } from "./rubrics";

export interface Encounter {
  id: string;
  csv: string;
  aiNote?: string;
  studentNote?: string;
  reviewJson?: Review | ReviewUnion;
  createdAt: Date;
  reviewPrompt?: string; // Legacy field for migration
  reviewPrompts?: Partial<Record<RubricKey, string>>;
  reviewRubricKey?: RubricKey;
  reviewPromptEditedAt?: Date;
}

// Use a single Map instance attached to globalThis
declare global {
  var __encounterStore: Map<string, Encounter> | undefined;
}

const globalStore = globalThis.__encounterStore;

export const db: Map<string, Encounter> =
  globalStore ?? (globalThis.__encounterStore = new Map());

export function newEncounter(csv: string): Encounter {
  const e: Encounter = { id: uuid(), csv, createdAt: new Date() };
  db.set(e.id, e);
  return e;
}

// Helper to migrate legacy reviewPrompt to reviewPrompts structure
export function getReviewPromptForRubric(encounter: Encounter, rubricKey: RubricKey): string | undefined {
  // If modern structure exists, use it
  if (encounter.reviewPrompts?.[rubricKey]) {
    return encounter.reviewPrompts[rubricKey];
  }
  
  // Legacy migration: if old reviewPrompt exists and rubricKey is pdqi9, use it
  if (encounter.reviewPrompt && rubricKey === "pdqi9") {
    return encounter.reviewPrompt;
  }
  
  return undefined;
}

// Helper to set review prompt for a specific rubric
export function setReviewPromptForRubric(encounter: Encounter, rubricKey: RubricKey, prompt: string): void {
  if (!encounter.reviewPrompts) {
    encounter.reviewPrompts = {} as Partial<Record<RubricKey, string>>;
  }
  encounter.reviewPrompts[rubricKey] = prompt;
  encounter.reviewPromptEditedAt = new Date();
}

// Helper to delete review prompt for a specific rubric
export function deleteReviewPromptForRubric(encounter: Encounter, rubricKey: RubricKey): void {
  if (encounter.reviewPrompts) {
    delete encounter.reviewPrompts[rubricKey];
  }
  
  // If this was the legacy pdqi9 prompt, also clear the old field
  if (rubricKey === "pdqi9" && encounter.reviewPrompt) {
    delete encounter.reviewPrompt;
  }
} 