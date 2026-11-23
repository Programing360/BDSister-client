"use client";

import React, { useState, useEffect } from "react";
import type { Goal } from "@/types/goals";
import { goalService } from "@/lib/services/goal-service";
import { HolisticWheel } from "./holistic-wheel";
import { ParetoMatrix } from "./pareto-matrix";
import { GoalTracker } from "./goal-tracker";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Target,
  Zap,
  Sparkles,
  Layers,
  Award,
} from "lucide-react";

export function GoalsDashboardView() {
  const [activeTab, setActiveTab] = useState<"wheel" | "pareto" | "goals">("wheel");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    goalService
      .getGoals()
      .then((data) => setGoals(data))
      .finally(() => setLoading(false));
  }, []);

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleGoalUpdated = (updatedGoal: Goal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );
  };

  const handleGoalDeleted = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const vitalCount = goals.filter((g) => g.impactTier === "VITAL_FEW").length;
  const completedCount = goals.filter((g) => g.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Discover Yourself &amp; Holistic Mastery
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Self-Discovery, Wheel &amp; 80/20 Goal Engine
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Diagnose life dimension harmony, prioritize your 20% high-leverage breakthroughs, and execute milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
            {vitalCount} Vital Goals
          </span>
          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold">
            {completedCount} Completed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("wheel")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeTab === "wheel"
              ? "bg-primary text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Holistic Development Wheel</span>
        </button>

        <button
          onClick={() => setActiveTab("pareto")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeTab === "pareto"
              ? "bg-primary text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>80/20 Priority Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab("goals")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeTab === "goals"
              ? "bg-primary text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Goal &amp; Milestone Roadmap ({goals.length})</span>
        </button>
      </div>

      {/* Content based on tab */}
      {loading ? (
        <div className="py-16 text-center text-xs text-text-secondary">
          Loading Discover Yourself data...
        </div>
      ) : (
        <>
          {activeTab === "wheel" && <HolisticWheel />}

          {activeTab === "pareto" && (
            <ParetoMatrix goals={goals} onGoalUpdated={handleGoalUpdated} />
          )}

          {activeTab === "goals" && (
            <GoalTracker
              goals={goals}
              onGoalCreated={handleGoalCreated}
              onGoalUpdated={handleGoalUpdated}
              onGoalDeleted={handleGoalDeleted}
            />
          )}
        </>
      )}
    </div>
  );
}
