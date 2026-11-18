"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  PieChart,
} from "lucide-react";
import {
  DEMO_PAYMENT_KPIS,
  DEMO_MONTHLY_REVENUE_METRICS,
  DEMO_PAYMENT_DISCLAIMER,
  formatBDT,
} from "../../data/mock-payments";

export function RevenueReportsView() {
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [timeframe]);

  const handleExportReport = () => {
    setFeedbackToast(`Financial reconciliation report for ${timeframe.toUpperCase()} period generated (Demo CSV).`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const totalGross = DEMO_PAYMENT_KPIS.totalCollectedRevenueBDT;
  const totalRefunds = DEMO_PAYMENT_KPIS.refundedAmountBDT;
  const netCalculated = totalGross - totalRefunds;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl shadow-purple-900/40 flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav
        data-aos="fade-down"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/payments" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Payments
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">Revenue Reports</span>
      </nav>

      {/* Header */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 text-emerald-600 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800 shadow-lg shadow-emerald-500/10">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Revenue Reconciliation & Financial Audits
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Multi-period financial breakdown between membership subscriptions and marketplace commissions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
            {(
              [
                { id: "monthly", label: "Monthly" },
                { id: "quarterly", label: "Quarterly" },
                { id: "yearly", label: "Yearly" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === t.id
                    ? "bg-white dark:bg-gray-900 text-[#5B46F6] shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (Demo)</span>
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div
        data-aos="fade-up"
        className="bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 shadow-md shadow-amber-500/5"
      >
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold">Simulated Accounting Ledger: </span>
          {DEMO_PAYMENT_DISCLAIMER}
        </div>
      </div>

      {/* Revenue High-level Metrics */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-2">
          <span className="text-xs font-semibold text-gray-500">Gross Platform Revenue</span>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            {formatBDT(totalGross)}
          </div>
          <p className="text-[11px] text-gray-400">Total BDT collected through ZiniPay</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-indigo-500/5 space-y-2">
          <span className="text-xs font-semibold text-[#5B46F6]">Membership Subscription Share</span>
          <div className="text-2xl font-semibold text-[#5B46F6]">
            {formatBDT(DEMO_PAYMENT_KPIS.membershipRevenueBDT)}
          </div>
          <p className="text-[11px] text-gray-400">Recurring artisan & sister tier dues</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-emerald-500/5 space-y-2">
          <span className="text-xs font-semibold text-emerald-600">Marketplace Sales Volume</span>
          <div className="text-2xl font-semibold text-emerald-600">
            {formatBDT(DEMO_PAYMENT_KPIS.marketplaceRevenueBDT)}
          </div>
          <p className="text-[11px] text-gray-400">Artisan product purchases settled</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-2">
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Net Platform Earnings</span>
          <div className="text-2xl font-semibold text-purple-700 dark:text-purple-400">
            {formatBDT(netCalculated)}
          </div>
          <p className="text-[11px] text-gray-400">Net after {formatBDT(totalRefunds)} refunds settled</p>
        </div>
      </div>

      {/* Multi-month Accounting Table */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="bg-white/95 dark:bg-gray-900/95 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 shadow-xl shadow-purple-500/5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
            Historical Revenue Performance Schedule ({timeframe.toUpperCase()})
          </h3>
          <span className="text-xs text-gray-400">Audit standard: Cash Basis (BDT)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 font-semibold border-b border-gray-100 text-[11px]">
              <tr>
                <th className="py-3 px-4">Accounting Period</th>
                <th className="py-3 px-4">Membership Dues</th>
                <th className="py-3 px-4">Marketplace Volume</th>
                <th className="py-3 px-4">Refund Reversals</th>
                <th className="py-3 px-4">Net Collected BDT</th>
                <th className="py-3 px-4 text-right">Transactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {DEMO_MONTHLY_REVENUE_METRICS.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.month}</td>
                  <td className="py-3 px-4 font-mono">{formatBDT(row.membershipRevenueBDT)}</td>
                  <td className="py-3 px-4 font-mono">{formatBDT(row.marketplaceRevenueBDT)}</td>
                  <td className="py-3 px-4 font-mono text-rose-600">-{formatBDT(row.refundsBDT)}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatBDT(row.netRevenueBDT)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{row.transactionCount} txns</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
