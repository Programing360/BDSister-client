// ============================================================
// BDSisters.org — Goal & Holistic Development Service
// Domain 8: Goals & 80/20 Pareto Prioritization
// ============================================================

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Goal,
  HolisticWheelScore,
  WheelAnalysisResponse,
  LifeDimension,
} from "@/types/goals";

export const INITIAL_WHEEL_SCORES: HolisticWheelScore[] = [
  {
    dimension: "Spiritual",
    score: 8,
    targetScore: 9,
    notes: "Consistent daily prayers, Quran reflections, and gratitude practice.",
    color: "#5B46F6", // Primary
  },
  {
    dimension: "Financial",
    score: 6,
    targetScore: 8,
    notes: "Halal savings plan, building 6-month emergency reserve, revenue diversification.",
    color: "#10B981", // Emerald
  },
  {
    dimension: "Career",
    score: 7,
    targetScore: 9,
    notes: "Expanding boutique client base, securing trade license, digital sales growth.",
    color: "#3B82F6", // Blue
  },
  {
    dimension: "Emotional",
    score: 6,
    targetScore: 8,
    notes: "Managing entrepreneurial anxiety, setting healthy boundaries, peer sharing.",
    color: "#EC4899", // Pink
  },
  {
    dimension: "Physical",
    score: 5,
    targetScore: 8,
    notes: "Need 7+ hours sleep, consistent hydration, and weekly walks in morning light.",
    color: "#F59E0B", // Amber
  },
  {
    dimension: "Family",
    score: 8,
    targetScore: 9,
    notes: "Nurturing children's character, evening family dinners without phone screens.",
    color: "#8B5CF6", // Purple
  },
  {
    dimension: "Community",
    score: 7,
    targetScore: 8,
    notes: "Mentoring junior sisters in BDSisters circles and sponsoring educational kits.",
    color: "#06B6D4", // Cyan
  },
  {
    dimension: "Personal Mastery",
    score: 6,
    targetScore: 9,
    notes: "Reading 2 business books monthly, learning advanced bookkeeping and Excel.",
    color: "#6366F1", // Indigo
  },
];

export const MOCK_GOALS: Goal[] = [
  {
    id: "goal-1",
    title: "Launch E-Commerce Boutique & Land First 50 Corporate Orders",
    description:
      "A vital 20% high-leverage business breakthrough goal that drives 80% of annual financial stability and brand visibility.",
    dimension: "Career",
    impactTier: "VITAL_FEW",
    targetDate: "2026-12-31",
    progress: 75,
    status: "IN_PROGRESS",
    milestones: [
      { id: "m-1", title: "Complete DNCC online trade license renewal", completed: true },
      { id: "m-2", title: "Finalize direct artisan contract with Sonargaon weavers", completed: true },
      { id: "m-3", title: "Publish 12 verified products on BDSisters Marketplace", completed: true },
      { id: "m-4", title: "Sign corporate delivery agreement with courier partner", completed: false },
    ],
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "goal-2",
    title: "Build 6-Month Emergency Fund in Shariah-Compliant Mudaraba Deposit",
    description:
      "Shield business and family from cashflow volatility with liquid, halal reserve funds.",
    dimension: "Financial",
    impactTier: "VITAL_FEW",
    targetDate: "2027-03-31",
    progress: 50,
    status: "IN_PROGRESS",
    milestones: [
      { id: "m-5", title: "Open Islamic banking high-yield Mudaraba account", completed: true },
      { id: "m-6", title: "Automate 20% monthly net profit allocation", completed: true },
      { id: "m-7", title: "Accumulate ৳250,000 threshold balance", completed: false },
    ],
    createdAt: "2026-11-05T12:00:00Z",
  },
  {
    id: "goal-3",
    title: "Daily Morning Mindfulness & 20-Minute Brisk Walk",
    description:
      "Reclaim physical vitality and clear mental brain fog before beginning daily work.",
    dimension: "Physical",
    impactTier: "USEFUL_MANY",
    targetDate: "2026-12-15",
    progress: 33,
    status: "IN_PROGRESS",
    milestones: [
      { id: "m-8", title: "Set 6:00 AM alarm and morning stretch routine", completed: true },
      { id: "m-9", title: "Complete 14 consecutive days of morning walks", completed: false },
      { id: "m-10", title: "Track daily 2.5L water hydration target", completed: false },
    ],
    createdAt: "2026-11-10T08:00:00Z",
  },
  {
    id: "goal-4",
    title: "Read 2 Books on Supply Chain & Modest Design Architecture",
    description:
      "Deepen domain mastery and improve garment finishing quality for international export standards.",
    dimension: "Personal Mastery",
    impactTier: "USEFUL_MANY",
    targetDate: "2027-01-31",
    progress: 0,
    status: "NOT_STARTED",
    milestones: [
      { id: "m-11", title: "Acquire recommended reading list from TSPP/CoP mentor", completed: false },
      { id: "m-12", title: "Complete Book 1: Textile Quality & Sustainable Dying", completed: false },
      { id: "m-13", title: "Synthesize 3 actionable case studies for our workshop team", completed: false },
    ],
    createdAt: "2026-11-15T15:30:00Z",
  },
];

export const goalService = {
  async getGoals(): Promise<Goal[]> {
    try {
      const res = await apiClient.get<Goal[]>(API_ENDPOINTS.goals.list);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn("[GoalService] Goals API deferred, using fallback:", (err as Error).message);
    }
    return MOCK_GOALS;
  },

  async createGoal(data: {
    title: string;
    description: string;
    dimension: LifeDimension;
    impactTier: "VITAL_FEW" | "USEFUL_MANY";
    targetDate: string;
    milestones: string[];
  }): Promise<Goal> {
    try {
      const res = await apiClient.post<Goal>(API_ENDPOINTS.goals.create, data);
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[GoalService] Create goal API deferred, simulating:", (err as Error).message);
    }

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: data.title,
      description: data.description,
      dimension: data.dimension,
      impactTier: data.impactTier,
      targetDate: data.targetDate,
      progress: 0,
      status: "NOT_STARTED",
      milestones: data.milestones.map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
    };

    MOCK_GOALS.unshift(newGoal);
    return newGoal;
  },

  async updateGoal(id: string, updateData: Partial<Goal>): Promise<Goal> {
    try {
      const res = await apiClient.patch<Goal>(API_ENDPOINTS.goals.update(id), updateData);
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[GoalService] Update goal API deferred, simulating:", (err as Error).message);
    }

    const existing = MOCK_GOALS.find((g) => g.id === id);
    if (!existing) {
      throw new Error("Goal not found");
    }

    const updated: Goal = {
      ...existing,
      ...updateData,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    const index = MOCK_GOALS.findIndex((g) => g.id === id);
    if (index !== -1) {
      MOCK_GOALS[index] = updated;
    }
    return updated;
  },

  async deleteGoal(id: string): Promise<{ success: boolean }> {
    try {
      const res = await apiClient.delete<{ success: boolean }>(API_ENDPOINTS.goals.delete(id));
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[GoalService] Delete goal API deferred, simulating:", (err as Error).message);
    }

    const index = MOCK_GOALS.findIndex((g) => g.id === id);
    if (index !== -1) {
      MOCK_GOALS.splice(index, 1);
    }
    return { success: true };
  },

  async getWheelAnalysis(): Promise<WheelAnalysisResponse> {
    try {
      const res = await apiClient.get<WheelAnalysisResponse>(API_ENDPOINTS.goals.wheel);
      if (res.data && res.data.scores) return res.data;
    } catch (err) {
      console.warn("[GoalService] Wheel API deferred, using fallback:", (err as Error).message);
    }

    const total = INITIAL_WHEEL_SCORES.reduce((acc, s) => acc + s.score, 0);
    const overallBalanceScore = Math.round((total / (INITIAL_WHEEL_SCORES.length * 10)) * 100);

    return {
      scores: INITIAL_WHEEL_SCORES,
      overallBalanceScore,
      strongestDimension: "Spiritual",
      weakestDimension: "Physical",
      vitalFewRecommendations: [
        "Your Physical vitality (score 5/10) is currently your chief bottleneck. Boosting your sleep and morning movement will lift focus across your Career and Emotional harmony.",
        "Your Spiritual and Family foundation (8/10) is strong. Leverage this grounding to tackle your top 20% high-impact financial goals.",
        "Prioritize the 'Vital Few' goals over routine busywork to unlock 80% of your business breakthrough this quarter.",
      ],
    };
  },

  async updateWheelScores(scores: HolisticWheelScore[]): Promise<WheelAnalysisResponse> {
    try {
      const res = await apiClient.patch<WheelAnalysisResponse>(API_ENDPOINTS.goals.wheel, { scores });
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[GoalService] Update wheel API deferred, simulating:", (err as Error).message);
    }

    // Update in-memory
    scores.forEach((s) => {
      const found = INITIAL_WHEEL_SCORES.find((i) => i.dimension === s.dimension);
      if (found) {
        found.score = s.score;
        found.targetScore = s.targetScore;
        if (s.notes) found.notes = s.notes;
      }
    });

    const total = INITIAL_WHEEL_SCORES.reduce((acc, s) => acc + s.score, 0);
    const overallBalanceScore = Math.round((total / (INITIAL_WHEEL_SCORES.length * 10)) * 100);

    return {
      scores: INITIAL_WHEEL_SCORES,
      overallBalanceScore,
      strongestDimension: "Spiritual",
      weakestDimension: "Physical",
      vitalFewRecommendations: [
        "Updated dimensions evaluated. Prioritize physical restoration to maintain sustained entrepreneurial energy.",
      ],
    };
  },
};
