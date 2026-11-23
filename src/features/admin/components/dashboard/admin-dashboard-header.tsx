"use client";

import React, { useState, useEffect } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { AdminTimeframe } from "../../types/admin-analytics";

interface AdminDashboardHeaderProps {
  timeframe: AdminTimeframe;
  onTimeframeChange: (t: AdminTimeframe) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function AdminDashboardHeader({
  timeframe,
  onTimeframeChange,
  isRefreshing,
  onRefresh,
}: AdminDashboardHeaderProps) {
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchAdminProfile() {
      try {
        const res = await apiClient.get<{ data?: { fullName?: string }; fullName?: string }>(
          API_ENDPOINTS.auth.me
        );
        if (!isMounted) return;
        const raw = res as unknown as { data?: { fullName?: string }; fullName?: string };
        const nameFromDb = raw.data?.fullName || raw.fullName;
        if (nameFromDb) setAdminName(nameFromDb);
      } catch {
        // Fallback name handled in render
      }
    }

    fetchAdminProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const getGreeting = () => {
    const dhakaHour = (new Date().getUTCHours() + 6) % 24;
    if (dhakaHour >= 5 && dhakaHour < 12) return "Good morning";
    if (dhakaHour >= 12 && dhakaHour < 17) return "Good afternoon";
    if (dhakaHour >= 17 && dhakaHour < 21) return "Good evening";
    return "Welcome back";
  };

  const todayFormatted = new Intl.DateTimeFormat("en-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {getGreeting()}, {adminName || "Administrator"}!
          </h1>
          <span className="rounded-full bg-[#F7DFC7]/70 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
            Admin Console
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-600 font-medium">
          <Calendar className="h-3.5 w-3.5 text-[#5B9891]" />
          <span>{todayFormatted} (Bangladesh Time)</span>
        </div>
      </div>

      {/* Timeframe & Refresh Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center rounded-xl border border-[#5B9891]/20 bg-[#FAF8F5] p-1">
          {(
            [
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
              { id: "year", label: "All / Year" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTimeframeChange(t.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${timeframe === t.id
                ? "bg-[#5B9891] text-white shadow-xs"
                : "text-gray-600 hover:text-[#5B9891]"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          title="Refresh live data"
          disabled={isRefreshing}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#5B9891]/25 bg-white text-[#5B9891] shadow-2xs hover:bg-[#5B9891] hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}