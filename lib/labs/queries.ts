import { labCatalog } from "./catalog";
import type { LabDifficulty, LabId } from "./types";

export function getLabs() {
  return labCatalog;
}

export function getLabBySlug(slug: string) {
  return labCatalog.find((lab) => lab.slug === slug);
}

export function getLabNumber(id: LabId) {
  return String(labCatalog.findIndex((lab) => lab.id === id) + 1).padStart(2, "0");
}

export function getLabLevels(slug: string) {
  return getLabBySlug(slug)?.levels ?? [];
}

export function getLabLevelByDifficulty(slug: string, difficulty: LabDifficulty) {
  return getLabLevels(slug).find((level) => level.difficulty === difficulty);
}
