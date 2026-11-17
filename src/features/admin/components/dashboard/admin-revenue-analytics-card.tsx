"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  ArrowUpRight,
  Info,
} from "lucide-react";
import {
  DEMO_REVENUE_TREND_SERIES,
  DEMO_PAYMENT_BREAKDOWN,
  DEMO_FINANCIAL_SUMMARY,
} from "../../data/admin-analytics-data";

export function AdminRevenueAnalyticsCard() {
  const [trendRange, setTrendRange] = useState<"7d" | "30d" | "90d" | "12m">("30d");
  const [activeMetric, setActiveMetric] = useState<"gross" | "net">("gross");

  const trendData = DEMO_REVENUE_TREND_SERIES[trendRange];

  const maxRevenue = Math.max(
    ...trendData.map((d) => (activeMetric === "gross" ? d.grossRevenue : d.netRevenue)),
    1000
  );

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-6">
      {/* 1. Header with Range Toggle and Integration Link */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
              <Banknote className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              Revenue Trends & Financial Settlement Analytics
            </h3>
          </div>
          <p className="text-xs text-[#4B5563] mt-1">
            Settled marketplace volume, net earnings after refunds, and ZiniPay gateway performance.
          </p>
        </div>

        <div className="flex flex-col gap-2">
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
                onClick={() => setTrendRange(r.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${trendRange === r.id
                  ? "bg-[#5B46F6] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <Link
            href="/admin/integrations/zinipay"
            className="inline-flex items-center gap-1 rounded-xl border border-gray-200/80 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:border-[#5B46F6] hover:text-[#5B46F6] transition shadow-2xs"
          >
            <span>ZiniPay Audit</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 2. Key Financial Indicators Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
          <span className="text-[11px] font-semibold text-emerald-800">Gross GMV</span>
          <p className="mt-1 text-xl font-black text-emerald-700">
            ৳ {DEMO_FINANCIAL_SUMMARY.grossRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">+26.1% vs last period</span>
        </div>

        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3.5">
          <span className="text-[11px] font-semibold text-purple-800">Net Platform GMV</span>
          <p className="mt-1 text-xl font-black text-[#5B46F6]">
            ৳ {DEMO_FINANCIAL_SUMMARY.netRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-purple-700">Gross minus Refunds</span>
        </div>

        <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3.5">
          <span className="text-[11px] font-semibold text-rose-800">Refunded Volume</span>
          <p className="mt-1 text-xl font-black text-rose-700">
            ৳ {DEMO_FINANCIAL_SUMMARY.refundedAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-rose-600">1.7% of gross GMV</span>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
          <span className="text-[11px] font-semibold text-gray-600">Avg Order Value (AOV)</span>
          <p className="mt-1 text-xl font-black text-gray-900">
            ৳ {DEMO_FINANCIAL_SUMMARY.averageOrderValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-gray-400">Across 5,612 orders</span>
        </div>
      </div>

      {/* 3. Metric Switcher & Revenue Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMetric("gross")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${activeMetric === "gross"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "border-gray-200 bg-white text-gray-600"
                }`}
            >
              Gross Revenue
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric("net")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${activeMetric === "net"
                ? "bg-purple-50 border-purple-300 text-[#5B46F6]"
                : "border-gray-200 bg-white text-gray-600"
                }`}
            >
              Net Revenue
            </button>
          </div>

          <span className="text-[11px] text-gray-400 font-medium">
            Values displayed in BDT (৳)
          </span>
        </div>

        {/* Visual Revenue Bars with Tooltip */}
        <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 px-1">
          {trendData.map((d) => {
            const amount = activeMetric === "gross" ? d.grossRevenue : d.netRevenue;
            const heightPct = Math.max(Math.round((amount / maxRevenue) * 100), 8);

            return (
              <div
                key={d.period}
                className="group relative flex-1 flex flex-col items-center h-full justify-end"
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition pointer-events-none absolute -top-10 z-10 rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white shadow-md whitespace-nowrap text-center">
                  <p>{d.period}</p>
                  <p className="text-emerald-400">৳ {amount.toLocaleString()}</p>
                </div>

                {/* Bar */}
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${activeMetric === "gross"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-[#5B46F6] hover:bg-[#7366F7]"
                    }`}
                />

                {/* Label */}
                <span className="mt-2 text-[10px] font-semibold text-gray-400 group-hover:text-gray-900 transition">
                  {d.period}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Payment Gateway Reconciliation Breakdown */}
      <div className="space-y-3 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Payment Reconciliation Breakdown
          </h4>
          <span className="text-xs font-bold text-emerald-700">
            96.1% Overall Settlement Rate
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Successful</span>
            </div>
            <p className="mt-1 text-base font-black text-emerald-900">
              ৳ {DEMO_PAYMENT_BREAKDOWN.successfulAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              {DEMO_PAYMENT_BREAKDOWN.successfulCount} orders ({DEMO_PAYMENT_BREAKDOWN.successfulPercentage}%)
            </p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-3">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
              <Clock className="h-3.5 w-3.5" />
              <span>Pending In Checkout</span>
            </div>
            <p className="mt-1 text-base font-black text-amber-900">
              ৳ {DEMO_PAYMENT_BREAKDOWN.pendingAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
              {DEMO_PAYMENT_BREAKDOWN.pendingCount} sessions ({DEMO_PAYMENT_BREAKDOWN.pendingPercentage}%)
            </p>
          </div>

          <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-3">
            <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
              <XCircle className="h-3.5 w-3.5" />
              <span>Failed / Declined</span>
            </div>
            <p className="mt-1 text-base font-black text-rose-900">
              ৳ {DEMO_PAYMENT_BREAKDOWN.failedAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-rose-700 font-semibold mt-0.5">
              {DEMO_PAYMENT_BREAKDOWN.failedCount} attempts ({DEMO_PAYMENT_BREAKDOWN.failedPercentage}%)
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
            <div className="flex items-center gap-1.5 text-gray-700 text-xs font-bold">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Refunded Amount</span>
            </div>
            <p className="mt-1 text-base font-black text-gray-900">
              ৳ {DEMO_PAYMENT_BREAKDOWN.refundedAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
              {DEMO_PAYMENT_BREAKDOWN.refundedCount} refunds ({DEMO_PAYMENT_BREAKDOWN.refundedPercentage}%)
            </p>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500 border border-gray-200/60">
          <Info className="h-4 w-4 text-[#5B46F6] shrink-0 mt-0.5" />
          <span>
            <strong>Accounting Standard:</strong> Pending and failed payments do not count toward settled gross or net revenue. Refunded volumes are subtracted to determine Net GMV. Real-time settlement occurs via ZiniPay merchant automated reconciliation.
          </span>
        </div>
      </div>
    </div>
  );
}
