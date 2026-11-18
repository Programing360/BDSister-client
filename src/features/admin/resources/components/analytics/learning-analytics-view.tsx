"use client";

import React from "react";
import Link from "next/link";
import type {
  LearningAnalyticsMetrics,
  ResourceKpis,
} from "../../types/resource";
import {
  DEMO_LEARNING_ANALYTICS,
  DEMO_RESOURCE_KPIS,
} from "../../data/mock-resources";
import {
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  BarChart3,
  Layers,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

interface LearningAnalyticsViewProps {
  metrics?: LearningAnalyticsMetrics;
  kpis?: ResourceKpis;
}

export function LearningAnalyticsView({
  metrics = DEMO_LEARNING_ANALYTICS,
  kpis = DEMO_RESOURCE_KPIS,
}: LearningAnalyticsViewProps) {
  const maxEnrollments = Math.max(
    ...metrics.monthlyEnrollmentSeries.map((s) => s.enrollments)
  );

  const totalCohort = metrics.progressDistribution.reduce(
    (acc, cur) => acc + cur.learnersCount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link
              href="/admin/resources"
              className="hover:text-[#5B46F6] transition-colors"
            >
              Resources
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Analytics</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE6F7] text-[#5B46F6]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Educational Learning Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                LMS completion rates, student progression cohorts, time-to-finish metrics, and resource consumption telemetry.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-pink-50/20 p-3.5 text-xs text-indigo-950 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-semibold text-[#5B46F6]">
            LMS Telemetry Engine:
          </span>
          <span>DEMO DATA — Not connected to live learning services.</span>
        </div>
        <span className="text-slate-500 font-medium hidden sm:inline">
          Aggregated across {kpis.totalResources} Catalogued Resources
        </span>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5" data-aos="fade-up">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Users className="h-4 w-4 text-[#5B46F6]" /> Total Students
          </div>
          <div className="text-xl font-bold text-slate-900">
            {metrics.totalEnrolledLearners.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all courses</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Clock className="h-4 w-4 text-indigo-600" /> Active Now
          </div>
          <div className="text-xl font-bold text-slate-900">
            {metrics.activeLearners.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Currently studying</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Finished
          </div>
          <div className="text-xl font-bold text-slate-900">
            {metrics.completedCoursesCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Full course completions</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <TrendingUp className="h-4 w-4 text-amber-600" /> Completion Rate
          </div>
          <div className="text-xl font-bold text-slate-900">
            {metrics.averageCompletionRatePct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Platform average</div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Enrollment vs Completion Trend */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#5B46F6]" />
                Enrollment & Completion Trend (6-Month Cohort)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly comparison of new student joins vs curriculum graduations
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#5B46F6]" /> Enrollments
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Completions
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {metrics.monthlyEnrollmentSeries.map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 w-16">
                    {item.month}
                  </span>
                  <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                    <span className="text-[#5B46F6] font-semibold">
                      {item.enrollments} enrolled
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      {item.completions} completed
                    </span>
                  </div>
                </div>

                {/* Double Bar */}
                <div className="space-y-1">
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#5B46F6] transition-all duration-500"
                      style={{
                        width: `${Math.round(
                          (item.enrollments / maxEnrollments) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${Math.round(
                          (item.completions / maxEnrollments) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Distribution Breakdown */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#5B46F6]" />
              Student Syllabus Progression
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of active enrolled learners by progress bracket
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {metrics.progressDistribution.map((dist, idx) => {
              const colors = [
                "bg-slate-400",
                "bg-indigo-400",
                "bg-[#5B46F6]",
                "bg-purple-600",
                "bg-emerald-500",
              ];
              const color = colors[idx % colors.length];
              const pct = totalCohort > 0 ? Math.round((dist.learnersCount / totalCohort) * 100) : 0;

              return (
                <div key={dist.range} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {dist.range} Progress
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {dist.learnersCount} students ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 space-y-1 mt-4">
            <div className="font-bold text-slate-800">Retention Insight</div>
            <p className="leading-relaxed text-[11px]">
              Learners progress efficiently with bite-sized video lessons and actionable templates tailored for Bangladeshi entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
