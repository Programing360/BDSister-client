"use client";

import React, { useState, useEffect } from "react";
import { goalService } from "@/lib/services/goal-service";
import type { HolisticWheelScore, WheelAnalysisResponse } from "@/types/goals";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Save,
  RotateCcw,
} from "lucide-react";

interface HolisticWheelProps {
  onScoreUpdated?: (scores: HolisticWheelScore[]) => void;
}

export function HolisticWheel({ onScoreUpdated }: HolisticWheelProps) {
  const [analysis, setAnalysis] = useState<WheelAnalysisResponse | null>(null);
  const [scores, setScores] = useState<HolisticWheelScore[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    goalService.getWheelAnalysis().then((data) => {
      setAnalysis(data);
      setScores(data.scores);
    });
  }, []);

  const handleScoreChange = (dimension: string, newScore: number) => {
    setScores((prev) =>
      prev.map((s) => (s.dimension === dimension ? { ...s, score: newScore } : s))
    );
  };

  const handleSaveAssessment = async () => {
    try {
      setSaving(true);
      const res = await goalService.updateWheelScores(scores);
      setAnalysis(res);
      setSavedSuccess(true);
      if (onScoreUpdated) onScoreUpdated(scores);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!analysis || scores.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-text-secondary">
        Loading Holistic Development Wheel...
      </div>
    );
  }

  // --- SVG Radar Geometry ---
  const size = 440;
  const center = size / 2;
  const radius = 150;
  const totalAxes = scores.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  // Compute point coordinates on wheel
  const getCoordinates = (index: number, scoreValue: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (scoreValue / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build polygon path strings
  const currentPolygonPoints = scores
    .map((s, idx) => {
      const { x, y } = getCoordinates(idx, s.score);
      return `${x},${y}`;
    })
    .join(" ");

  const targetPolygonPoints = scores
    .map((s, idx) => {
      const { x, y } = getCoordinates(idx, s.targetScore);
      return `${x},${y}`;
    })
    .join(" ");

  // Grid levels (2, 4, 6, 8, 10)
  const gridLevels = [2, 4, 6, 8, 10];

  const overallScore = Math.round(
    (scores.reduce((acc, s) => acc + s.score, 0) / (scores.length * 10)) * 100
  );

  return (
    <div className="space-y-8">
      {/* Top Banner & Balance Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card">
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Holistic Growth Diagnosis
            </span>
          </div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">
            Discover Yourself Across 8 Life Dimensions
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            True Islamic excellence and entrepreneurial success require holistic balance.
            Identify your strength anchors, diagnose the bottleneck dimension holding you back, and realign your focus.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-surface/60 p-5 border border-border/70 text-center">
          <span className="text-xs text-text-secondary font-medium">Life Harmony Index</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-black text-primary">{overallScore}</span>
            <span className="text-xs text-text-secondary font-semibold">/ 100</span>
          </div>
          <span className="mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {overallScore >= 75 ? "Well-Balanced Harmony" : "Opportunity for Realignment"}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-success/10 p-4 text-xs text-success border border-success/20 font-medium animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Your holistic self-assessment ratings have been updated and synchronized with your goals!</span>
        </div>
      )}

      {/* Main Wheel View: SVG Radar + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Responsive SVG Radar Chart */}
        <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-white p-6 shadow-card flex flex-col items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full select-none"
            >
              {/* Concentric Grid Rings */}
              {gridLevels.map((lvl) => {
                const r = (lvl / 10) * radius;
                return (
                  <circle
                    key={lvl}
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeDasharray={lvl === 10 ? "none" : "3,3"}
                    strokeWidth="1"
                  />
                );
              })}

              {/* 8 Axis Lines */}
              {scores.map((_, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const endX = center + radius * Math.cos(angle);
                const endY = center + radius * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={endX}
                    y2={endY}
                    stroke="#CBD5E1"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Target Polygon (Dashed outline) */}
              <polygon
                points={targetPolygonPoints}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* Current Score Polygon (Filled Gradient & Stroke) */}
              <defs>
                <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5B46F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <polygon
                points={currentPolygonPoints}
                fill="url(#wheelGradient)"
                stroke="#5B46F6"
                strokeWidth="2.5"
              />

              {/* Vertex Circles */}
              {scores.map((s, idx) => {
                const { x, y } = getCoordinates(idx, s.score);
                return (
                  <circle
                    key={s.dimension}
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill={s.color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Axis Dimension Labels */}
              {scores.map((s, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const labelRadius = radius + 38;
                const lx = center + labelRadius * Math.cos(angle);
                const ly = center + labelRadius * Math.sin(angle);
                return (
                  <g key={s.dimension} transform={`translate(${lx}, ${ly})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[11px] font-bold fill-slate-800"
                    >
                      {s.dimension}
                    </text>
                    <text
                      y="14"
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-indigo-600 font-mono"
                    >
                      {s.score}/10
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-6 mt-4 text-xs">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <strong className="text-text-primary">Current Rating</strong>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-dashed border-slate-400" />
              <strong className="text-text-secondary">Target Benchmark</strong>
            </span>
          </div>
        </div>

        {/* Right: Key Insights & Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Diagnostic Insights</span>
            </h3>

            <div className="space-y-3">
              <div className="rounded-2xl bg-primary/5 p-4 border border-primary/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Strongest Anchor
                </span>
                <h4 className="text-sm font-bold text-text-primary">
                  {analysis.strongestDimension} Dimension (8/10)
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your spiritual and ethical grounding is your primary source of resilience. Lean on this during times of high business pressure.
                </p>
              </div>

              <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Chief Bottleneck Dimension
                </span>
                <h4 className="text-sm font-bold text-text-primary">
                  {analysis.weakestDimension} Dimension (5/10)
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Rest, recovery, and regular movement represent your greatest growth opportunity. Raising your physical stamina by just 2 points will amplify all other dimensions.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/70 space-y-2 text-xs text-text-secondary">
              <span className="font-bold text-text-primary block">
                Pareto Actionable Focus:
              </span>
              {analysis.vitalFewRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score Adjustment Sliders */}
      <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Refine Your Self-Assessment Ratings
            </h3>
            <p className="text-xs text-text-secondary">
              Slide to adjust your current satisfaction level (1 to 10) in each life dimension.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAssessment}
            disabled={saving}
            className="rounded-2xl gap-2 shadow-button"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save Ratings"}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scores.map((s) => (
            <div
              key={s.dimension}
              className="rounded-2xl border border-border/70 bg-surface/40 p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary text-sm">
                  {s.dimension}
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-primary text-base">{s.score}</span>
                  <span className="text-text-secondary text-xs">/ 10</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={s.score}
                onChange={(e) => handleScoreChange(s.dimension, Number(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <p className="text-[11px] text-text-secondary leading-relaxed">
                {s.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
