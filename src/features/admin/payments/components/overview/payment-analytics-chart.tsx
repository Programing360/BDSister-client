"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Smartphone,
  CreditCard,
  Building,
  Sparkles,
} from "lucide-react";
import { DEMO_MONTHLY_REVENUE_METRICS, formatBDT } from "../../data/mock-payments";

export function PaymentAnalyticsChart() {
  const [streamFilter, setStreamFilter] = useState<"ALL" | "MEMBERSHIP" | "MARKETPLACE">("ALL");

  const maxRevenue = Math.max(
    ...DEMO_MONTHLY_REVENUE_METRICS.map((m) =>
      streamFilter === "MEMBERSHIP"
        ? m.membershipRevenueBDT
        : streamFilter === "MARKETPLACE"
        ? m.marketplaceRevenueBDT
        : m.membershipRevenueBDT + m.marketplaceRevenueBDT
    ),
    1000
  );

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="150"
      className="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      {/* 1. Monthly Revenue & Transaction Volume Trajectory (2 Columns) */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B46F6] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Monthly Revenue & Settlement Trajectory
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Collected BDT volume across membership subscriptions and artisan commerce
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
            {(
              [
                { id: "ALL", label: "Combined" },
                { id: "MEMBERSHIP", label: "Membership" },
                { id: "MARKETPLACE", label: "Marketplace" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStreamFilter(filter.id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  streamFilter === filter.id
                    ? "bg-white dark:bg-gray-900 text-[#5B46F6] shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 pt-4 px-2">
            {DEMO_MONTHLY_REVENUE_METRICS.map((item) => {
              const activeVal =
                streamFilter === "MEMBERSHIP"
                  ? item.membershipRevenueBDT
                  : streamFilter === "MARKETPLACE"
                  ? item.marketplaceRevenueBDT
                  : item.membershipRevenueBDT + item.marketplaceRevenueBDT;

              const barHeightPercent = Math.round((activeVal / maxRevenue) * 100);

              return (
                <div key={item.month} className="flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-gray-900 text-white px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none shadow-lg">
                    {formatBDT(activeVal)}
                  </div>

                  {/* Dual color stacked bar */}
                  <div className="w-full max-w-[44px] rounded-t-xl bg-gray-100 dark:bg-gray-800 h-full flex flex-col justify-end overflow-hidden p-0.5">
                    {streamFilter === "ALL" ? (
                      <>
                        <div
                          className="w-full bg-gradient-to-t from-purple-500 to-[#5B46F6] rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${(item.membershipRevenueBDT / maxRevenue) * 100}%`,
                          }}
                          title={`Membership: ${formatBDT(item.membershipRevenueBDT)}`}
                        />
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-b-lg transition-all duration-500"
                          style={{
                            height: `${(item.marketplaceRevenueBDT / maxRevenue) * 100}%`,
                          }}
                          title={`Marketplace: ${formatBDT(item.marketplaceRevenueBDT)}`}
                        />
                      </>
                    ) : (
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          streamFilter === "MEMBERSHIP"
                            ? "bg-gradient-to-t from-purple-600 to-[#5B46F6]"
                            : "bg-gradient-to-t from-emerald-600 to-emerald-400"
                        }`}
                        style={{ height: `${barHeightPercent}%` }}
                      />
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    {item.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B46F6]" />
                <span>Membership Fees (37.7%)</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Marketplace Orders (62.3%)</span>
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              Avg Transaction: <strong>৳1,722</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. ZiniPay Channel Distribution & Success Rate (1 Column) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 space-y-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                ZiniPay Payment Channels
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                MFS & banking customer adoption
              </p>
            </div>
          </div>

          <div className="space-y-3.5 mt-4">
            {[
              { label: "bKash MFS Direct", share: 58, count: "1,647 txns", color: "bg-pink-500", text: "text-pink-600" },
              { label: "Nagad MFS Direct", share: 24, count: "682 txns", color: "bg-orange-500", text: "text-orange-600" },
              { label: "Visa / Mastercard Cards", share: 11, count: "312 txns", color: "bg-blue-600", text: "text-blue-600" },
              { label: "Rocket (DBBL)", share: 5, count: "142 txns", color: "bg-purple-600", text: "text-purple-600" },
              { label: "Internet Banking (City / EBL)", share: 2, count: "57 txns", color: "bg-teal-600", text: "text-teal-600" },
            ].map((channel) => (
              <div key={channel.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{channel.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">{channel.count}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{channel.share}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${channel.color}`}
                    style={{ width: `${channel.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-300">
              Gateway Reliability Index
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              99.8% ZiniPay uptime in Q4 2026
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-900 text-xs font-semibold text-emerald-700 border border-emerald-300 dark:border-emerald-700 shadow-xs">
            Optimal
          </span>
        </div>
      </div>
    </div>
  );
}
