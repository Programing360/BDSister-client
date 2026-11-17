"use client";

import React from "react";
import {
  ShieldAlert,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { VerificationKpiData } from "../types/admin-verification";

interface VerificationKpiCardsProps {
  kpis: VerificationKpiData;
  activeFilter?: string;
  onFilterClick?: (status: string) => void;
}

export function VerificationKpiCards({
  kpis,
  activeFilter,
  onFilterClick,
}: VerificationKpiCardsProps) {
  const cards = [
    {
      label: "Total Submissions",
      value: kpis.totalSubmissions.toLocaleString(),
      statusKey: "ALL",
      subtext: "All time submissions",
      icon: ShieldAlert,
      iconColor: "text-[#5B46F6]",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
      activeBorder: "border-[#5B46F6]",
    },
    {
      label: "Pending Review",
      value: kpis.pendingReview.toLocaleString(),
      statusKey: "PENDING",
      subtext: "Awaiting auditor review",
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      activeBorder: "border-amber-500",
    },
    {
      label: "Under Review",
      value: kpis.underReview.toLocaleString(),
      statusKey: "UNDER_REVIEW",
      subtext: "In active inspection",
      icon: Eye,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      activeBorder: "border-blue-500",
    },
    {
      label: "Verified",
      value: kpis.verified.toLocaleString(),
      statusKey: "VERIFIED",
      subtext: "Approved identity",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      activeBorder: "border-emerald-500",
    },
    {
      label: "Action Required",
      value: kpis.actionRequired.toLocaleString(),
      statusKey: "ACTION_REQUIRED",
      subtext: "Additional info requested",
      icon: HelpCircle,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 dark:bg-purple-950/40",
      activeBorder: "border-purple-500",
    },
    {
      label: "Rejected",
      value: kpis.rejected.toLocaleString(),
      statusKey: "REJECTED",
      subtext: "Unverified or invalid",
      icon: XCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50 dark:bg-rose-950/40",
      activeBorder: "border-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.statusKey;
        const isClickable = !!onFilterClick;

        return (
          <div
            key={card.label}
            onClick={() => onFilterClick && onFilterClick(card.statusKey)}
            className={`p-4 rounded-2xl bg-white dark:bg-gray-900 border transition shadow-2xs ${
              isActive
                ? `${card.activeBorder} ring-2 ring-[#5B46F6]/20 bg-indigo-50/20`
                : "border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            } ${isClickable ? "cursor-pointer" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.iconBg} ${card.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {card.value}
              </span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
