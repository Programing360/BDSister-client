"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RotateCcw,
  CreditCard,
  Building,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { PaymentStatus, PaymentType, PaymentMethod } from "../../types/payment";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "SUCCESSFUL":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shadow-sm shadow-emerald-500/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Successful</span>
        </span>
      );
    case "PENDING":
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/90 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 shadow-sm shadow-amber-500/15">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin shrink-0" />
          <span>{status === "PROCESSING" ? "Processing" : "Pending"}</span>
        </span>
      );
    case "INITIATED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/90 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 shadow-sm shadow-blue-500/10">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Initiated</span>
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 shadow-sm shadow-rose-500/10">
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Failed</span>
        </span>
      );
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/90 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 shadow-sm shadow-purple-500/10">
          <RotateCcw className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>{status === "PARTIALLY_REFUNDED" ? "Partially Refunded" : "Refunded"}</span>
        </span>
      );
    case "CANCELLED":
    case "EXPIRED":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
          <AlertCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span>{status === "EXPIRED" ? "Expired" : "Cancelled"}</span>
        </span>
      );
  }
}

export function PaymentTypeBadge({ type }: { type: PaymentType }) {
  switch (type) {
    case "MEMBERSHIP_SUBSCRIPTION":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#5B46F6] border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 shadow-xs shadow-indigo-500/10">
          <Sparkles className="w-3 h-3 text-[#5B46F6]" />
          <span>Membership</span>
        </span>
      );
    case "MARKETPLACE_ORDER":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-xs">
          <span>Order</span>
        </span>
      );
    case "COURSE_ENROLLMENT":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 shadow-xs">
          <span>Course</span>
        </span>
      );
    case "FEATURED_LISTING":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 shadow-xs">
          <span>Listing</span>
        </span>
      );
  }
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  switch (method) {
    case "ZINIPAY_BKASH":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-pink-700 dark:text-pink-300">
          <Smartphone className="w-3.5 h-3.5 text-pink-600" />
          <span>ZiniPay (bKash)</span>
        </span>
      );
    case "ZINIPAY_NAGAD":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
          <span>ZiniPay (Nagad)</span>
        </span>
      );
    case "ZINIPAY_ROCKET":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
          <Smartphone className="w-3.5 h-3.5 text-purple-600" />
          <span>ZiniPay (Rocket)</span>
        </span>
      );
    case "ZINIPAY_CARD":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
          <span>ZiniPay (Card)</span>
        </span>
      );
    case "ZINIPAY_INTERNET_BANKING":
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
          <Building className="w-3.5 h-3.5 text-teal-600" />
          <span>ZiniPay (Net Banking)</span>
        </span>
      );
  }
}
