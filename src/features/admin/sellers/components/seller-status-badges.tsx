"use client";

import React from "react";
import type { SellerApprovalStatus, SellerVerificationStatus, SellerType } from "../types/admin-seller.ts";
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck, Shield } from "lucide-react";

export function SellerStatusBadge({ status, size = "md" }: { status: SellerApprovalStatus | string; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  switch (status) {
    case "APPROVED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClass}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved Seller</span>
        </span>
      );
    case "PENDING_APPROVAL":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClass}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Pending Onboarding</span>
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClass}`}>
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Under Review</span>
        </span>
      );
    case "SUSPENDED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClass}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
          <span>Suspended</span>
        </span>
      );
    case "REJECTED":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClass}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
  }
}

export function SellerVerificationBadge({ status, size = "md" }: { status: SellerVerificationStatus | string; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  switch (status) {
    case "VERIFIED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClass}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-[#5B46F6]" />
          <span>ID Verified</span>
        </span>
      );
    case "PENDING":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClass}`}>
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>Pending Check</span>
        </span>
      );
    case "REJECTED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClass}`}>
          <Shield className="w-3.5 h-3.5 text-rose-600" />
          <span>Failed Check</span>
        </span>
      );
    case "UNVERIFIED":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 ${sizeClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          <span>Unverified</span>
        </span>
      );
  }
}

export function SellerTypeBadge({ type }: { type: SellerType | string }) {
  switch (type) {
    case "BUSINESS":
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#EAE6F7] text-[#5B46F6] border border-[#5B46F6]/20">
          Business Seller
        </span>
      );
    case "SERVICE_PROVIDER":
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
          Service Provider
        </span>
      );
    case "INDIVIDUAL":
    default:
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-700 border border-gray-200">
          Individual Artisan
        </span>
      );
  }
}
