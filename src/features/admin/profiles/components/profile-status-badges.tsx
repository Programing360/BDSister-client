"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileEdit,
  ShieldAlert,
  Globe,
  Users,
  Lock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import type {
  ProfileApprovalStatus,
  ProfileVisibility,
  ProfileVerificationBadge,
  ProfileReviewPriority,
  ProfileReportStatus,
} from "../types/admin-profile";

export function ProfileApprovalStatusBadge({ status }: { status: ProfileApprovalStatus }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shadow-sm shadow-emerald-500/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Published</span>
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/90 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 shadow-sm shadow-amber-500/15">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Pending Review</span>
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/90 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 shadow-sm shadow-blue-500/15">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
          <span>Under Review</span>
        </span>
      );
    case "CHANGES_REQUESTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200/90 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800 shadow-sm shadow-orange-500/15">
          <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>Changes Requested</span>
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 shadow-sm shadow-rose-500/10">
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Rejected</span>
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100/80 text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 shadow-sm shadow-red-500/15">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>Suspended</span>
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 shadow-xs">
          <FileEdit className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span>Draft</span>
        </span>
      );
  }
}

export function ProfileVisibilityBadge({ visibility }: { visibility: ProfileVisibility }) {
  switch (visibility) {
    case "PUBLIC":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50/80 text-[#5B46F6] border border-indigo-200/70 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/80 shadow-xs shadow-indigo-500/10">
          <Globe className="w-3 h-3 text-[#5B46F6] dark:text-indigo-400 shrink-0" />
          <span>Public</span>
        </span>
      );
    case "MEMBERS_ONLY":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50/80 text-purple-700 border border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/80 shadow-xs shadow-purple-500/10">
          <Users className="w-3 h-3 text-purple-600 shrink-0" />
          <span>Members Only</span>
        </span>
      );
    case "PRIVATE":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 shadow-xs">
          <Lock className="w-3 h-3 text-gray-400 shrink-0" />
          <span>Private</span>
        </span>
      );
  }
}

export function ProfileVerificationBadgeTag({ status }: { status: ProfileVerificationBadge }) {
  switch (status) {
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800 shadow-xs shadow-teal-500/10">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>NID Verified</span>
        </span>
      );
    case "PENDING":
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 shadow-xs shadow-amber-500/10">
          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Verification In Review</span>
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 shadow-xs shadow-rose-500/10">
          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>NID Rejected</span>
        </span>
      );
    case "NOT_SUBMITTED":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-normal text-gray-500 bg-gray-50/80 border border-gray-200/80 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700">
          <span>Unverified</span>
        </span>
      );
  }
}

export function ProfilePriorityBadge({ priority }: { priority: ProfileReviewPriority }) {
  switch (priority) {
    case "URGENT":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 shadow-xs shadow-rose-500/20">
          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
          <span>Urgent</span>
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800 shadow-xs shadow-orange-500/15">
          <span>High Priority</span>
        </span>
      );
    case "NORMAL":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700">
          <span>Normal</span>
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-normal bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400 border border-gray-200/40 dark:border-gray-800">
          <span>Low</span>
        </span>
      );
  }
}

export function ProfileReportStatusBadge({ status }: { status: ProfileReportStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 shadow-xs shadow-rose-500/15">
          <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
          <span>Pending Investigation</span>
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 shadow-xs shadow-blue-500/15">
          <Clock className="w-3 h-3 text-blue-600 shrink-0" />
          <span>Under Review</span>
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shadow-xs shadow-emerald-500/10">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Resolved</span>
        </span>
      );
    case "DISMISSED":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
          <span>Dismissed</span>
        </span>
      );
  }
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border border-amber-200/90 dark:from-amber-950/50 dark:to-orange-950/50 dark:text-amber-300 dark:border-amber-800/80 shadow-sm shadow-amber-500/20">
      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
      <span>Featured</span>
    </span>
  );
}
