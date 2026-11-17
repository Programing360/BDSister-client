import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { DashboardCard } from "../shared/dashboard-card";
import { EmptyState } from "../shared/empty-state";

export function RecommendedLearningPreview() {
  return (
    <DashboardCard
      title="Learning & Masterclasses"
      subtitle="Courses tailored for entrepreneurship and professional leadership"
      icon={<GraduationCap className="h-5 w-5" />}
      headerAction={
        <Link
          href="/member/courses"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5B46F6] hover:underline"
        >
          <span>Course Hub</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <EmptyState
        icon={<GraduationCap className="h-6 w-6 text-gray-400" />}
        title="No active course enrollments"
        description="Expand your digital skills, master business accounting, or learn export readiness with certified mentors."
        actionHref="/member/courses"
        actionLabel="Browse Available Courses"
      />
    </DashboardCard>
  );
}
