"use client";

import React from "react";
import {
  Users,
  UserCheck,
  ShieldAlert,
  Briefcase,
  Store,
  Package,
  ShoppingBag,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import type { AdminKpiMetric } from "../../types/admin-dashboard";

interface AdminStatCardProps {
  metric: AdminKpiMetric;
  isLoading?: boolean;
}

const ICON_MAP = {
  users: Users,
  userCheck: UserCheck,
  shieldAlert: ShieldAlert,
  briefcase: Briefcase,
  store: Store,
  package: Package,
  shoppingBag: ShoppingBag,
  banknote: Banknote,
};

export function AdminStatCard({ metric, isLoading = false }: AdminStatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 bg-gray-200 rounded" />
          <div className="h-9 w-9 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-7 w-28 bg-gray-200 rounded" />
        <div className="h-3 w-36 bg-gray-100 rounded" />
      </div>
    );
  }

  const IconComponent = ICON_MAP[metric.iconName] || Users;
  const isPositive = metric.changePercent > 0;
  const isNegative = metric.changePercent < 0;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-[#5B46F6]/30">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-gray-500 truncate">
          {metric.label}
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6] shadow-2xs">
          <IconComponent className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-black tracking-tight text-gray-900">
          {metric.value}
        </span>

        {/* Change indicator pill */}
        <div
          className={`flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] font-bold ${
            isPositive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
              : isNegative
              ? "bg-rose-50 text-rose-700 border border-rose-200/70"
              : "bg-gray-50 text-gray-600 border border-gray-200"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : isNegative ? (
            <ArrowDownRight className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
          <span>{Math.abs(metric.changePercent)}%</span>
        </div>
      </div>

      <p className="mt-2 text-[11px] font-medium text-gray-400 truncate">
        {metric.comparisonText}
      </p>
    </div>
  );
}
