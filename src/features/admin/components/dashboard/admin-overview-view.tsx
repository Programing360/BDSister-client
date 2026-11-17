"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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

function AdminOverviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial timeframe from URL or default to "30d"
  const urlTimeframe = (searchParams.get("timeframe") as AdminTimeframe) || "30d";
  const validTimeframes: AdminTimeframe[] = ["today", "7d", "30d", "90d", "year", "custom"];
  const initialTimeframe = validTimeframes.includes(urlTimeframe) ? urlTimeframe : "30d";

  const [timeframe, setTimeframe] = useState<AdminTimeframe>(initialTimeframe);
  const [customRange, setCustomRange] = useState<CustomDateRange>({
    startDate: "2026-10-01",
    endDate: "2026-11-17",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <div className="space-y-8">
      {/* 1. Welcome & Dashboard Header */}
      <AdminDashboardHeader
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* 2. Platform KPI Summary (15 metrics: 5 primary + 10 in category tabs) */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">Platform Key Performance Indicators</h2>
        <AdminKpiSection metrics={currentMetrics} isLoading={isRefreshing} />
      </section>

      {/* 3. Visual Analytics Grid: Member Growth & Revenue Analytics */}
      <section aria-labelledby="growth-revenue-heading">
        <h2 id="growth-revenue-heading" className="sr-only">Growth and Financial Analytics</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminMemberAnalyticsCard />
          <AdminRevenueAnalyticsCard />
        </div>
      </section>

      {/* 4. Enterprise Ecosystem Grid: Business Analytics & E-Commerce Analytics */}
      <section aria-labelledby="enterprise-heading">
        <h2 id="enterprise-heading" className="sr-only">Business and E-Commerce Ecosystem</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminBusinessAnalyticsCard />
          <AdminEcommerceAnalyticsCard />
        </div>
      </section>

      {/* 5. Commerce Operations & Verification Queues Grid */}
      <section aria-labelledby="orders-approvals-heading">
        <h2 id="orders-approvals-heading" className="sr-only">Recent Orders and Pending Approvals</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AdminRecentOrdersCard />
          </div>
          <div className="lg:col-span-5">
            <AdminPendingApprovalsCard />
          </div>
        </div>
      </section>

      {/* 6. Activity Feed & Quick Actions Grid */}
      <section aria-labelledby="activity-workflows-heading">
        <h2 id="activity-workflows-heading" className="sr-only">Activity Stream and Quick Workflows</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <AdminRecentActivitiesCard />
          </div>
          <div className="lg:col-span-6">
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
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading Admin Overview & Analytics...
        </div>
      }
    >
      <AdminOverviewContent />
    </Suspense>
  );
}
