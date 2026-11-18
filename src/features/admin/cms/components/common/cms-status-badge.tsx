"use client";

import React from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Eye,
  Globe,
  Lock,
  Sparkles,
  Calendar,
  Layers,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import type {
  PageStatus,
  PageType,
  BannerStatus,
  BannerType,
} from "../../types/cms";

export function PageStatusBadge({ status }: { status: PageStatus }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Published
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 shadow-sm shadow-slate-500/10">
          <Clock className="w-3 h-3 text-slate-500" />
          Draft
        </span>
      );
    case "IN_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 shadow-sm shadow-amber-500/10">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          In Review
        </span>
      );
    case "SCHEDULED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#5B46F6] shadow-sm shadow-indigo-500/10">
          <Calendar className="w-3 h-3 text-[#5B46F6]" />
          Scheduled
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 shadow-sm shadow-slate-500/10">
          <Archive className="w-3 h-3 text-slate-400" />
          Archived
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 shadow-sm">
          {status}
        </span>
      );
  }
}

export function PageTypeBadge({ type }: { type: PageType }) {
  switch (type) {
    case "LANDING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#5B46F6] shadow-sm shadow-indigo-500/10">
          <Sparkles className="w-3 h-3 text-[#5B46F6]" />
          Landing
        </span>
      );
    case "STANDARD":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10">
          <FileText className="w-3 h-3 text-blue-600" />
          Standard
        </span>
      );
    case "INFORMATIONAL":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 shadow-sm shadow-slate-500/10">
          <Layers className="w-3 h-3 text-slate-500" />
          Informational
        </span>
      );
    case "CAMPAIGN":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 shadow-sm shadow-rose-500/10">
          <Sparkles className="w-3 h-3 text-rose-600" />
          Campaign
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 shadow-sm">
          {type}
        </span>
      );
  }
}

export function BannerStatusBadge({ status }: { status: BannerStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Active
        </span>
      );
    case "SCHEDULED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#5B46F6] shadow-sm shadow-indigo-500/10">
          <Calendar className="w-3 h-3 text-[#5B46F6]" />
          Scheduled
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 shadow-sm">
          <Clock className="w-3 h-3 text-slate-400" />
          Draft
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/10">
          <AlertCircle className="w-3 h-3 text-rose-500" />
          Expired
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 shadow-sm">
          <Archive className="w-3 h-3 text-slate-400" />
          Archived
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 shadow-sm">
          {status}
        </span>
      );
  }
}

export function SeoScoreBadge({ score }: { score: number }) {
  if (score >= 90) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        {score}/100 Optimized
      </span>
    );
  }
  if (score >= 70) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 shadow-sm shadow-amber-500/10">
        <AlertCircle className="w-3 h-3 text-amber-600" />
        {score}/100 Needs Review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 shadow-sm shadow-rose-500/10">
      <ShieldAlert className="w-3 h-3 text-rose-600" />
      {score}/100 Missing Meta
    </span>
  );
}
