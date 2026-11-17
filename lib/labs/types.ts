export type LabId = "water-01" | "power-01" | "rail-01";
export type LabSlug =
  | "water-treatment"
  | "power-substation"
  | "railway-operations";
export type LabDifficulty = "beginner" | "intermediate" | "advanced";
export type LabStatus = "coming_soon" | "available" | "maintenance";

export interface LabLevel {
  difficulty: LabDifficulty;
  title: string;
  description: string;
  objectives: string[];
  assets: string[];
  estimatedMinutes: number;
}

export interface Lab {
  id: LabId;
  slug: LabSlug;
  title: string;
  description: string;
  difficulty: LabDifficulty;
  status: LabStatus;
  objectives: string[];
  assets: string[];
  estimatedMinutes: number;
  levels: readonly LabLevel[];
}

export const difficultyLabels: Record<LabDifficulty, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export const statusLabels: Record<LabStatus, string> = {
  coming_soon: "準備中",
  available: "利用可能",
  maintenance: "メンテナンス中",
};
