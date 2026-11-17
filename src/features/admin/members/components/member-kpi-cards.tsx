import React from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Crown,
  UserX,
  ShieldAlert,
} from "lucide-react";
import { MemberKpiData } from "../types/admin-member";

interface MemberKpiCardsProps {
  kpis: MemberKpiData;
  isLoading?: boolean;
}

export function MemberKpiCards({ kpis, isLoading = false }: MemberKpiCardsProps) {
  const cards = [
    {
      id: "total",
      label: "Total Members",
      value: kpis.totalMembers.toLocaleString(),
      subtext: "All registered sisters",
      icon: Users,
      color: "bg-purple-50 text-[#5B46F6] border-purple-100",
    },
    {
      id: "active",
      label: "Active Members",
      value: kpis.activeMembers.toLocaleString(),
      subtext: "Active in last 30 days",
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      id: "free",
      label: "Free Members",
      value: kpis.freeMembers.toLocaleString(),
      subtext: "Community tier base",
      icon: UserPlus,
      color: "bg-gray-50 text-gray-700 border-gray-200",
    },
    {
      id: "paid",
      label: "Paid Members (Pro)",
      value: kpis.paidMembers.toLocaleString(),
      subtext: "Verified entrepreneurs",
      icon: Crown,
      color: "bg-purple-50 text-[#5B46F6] border-purple-200",
    },
    {
      id: "suspended",
      label: "Suspended / Banned",
      value: kpis.suspendedMembers.toLocaleString(),
      subtext: "Policy or audit hold",
      icon: UserX,
      color: "bg-rose-50 text-rose-700 border-rose-100",
    },
    {
      id: "verifications",
      label: "Pending Verifications",
      value: kpis.pendingVerifications.toLocaleString(),
      subtext: "NID/Passport queue",
      icon: ShieldAlert,
      color: "bg-amber-50 text-amber-800 border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs transition hover:border-[#5B46F6]/30"
          >
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 truncate">
                    {c.label}
                  </span>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border ${c.color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-xl font-black text-gray-900">{c.value}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400 truncate">
                    {c.subtext}
                  </p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
