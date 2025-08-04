import { v4 as uuid } from "uuid";

export interface Encounter {
  id: string;
  csv: string;
  aiNote?: string;
  studentNote?: string;
  reviewJson?: Record<string, unknown>;
  createdAt: Date;
}

// Use a single Map instance attached to globalThis
const globalStore =
  (globalThis as unknown as { __encounterStore?: Map<string, Encounter> }).__encounterStore;

export const db: Map<string, Encounter> =
  globalStore ?? ((globalThis as unknown as { __encounterStore: Map<string, Encounter> }).__encounterStore = new Map());

export function newEncounter(csv: string): Encounter {
  const e: Encounter = { id: uuid(), csv, createdAt: new Date() };
  db.set(e.id, e);
  return e;
} 