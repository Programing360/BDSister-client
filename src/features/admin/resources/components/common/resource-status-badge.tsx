"use client";

import React from "react";
import {
  FileText,
  Video,
  FileCode,
  Download,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Archive,
  ShieldAlert,
  Globe,
  Lock,
  Star,
} from "lucide-react";
import type {
  ResourceType,
  ResourceStatus,
  ResourceVisibility,
  CourseLevel,
  CourseStatus,
  EnrollmentStatus,
  ApprovalStatus,
  ApprovalPriority,
} from "../../types/resource";

export function ResourceTypeBadge({ type }: { type: ResourceType }) {
  switch (type) {
    case "ARTICLE":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
          <FileText className="w-3 h-3 text-blue-600" />
          Article
        </span>
      );
    case "VIDEO":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
          <Video className="w-3 h-3 text-rose-600" />
          Video
        </span>
      );
    case "PDF":
    case "DOCUMENT":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
          <Download className="w-3 h-3 text-amber-600" />
          {type}
        </span>
      );
    case "COURSE":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
          <GraduationCap className="w-3 h-3 text-brand-primary" />
          Course
        </span>
      );
    case "GUIDE":
    case "TUTORIAL":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <BookOpen className="w-3 h-3 text-emerald-600" />
          {type}
        </span>
      );
    case "TEMPLATE":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20">
          <FileCode className="w-3 h-3 text-purple-600" />
          Template
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-700 border border-slate-500/20">
          <Layers className="w-3 h-3 text-slate-500" />
          {type}
        </span>
      );
  }
}

export function ResourceStatusBadge({ status }: { status: ResourceStatus }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Published
        </span>
      );
    case "PENDING_REVIEW":
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
          <Clock className="w-3 h-3 text-amber-600" />
          {status === "UNDER_REVIEW" ? "Under Review" : "Pending Review"}
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-700 border border-slate-500/20">
          Draft
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
          <XCircle className="w-3 h-3 text-rose-600" />
          Rejected
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20">
          <Archive className="w-3 h-3 text-purple-600" />
          Archived
        </span>
      );
  }
}

export function ResourceVisibilityBadge({ visibility }: { visibility: ResourceVisibility }) {
  switch (visibility) {
    case "PUBLIC":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Globe className="w-2.5 h-2.5 text-emerald-600" />
          Public
        </span>
      );
    case "MEMBERS_ONLY":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
          <Lock className="w-2.5 h-2.5 text-brand-primary" />
          Members
        </span>
      );
    case "PREMIUM":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Star className="w-2.5 h-2.5 text-amber-500" />
          Premium
        </span>
      );
  }
}

export function CourseLevelBadge({ level }: { level: CourseLevel }) {
  switch (level) {
    case "BEGINNER":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Beginner
        </span>
      );
    case "INTERMEDIATE":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          Intermediate
        </span>
      );
    case "ADVANCED":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          Advanced
        </span>
      );
    case "ALL_LEVELS":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          All Levels
        </span>
      );
  }
}

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Published
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
          <Clock className="w-3 h-3 text-amber-600" />
          Pending Review
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-700 border border-slate-500/20">
          Draft
        </span>
      );
    case "UNPUBLISHED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
          Unpublished
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20">
          Archived
        </span>
      );
  }
}

export function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Active
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <GraduationCap className="w-3 h-3 text-purple-600" />
          Completed
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          Pending
        </span>
      );
    case "CANCELLED":
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          {status}
        </span>
      );
  }
}

export function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  switch (status) {
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Approved
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
          <Clock className="w-3 h-3 text-amber-600" />
          Pending
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
          Under Review
        </span>
      );
    case "CHANGES_REQUESTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20">
          Changes Requested
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
          <XCircle className="w-3 h-3 text-rose-600" />
          Rejected
        </span>
      );
  }
}

export function ApprovalPriorityBadge({ priority }: { priority: ApprovalPriority }) {
  switch (priority) {
    case "URGENT":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700 border border-rose-300">
          Urgent
        </span>
      );
    case "HIGH":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-300">
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Medium
        </span>
      );
    case "LOW":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          Low
        </span>
      );
  }
}
