"use client";

import React from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  TrendingUp,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import type { PaymentOverviewKpis } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";

interface PaymentKpiCardsProps {
  kpis: PaymentOverviewKpis;
}

export function PaymentKpiCards({ kpis }: PaymentKpiCardsProps) {
  const cards = [
    {
      id: "total_revenue",
      label: "Total Collected Revenue",
      value: formatBDT(kpis.totalCollectedRevenueBDT),
      subtext: `Membership ${formatBDT(kpis.membershipRevenueBDT)} • Store ${formatBDT(kpis.marketplaceRevenueBDT)}`,
      icon: TrendingUp,
      iconColor: "text-[#5B46F6]",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
      shadow: "shadow-lg shadow-[#5B46F6]/10 hover:shadow-xl hover:shadow-[#5B46F6]/18",
    },
    {
      id: "successful_payments",
      label: "Successful Payments",
      value: kpis.successfulPayments.toLocaleString(),
      subtext: `${((kpis.successfulPayments / kpis.totalPayments) * 100).toFixed(1)}% settlement conversion rate`,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
      shadow: "shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20",
    },
    {
      id: "total_payments",
      label: "Total Payment Volume",
      value: kpis.totalPayments.toLocaleString(),
      subtext: "Across ZiniPay MFS & card channels",
      icon: CreditCard,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 dark:bg-purple-950/50",
      shadow: "shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/18",
    },
    {
      id: "pending_payments",
      label: "Pending Verification",
      value: kpis.pendingPayments.toLocaleString(),
      subtext: "Awaiting bank/wallet confirmation",
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      shadow: "shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20",
    },
    {
      id: "failed_payments",
      label: "Failed Payment Attempts",
      value: kpis.failedPayments.toLocaleString(),
      subtext: "Wallet timeout or customer cancellation",
      icon: XCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50 dark:bg-rose-950/50",
      shadow: "shadow-lg shadow-rose-500/8 hover:shadow-xl hover:shadow-rose-500/18",
    },
    {
      id: "refunded_amount",
      label: "Refunded Amount",
      value: formatBDT(kpis.refundedAmountBDT),
      subtext: "Customer & artisan returns processed",
      icon: RotateCcw,
      iconColor: "text-purple-700",
      iconBg: "bg-purple-50 dark:bg-purple-950/50",
      shadow: "shadow-lg shadow-purple-500/8 hover:shadow-xl hover:shadow-purple-500/15",
    },
  ];

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="100"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 transition-all duration-300 hover:translate-y-[-2px] ${card.shadow}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-1">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 border border-current/15 shadow-xs`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
