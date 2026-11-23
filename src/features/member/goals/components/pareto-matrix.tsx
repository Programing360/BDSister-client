"use client";

import React, { useState } from "react";
import type { Goal } from "@/types/goals";
import { goalService } from "@/lib/services/goal-service";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Flame,
} from "lucide-react";

interface ParetoMatrixProps {
  goals: Goal[];
  onGoalUpdated: (updated: Goal) => void;
}

export function ParetoMatrix({ goals, onGoalUpdated }: ParetoMatrixProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const vitalFew = goals.filter((g) => g.impactTier === "VITAL_FEW");
  const usefulMany = goals.filter((g) => g.impactTier === "USEFUL_MANY");

  const handleToggleTier = async (goal: Goal) => {
    try {
      setUpdatingId(goal.id);
      const newTier = goal.impactTier === "VITAL_FEW" ? "USEFUL_MANY" : "VITAL_FEW";
      const updated = await goalService.updateGoal(goal.id, { impactTier: newTier });
      onGoalUpdated(updated);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Principle Education Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-heading-accent/5 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            The 80/20 Leverage Principle (Vilfredo Pareto)
          </span>
        </div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">
          20% of Your Actions Drive 80% of Your Breakthroughs
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-3xl leading-relaxed">
          Most ambitious sisters get caught in the exhaustion of the &quot;Useful Many&quot; — answering routine inquiries, endlessly tweaking logos, or organizing folders.
          By ruthlessly identifying and executing your <strong>Vital Few</strong> goals first, you create compounding leverage that transforms your business and personal peace of mind.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-2xl bg-white/80 p-4 border border-primary/20 shadow-xs flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-black text-lg shrink-0">
              20%
            </div>
            <div>
              <strong className="text-xs font-bold text-text-primary block">The Vital Few (Leverage)</strong>
              <span className="text-[11px] text-text-secondary">
                {vitalFew.length} Active Goals producing 80% of commercial impact.
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 border border-border shadow-xs flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-black text-lg shrink-0">
              80%
            </div>
            <div>
              <strong className="text-xs font-bold text-text-primary block">The Useful Many (Support)</strong>
              <span className="text-[11px] text-text-secondary">
                {usefulMany.length} Supporting habits and recurring operational routines.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Pareto Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: Vital Few (20% High Impact) */}
        <div className="rounded-3xl border-2 border-primary/30 bg-white p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  The Vital Few (High Leverage)
                </h3>
                <span className="text-[11px] text-amber-600 font-semibold">
                  Focus 80% of your prime energy here
                </span>
              </div>
            </div>
            <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-bold">
              {vitalFew.length} Goals
            </span>
          </div>

          {vitalFew.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-text-secondary">
              No vital goals designated yet. Promote a goal to give it top priority!
            </div>
          ) : (
            <div className="space-y-4">
              {vitalFew.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3 transition-all hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                        {goal.dimension}
                      </span>
                      <h4 className="text-sm font-bold text-text-primary mt-1.5 leading-snug">
                        {goal.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleToggleTier(goal)}
                      disabled={updatingId === goal.id}
                      className="text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors shrink-0"
                      title="Demote to Useful Many"
                    >
                      Demote ↓
                    </button>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-text-secondary">Milestone Progress:</span>
                      <strong className="text-primary font-bold">{goal.progress}%</strong>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white overflow-hidden border border-primary/20">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
                    <span>
                      {goal.milestones.filter((m) => m.completed).length} of {goal.milestones.length} milestones complete
                    </span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Useful Many (80% Routine & Habits) */}
        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface text-text-secondary border border-border">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  The Useful Many (Supportive)
                </h3>
                <span className="text-[11px] text-text-secondary">
                  Automate, batch, or execute during lower-energy hours
                </span>
              </div>
            </div>
            <span className="rounded-full bg-surface text-text-secondary border border-border px-2.5 py-0.5 text-xs font-bold">
              {usefulMany.length} Goals
            </span>
          </div>

          {usefulMany.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-text-secondary">
              No secondary goals listed.
            </div>
          ) : (
            <div className="space-y-4">
              {usefulMany.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-border/80 bg-surface/40 p-5 space-y-3 transition-all hover:bg-surface/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-text-secondary border border-border/60">
                        {goal.dimension}
                      </span>
                      <h4 className="text-sm font-bold text-text-primary mt-1.5 leading-snug">
                        {goal.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleToggleTier(goal)}
                      disabled={updatingId === goal.id}
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
                      title="Promote to Vital Few"
                    >
                      Promote to Vital ↑
                    </button>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-text-secondary">Progress:</span>
                      <strong className="text-text-primary font-bold">{goal.progress}%</strong>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white overflow-hidden border border-border">
                      <div
                        className="h-full bg-slate-400 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
                    <span>
                      {goal.milestones.filter((m) => m.completed).length} of {goal.milestones.length} milestones complete
                    </span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
