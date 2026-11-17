import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  XCircle,
  AlertCircle,
  Crown,
  CheckCircle2,
} from "lucide-react";
import {
  AdminAccountStatus,
  MembershipType,
  IdentityVerificationStatus,
} from "../types/admin-member";

export function AccountStatusBadge({ status }: { status: AdminAccountStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Suspended
        </span>
      );
    case "BANNED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Banned
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          Pending
        </span>
      );
  }
}

export function MembershipBadge({
  type,
  plan,
  planName,
}: {
  type: MembershipType;
  plan?: string;
  planName?: string;
}) {
  const displayPlan = planName || plan;
  if (type === "PAID") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-[#5B46F6]">
        <Crown className="h-3 w-3 text-[#5B46F6]" />
        <span>{displayPlan || "Paid Pro"}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-gray-600">
      <span>{displayPlan || "Free"}</span>
    </span>
  );
}

export function EmailVerificationBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
        <span>Verified</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
      <Clock className="h-3 w-3 text-amber-600" />
      <span>Unverified</span>
    </span>
  );
}

export function IdentityVerificationBadge({
  status,
}: {
  status: IdentityVerificationStatus;
}) {
  switch (status) {
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          Verified
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">
          <Clock className="h-3 w-3 text-sky-600" />
          Under Review
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800">
          <ShieldAlert className="h-3 w-3 text-amber-600" />
          Pending
        </span>
      );
    case "ACTION_REQUIRED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-800">
          <AlertCircle className="h-3 w-3 text-orange-600" />
          Action Required
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700">
          <XCircle className="h-3 w-3 text-rose-600" />
          Rejected
        </span>
      );
    case "NOT_SUBMITTED":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-gray-500">
          Not Submitted
        </span>
      );
  }
}
