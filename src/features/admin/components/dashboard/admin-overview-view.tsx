"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Users,
  Clock,
  Store,
  ShoppingBag,
  Banknote,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Activity,
  Sparkles,
  AlertCircle,
  KeyRound,
  ClipboardList,
  Building2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { AdminTimeframe } from "../../types/admin-analytics";
import { AdminDashboardHeader } from "./admin-dashboard-header";

interface DashboardAnalyticsData {
  kpis: {
    totalMembers: number;
    newMembersInPeriod: number;
    paidMembers: number;
    freeMembers: number;
    pendingApprovals: number;
    totalBusinesses: number;
    activePaidBusinesses: number;
    totalOrders: number;
    totalOrderSales: number;
    totalRevenue: number;
    platformCommissionEarned: number;
  };
  ordersByStatus: Record<string, number>;
  growthSeries: Array<{ period: string; registrations: number }>;
  queues: {
    pendingUsers: Array<{
      _id: string;
      fullName: string;
      email: string;
      status: string;
      createdAt: string;
    }>;
    recentOrders: Array<{
      _id: string;
      orderNumber?: string;
      totalAmount: number;
      orderStatus: string;
      paymentStatus: string;
      buyerId?: { fullName?: string; email?: string };
      createdAt: string;
    }>;
    recentActivities: Array<{
      _id: string;
      action: string;
      targetModel: string;
      adminId?: { fullName?: string; role?: string };
      createdAt: string;
    }>;
  };
}

function AdminOverviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlTimeframe = (searchParams.get("timeframe") as AdminTimeframe) || "30d";
  const [timeframe, setTimeframe] = useState<AdminTimeframe>(urlTimeframe);
  const [data, setData] = useState<DashboardAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: DashboardAnalyticsData }>(
        `${API_ENDPOINTS.admin.analytics}?timeframe=${timeframe}`
      );
      const payload = (res as unknown as { data: DashboardAnalyticsData }).data;
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard analytics.");
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleTimeframeChange = (newTimeframe: AdminTimeframe) => {
    setTimeframe(newTimeframe);
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeframe", newTimeframe);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuickApproval = async (userId: string, status: "Active" | "Rejected") => {
    setActionLoadingId(userId);
    try {
      await apiClient.patch(API_ENDPOINTS.admin.updateUserStatus(userId), { status });
      await fetchAnalytics();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const kpis = data?.kpis;
  const maxRegistrations = Math.max(
    ...(data?.growthSeries.map((g) => g.registrations) || [1]),
    1
  );

  const freePct =
    kpis && kpis.totalMembers > 0
      ? Math.round((kpis.freeMembers / kpis.totalMembers) * 100)
      : 100;
  const paidPct = 100 - freePct;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Top Header with Paper Heart Warm Gradient */}
      <div className="rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
        <AdminDashboardHeader
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          isRefreshing={isLoading}
          onRefresh={fetchAnalytics}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <p>{error}</p>
        </div>
      )}

      {/* 2. Row 1: 5 Core KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Total Members",
            value: isLoading ? "..." : (kpis?.totalMembers ?? 0).toLocaleString(),
            sub: `+${kpis?.newMembersInPeriod ?? 0} in selected period`,
            icon: <Users className="h-5 w-5 text-[#5B9891]" />,
            bg: "bg-[#5B9891]/12 border-[#5B9891]/25",
          },
          {
            label: "Pending Approvals",
            value: isLoading ? "..." : (kpis?.pendingApprovals ?? 0).toLocaleString(),
            sub: "Awaiting ID verification",
            icon: <Clock className="h-5 w-5 text-[#D98408]" />,
            bg: "bg-[#F2B55D]/20 border-[#F2B55D]/40",
          },
          {
            label: "Paid Businesses",
            value: isLoading
              ? "..."
              : `${kpis?.activePaidBusinesses ?? 0} / ${kpis?.totalBusinesses ?? 0}`,
            sub: "Active subscribed brands",
            icon: <Store className="h-5 w-5 text-[#5B9891]" />,
            bg: "bg-[#F7DFC7]/65 border-[#D98408]/25",
          },
          {
            label: "Total Orders",
            value: isLoading ? "..." : (kpis?.totalOrders ?? 0).toLocaleString(),
            sub: `৳${(kpis?.totalOrderSales ?? 0).toLocaleString()} GMV`,
            icon: <ShoppingBag className="h-5 w-5 text-[#D98408]" />,
            bg: "bg-[#F7DFC7]/50 border-[#F2B55D]/40",
          },
          {
            label: "Platform Revenue",
            value: isLoading ? "..." : `৳${(kpis?.totalRevenue ?? 0).toLocaleString()}`,
            sub: `৳${(kpis?.platformCommissionEarned ?? 0).toLocaleString()} commission`,
            icon: <Banknote className="h-5 w-5 text-[#5B9891]" />,
            bg: "bg-[#5B9891]/15 border-[#5B9891]/30",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex flex-col justify-between rounded-2xl border-gray-200/80 bg-white p-5 shadow-md shadow-gray-400 transition hover:border-[#5B9891]/50 hover:shadow-lg hover:bg-[#fcf1e7]"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${card.bg}`}
              >
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black tracking-tight text-gray-900">{card.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-600">{card.label}</p>
            </div>
            <p className="mt-3 border-t border-gray-100 pt-2 text-[11px] font-medium text-gray-500">
              {card.sub}
            </p>
          </div>
        ))}
      </section>

      {/* 3. Row 2: Growth Chart & Tier Distribution */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Monthly Registrations Bar Chart (Loch Blue) */}
        <div className="lg:col-span-7 rounded-2xl shadow-sm hover:bg-[#fcf1e7] transition-all duration-200 shadow-gray-400  border-gray-200/80 bg-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Member Registration Trend</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Monthly cohort sign-ups across the platform
            </p>
          </div>

          {data?.growthSeries && data.growthSeries.length > 0 ? (
            <div className="h-44 w-full flex items-end gap-3 pt-8 pb-2">
              {data.growthSeries.map((point) => {
                const heightPct = Math.max(
                  Math.round((point.registrations / maxRegistrations) * 100),
                  10
                );
                return (
                  <div
                    key={point.period}
                    className="group relative flex-1 flex flex-col items-center h-full justify-end"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition pointer-events-none absolute -top-8 rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white whitespace-nowrap">
                      {point.registrations} members
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[44px] rounded-t-lg bg-[#5B9891] hover:bg-[#467A74] transition-all"
                    />
                    <span className="mt-2 text-[11px] font-semibold text-gray-500">
                      {point.period}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-gray-400">
              No historical registration data available yet.
            </div>
          )}
        </div>

        {/* Tier & Business Subscription Breakdown (Loch Blue vs Bright Gold) */}
        <div className="lg:col-span-5 rounded-2xl shadow-sm hover:bg-[#fcf1e7] transition-all duration-200 shadow-gray-400  bg-white p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">Membership & Order Health</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Distribution of free vs paid entrepreneur tiers
            </p>
          </div>

          <div className="space-y-5">
            {/* Free vs Paid Members */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#467A74]">
                  Free Members: {kpis?.freeMembers ?? 0} ({freePct}%)
                </span>
                <span className="text-[#D98408]">
                  Paid Members: {kpis?.paidMembers ?? 0} ({paidPct}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#F7DFC7]/50 overflow-hidden flex">
                <div style={{ width: `${freePct}%` }} className="bg-[#5B9891] h-full" />
                <div style={{ width: `${paidPct}%` }} className="bg-[#D98408] h-full" />
              </div>
            </div>

            {/* Order Status Summary */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Orders Breakdown
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(data?.ordersByStatus || {}).length > 0 ? (
                  Object.entries(data?.ordersByStatus || {}).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between rounded-xl border border-[#F7DFC7] bg-[#FAF8F5] px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-gray-600">{status}</span>
                      <span className="font-bold text-gray-900">{count}</span>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-xs text-gray-400">
                    No orders placed in this period.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Row 3: Pending Approvals Queue & Recent Orders */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Pending Member Approvals */}
        <div className="lg:col-span-6 rounded-2xl shadow-sm hover:bg-[#fcf1e7] transition-all duration-200 shadow-gray-400  bg-white p-6 ">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#D98408]" />
              <h3 className="text-base font-bold text-gray-900">Pending Member Approvals</h3>
            </div>
            <Link
              href="/admin/members"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5B9891] hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {data?.queues.pendingUsers && data.queues.pendingUsers.length > 0 ? (
              data.queues.pendingUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/members/${user._id}`}
                      className="truncate text-sm font-bold text-gray-900 hover:text-[#5B9891]"
                    >
                      {user.fullName}
                    </Link>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={actionLoadingId === user._id}
                      onClick={() => handleQuickApproval(user._id, "Active")}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#5B9891]/12 border border-[#5B9891]/30 px-2.5 py-1.5 text-xs font-bold text-[#467A74] hover:bg-[#5B9891] hover:text-white transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoadingId === user._id}
                      onClick={() => handleQuickApproval(user._id, "Rejected")}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-xs text-gray-400">
                All caught up! No pending member approvals.
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-6 rounded-2xl shadow-sm hover:bg-[#fcf1e7] transition-all duration-200 shadow-gray-400  bg-white p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#5B9891]" />
              <h3 className="text-base font-bold text-gray-900">Recent Marketplace Orders</h3>
            </div>
            <Link
              href="/admin/shop/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5B9891] hover:underline"
            >
              <span>All Orders</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {data?.queues.recentOrders && data.queues.recentOrders.length > 0 ? (
              data.queues.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {order.buyerId?.fullName || "Customer"} • {order.orderStatus}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-gray-900">
                      ৳{order.totalAmount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${order.paymentStatus === "Paid"
                        ? "bg-[#5B9891]/15 text-[#467A74]"
                        : "bg-[#F2B55D]/25 text-[#D98408]"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-xs text-gray-400">
                No recent orders recorded yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Row 4: Audit Logs & Quick Workflows */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Audit Logs */}
        <div className="lg:col-span-7 rounded-2xl shadow-sm hover:bg-[#fcf1e7] transition-all duration-200 shadow-gray-400  bg-white p-6 ">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#5B9891]" />
              <h3 className="text-base font-bold text-gray-900">Recent Admin Activity Log</h3>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {data?.queues.recentActivities && data.queues.recentActivities.length > 0 ? (
              data.queues.recentActivities.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between rounded-xl border border-[#F7DFC7] bg-[#FAF8F5] px-3.5 py-2.5 text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-900">
                      {log.adminId?.fullName || "Admin"}
                    </span>{" "}
                    <span className="text-gray-600">
                      performed <strong className="text-[#5B9891]">{log.action}</strong> on{" "}
                      {log.targetModel}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-gray-400">
                No administrative actions logged yet.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5 rounded-2xl shadow-sm hover:bg-[#fcf1e7] transition-all duration-200 shadow-gray-400  bg-white p-6 ">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">
            Quick Administrative Actions
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <Link
              href="/admin/members"
              className="flex items-center justify-between rounded-xl border border-gray-200/80 p-3.5 transition hover:border-[#5B9891] hover:bg-[#F7DFC7]/25"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#5B9891]" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Verify Member Identities</p>
                  <p className="text-[11px] text-gray-500">Review NID & Passport submissions</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/businesses"
              className="flex items-center justify-between rounded-xl border border-gray-200/80 p-3.5 transition hover:border-[#5B9891] hover:bg-[#F7DFC7]/25"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[#D98408]" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Manage Business Subscriptions</p>
                  <p className="text-[11px] text-gray-500">Approve brands & subscription status</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/tasks"
              className="flex items-center justify-between rounded-xl border border-gray-200/80 p-3.5 transition hover:border-[#5B9891] hover:bg-[#F7DFC7]/25"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-[#5B9891]" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Assign Admin Tasks</p>
                  <p className="text-[11px] text-gray-500">Delegate moderation & review tasks</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/integrations"
              className="flex items-center justify-between rounded-xl border border-gray-200/80 p-3.5 transition hover:border-[#5B9891] hover:bg-[#F7DFC7]/25"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-[#D98408]" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Wing API Integrations</p>
                  <p className="text-[11px] text-gray-500">
                    Generate keys for CoP, TSPP, IMBD & Wings
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </Link>
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
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-[#5B9891]/20 bg-white space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-[#F7DFC7] text-[#5B9891] flex items-center justify-center animate-bounce">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Loading Executive Overview...</p>
        </div>
      }
    >
      <AdminOverviewContent />
    </Suspense>
  );
}