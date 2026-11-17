"use client";

import React from "react";
import { Banknote, CreditCard, ArrowUpRight } from "lucide-react";
import { DEMO_REVENUE_TRENDS } from "../../data/admin-mock-data";

export function AdminRevenueChart() {
  const maxRevenue = Math.max(...DEMO_REVENUE_TRENDS.map((d) => d.totalRevenue));

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Banknote className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Gross Marketplace Volume</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Total BDT processed via ZiniPay Gateway
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> +19.6% MoM
          </span>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="mt-6">
        <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2">
          {DEMO_REVENUE_TRENDS.map((item) => {
            const heightPercent = Math.round((item.totalRevenue / maxRevenue) * 100);
            const formattedBDT = `৳${(item.totalRevenue / 1000000).toFixed(2)}M`;

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip value */}
                <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none mb-1">
                  {formattedBDT}
                </div>

                {/* Animated Bar with emerald gradient */}
                <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-xs"
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

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5 text-gray-600">
          <CreditCard className="h-3.5 w-3.5 text-[#5B46F6]" />
          <span>Hosted Invoice Flow: 99.4% settlement success</span>
        </div>
        <span className="italic text-[10px]">Demonstration data</span>
      </div>
    </div>
  );
}
