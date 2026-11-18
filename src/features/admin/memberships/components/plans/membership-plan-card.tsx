"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Users,
  Edit2,
  ExternalLink,
  Crown,
} from "lucide-react";
import type { MembershipPlan } from "../../types/membership";
import { formatBDT } from "../../../payments/data/mock-payments";
import { PlanDurationBadge } from "../common/subscription-status-badge";

interface MembershipPlanCardProps {
  plan: MembershipPlan;
}

export function MembershipPlanCard({ plan }: MembershipPlanCardProps) {
  const isFree = plan.type === "FREE";

  const colorStyles = {
    purple: "border-purple-200/80 dark:border-purple-800 shadow-purple-500/10 hover:shadow-purple-500/20",
    amber: "border-amber-200/80 dark:border-amber-800 shadow-amber-500/10 hover:shadow-amber-500/20",
    emerald: "border-emerald-200/80 dark:border-emerald-800 shadow-emerald-500/10 hover:shadow-emerald-500/20",
    indigo: "border-indigo-200/80 dark:border-indigo-800 shadow-indigo-500/10 hover:shadow-indigo-500/20",
    rose: "border-rose-200/80 dark:border-rose-800 shadow-rose-500/10 hover:shadow-rose-500/20",
  }[plan.colorScheme] || "border-gray-200 dark:border-gray-800 shadow-gray-200/50";

  return (
    <div
      className={`p-6 rounded-3xl bg-white dark:bg-gray-900 border transition-all duration-300 hover:translate-y-[-2px] flex flex-col justify-between shadow-xl ${colorStyles}`}
    >
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-gray-900 dark:text-white">
                {plan.name}
              </h3>
              {plan.badgeText && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border border-amber-200 shadow-xs">
                  {plan.badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {plan.description}
            </p>
          </div>

          <PlanDurationBadge duration={plan.billingDuration} />
        </div>

        {/* Price & Billing Schedule */}
        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
              {isFree ? "Free" : formatBDT(plan.priceBDT)}
            </div>
            <span className="text-[10px] text-gray-400">{plan.durationLabel}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-[#5B46F6] flex items-center gap-1 justify-end">
              <Users className="w-3.5 h-3.5" />
              <span>{plan.memberCount.toLocaleString()}</span>
            </span>
            <span className="text-[10px] text-gray-400">Total Enrolled Sisters</span>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Included Platform Benefits
          </span>
          <div className="space-y-2">
            {plan.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="leading-tight">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            plan.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {plan.status}
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/membership-plans/${plan.id}/edit`}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Edit Plan"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/admin/membership-plans/${plan.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold text-xs text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition border border-indigo-200/60 shadow-xs"
          >
            <span>Plan Details</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
