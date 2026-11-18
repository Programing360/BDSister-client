"use client";

import React from "react";
import type { BusinessApprovalStatus, BusinessVerificationStatus } from "../types/admin-business.ts";
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

interface StatusBadgeProps {
  status: BusinessApprovalStatus | string;
  size?: "sm" | "md";
}

export function BusinessStatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  switch (status) {
    case "APPROVED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClass}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved</span>
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClass}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Pending Review</span>
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClass}`}>
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Under Review</span>
        </span>
      );
    case "REJECTED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClass}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    case "SUSPENDED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClass}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
          <span>Suspended</span>
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${sizeClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          <span>Draft</span>
        </span>
      );
  }
}

export function BusinessVerificationBadge({ status, size = "md" }: { status: BusinessVerificationStatus | string; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  switch (status) {
    case "VERIFIED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClass}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-[#5B46F6]" />
          <span>Verified</span>
        </span>
      );
    case "PENDING":
    case "UNDER_REVIEW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClass}`}>
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>Doc Review</span>
        </span>
      );
    case "REJECTED":
    case "ACTION_REQUIRED":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClass}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Action Required</span>
        </span>
      );
    case "NOT_SUBMITTED":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200 ${sizeClass}`}>
          <Shield className="w-3.5 h-3.5 text-gray-400" />
          <span>Unverified</span>
        </span>
      );
  }
}

export function BusinessPriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "URGENT":
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
          URGENT
        </span>
      );
    case "HIGH":
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800 border border-amber-200">
          HIGH
        </span>
      );
    case "LOW":
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700 border border-gray-200">
          LOW
        </span>
      );
    case "NORMAL":
    default:
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200">
          NORMAL
        </span>
      );
  }
}
