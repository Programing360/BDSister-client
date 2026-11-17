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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3" />
          <span>Published</span>
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
          <Clock className="w-3 h-3" />
          <span>Pending Review</span>
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
          <Clock className="w-3 h-3 animate-spin" />
          <span>Under Review</span>
        </span>
      );
    case "CHANGES_REQUESTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800">
          <AlertCircle className="w-3 h-3" />
          <span>Changes Requested</span>
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
          <XCircle className="w-3 h-3" />
          <span>Rejected</span>
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
          <ShieldAlert className="w-3 h-3" />
          <span>Suspended</span>
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
          <FileEdit className="w-3 h-3" />
          <span>Draft</span>
        </span>
      );
  }
}

export function ProfileVisibilityBadge({ visibility }: { visibility: ProfileVisibility }) {
  switch (visibility) {
    case "PUBLIC":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-[#5B46F6] border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900">
          <Globe className="w-3 h-3" />
          <span>Public</span>
        </span>
      );
    case "MEMBERS_ONLY":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900">
          <Users className="w-3 h-3" />
          <span>Members Only</span>
        </span>
      );
    case "PRIVATE":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
          <Lock className="w-3 h-3" />
          <span>Private</span>
        </span>
      );
  }
}

export function ProfileVerificationBadgeTag({ status }: { status: ProfileVerificationBadge }) {
  switch (status) {
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800">
          <ShieldCheck className="w-3 h-3 text-teal-600" />
          <span>NID Verified</span>
        </span>
      );
    case "PENDING":
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>Verification In Review</span>
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
          <XCircle className="w-3 h-3 text-rose-500" />
          <span>NID Rejected</span>
        </span>
      );
    case "NOT_SUBMITTED":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-normal text-gray-500 bg-gray-50 border border-gray-200 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700">
          <span>Unverified</span>
        </span>
      );
  }
}

export function ProfilePriorityBadge({ priority }: { priority: ProfileReviewPriority }) {
  switch (priority) {
    case "URGENT":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>Urgent</span>
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800">
          <span>High Priority</span>
        </span>
      );
    case "NORMAL":
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <span>Normal</span>
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-500">
          <span>Low</span>
        </span>
      );
  }
}

export function ProfileReportStatusBadge({ status }: { status: ProfileReportStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
          <AlertCircle className="w-3 h-3" />
          <span>Pending Investigation</span>
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
          <Clock className="w-3 h-3" />
          <span>Under Review</span>
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3" />
          <span>Resolved</span>
        </span>
      );
    case "DISMISSED":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
          <span>Dismissed</span>
        </span>
      );
  }
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/80 dark:from-amber-950/40 dark:to-orange-950/40 dark:text-amber-300 dark:border-amber-800/80 shadow-xs">
      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
      <span>Featured</span>
    </span>
  );
}
