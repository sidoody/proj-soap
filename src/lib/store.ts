import { v4 as uuid } from "uuid";
import { Review } from "@/types";

export interface Encounter {
  id: string;
  csv: string;
  aiNote?: string;
  studentNote?: string;
  reviewJson?: Review;
  createdAt: Date;
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