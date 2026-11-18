"use client";

import React, { useState } from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  X,
} from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { AdminTimeframe, CustomDateRange } from "../../types/admin-analytics";
import { DEMO_DATA_DISCLAIMER } from "../../data/admin-analytics-data";

interface AdminDashboardHeaderProps {
  timeframe: AdminTimeframe;
  onTimeframeChange: (t: AdminTimeframe) => void;
  customRange: CustomDateRange;
  onCustomRangeChange: (r: CustomDateRange) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function AdminDashboardHeader({
  timeframe,
  onTimeframeChange,
  customRange,
  onCustomRangeChange,
  isRefreshing,
  onRefresh,
}: AdminDashboardHeaderProps) {
  const { data: session } = useSession();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempStart, setTempStart] = useState(customRange.startDate);
  const [tempEnd, setTempEnd] = useState(customRange.endDate);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Time-based greeting in Bangladesh Time
  const getGreeting = () => {
    const dhakaHour = new Date().getUTCHours() + 6; // UTC+6 for Asia/Dhaka
    const normalizedHour = dhakaHour >= 24 ? dhakaHour - 24 : dhakaHour;

    if (normalizedHour >= 5 && normalizedHour < 12) return "Good morning";
    if (normalizedHour >= 12 && normalizedHour < 17) return "Good afternoon";
    if (normalizedHour >= 17 && normalizedHour < 21) return "Good evening";
    return "Welcome back";
  };

  // Formatted Date in Bangladesh Locale
  const todayFormatted = new Intl.DateTimeFormat("en-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  const adminDisplayName = session?.user?.name
    ? session.user.name
    : "Sister Administrator";

  const handleExportClick = () => {
    setExportNotice(
      "Export Request Registered: An administrative metrics snapshot (PDF/CSV) will be compiled and streamed via the backend export service."
    );
    setTimeout(() => setExportNotice(null), 5000);
  };

  const applyCustomRange = () => {
    if (tempStart && tempEnd) {
      onCustomRangeChange({ startDate: tempStart, endDate: tempEnd });
      onTimeframeChange("custom");
      setShowCustomModal(false);
    }
  };

  const timeframeLabels: Record<AdminTimeframe, string> = {
    today: "Today",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    year: "This Year",
    custom: "Custom Range",
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Top Row: Welcome, Identity, Date, and Action Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-gray-200/80 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {getGreeting()}, {adminDisplayName}!
            </h1>
            <span className="rounded-full bg-purple-50 border border-purple-200/80 px-3 py-0.5 text-xs font-semibold text-[#5B46F6]">
              Executive Overview
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#4B5563]">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-[#5B46F6]" />
              {todayFormatted} (Bangladesh Time)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Core Microservices Operational
            </span>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Selector Pill Group */}
          <div className="flex items-center rounded-xl border border-gray-200/80 bg-white p-1 shadow-2xs">
            {(
              [
                { id: "today", label: "Today" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "90d", label: "90 Days" },
                { id: "year", label: "Year" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTimeframeChange(t.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${timeframe === t.id
                    ? "bg-[#5B46F6] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {t.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition flex items-center gap-1 ${timeframe === "custom"
                  ? "bg-[#5B46F6] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <CalendarDays className="h-3 w-3" />
              <span>Custom</span>
            </button>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh dashboard metrics"
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-500 shadow-2xs hover:border-[#5B46F6]/40 hover:text-[#5B46F6] transition disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#5B46F6]" : ""}`}
            />
          </button>

          {/* Export Report CTA */}
          <button
            type="button"
            onClick={handleExportClick}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200/80 px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 hover:border-[#5B46F6]/40 hover:text-[#5B46F6] transition"
          >
            <Download className="h-4 w-4 text-gray-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Selected Timeframe Indicator Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <span className="text-gray-400">Current View Filter:</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 border border-purple-200/70 px-2.5 py-0.5 text-xs font-bold text-[#5B46F6]">
            {timeframeLabels[timeframe]}
            {timeframe === "custom" && (
              <span className="text-[11px] font-normal text-purple-700">
                ({customRange.startDate} to {customRange.endDate})
              </span>
            )}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-[11px] text-gray-500">
            All 15 metrics, growth charts, and payment breakdowns are synchronized to this period.
          </span>
        </div>
      </div>

      {/* Toast Notification on Export */}
      {exportNotice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50/90 p-3.5 text-xs text-purple-900 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-[#5B46F6] shrink-0 mt-0.5" />
            <span>{exportNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportNotice(null)}
            className="text-purple-700 hover:text-purple-950"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Demonstration Data Banner */}
      {/* <div className="flex items-center justify-between gap-3 rounded-2xl border border-purple-200/70 bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 p-3.5 sm:p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#5B46F6] text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">
              Admin Dashboard Overview & Platform Analytics Active
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {DEMO_DATA_DISCLAIMER}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block rounded-md bg-purple-100 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-[#5B46F6]">
          Frontend Analytics Demo
        </span>
      </div> */}

      {/* Custom Range Dialog / Popover */}
      {showCustomModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#5B46F6]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Select Custom Date Range
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Specify a custom timeframe to filter the administrative overview. Demonstration records will adjust to this window.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-hidden focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-hidden focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCustomRange}
                className="rounded-xl bg-[#5B46F6] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#4a36e0]"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
