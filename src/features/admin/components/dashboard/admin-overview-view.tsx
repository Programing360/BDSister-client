"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AOS from "aos";
import {
  AdminTimeframe,
  CustomDateRange,
  AdminKpiMetricItem,
} from "../../types/admin-analytics";
import { DEMO_KPIS_BY_TIMEFRAME } from "../../data/admin-analytics-data";
import { AdminDashboardHeader } from "./admin-dashboard-header";
import { AdminKpiSection } from "./admin-kpi-section";
import { AdminMemberAnalyticsCard } from "./admin-member-analytics-card";
import { AdminBusinessAnalyticsCard } from "./admin-business-analytics-card";
import { AdminEcommerceAnalyticsCard } from "./admin-ecommerce-analytics-card";
import { AdminRevenueAnalyticsCard } from "./admin-revenue-analytics-card";
import { AdminRecentActivitiesCard } from "./admin-recent-activities-card";
import { AdminRecentOrdersCard } from "./admin-recent-orders-card";
import { AdminPendingApprovalsCard } from "./admin-pending-approvals-card";
import { AdminQuickActionsCard } from "./admin-quick-actions-card";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Building2,
  Layers,
  ShoppingBag,
  Activity,
  Zap,
} from "lucide-react";

function AdminOverviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial timeframe from URL or default to "30d"
  const urlTimeframe =
    (searchParams.get("timeframe") as AdminTimeframe) || "30d";
  const validTimeframes: AdminTimeframe[] = [
    "today",
    "7d",
    "30d",
    "90d",
    "year",
    "custom",
  ];
  const initialTimeframe = validTimeframes.includes(urlTimeframe)
    ? urlTimeframe
    : "30d";

  const [timeframe, setTimeframe] = useState<AdminTimeframe>(initialTimeframe);
  const [customRange, setCustomRange] = useState<CustomDateRange>({
    startDate: "2026-10-01",
    endDate: "2026-11-17",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize and refresh AOS animations on mount and dynamic state updates
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [timeframe, isRefreshing]);

  // Sync state to URL parameter when timeframe changes
  const handleTimeframeChange = (newTimeframe: AdminTimeframe) => {
    setTimeframe(newTimeframe);
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeframe", newTimeframe);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Get active KPI metrics set for current timeframe
  const currentMetrics: AdminKpiMetricItem[] =
    DEMO_KPIS_BY_TIMEFRAME[timeframe] || DEMO_KPIS_BY_TIMEFRAME["30d"];

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Welcome & Dashboard Header */}
      <div
        data-aos="fade-down"
        data-aos-duration="600"
        className="rounded-3xl border border-gray-200/80 bg-white/95 p-6 sm:p-7 shadow-lg shadow-[#5B46F6]/10 hover:shadow-xl hover:shadow-[#5B46F6]/15 transition-all duration-300 backdrop-blur-xs"
      >
        <AdminDashboardHeader
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </div>

      {/* 2. Platform KPI Summary (15 metrics: 5 primary + 10 in category tabs) */}
      <section aria-labelledby="kpi-heading" className="space-y-3.5">
        <div
          data-aos="fade-right"
          data-aos-delay="100"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1"
        >
          <div className="flex items-center gap-2.5">
            {/* <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 border border-purple-100/80 text-[#5B46F6] shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div> */}
            <div>
              <h2
                id="kpi-heading"
                className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight"
              >
                Platform Vital Metrics & Core KPIs
              </h2>
              <p className="text-xs font-normal text-gray-500">
                Key performance indicators across membership, commerce, and platform security
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EAE6F7]/70 border border-[#5B46F6]/20 text-[#5B46F6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B46F6] animate-pulse" />
            Live System Health
          </span>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="rounded-3xl border border-gray-200/70 bg-white/70 p-4 sm:p-5 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/15 transition-all duration-300 backdrop-blur-xs"
        >
          <AdminKpiSection metrics={currentMetrics} isLoading={isRefreshing} />
        </div>
      </section>

      {/* 3. Visual Analytics Grid: Member Growth & Revenue Analytics */}
      <section aria-labelledby="growth-revenue-heading" className="space-y-3.5">
        <div
          data-aos="fade-right"
          data-aos-delay="200"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 shadow-xs">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="growth-revenue-heading"
                className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight"
              >
                Growth Velocity & Financial Trajectory
              </h2>
              <p className="text-xs font-normal text-gray-500">
                Community cohort expansion paired with verified platform GMV and revenue velocity
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50/70 border border-indigo-200/60 text-indigo-700">
            <TrendingUp className="h-3 w-3" />
            Analytical Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Member Analytics Card: Relevant Indigo/Violet Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="250"
            className="rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/20"
          >
            <AdminMemberAnalyticsCard />
          </div>

          {/* Revenue Analytics Card: Relevant Emerald Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20"
          >
            <AdminRevenueAnalyticsCard />
          </div>
        </div>
      </section>

      {/* 4. Enterprise Ecosystem Grid: Business Analytics & E-Commerce Analytics */}
      <section aria-labelledby="enterprise-heading" className="space-y-3.5">
        <div
          data-aos="fade-right"
          data-aos-delay="300"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/80 text-blue-600 shadow-xs">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="enterprise-heading"
                className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight"
              >
                Business Ecosystem & Marketplace Commerce
              </h2>
              <p className="text-xs font-normal text-gray-500">
                Sister enterprise verification pipeline and artisan marketplace catalog performance
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50/70 border border-blue-200/60 text-blue-700">
            <Layers className="h-3 w-3" />
            Enterprise Hub
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Business Directory Card: Relevant Blue Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="350"
            className="rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20"
          >
            <AdminBusinessAnalyticsCard />
          </div>

          {/* Ecommerce Analytics Card: Relevant Purple Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20"
          >
            <AdminEcommerceAnalyticsCard />
          </div>
        </div>
      </section>

      {/* 5. Commerce Operations & Verification Queues Grid */}
      <section aria-labelledby="orders-approvals-heading" className="space-y-3.5">
        <div
          data-aos="fade-right"
          data-aos-delay="400"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 border border-amber-100/80 text-amber-600 shadow-xs">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="orders-approvals-heading"
                className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight"
              >
                Live Orders & Compliance Backlog
              </h2>
              <p className="text-xs font-normal text-gray-500">
                Recent customer purchase flow alongside administrative verification queues
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50/70 border border-amber-200/60 text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Action Required
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Recent Orders: Relevant Sky Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="450"
            className="lg:col-span-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-sky-500/10 hover:shadow-xl hover:shadow-sky-500/20"
          >
            <AdminRecentOrdersCard />
          </div>

          {/* Pending Approvals: Relevant Amber/Orange Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="500"
            className="lg:col-span-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-amber-500/12 hover:shadow-xl hover:shadow-amber-500/22"
          >
            <AdminPendingApprovalsCard />
          </div>
        </div>
      </section>

      {/* 6. Activity Feed & Quick Actions Grid */}
      <section aria-labelledby="activity-workflows-heading" className="space-y-3.5">
        <div
          data-aos="fade-right"
          data-aos-delay="500"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 border border-purple-100/80 text-[#5B46F6] shadow-xs">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="activity-workflows-heading"
                className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight"
              >
                Audit Activity Log & Administrative Workflows
              </h2>
              <p className="text-xs font-normal text-gray-500">
                Chronological platform event trail paired with rapid staff execution shortcuts
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50/70 border border-purple-200/60 text-[#5B46F6]">
            <Zap className="h-3 w-3" />
            Quick Workflows
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Recent Activities: Relevant Slate/Purple Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="550"
            className="lg:col-span-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-500/10 hover:shadow-xl hover:shadow-slate-500/20"
          >
            <AdminRecentActivitiesCard />
          </div>

          {/* Quick Actions: Signature BDSisters Purple Shadow */}
          <div
            data-aos="fade-up"
            data-aos-delay="600"
            className="lg:col-span-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#5B46F6]/12 hover:shadow-xl hover:shadow-[#5B46F6]/22"
          >
            <AdminQuickActionsCard />
          </div>
        </div>
      </section>
    </div>
  );
}

export function AdminOverviewView() {
  return (
    <Suspense
      fallback={
        <div
          data-aos="fade-in"
          className="flex flex-col items-center justify-center py-24 rounded-3xl border border-gray-200/70 bg-white/80 backdrop-blur-xs shadow-lg shadow-[#5B46F6]/8 space-y-3"
        >
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-[#EAE6F7] text-[#5B46F6] flex items-center justify-center shadow-md animate-bounce">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-ping" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
              Preparing Executive Overview
            </h3>
            <p className="text-xs font-normal text-gray-500 mt-0.5">
              Loading real-time telemetry, KPI metrics, and operational streams...
            </p>
          </div>
        </div>
      }
    >
      <AdminOverviewContent />
    </Suspense>
  );
}
