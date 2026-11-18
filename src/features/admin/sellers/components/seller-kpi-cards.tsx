"use client";

import React from "react";
import type { SellerKpiData } from "../types/admin-seller.ts";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface SellerKpiCardsProps {
  kpis: SellerKpiData;
}

export function SellerKpiCards({ kpis }: SellerKpiCardsProps) {
  const cards = [
    {
      label: "Total Registered Sellers",
      value: kpis.totalSellers,
      change: "All marketplace merchants",
      icon: Users,
      color: "text-[#5B46F6]",
      bg: "bg-[#EAE6F7]",
    },
    {
      label: "Pending Onboarding",
      value: kpis.pendingSellers,
      change: "Awaiting approval",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      alert: kpis.pendingSellers > 0,
    },
    {
      label: "Approved & Active",
      value: kpis.approvedSellers,
      change: "Operational shops",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Suspended",
      value: kpis.suspendedSellers,
      change: "Restricted accounts",
      icon: AlertTriangle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Identity Verified",
      value: kpis.verifiedSellers,
      change: "NID/KYC cleared",
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Marketplace GMV",
      value: `৳${(kpis.totalMarketplaceRevenueBDT / 100000).toFixed(1)}L`,
      change: "Total sister payouts",
      icon: TrendingUp,
      color: "text-emerald-700",
      bg: "bg-emerald-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border border-gray-200/80 bg-white shadow-xs transition-all hover:shadow-sm hover:border-[#5B46F6]/30 ${
              card.alert ? "ring-1 ring-amber-300" : ""
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
