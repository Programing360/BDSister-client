"use client";

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Crown,
  ShieldAlert,
  Briefcase,
  Store,
  Clock,
  Package,
  ShoppingBag,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
} from "lucide-react";
import { AdminKpiMetricItem, AdminKpiCategory } from "../../types/admin-analytics";

interface AdminKpiSectionProps {
  metrics: AdminKpiMetricItem[];
  isLoading?: boolean;
}

export function AdminKpiSection({ metrics, isLoading = false }: AdminKpiSectionProps) {
  const [activeCategory, setActiveCategory] = useState<AdminKpiCategory | "all">("all");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const primaryMetrics = metrics.filter((m) => m.isPrimary);
  const additionalMetrics = metrics.filter((m) => !m.isPrimary);

  const filteredAdditionalMetrics =
    activeCategory === "all"
      ? additionalMetrics
      : additionalMetrics.filter((m) => m.category === activeCategory);

  const renderIcon = (iconName: AdminKpiMetricItem["iconName"], className = "h-5 w-5") => {
    switch (iconName) {
      case "users":
        return <Users className={className} />;
      case "userCheck":
        return <UserCheck className={className} />;
      case "userPlus":
        return <UserPlus className={className} />;
      case "crown":
        return <Crown className={className} />;
      case "shieldAlert":
        return <ShieldAlert className={className} />;
      case "briefcase":
        return <Briefcase className={className} />;
      case "store":
        return <Store className={className} />;
      case "clock":
        return <Clock className={className} />;
      case "package":
        return <Package className={className} />;
      case "shoppingBag":
        return <ShoppingBag className={className} />;
      case "creditCard":
        return <CreditCard className={className} />;
      case "banknote":
        return <Banknote className={className} />;
      case "checkCircle":
        return <CheckCircle className={className} />;
      case "xCircle":
        return <XCircle className={className} />;
      default:
        return <Users className={className} />;
    }
  };

  const getStatusClasses = (statusColor: AdminKpiMetricItem["statusColor"]) => {
    switch (statusColor) {
      case "success":
        return {
          iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
          trendText: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
      case "warning":
        return {
          iconBg: "bg-amber-50 text-amber-600 border-amber-100",
          trendText: "text-amber-800 bg-amber-50 border-amber-200",
        };
      case "danger":
        return {
          iconBg: "bg-rose-50 text-rose-600 border-rose-100",
          trendText: "text-rose-700 bg-rose-50 border-rose-200",
        };
      case "info":
        return {
          iconBg: "bg-sky-50 text-sky-600 border-sky-100",
          trendText: "text-sky-700 bg-sky-50 border-sky-200",
        };
      case "neutral":
        return {
          iconBg: "bg-gray-50 text-gray-600 border-gray-200",
          trendText: "text-gray-700 bg-gray-50 border-gray-200",
        };
      case "primary":
      default:
        return {
          iconBg: "bg-purple-50 text-[#5B46F6] border-purple-100",
          trendText: "text-[#5B46F6] bg-purple-50 border-purple-200",
        };
    }
  };

  const renderTrend = (metric: AdminKpiMetricItem) => {
    if (metric.trend === "neutral") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-gray-600">
          <Minus className="h-3 w-3" />
          <span>0.0%</span>
        </span>
      );
    }

    const isUp = metric.trend === "up";
    const isDesirable =
      metric.id === "failed_payments" || metric.id === "pending_verifications"
        ? !isUp // for backlogs/failures, going down is good!
        : isUp;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold ${isDesirable
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
      >
        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{Math.abs(metric.changePercent)}%</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Primary Overview: 5 Prominent Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500">
            Primary Platform Health
          </h2>
          <span className="text-xs text-gray-400">Core operational indicators</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {primaryMetrics.map((metric) => {
            const styles = getStatusClasses(metric.statusColor);
            return (
              <div
                key={metric.id}
                className="relative flex flex-col justify-between rounded-2xl shadow-lg border-gray-200/80 bg-white p-5 shadow-2xs transition hover:border-[#5B46F6]/30 hover:shadow-md"
              >
                {isLoading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-gray-200" />
                      <div className="h-5 w-14 rounded-md bg-gray-200" />
                    </div>
                    <div className="h-7 w-24 rounded-md bg-gray-200" />
                    <div className="h-3.5 w-32 rounded-md bg-gray-100" />
                  </div>
                ) : (
                  <>
                    <div>
                      {/* Header row: Icon & Trend Pill */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${styles.iconBg} shadow-2xs`}
                        >
                          {renderIcon(metric.iconName, "h-5 w-5")}
                        </div>
                        {renderTrend(metric)}
                      </div>

                      {/* Value Display */}
                      <div className="mt-4">
                        <p className="text-2xl font-black tracking-tight text-[#111827]">
                          {metric.value}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-gray-600 truncate">
                            {metric.label}
                          </p>
                          <button
                            type="button"
                            title={metric.tooltipText}
                            onClick={() =>
                              setActiveTooltip(
                                activeTooltip === metric.id ? null : metric.id
                              )
                            }
                            className="text-gray-400 hover:text-[#5B46F6] transition"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comparison Subtext */}
                    <p className="mt-3 text-[11px] font-medium text-gray-400 border-t border-gray-100 pt-2">
                      {metric.comparisonText}
                    </p>

                    {/* Active Tooltip Popover */}
                    {activeTooltip === metric.id && (
                      <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-xl border border-purple-200 bg-white p-3 text-xs text-gray-700 shadow-xl">
                        <p className="font-bold text-[#111827]">{metric.label}</p>
                        <p className="mt-1 text-gray-500">{metric.tooltipText}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Additional Metrics: 10 Structured Metrics in Organized Category Tabs */}
      <div className="rounded-2xl border-gray-200/80 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Additional Platform Metrics & Dimension Breakdowns
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Granular breakdown across membership tiers, business compliance, and financial transactions.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center rounded-xl border border-gray-200/80 bg-gray-50/80 p-1">
            {(
              [
                { id: "all", label: "All Metrics" },
                { id: "members", label: "Members" },
                { id: "business", label: "Businesses" },
                { id: "ecommerce", label: "E-Commerce" },
                { id: "financial", label: "Financial" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${activeCategory === cat.id
                  ? "bg-[#5B46F6] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Additional Metric Cards Grid */}
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {filteredAdditionalMetrics.map((metric) => {
            const styles = getStatusClasses(metric.statusColor);
            return (
              <div
                key={metric.id}
                className="flex flex-col justify-between rounded-xl border-x-2 shadow-lg bg-gray-50/50 p-4 transition hover:bg-white border-[#5B46F6]/20 hover:border-[#5B46F6]/40 hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-6 w-16 rounded bg-gray-200" />
                    <div className="h-3 w-24 rounded bg-gray-100" />
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 truncate">
                          {metric.label}
                        </span>
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border ${styles.iconBg}`}
                        >
                          {renderIcon(metric.iconName, "h-3.5 w-3.5")}
                        </div>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between gap-1">
                        <p className="text-xl font-black text-gray-900">
                          {metric.value}
                        </p>
                        {renderTrend(metric)}
                      </div>
                    </div>

                    <p className="mt-2 text-[10px] text-gray-400 truncate">
                      {metric.comparisonText}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
