import { v4 as uuid } from "uuid";

export interface Encounter {
  id: string;
  csv: string;
  aiNote?: string;
  studentNote?: string;
  reviewJson?: any;
  createdAt: Date;
}

// Use a single Map instance attached to globalThis
const globalStore =
  (globalThis as any).__encounterStore as Map<string, Encounter> | undefined;

export const db: Map<string, Encounter> =
  globalStore ?? ((globalThis as any).__encounterStore = new Map());

export function newEncounter(csv: string): Encounter {
  const e: Encounter = { id: uuid(), csv, createdAt: new Date() };
  db.set(e.id, e);
  return e;
} 