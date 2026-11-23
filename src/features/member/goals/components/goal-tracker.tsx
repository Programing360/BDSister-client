"use client";

import React, { useState } from "react";
import type { Goal, LifeDimension, GoalImpactTier, GoalStatus } from "@/types/goals";
import { goalService } from "@/lib/services/goal-service";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Sparkles,
  Flame,
  Layers,
  Filter,
  X,
  Target,
  Clock,
} from "lucide-react";

interface GoalTrackerProps {
  goals: Goal[];
  onGoalCreated: (goal: Goal) => void;
  onGoalUpdated: (goal: Goal) => void;
  onGoalDeleted: (id: string) => void;
}

export function GoalTracker({
  goals,
  onGoalCreated,
  onGoalUpdated,
  onGoalDeleted,
}: GoalTrackerProps) {
  const [filterDimension, setFilterDimension] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterTier, setFilterTier] = useState<string>("ALL");

  // Create Goal Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDimension, setNewDimension] = useState<LifeDimension>("Career");
  const [newTier, setNewTier] = useState<GoalImpactTier>("VITAL_FEW");
  const [newTargetDate, setNewTargetDate] = useState("2026-12-31");
  const [milestonesList, setMilestonesList] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);

  const filtered = goals.filter((g) => {
    const matchDim = filterDimension === "ALL" || g.dimension === filterDimension;
    const matchStatus = filterStatus === "ALL" || g.status === filterStatus;
    const matchTier = filterTier === "ALL" || g.impactTier === filterTier;
    return matchDim && matchStatus && matchTier;
  });

  const handleToggleMilestone = async (goal: Goal, milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const totalCount = updatedMilestones.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const status: GoalStatus =
      progress === 100 ? "COMPLETED" : progress > 0 ? "IN_PROGRESS" : "NOT_STARTED";

    const updated = await goalService.updateGoal(goal.id, {
      milestones: updatedMilestones,
      progress,
      status,
    });
    onGoalUpdated(updated);
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await goalService.deleteGoal(id);
      onGoalDeleted(id);
    }
  };

  const handleAddMilestoneInput = () => {
    setMilestonesList((prev) => [...prev, ""]);
  };

  const handleRemoveMilestoneInput = (index: number) => {
    setMilestonesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMilestoneInputChange = (index: number, val: string) => {
    setMilestonesList((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setSubmitting(true);
      const cleanedMilestones = milestonesList.map((m) => m.trim()).filter(Boolean);
      const created = await goalService.createGoal({
        title: newTitle.trim(),
        description: newDesc.trim(),
        dimension: newDimension,
        impactTier: newTier,
        targetDate: newTargetDate,
        milestones: cleanedMilestones.length > 0 ? cleanedMilestones : ["Initial planning step"],
      });

      onGoalCreated(created);
      setModalOpen(false);
      setNewTitle("");
      setNewDesc("");
      setMilestonesList([""]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & New Goal Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <h2 className="text-xl font-black text-text-primary tracking-tight">
            Goal &amp; Milestone Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track execution progress, check off step-by-step milestones, and celebrate wins across your life dimensions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="rounded-2xl gap-2 shadow-button"
        >
          <Plus className="h-4 w-4" />
          <span>Set New Goal</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-border/80 shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-secondary">Dimension:</span>
          <select
            value={filterDimension}
            onChange={(e) => setFilterDimension(e.target.value)}
            className="rounded-xl border border-border bg-surface/50 px-2.5 py-1.5 font-medium text-text-primary"
          >
            <option value="ALL">All Dimensions</option>
            <option value="Spiritual">Spiritual</option>
            <option value="Financial">Financial</option>
            <option value="Career">Career</option>
            <option value="Emotional">Emotional</option>
            <option value="Physical">Physical</option>
            <option value="Family">Family</option>
            <option value="Community">Community</option>
            <option value="Personal Mastery">Personal Mastery</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-text-secondary">Impact Tier:</span>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="rounded-xl border border-border bg-surface/50 px-2.5 py-1.5 font-medium text-text-primary"
          >
            <option value="ALL">All Tiers</option>
            <option value="VITAL_FEW">Vital Few (20% High Impact)</option>
            <option value="USEFUL_MANY">Useful Many (80% Routine)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-text-secondary">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-border bg-surface/50 px-2.5 py-1.5 font-medium text-text-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 rounded-3xl border border-dashed border-border bg-white p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              No Goals Found in this View
            </h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              Set a new goal or adjust your filters above to see your milestone roadmaps.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="rounded-2xl"
            >
              Add Your First Goal
            </Button>
          </div>
        ) : (
          filtered.map((goal) => (
            <div
              key={goal.id}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-6 shadow-card hover:border-primary/40 transition-all space-y-4"
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-bold text-primary text-[10px]">
                      {goal.dimension}
                    </span>
                    {goal.impactTier === "VITAL_FEW" ? (
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                        <Flame className="h-3 w-3" />
                        <span>Vital 20%</span>
                      </span>
                    ) : (
                      <span className="rounded-md bg-surface text-text-secondary border border-border px-2 py-0.5 text-[10px] font-medium">
                        Useful 80%
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      goal.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : goal.status === "IN_PROGRESS"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-surface text-text-secondary border border-border"
                    }`}
                  >
                    {goal.status === "COMPLETED"
                      ? "Completed"
                      : goal.status === "IN_PROGRESS"
                      ? "In Progress"
                      : "Not Started"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary leading-snug">
                  {goal.title}
                </h3>
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                  {goal.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Completion:</span>
                    <span className="text-primary font-bold">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface overflow-hidden border border-border/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.progress === 100 ? "bg-emerald-500" : "bg-primary"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestone Checklist */}
                <div className="mt-5 space-y-2 border-t border-border/70 pt-4">
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block mb-2">
                    Milestone Checklist:
                  </span>
                  {goal.milestones.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleToggleMilestone(goal, m.id)}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                        m.completed
                          ? "bg-emerald-50/60 text-text-secondary line-through"
                          : "hover:bg-surface text-text-primary font-medium"
                      }`}
                    >
                      {m.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-text-secondary shrink-0 mt-0.5" />
                      )}
                      <span className="leading-snug">{m.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-xs text-text-secondary">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Target: {goal.targetDate}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-1.5 rounded-lg text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                  title="Delete goal"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">Set a New Goal</h3>
                  <p className="text-xs text-text-secondary">Define milestones and Pareto impact</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-text-secondary hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Goal Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Secure ISO-compliant packaging partner for modest fashion"
                  className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Life Dimension
                  </label>
                  <select
                    value={newDimension}
                    onChange={(e) => setNewDimension(e.target.value as LifeDimension)}
                    className="w-full rounded-2xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                  >
                    <option value="Spiritual">Spiritual</option>
                    <option value="Financial">Financial</option>
                    <option value="Career">Career</option>
                    <option value="Emotional">Emotional</option>
                    <option value="Physical">Physical</option>
                    <option value="Family">Family</option>
                    <option value="Community">Community</option>
                    <option value="Personal Mastery">Personal Mastery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Impact Tier (Pareto)
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as GoalImpactTier)}
                    className="w-full rounded-2xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                  >
                    <option value="VITAL_FEW">Vital Few (20% High Leverage)</option>
                    <option value="USEFUL_MANY">Useful Many (80% Routine / Habit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Brief why or outcome..."
                    className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Milestones dynamic list */}
              <div className="space-y-2 pt-2 border-t border-border/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-primary">
                    Action Milestones
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMilestoneInput}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {milestonesList.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => handleMilestoneInputChange(idx, e.target.value)}
                        placeholder={`Step ${idx + 1}...`}
                        className="flex-1 rounded-xl border border-border bg-surface/50 px-3 py-1.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                      />
                      {milestonesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestoneInput(idx)}
                          className="p-1 text-text-secondary hover:text-danger"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="rounded-2xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting || !newTitle.trim()}
                  className="rounded-2xl shadow-button gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{submitting ? "Saving..." : "Create Goal"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
