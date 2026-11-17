"use client";

import React, { useState } from "react";
import { Users, TrendingUp } from "lucide-react";
import { DEMO_MEMBER_GROWTH } from "../../data/admin-mock-data";

export function AdminMemberGrowthChart() {
  const [metricKey, setMetricKey] = useState<"registeredMembers" | "activeMembers" | "businesses">(
    "registeredMembers"
  );

  const maxVal = Math.max(...DEMO_MEMBER_GROWTH.map((d) => d[metricKey]));

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md">
      {/* Chart Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-[#5B46F6]">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Platform Community Growth</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            6-month trajectory of registered sister members & artisans
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMetricKey("registeredMembers")}
            className={`rounded-lg px-2.5 py-1 transition ${
              metricKey === "registeredMembers"
                ? "bg-white text-[#5B46F6] shadow-xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Members
          </button>
          <button
            type="button"
            onClick={() => setMetricKey("activeMembers")}
            className={`rounded-lg px-2.5 py-1 transition ${
              metricKey === "activeMembers"
                ? "bg-white text-[#5B46F6] shadow-xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setMetricKey("businesses")}
            className={`rounded-lg px-2.5 py-1 transition ${
              metricKey === "businesses"
                ? "bg-white text-[#5B46F6] shadow-xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Shops
          </button>
        </div>
      </div>

      {/* Visual Chart Graph (CSS & SVG bars) */}
      <div className="mt-6">
        <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2">
          {DEMO_MEMBER_GROWTH.map((item) => {
            const currentVal = item[metricKey];
            const heightPercent = Math.round((currentVal / maxVal) * 100);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip value */}
                <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none mb-1">
                  {currentVal.toLocaleString()}
                </div>

                {/* Animated Bar with gradient fill */}
                <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#5B46F6] to-[#7366F7] rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-xs"
                  />
                </div>

                {/* X-axis label */}
                <span className="text-[11px] font-bold text-gray-500 mt-1">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-semibold text-gray-700">+12.8% sustained growth rate</span>
        </div>
        <span className="italic text-[10px]">Demonstration data</span>
      </div>
    </div>
  );
}
