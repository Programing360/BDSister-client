import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, UserCheck } from "lucide-react";
import type { ProfileCompletionReport } from "../../types/dashboard";
import { DashboardCard } from "../shared/dashboard-card";

interface ProfileCompletionCardProps {
  report: ProfileCompletionReport;
}

export function ProfileCompletionCard({ report }: ProfileCompletionCardProps) {
  return (
    <DashboardCard
      title="Profile Completion"
      subtitle={`${report.completedCount} of ${report.totalCount} milestones completed`}
      icon={<UserCheck className="h-5 w-5" />}
      headerAction={
        <Link
          href="/member/profile/edit"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5B46F6] hover:underline"
        >
          <span>Update Profile</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="space-y-4">
        {/* Progress Bar & Percentage */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
            <span>Overall Readiness</span>
            <span className="text-[#5B46F6] text-sm">{report.percentage}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5B46F6] to-[#7366F7] transition-all duration-500"
              style={{ width: `${report.percentage}%` }}
            />
          </div>
        </div>

        {/* Steps Checklist */}
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/60 p-2">
          {report.steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between p-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-gray-300" />
                )}
                <div>
                  <p className={`font-bold ${step.completed ? "text-gray-900" : "text-gray-600"}`}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>

              {!step.completed && (
                <Link
                  href={step.href}
                  className="shrink-0 font-bold text-[#5B46F6] hover:underline text-[11px]"
                >
                  Action
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
