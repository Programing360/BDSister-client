import React from "react";
import {
  CommunityCategoryStatus,
  DiscussionStatus,
  PostStatus,
  CommentStatus,
  ModerationPriority,
  ModerationReviewStatus,
  ReportStatus,
  ReportCategory,
  ModeratorStatus,
} from "../../types/community";

export function CategoryStatusBadge({ status }: { status: CommunityCategoryStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          Active
        </span>
      );
    case "INACTIVE":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          Inactive
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Archived
        </span>
      );
    default:
      return null;
  }
}

export function DiscussionStatusBadge({ status }: { status: DiscussionStatus }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Published
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Under Review
        </span>
      );
    case "LOCKED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          Locked
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          Draft
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Archived
        </span>
      );
    case "REMOVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          Removed
        </span>
      );
    default:
      return null;
  }
}

export function PostStatusBadge({ status }: { status: PostStatus }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Published
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Pending Review
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          Rejected
        </span>
      );
    case "HIDDEN":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          Hidden
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          Draft
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Archived
        </span>
      );
    case "REMOVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          Removed
        </span>
      );
    default:
      return null;
  }
}

export function CommentStatusBadge({ status }: { status: CommentStatus }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Published
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Pending Review
        </span>
      );
    case "HIDDEN":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          Hidden
        </span>
      );
    case "REJECTED":
    case "REMOVED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          {status === "REJECTED" ? "Rejected" : "Removed"}
        </span>
      );
    default:
      return null;
  }
}

export function ModerationPriorityBadge({ priority }: { priority: ModerationPriority }) {
  switch (priority) {
    case "URGENT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
          ⚡ Urgent
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
          High
        </span>
      );
    case "NORMAL":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          Normal
        </span>
      );
    case "LOW":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          Low
        </span>
      );
    default:
      return null;
  }
}

export function ModerationReviewStatusBadge({ status }: { status: ModerationReviewStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Pending
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          Under Review
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Approved
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          Rejected
        </span>
      );
    case "NEEDS_CHANGES":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          Needs Changes
        </span>
      );
    default:
      return null;
  }
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  switch (status) {
    case "NEW":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          New
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Under Review
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Resolved
        </span>
      );
    case "DISMISSED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          Dismissed
        </span>
      );
    case "ESCALATED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
          Escalated
        </span>
      );
    default:
      return null;
  }
}

export function ReportCategoryBadge({ category }: { category: ReportCategory }) {
  const map: Record<ReportCategory, { label: string; cls: string }> = {
    SPAM: { label: "Spam", cls: "bg-gray-100 text-gray-800 border-gray-200" },
    HARASSMENT: { label: "Harassment", cls: "bg-rose-100 text-rose-800 border-rose-200" },
    BULLYING: { label: "Bullying", cls: "bg-red-100 text-red-800 border-red-200" },
    HATE_SPEECH: { label: "Hate Speech", cls: "bg-red-100 text-red-900 border-red-300 font-bold" },
    MISINFORMATION: { label: "Misinformation", cls: "bg-amber-100 text-amber-800 border-amber-200" },
    INAPPROPRIATE: { label: "Inappropriate Content", cls: "bg-orange-100 text-orange-800 border-orange-200" },
    COPYRIGHT: { label: "Copyright Concern", cls: "bg-purple-100 text-purple-800 border-purple-200" },
    FAKE_ACCOUNT: { label: "Fake Account", cls: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    OTHER: { label: "Other", cls: "bg-slate-100 text-slate-800 border-slate-200" },
  };

  const item = map[category] || { label: category, cls: "bg-gray-100 text-gray-800 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.cls}`}>
      {item.label}
    </span>
  );
}

export function ModeratorStatusBadge({ status }: { status: ModeratorStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Active
        </span>
      );
    case "INACTIVE":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          Inactive
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          Suspended
        </span>
      );
    default:
      return null;
  }
}
