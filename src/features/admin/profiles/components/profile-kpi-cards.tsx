"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  FileEdit,
  ShieldAlert,
  Sparkles,
  Layers,
} from "lucide-react";
import type { ProfileKpiData, ProfileApprovalStatus } from "../types/admin-profile";

interface ProfileKpiCardsProps {
  kpis: ProfileKpiData;
  activeFilter?: "ALL" | ProfileApprovalStatus;
  onFilterSelect?: (status: "ALL" | ProfileApprovalStatus) => void;
}

export function ProfileKpiCards({
  kpis,
  activeFilter,
  onFilterSelect,
}: ProfileKpiCardsProps) {
  const cards = [
    {
      id: "ALL",
      label: "Total Profiles",
      value: kpis.totalProfiles,
      subtext: "Platform directory registrations",
      icon: Users,
      iconColor: "text-[#5B46F6]",
      iconBg: "bg-indigo-50/90 dark:bg-indigo-950/50",
      status: "ALL" as const,
      shadowClass: "shadow-lg shadow-[#5B46F6]/8 hover:shadow-xl hover:shadow-[#5B46F6]/15",
    },
    {
      id: "PUBLISHED",
      label: "Published Live",
      value: kpis.publishedProfiles,
      subtext: "Publicly visible profiles",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50/90 dark:bg-emerald-950/50",
      status: "PUBLISHED" as const,
      shadowClass: "shadow-lg shadow-emerald-500/8 hover:shadow-xl hover:shadow-emerald-500/18",
    },
    {
      id: "PENDING_REVIEW",
      label: "Pending Review",
      value: kpis.pendingApproval,
      subtext: "Awaiting staff decision",
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50/90 dark:bg-amber-950/50",
      status: "PENDING_REVIEW" as const,
      highlight: true,
      shadowClass: "shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/22",
    },
    {
      id: "REJECTED",
      label: "Rejected Profiles",
      value: kpis.rejectedProfiles,
      subtext: "Guidelines non-compliant",
      icon: XCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50/90 dark:bg-rose-950/50",
      status: "REJECTED" as const,
      shadowClass: "shadow-lg shadow-rose-500/8 hover:shadow-xl hover:shadow-rose-500/18",
    },
    {
      id: "DRAFT",
      label: "Draft Profiles",
      value: kpis.draftProfiles,
      subtext: "Incomplete / unsubmitted",
      icon: FileEdit,
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100/90 dark:bg-gray-800/60",
      status: "DRAFT" as const,
      shadowClass: "shadow-lg shadow-gray-400/8 hover:shadow-xl hover:shadow-gray-400/15",
    },
    {
      id: "REPORTED",
      label: "Flagged & Reports",
      value: kpis.reportedProfiles,
      subtext: "Member safety inquiries",
      icon: ShieldAlert,
      iconColor: "text-red-600",
      iconBg: "bg-red-50/90 dark:bg-red-950/50",
      status: "ALL" as const,
      shadowClass: "shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/20",
    },
    {
      id: "FEATURED",
      label: "Featured Spotlight",
      value: kpis.featuredProfiles,
      subtext: "Homepage pinned sisters",
      icon: Sparkles,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50/90 dark:bg-amber-950/50",
      status: "ALL" as const,
      shadowClass: "shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20",
    },
  ];

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="100"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isSelected = activeFilter && activeFilter === card.status;

        return (
          <div
            key={card.label}
            onClick={() => onFilterSelect && onFilterSelect(card.status)}
            className={`relative p-4 rounded-2xl bg-white dark:bg-gray-900 border transition-all duration-300 cursor-pointer ${card.shadowClass} ${
              isSelected
                ? "border-[#5B46F6] ring-2 ring-[#5B46F6]/25 translate-y-[-2px]"
                : "border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:translate-y-[-1px]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-1">
                {card.label}
              </span>
              <div
                className={`w-7 h-7 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 border border-current/15 shadow-xs`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {card.value.toLocaleString()}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
              {card.subtext}
            </p>

            {card.highlight && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
}
