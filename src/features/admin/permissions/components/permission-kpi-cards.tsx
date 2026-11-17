"use client";

import React from "react";
import {
  Layers,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface PermissionKpiCardsProps {
  totalGroups: number;
  totalPermissions: number;
  assignedCount: number;
  criticalCount: number;
}

export function PermissionKpiCards({
  totalGroups,
  totalPermissions,
  assignedCount,
  criticalCount,
}: PermissionKpiCardsProps) {
  const cards = [
    {
      label: "Permission Domains",
      value: totalGroups,
      subtext: "Functional group boundaries",
      icon: Layers,
      iconColor: "text-[#5B46F6]",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      label: "Total Granular Capabilities",
      value: totalPermissions,
      subtext: "Discrete security rights",
      icon: KeyRound,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      label: "Active Assigned Rights",
      value: assignedCount,
      subtext: "Covered by at least 1 role",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "Critical Governance Rights",
      value: criticalCount,
      subtext: "Financial & root operations",
      icon: AlertTriangle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50 dark:bg-rose-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-2xs"
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
