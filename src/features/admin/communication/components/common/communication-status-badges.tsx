import React from "react";
import type {
  PriorityLevel,
  TicketStatus,
  ContactStatus,
  EmailDeliveryStatus,
  AnnouncementType,
  AnnouncementStatus,
  ComplaintStatus,
} from "../../types/communication";

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case "URGENT":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm shadow-rose-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          Urgent
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 shadow-sm shadow-amber-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 shadow-sm shadow-indigo-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Medium
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Low
        </span>
      );
  }
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  switch (status) {
    case "OPEN":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 shadow-sm shadow-blue-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Open
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 shadow-sm shadow-indigo-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          In Progress
        </span>
      );
    case "WAITING_FOR_RESPONSE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 shadow-sm shadow-amber-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Waiting
        </span>
      );
    case "ESCALATED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm shadow-rose-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Escalated
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm shadow-emerald-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Resolved
        </span>
      );
    case "CLOSED":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Closed
        </span>
      );
  }
}

export function ContactStatusBadge({ status }: { status: ContactStatus }) {
  switch (status) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm shadow-rose-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          New
        </span>
      );
    case "READ":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
          Read
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 shadow-sm shadow-indigo-500/10">
          In Progress
        </span>
      );
    case "REPLIED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 shadow-sm shadow-blue-500/10">
          Replied
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm shadow-emerald-500/10">
          Resolved
        </span>
      );
    case "ARCHIVED":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
          Archived
        </span>
      );
  }
}

export function DeliveryStatusBadge({ status }: { status: EmailDeliveryStatus | string }) {
  const s = String(status || "").toUpperCase();
  switch (s) {
    case "DELIVERED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm shadow-emerald-500/10">
          Delivered
        </span>
      );
    case "SENT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 shadow-sm shadow-blue-500/10">
          Sent
        </span>
      );
    case "QUEUED":
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 shadow-sm shadow-amber-500/10">
          Queued
        </span>
      );
    case "BOUNCED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm shadow-rose-500/10">
          Bounced
        </span>
      );
    case "FAILED":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm shadow-rose-500/10">
          {status}
        </span>
      );
  }
}

export function AnnouncementTypeBadge({ type }: { type: AnnouncementType }) {
  switch (type) {
    case "WARNING":
      return (
        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
          Warning
        </span>
      );
    case "IMPORTANT":
      return (
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
          Important
        </span>
      );
    case "EVENT":
      return (
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
          Event
        </span>
      );
    case "MEMBERSHIP":
      return (
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          Membership
        </span>
      );
    case "MAINTENANCE":
      return (
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
          Maintenance
        </span>
      );
    case "GENERAL":
    default:
      return (
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          General
        </span>
      );
  }
}

export function AnnouncementStatusBadge({ status }: { status: AnnouncementStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm shadow-emerald-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    case "SCHEDULED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 shadow-sm shadow-blue-500/10">
          Scheduled
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
          Draft
        </span>
      );
    case "EXPIRED":
    case "ARCHIVED":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
          {status}
        </span>
      );
  }
}

export function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  switch (status) {
    case "INVESTIGATING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 shadow-sm shadow-amber-500/10">
          Investigating
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm shadow-emerald-500/10">
          Resolved
        </span>
      );
    case "DISMISSED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
          Dismissed
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm shadow-rose-500/10">
          Pending Review
        </span>
      );
  }
}
