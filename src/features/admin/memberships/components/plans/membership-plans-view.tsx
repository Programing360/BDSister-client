"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  Sparkles,
  Plus,
  Users,
  CreditCard,
  ChevronRight,
  Info,
  Clock,
  Layers,
} from "lucide-react";
import { MembershipPlanCard } from "./membership-plan-card";
import {
  DEMO_MEMBERSHIP_PLANS,
  DEMO_MEMBERSHIP_DISCLAIMER,
} from "../../data/mock-memberships";

export function MembershipPlansView() {
  const [plans, setPlans] = useState(DEMO_MEMBERSHIP_PLANS);

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
        <span className="font-semibold text-gray-900 dark:text-white">Membership Plans</span>
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Membership Plans & Tier Architecture
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Manage Free Community membership and Paid Entrepreneur tiers with flexible manual billing durations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/subscriptions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Subscriptions</span>
          </Link>

          <Link
            href="/admin/membership-plans/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Plan</span>
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
          <span className="font-semibold">Membership Tier Notice: </span>
          {DEMO_MEMBERSHIP_DISCLAIMER} Note: Membership Type (Free/Paid) does not grant administrative system permissions.
        </div>
      </div>

      {/* Plans Grid */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {plans.map((plan) => (
          <MembershipPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
