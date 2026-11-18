"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  PauseCircle,
  Sparkles,
} from "lucide-react";
import type { SubscriptionStatus, PlanBillingDuration } from "../../types/membership";

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shadow-sm shadow-emerald-500/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Active</span>
        </span>
      );
    case "EXPIRING_SOON":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/90 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 shadow-sm shadow-amber-500/15">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Expiring Soon</span>
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/90 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 shadow-sm shadow-blue-500/10">
          <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
          <span>Pending Clearance</span>
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 shadow-sm shadow-rose-500/10">
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Expired</span>
        </span>
      );
    case "CANCELLED":
    case "SUSPENDED":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
          <PauseCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span>{status === "CANCELLED" ? "Cancelled" : "Suspended"}</span>
        </span>
      );
  }
}

export function PlanDurationBadge({ duration }: { duration: PlanBillingDuration }) {
  switch (duration) {
    case "YEARLY":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
          12 Months
        </span>
      );
    case "QUARTERLY":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800">
          3 Months
        </span>
      );
    case "HALF_YEARLY":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
          6 Months
        </span>
      );
    case "LIFETIME":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Lifetime</span>
        </span>
      );
    case "MONTHLY":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Monthly
        </span>
      );
  }
}
