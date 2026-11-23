"use client";

import React from "react";
import type { BusinessKpiData } from "../types/admin-business.ts";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

interface BusinessKpiCardsProps {
  kpis: BusinessKpiData;
}

export function BusinessKpiCards({ kpis }: BusinessKpiCardsProps) {
  const cards = [
    {
      label: "Total Businesses",
      value: kpis.totalBusinesses,
      change: "+14% this month",
      icon: Building2,
      color: "text-[#5B46F6]",
      bg: "bg-[#EAE6F7]",
    },
    {
      label: "Pending Review",
      value: kpis.pendingApprovals,
      change: "Action required",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      alert: kpis.pendingApprovals > 0,
    },
    {
      label: "Approved & Live",
      value: kpis.approvedBusinesses,
      change: "Active enterprises",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Rejected",
      value: kpis.rejectedBusinesses,
      change: "Ineligible records",
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Suspended",
      value: kpis.suspendedBusinesses,
      change: "Policy breaches",
      icon: AlertOctagon,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Trade Verified",
      value: kpis.verifiedBusinesses,
      change: "Trade license checked",
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Listed Products",
      value: kpis.totalProducts,
      change: "Across active shops",
      icon: ShoppingBag,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      label: "Gross GMV",
      value: `৳${(kpis.totalRevenueBDT / 100000).toFixed(1)}L`,
      change: "Total sister sales",
      icon: TrendingUp,
      color: "text-emerald-700",
      bg: "bg-emerald-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl shadow-sm shadow-gray-400 hover:bg-[#fcf1e6] transition-all duration-200 border-gray-200/80 bg-white hover:shadow-sm hover:border-[#5B46F6]/30 ${card.alert ? "ring-1 ring-amber-300" : ""
              }`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-xs font-medium text-gray-500 truncate" title={card.label}>
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900 tracking-tight">{card.value}</div>
            <p className="text-[11px] text-gray-400 truncate mt-0.5">{card.change}</p>
          </div>
        );
      })}
    </div>
  );
}
