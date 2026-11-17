"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import {
  DEMO_MEMBER_GROWTH_SERIES,
  DEMO_MEMBER_DISTRIBUTION,
  DEMO_MEMBER_ACTIVITY_SUMMARY,
} from "../../data/admin-analytics-data";

export function AdminMemberAnalyticsCard() {
  const [chartRange, setChartRange] = useState<"7d" | "30d" | "90d" | "12m">("30d");
  const [activeSeries, setActiveSeries] = useState<"registrations" | "active" | "paid">("registrations");

  const dataPoints = DEMO_MEMBER_GROWTH_SERIES[chartRange];

  // Compute maximum for SVG bar heights
  const maxVal = Math.max(
    ...dataPoints.map((p) => {
      if (activeSeries === "registrations") return p.newRegistrations;
      if (activeSeries === "active") return p.activeMembers;
      return p.paidMembers;
    }),
    1
  );

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-6">
      {/* 1. Header with Range and Metric Controls */}
      <div className=" gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              Member Growth & Community Demographics
            </h3>
          </div>
          {/* Range Selector */}
          <div className="flex items-center rounded-xl border border-gray-200/80 bg-gray-50/80 p-1">
            {(
              [
                { id: "7d", label: "7D" },
                { id: "30d", label: "30D" },
                { id: "90d", label: "90D" },
                { id: "12m", label: "12M" },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setChartRange(r.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${chartRange === r.id
                  ? "bg-[#5B46F6] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#4B5563] mt-1">
          Registration velocity, platform participation, and paid entrepreneur tier upgrades.
        </p>


      </div>

      {/* 2. Series Toggle Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveSeries("registrations")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${activeSeries === "registrations"
            ? "bg-purple-50 border-purple-300 text-[#5B46F6]"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#5B46F6]" />
          <span>New Registrations</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSeries("active")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${activeSeries === "active"
            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Active Members</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSeries("paid")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${activeSeries === "paid"
            ? "bg-amber-50 border-amber-300 text-amber-700"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Paid (Pro) Upgrades</span>
        </button>
      </div>

      {/* 3. Visual SVG/CSS Growth Bar Chart */}
      <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 px-1">
        {dataPoints.map((point) => {
          const val =
            activeSeries === "registrations"
              ? point.newRegistrations
              : activeSeries === "active"
                ? point.activeMembers
                : point.paidMembers;

          const heightPct = Math.max(Math.round((val / maxVal) * 100), 8);

          const barColor =
            activeSeries === "registrations"
              ? "bg-[#5B46F6] hover:bg-[#7366F7]"
              : activeSeries === "active"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-amber-500 hover:bg-amber-600";

          return (
            <div
              key={point.period}
              className="group relative flex-1 flex flex-col items-center h-full justify-end"
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition pointer-events-none absolute -top-9 z-10 rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white shadow-md whitespace-nowrap">
                {point.period}: {val.toLocaleString()}
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPct}%` }}
                className={`w-full rounded-t-md transition-all duration-300 ${barColor}`}
              />

              {/* X-axis label */}
              <span className="mt-2 text-[10px] font-semibold text-gray-400 group-hover:text-gray-900 transition">
                {point.period}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4. Member Distribution Visual Breakdown */}
      <div className="border-t border-gray-100 pt-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Member Tier & Activity Distribution
        </h4>

        {/* Free vs Paid Segmented Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-gray-700">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#5B46F6]" />
              Free Community Members: {DEMO_MEMBER_DISTRIBUTION.freeMembers.toLocaleString()} (
              {DEMO_MEMBER_DISTRIBUTION.freePercentage}%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" />
              Paid Pro Sellers: {DEMO_MEMBER_DISTRIBUTION.paidMembers.toLocaleString()} (
              {DEMO_MEMBER_DISTRIBUTION.paidPercentage}%)
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden flex">
            <div
              style={{ width: `${DEMO_MEMBER_DISTRIBUTION.freePercentage}%` }}
              className="bg-[#5B46F6] h-full"
            />
            <div
              style={{ width: `${DEMO_MEMBER_DISTRIBUTION.paidPercentage}%` }}
              className="bg-amber-500 h-full"
            />
          </div>
        </div>

        {/* Active vs Inactive Segmented Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" />
              Active (30-day engaged): {DEMO_MEMBER_DISTRIBUTION.activeMembers.toLocaleString()} (
              {DEMO_MEMBER_DISTRIBUTION.activePercentage}%)
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="h-2.5 w-2.5 rounded-xs bg-gray-300" />
              Dormant / Inactive: {DEMO_MEMBER_DISTRIBUTION.inactiveMembers.toLocaleString()} (
              {DEMO_MEMBER_DISTRIBUTION.inactivePercentage}%)
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden flex">
            <div
              style={{ width: `${DEMO_MEMBER_DISTRIBUTION.activePercentage}%` }}
              className="bg-emerald-500 h-full"
            />
            <div
              style={{ width: `${DEMO_MEMBER_DISTRIBUTION.inactivePercentage}%` }}
              className="bg-gray-300 h-full"
            />
          </div>
        </div>
      </div>

      {/* 5. Member Activity Summary: 4 Compact Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-gray-100 pt-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
          <p className="text-[11px] font-semibold text-gray-500">New Registrations</p>
          <p className="mt-1 text-lg font-black text-gray-900">
            +{DEMO_MEMBER_ACTIVITY_SUMMARY.newRegistrationsThisPeriod.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Growing weekly</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
          <p className="text-[11px] font-semibold text-gray-500">Avg Profile Completion</p>
          <p className="mt-1 text-lg font-black text-gray-900">
            {DEMO_MEMBER_ACTIVITY_SUMMARY.profileCompletionAverage}%
          </p>
          <p className="text-[10px] text-[#5B46F6] font-bold mt-0.5">High fidelity profiles</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
          <p className="text-[11px] font-semibold text-gray-500">Pending Verifications</p>
          <p className="mt-1 text-lg font-black text-amber-600">
            {DEMO_MEMBER_ACTIVITY_SUMMARY.pendingVerifications}
          </p>
          <p className="text-[10px] text-amber-700 font-bold mt-0.5">Queue awaiting audit</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
          <p className="text-[11px] font-semibold text-gray-500">Monthly Active Sisters</p>
          <p className="mt-1 text-lg font-black text-emerald-600">
            {DEMO_MEMBER_ACTIVITY_SUMMARY.recentlyActiveMembers.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Platform participants</p>
        </div>
      </div>
    </div>
  );
}
