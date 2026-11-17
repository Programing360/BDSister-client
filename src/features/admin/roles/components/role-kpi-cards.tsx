"use client";

import React from "react";
import {
  KeyRound,
  Lock,
  Sparkles,
  Layers,
  Users,
} from "lucide-react";
import { RoleKpiData, RoleType } from "../types/admin-role";

interface RoleKpiCardsProps {
  kpis: RoleKpiData;
  activeFilter?: "ALL" | RoleType;
  onFilterClick?: (type: "ALL" | RoleType) => void;
}

export function RoleKpiCards({
  kpis,
  activeFilter = "ALL",
  onFilterClick,
}: RoleKpiCardsProps) {
  const cards = [
    {
      label: "Total Roles",
      value: kpis.totalRoles,
      typeFilter: "ALL" as const,
      subtext: "System & custom roles",
      icon: KeyRound,
      iconColor: "text-[#5B46F6]",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
      activeBorder: "border-[#5B46F6]",
    },
    {
      label: "Built-in System Roles",
      value: kpis.builtInRoles,
      typeFilter: "BUILT_IN" as const,
      subtext: "Protected root profiles",
      icon: Lock,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 dark:bg-purple-950/40",
      activeBorder: "border-purple-500",
    },
    {
      label: "Custom Created Roles",
      value: kpis.customRoles,
      typeFilter: "CUSTOM" as const,
      subtext: "Configured by staff",
      icon: Sparkles,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
      activeBorder: "border-indigo-500",
    },
    {
      label: "Permission Domains",
      value: kpis.availablePermissionGroups,
      typeFilter: undefined,
      subtext: "72 granular capabilities",
      icon: Layers,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      activeBorder: "border-emerald-500",
    },
    {
      label: "Active Staff Assignments",
      value: kpis.activeRoleAssignments,
      typeFilter: undefined,
      subtext: "Elevated accounts (demo)",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      activeBorder: "border-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = !!card.typeFilter && !!onFilterClick;
        const isActive = isClickable && activeFilter === card.typeFilter;

        return (
          <div
            key={card.label}
            onClick={() => {
              if (isClickable && onFilterClick && card.typeFilter) {
                onFilterClick(card.typeFilter);
              }
            }}
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
