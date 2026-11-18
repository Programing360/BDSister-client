"use client";

import React from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  PauseCircle,
} from "lucide-react";
import type { SubscriptionOverviewKpis, SubscriptionStatus } from "../../types/membership";

interface SubscriptionKpiCardsProps {
  kpis: SubscriptionOverviewKpis;
  activeStatusFilter: "ALL" | SubscriptionStatus;
  onSelectStatus: (status: "ALL" | SubscriptionStatus) => void;
}

export function SubscriptionKpiCards({
  kpis,
  activeStatusFilter,
  onSelectStatus,
}: SubscriptionKpiCardsProps) {
  const cards = [
    {
      id: "ALL",
      label: "Total Subscriptions",
      value: kpis.totalSubscriptions.toLocaleString(),
      subtext: "Lifetime community registrations",
      icon: Users,
      iconColor: "text-[#5B46F6]",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
      status: "ALL" as const,
      shadow: "shadow-lg shadow-[#5B46F6]/10 hover:shadow-xl hover:shadow-[#5B46F6]/20",
    },
    {
      id: "ACTIVE",
      label: "Active Paid Subscriptions",
      value: kpis.activeSubscriptions.toLocaleString(),
      subtext: "Active marketplace shop access",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
      status: "ACTIVE" as const,
      shadow: "shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20",
    },
    {
      id: "EXPIRING_SOON",
      label: "Expiring Soon (30 Days)",
      value: kpis.expiringSoon.toLocaleString(),
      subtext: "Manual renewal reminders dispatched",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      status: "EXPIRING_SOON" as const,
      highlight: true,
      shadow: "shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20",
    },
    {
      id: "PENDING",
      label: "Pending Clearance",
      value: kpis.pendingSubscriptions.toLocaleString(),
      subtext: "Awaiting bank/ZiniPay clearing",
      icon: Clock,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-950/50",
      status: "PENDING" as const,
      shadow: "shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20",
    },
    {
      id: "EXPIRED",
      label: "Expired Subscriptions",
      value: kpis.expiredSubscriptions.toLocaleString(),
      subtext: "Shop listings paused pending renewal",
      icon: XCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50 dark:bg-rose-950/50",
      status: "EXPIRED" as const,
      shadow: "shadow-lg shadow-rose-500/8 hover:shadow-xl hover:shadow-rose-500/18",
    },
    {
      id: "CANCELLED",
      label: "Cancelled / Suspended",
      value: kpis.cancelledSubscriptions.toLocaleString(),
      subtext: "Member request or inactive",
      icon: PauseCircle,
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100 dark:bg-gray-800",
      status: "CANCELLED" as const,
      shadow: "shadow-lg shadow-gray-400/8 hover:shadow-xl hover:shadow-gray-400/15",
    },
  ];

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="100"
      className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatusFilter === card.status;

        return (
          <div
            key={card.id}
            onClick={() => onSelectStatus(card.status)}
            className={`p-4 rounded-3xl bg-white dark:bg-gray-900 border transition-all duration-300 cursor-pointer ${card.shadow} ${
              isSelected
                ? "border-[#5B46F6] ring-2 ring-[#5B46F6]/25 translate-y-[-2px]"
                : "border-gray-200/80 dark:border-gray-800 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-1">
                {card.label}
              </span>
              <div
                className={`w-7 h-7 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 border border-current/15`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5">
              <span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
