"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import type { ProfileCompletionReport } from "@/features/member/types/dashboard";

interface ProfileCompletionWidgetProps {
  report: ProfileCompletionReport;
}

export function ProfileCompletionWidget({ report }: ProfileCompletionWidgetProps) {
  const { percentage, completedCount, totalCount, steps } = report;
  const isComplete = percentage >= 100;

  return (
    <div className="rounded-3xl bg-white shadow-xl border border-gray-200/80 p-6 sm:p-7 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B46F6] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Profile Completeness
                </h3>
                {isComplete && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    All-Star Profile
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isComplete
                  ? "Your profile is fully completed and primed for sisterhood discovery!"
                  : `${completedCount} of ${totalCount} sections complete. Add missing details to boost trust.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#5B46F6]">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isComplete
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-[#5B46F6] to-[#7366F7]"
            }`}
            style={{ width: `${Math.max(5, percentage)}%` }}
          />
        </div>

        {/* Actionable Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((step) => {
            const isDone = step.completed;
            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isDone
                    ? "bg-gray-50/60 border-gray-200/60"
                    : "bg-white border-purple-200/80 hover:border-[#5B46F6] shadow-sm hover:shadow"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#7366F7] shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isDone ? "text-gray-600 line-through" : "text-gray-900"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                {!isDone && (
                  <Link
                    href={step.href}
                    className="shrink-0 p-1 rounded-lg text-[#5B46F6] hover:bg-purple-50 transition-colors"
                    title={`Complete ${step.label}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
