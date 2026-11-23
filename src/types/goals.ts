// ============================================================
// BDSisters.org — Discover Yourself & Goal Tracking Types
// Domain 8: Goals & Holistic Development
// ============================================================

export type LifeDimension =
  | "Spiritual"
  | "Financial"
  | "Career"
  | "Emotional"
  | "Physical"
  | "Family"
  | "Community"
  | "Personal Mastery";

export interface HolisticWheelScore {
  dimension: LifeDimension;
  score: number; // 1 to 10
  targetScore: number; // 1 to 10
  notes?: string;
  color: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export type GoalImpactTier = "VITAL_FEW" | "USEFUL_MANY"; // Pareto 20% vs 80%

export type GoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface Goal {
  id: string;
  title: string;
  description: string;
  dimension: LifeDimension;
  impactTier: GoalImpactTier;
  targetDate: string;
  progress: number; // 0 to 100
  status: GoalStatus;
  milestones: GoalMilestone[];
  createdAt: string;
  updatedAt?: string;
}

export interface WheelAnalysisResponse {
  scores: HolisticWheelScore[];
  overallBalanceScore: number; // 0 to 100
  strongestDimension: LifeDimension;
  weakestDimension: LifeDimension;
  vitalFewRecommendations: string[];
}
