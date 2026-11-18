"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  Users,
  Search,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { SubscriptionKpiCards } from "./subscription-kpi-cards";
import { SubscriptionTable } from "./subscription-table";
import {
  DEMO_MEMBERSHIP_SUBSCRIPTIONS,
  DEMO_SUBSCRIPTION_KPIS,
  DEMO_MEMBERSHIP_DISCLAIMER,
} from "../../data/mock-memberships";
import type {
  MembershipSubscription,
  SubscriptionStatus,
} from "../../types/membership";

export function SubscriptionsListView() {
  const [subscriptions, setSubscriptions] = useState<MembershipSubscription[]>(DEMO_MEMBERSHIP_SUBSCRIPTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | SubscriptionStatus>("ALL");
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [search, statusFilter, planFilter]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCode = s.subscriptionCode.toLowerCase().includes(q);
        const matchName = s.memberName.toLowerCase().includes(q);
        const matchEmail = s.memberEmail.toLowerCase().includes(q);
        const matchMem = s.memberId.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchEmail && !matchMem) return false;
      }

      if (statusFilter !== "ALL" && s.status !== statusFilter) {
        return false;
      }

      if (planFilter !== "ALL" && s.planId !== planFilter) {
        return false;
      }

      return true;
    });
  }, [subscriptions, search, statusFilter, planFilter]);

  const paginatedSubscriptions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSubscriptions.slice(start, start + pageSize);
  }, [filteredSubscriptions, page]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav
        data-aos="fade-down"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/membership-plans" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Membership
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">Subscriptions</span>
      </nav>

      {/* Header */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 text-[#5B46F6] dark:text-indigo-300 flex items-center justify-center border border-indigo-100/80 dark:border-indigo-900 shadow-lg shadow-[#5B46F6]/10">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Membership Subscriptions
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Monitor active subscriber accounts, expiration timelines, and manual renewal requests
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/membership-plans"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5B46F6]" />
            <span>Membership Plans</span>
          </Link>

          <Link
            href="/admin/subscriptions/renewals"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 rounded-xl transition-all border border-amber-200 dark:border-amber-800 shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Renewals Review</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div
        data-aos="fade-up"
        className="bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 shadow-md shadow-amber-500/5"
      >
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold">Simulated Subscription Ledger: </span>
          {DEMO_MEMBERSHIP_DISCLAIMER} Note: BDSisters membership renewals operate on manual confirmation unless future requirements change. No auto-debit will occur.
        </div>
      </div>

      {/* KPI Cards */}
      <SubscriptionKpiCards
        kpis={DEMO_SUBSCRIPTION_KPIS}
        activeStatusFilter={statusFilter}
        onSelectStatus={(status) => setStatusFilter(status)}
      />

      {/* Filters Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 dark:bg-gray-900/95 p-4 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-md shadow-purple-500/5"
      >
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriptions by member name, subscription code, or ID..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-gray-50/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium"
          >
            <option value="ALL">All Membership Tiers</option>
            <option value="plan_entrepreneur_annual">Sister Entrepreneur (Annual)</option>
            <option value="plan_artisan_circle_lifetime">Elite Artisan Circle (Lifetime)</option>
            <option value="plan_entrepreneur_quarterly">Sister Entrepreneur (Quarterly)</option>
            <option value="plan_free_sister">Community Sister (Free)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRING_SOON">Expiring Soon</option>
            <option value="PENDING">Pending Clearance</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <SubscriptionTable
        subscriptions={paginatedSubscriptions}
        page={page}
        pageSize={pageSize}
        totalItems={filteredSubscriptions.length}
        onPageChange={setPage}
      />
    </div>
  );
}
