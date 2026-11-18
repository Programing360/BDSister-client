"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  CreditCard,
  ShieldCheck,
  RotateCcw,
  FileText,
  TrendingUp,
  ChevronRight,
  Info,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { PaymentKpiCards } from "./payment-kpi-cards";
import { PaymentAnalyticsChart } from "./payment-analytics-chart";
import { RecentTransactionsCard } from "./recent-transactions-card";
import { RecentRefundsCard } from "./recent-refunds-card";
import {
  DEMO_PAYMENT_KPIS,
  DEMO_PAYMENT_DISCLAIMER,
} from "../../data/mock-payments";

export function PaymentsOverviewView() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [isRefreshing]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage("Payment cache refreshed with latest simulation metrics.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl shadow-purple-900/40 flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
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
        <span className="font-semibold text-gray-900 dark:text-white">Payments & Billing</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#5B46F6]">Overview</span>
      </nav>

      {/* Header Banner */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 text-[#5B46F6] dark:text-indigo-300 flex items-center justify-center border border-indigo-100/80 dark:border-indigo-900 shadow-lg shadow-[#5B46F6]/10">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Payment & Financial Overview
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Centralized gateway reconciliation, settlement metrics, and revenue analytics for BDSisters.org
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/payments/gateway"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 rounded-xl transition-all border border-indigo-200 dark:border-indigo-800 shadow-md shadow-indigo-500/10 hover:shadow-lg"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ZiniPay Gateway</span>
          </Link>

          <Link
            href="/admin/payments/transactions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-md shadow-gray-200/50 dark:shadow-none hover:shadow-lg"
          >
            <span>All Transactions</span>
          </Link>

          <Link
            href="/admin/payments/refunds"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 rounded-xl transition-all border border-purple-200 dark:border-purple-800 shadow-md shadow-purple-500/10 hover:shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refunds</span>
          </Link>

          <Link
            href="/admin/payments/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800 shadow-md shadow-emerald-500/10 hover:shadow-lg"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Revenue Reports</span>
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-md shadow-gray-200/50 dark:shadow-none cursor-pointer"
            title="Refresh payment metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#5B46F6]" : ""}`} />
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
          <span className="font-semibold">Simulated Financial Infrastructure: </span>
          {DEMO_PAYMENT_DISCLAIMER}
        </div>
      </div>

      {/* KPI Cards */}
      <PaymentKpiCards kpis={DEMO_PAYMENT_KPIS} />

      {/* Analytics Charts */}
      <PaymentAnalyticsChart />

      {/* Recent Streams (Transactions + Refunds) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentTransactionsCard />
        </div>
        <div>
          <RecentRefundsCard />
        </div>
      </div>
    </div>
  );
}
