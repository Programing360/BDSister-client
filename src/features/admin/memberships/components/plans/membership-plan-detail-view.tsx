"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  Sparkles,
  ArrowLeft,
  Edit2,
  Users,
  CheckCircle2,
  ChevronRight,
  Info,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { MembershipPlan } from "../../types/membership";
import { formatBDT } from "../../../payments/data/mock-payments";
import { PlanDurationBadge } from "../common/subscription-status-badge";

interface MembershipPlanDetailViewProps {
  plan: MembershipPlan;
}

export function MembershipPlanDetailView({ plan }: MembershipPlanDetailViewProps) {
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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
          Membership Plans
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">{plan.name}</span>
      </nav>

      {/* Header */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B46F6] flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {plan.name}
                </h1>
                <PlanDurationBadge duration={plan.billingDuration} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {plan.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/membership-plans"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Plans</span>
          </Link>

          <Link
            href={`/admin/membership-plans/${plan.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/20"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Plan</span>
          </Link>
        </div>
      </div>

      {/* Grid: 3 Metric Cards */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-1">
          <span className="text-xs font-semibold text-gray-500">Plan Membership Pricing</span>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            {plan.type === "FREE" ? "Free Tier" : formatBDT(plan.priceBDT)}
          </div>
          <p className="text-[11px] text-gray-400">{plan.durationLabel}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-indigo-500/5 space-y-1">
          <span className="text-xs font-semibold text-gray-500">Active Subscriptions</span>
          <div className="text-2xl font-semibold text-[#5B46F6]">
            {plan.activeSubscriptions.toLocaleString()} Sisters
          </div>
          <p className="text-[11px] text-gray-400">Total enrolled: {plan.memberCount.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-emerald-500/5 space-y-1">
          <span className="text-xs font-semibold text-gray-500">Status & Governance</span>
          <div className="text-2xl font-semibold text-emerald-600">
            {plan.status}
          </div>
          <p className="text-[11px] text-gray-400">Created on {plan.createdAt}</p>
        </div>
      </div>

      {/* Benefits Showcase Card */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-4"
      >
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Curated Platform Entitlements & Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span className="font-medium leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
