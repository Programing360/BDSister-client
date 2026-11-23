"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Compass,
    Plus,
    CheckCircle2,
    Trash2,
    Sparkles,
    Target,
    RefreshCw,
    AlertCircle,
    Flame,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

type HolisticCategory =
    | "Deen & Spirituality"
    | "Family & Tarbiyah"
    | "Career & Enterprise"
    | "Health & Wellness"
    | "Sisterhood & Khidmah";

interface GoalItem {
    _id: string;
    title: string;
    category: HolisticCategory | string;
    isTop20Priority?: boolean;
    progress: number;
    isCompleted: boolean;
    targetDate?: string;
}

const WHEEL_CATEGORIES: Array<{
    name: HolisticCategory;
    shortLabel: string;
    color: string;
}> = [
        { name: "Deen & Spirituality", shortLabel: "Deen", color: "#5B9891" },
        { name: "Family & Tarbiyah", shortLabel: "Family", color: "#D98408" },
        { name: "Career & Enterprise", shortLabel: "Enterprise", color: "#467A74" },
        { name: "Health & Wellness", shortLabel: "Wellness", color: "#F2B55D" },
        { name: "Sisterhood & Khidmah", shortLabel: "Khidmah", color: "#8B5E3C" },
    ];

export function MemberDiscoverView() {
    const [goals, setGoals] = useState<GoalItem[]>([]);
    const [wheelScores, setWheelScores] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    // New Goal Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<HolisticCategory>("Deen & Spirituality");
    const [isTop20, setIsTop20] = useState<boolean>(true);
    const [filterMode, setFilterMode] = useState<"ALL" | "TOP20">("ALL");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchDiscoverData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [goalsRes, wheelRes] = await Promise.allSettled([
                apiClient.get<{ data?: GoalItem[] }>(API_ENDPOINTS.goals.list),
                apiClient.get<{ data?: Record<string, number> }>(API_ENDPOINTS.goals.wheel),
            ]);

            if (goalsRes.status === "fulfilled") {
                const rawG = goalsRes.value as unknown as { data?: GoalItem[] } | GoalItem[];
                const list = Array.isArray(rawG) ? rawG : rawG.data || [];
                setGoals(list);
            }

            if (wheelRes.status === "fulfilled") {
                const rawW = wheelRes.value as unknown as { data?: Record<string, number> };
                if (rawW.data && typeof rawW.data === "object") {
                    setWheelScores(rawW.data);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load holistic goals.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDiscoverData();
    }, [fetchDiscoverData]);

    // Compute wheel score per category (fallback to goal progress average if backend wheel is empty)
    const computedWheel = useMemo(() => {
        return WHEEL_CATEGORIES.map((cat) => {
            const rawScore = wheelScores[cat.name];
            if (typeof rawScore === "number") {
                return { ...cat, score: Math.min(100, Math.max(10, rawScore)) };
            }
            const catGoals = goals.filter((g) => g.category === cat.name);
            if (catGoals.length === 0) return { ...cat, score: 25 };
            const avg =
                catGoals.reduce((sum, g) => sum + (g.isCompleted ? 100 : g.progress || 40), 0) /
                catGoals.length;
            return { ...cat, score: Math.round(avg) };
        });
    }, [goals, wheelScores]);

    // 80/20 Focus Metrics
    const focusMetrics = useMemo(() => {
        const total = goals.length;
        const top20Goals = goals.filter((g) => g.isTop20Priority);
        const completedTop20 = top20Goals.filter((g) => g.isCompleted).length;
        const top20Ratio = total > 0 ? Math.round((top20Goals.length / total) * 100) : 0;
        return { total, top20Count: top20Goals.length, completedTop20, top20Ratio };
    }, [goals]);

    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setIsCreating(true);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.goals.create, {
                title: title.trim(),
                category,
                isTop20Priority: isTop20,
                progress: 0,
                isCompleted: false,
            });
            setTitle("");
            showToast("Holistic goal added to your wheel!");
            await fetchDiscoverData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create goal.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleToggleGoal = async (goal: GoalItem) => {
        const nextCompleted = !goal.isCompleted;
        try {
            await apiClient.patch(API_ENDPOINTS.goals.update(goal._id), {
                isCompleted: nextCompleted,
                progress: nextCompleted ? 100 : 50,
            });
            await fetchDiscoverData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update goal.");
        }
    };

    const handleDeleteGoal = async (id: string) => {
        try {
            await apiClient.delete(API_ENDPOINTS.goals.delete(id));
            await fetchDiscoverData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete goal.");
        }
    };

    const visibleGoals =
        filterMode === "TOP20" ? goals.filter((g) => g.isTop20Priority) : goals;

    // Build SVG radar polygon points
    const cx = 130;
    const cy = 130;
    const maxR = 95;
    const polygonPoints = computedWheel
        .map((item, idx) => {
            const angle = (Math.PI * 2 * idx) / computedWheel.length - Math.PI / 2;
            const r = (item.score / 100) * maxR;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");

    return (
        <div className="space-y-6 pb-14">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Discover Yourself
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <Compass className="h-3.5 w-3.5" />
                            Holistic Wheel & 80/20 Focus
                        </span>
                        <SectionHelpTooltip
                            title="Discover Yourself Workspace"
                            explanation="Reflect on your Islamized Holistic Development Wheel across Deen, Family, Enterprise, Wellness, and Khidmah, and prioritize the top 20% actions that drive 80% of barakah and impact."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Align your daily actions with Islamic purpose, family harmony, and sustainable growth.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchDiscoverData}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Sync Wheel</span>
                </button>
            </div>

            {/* Main 2-Column Layout: Left = Holistic Wheel + 80/20 Chart, Right = Goal Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 5 Columns: Visual Wheel & 80/20 Breakdown */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Islamized Holistic Development Wheel */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-[#D98408]" />
                                <h2 className="text-sm font-bold text-gray-900">
                                    Islamized Holistic Development Wheel
                                </h2>
                            </div>
                            <SectionHelpTooltip
                                title="5 Pillars of Holistic Balance"
                                explanation="Visualizes your current balance across Deen, Family, Enterprise, Wellness, and Sisterhood Khidmah."
                            />
                        </div>

                        <div className="flex justify-center py-2">
                            <svg width="260" height="260" viewBox="0 0 260 260" className="overflow-visible">
                                {/* Concentric guide circles */}
                                {[25, 50, 75, 100].map((pct) => (
                                    <circle
                                        key={pct}
                                        cx={cx}
                                        cy={cy}
                                        r={(pct / 100) * maxR}
                                        fill="none"
                                        stroke="#E5E7EB"
                                        strokeDasharray="3 3"
                                    />
                                ))}

                                {/* Spokes & Labels */}
                                {computedWheel.map((item, idx) => {
                                    const angle = (Math.PI * 2 * idx) / computedWheel.length - Math.PI / 2;
                                    const x2 = cx + maxR * Math.cos(angle);
                                    const y2 = cy + maxR * Math.sin(angle);
                                    const lx = cx + (maxR + 22) * Math.cos(angle);
                                    const ly = cy + (maxR + 22) * Math.sin(angle);

                                    return (
                                        <g key={item.name}>
                                            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#E5E7EB" />
                                            <text
                                                x={lx}
                                                y={ly}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-gray-700 text-[10px] font-bold"
                                            >
                                                {item.shortLabel}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Filled Holistic Area */}
                                <polygon
                                    points={polygonPoints}
                                    fill="rgba(91, 152, 145, 0.25)"
                                    stroke="#5B9891"
                                    strokeWidth="2.5"
                                />
                            </svg>
                        </div>

                        {/* Domain Score Bars */}
                        <div className="space-y-2.5 pt-1">
                            {computedWheel.map((item) => (
                                <div key={item.name} className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-gray-700">{item.name}</span>
                                        <span className="text-[#467A74]">{item.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-[#FAF8F5] overflow-hidden">
                                        <div
                                            style={{ width: `${item.score}%`, backgroundColor: item.color }}
                                            className="h-full rounded-full transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 80/20 Focus Chart Card */}
                    <div className="rounded-2xl border border-[#D98408]/30 bg-white p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Flame className="h-4 w-4 text-[#D98408]" />
                                <h2 className="text-sm font-bold text-gray-900">80/20 High-Impact Focus</h2>
                            </div>
                            <SectionHelpTooltip
                                title="Pareto 80/20 Principle"
                                explanation="Focus on the vital 20% of goals that bring 80% of spiritual, family, and business results."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="rounded-xl bg-[#F7DFC7]/55 p-3.5 border border-[#D98408]/20">
                                <p className="text-xl font-black text-[#D98408]">{focusMetrics.top20Count}</p>
                                <p className="text-[11px] font-bold text-gray-700 mt-0.5">Vital 20% Goals</p>
                            </div>
                            <div className="rounded-xl bg-[#5B9891]/12 p-3.5 border border-[#5B9891]/25">
                                <p className="text-xl font-black text-[#467A74]">
                                    {focusMetrics.completedTop20}/{focusMetrics.top20Count}
                                </p>
                                <p className="text-[11px] font-bold text-gray-700 mt-0.5">Vital Completed</p>
                            </div>
                        </div>

                        <p className="text-[11px] text-gray-500 leading-relaxed">
                            Currently <strong>{focusMetrics.top20Ratio}%</strong> of your active goals are marked as Vital 20% Priorities. Keep your vital list focused and intentional.
                        </p>
                    </div>
                </div>

                {/* Right 7 Columns: Create & Track Goals */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Add Goal Form */}
                    <form
                        onSubmit={handleCreateGoal}
                        className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3.5"
                    >
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-[#5B9891]" />
                            <h2 className="text-sm font-bold text-gray-900">Set a New Intentional Goal</h2>
                        </div>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Complete Surah Al-Mulk memorization or Launch Ramadan gift box..."
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                            required
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as HolisticCategory)}
                                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700"
                            >
                                {WHEEL_CATEGORIES.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <label className="inline-flex items-center gap-2 text-xs font-bold text-[#D98408] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isTop20}
                                    onChange={(e) => setIsTop20(e.target.checked)}
                                    className="h-4 w-4 accent-[#D98408]"
                                />
                                <span>Mark as Vital 20% Priority</span>
                            </label>

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                <span>{isCreating ? "Adding..." : "Add Goal"}</span>
                            </button>
                        </div>
                    </form>

                    {/* Goals List */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-bold text-gray-900">
                                My Goal Roadmap ({visibleGoals.length})
                            </h3>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setFilterMode("ALL")}
                                    className={`rounded-lg px-3 py-1 text-[11px] font-bold ${filterMode === "ALL"
                                        ? "bg-[#5B9891] text-white"
                                        : "bg-[#FAF8F5] text-gray-600"
                                        }`}
                                >
                                    All Goals
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterMode("TOP20")}
                                    className={`rounded-lg px-3 py-1 text-[11px] font-bold ${filterMode === "TOP20"
                                        ? "bg-[#D98408] text-white"
                                        : "bg-[#FAF8F5] text-gray-600"
                                        }`}
                                >
                                    Vital 20% Only
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <p className="py-10 text-center text-xs text-gray-400 animate-pulse">
                                Loading goals...
                            </p>
                        ) : visibleGoals.length === 0 ? (
                            <p className="py-10 text-center text-xs text-gray-400">
                                No goals found in this view. Add your first goal above!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {visibleGoals.map((goal) => (
                                    <div
                                        key={goal._id}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#FAF8F5] px-4 py-3 text-xs"
                                    >
                                        <div className="flex items-start gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleGoal(goal)}
                                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${goal.isCompleted
                                                    ? "bg-[#5B9891] border-[#5B9891] text-white"
                                                    : "bg-white border-gray-300 text-transparent hover:border-[#5B9891]"
                                                    }`}
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                            </button>
                                            <div>
                                                <p
                                                    className={`font-bold ${goal.isCompleted
                                                        ? "line-through text-gray-400"
                                                        : "text-gray-900"
                                                        }`}
                                                >
                                                    {goal.title}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                    <span className="rounded bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                                        {goal.category}
                                                    </span>
                                                    {goal.isTop20Priority && (
                                                        <span className="rounded bg-[#F7DFC7] px-2 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                            Vital 20%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGoal(goal._id)}
                                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 shrink-0"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}