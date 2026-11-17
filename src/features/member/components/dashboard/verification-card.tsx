import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, ShieldAlert, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import type { IdentityVerificationStatus } from "../../types/dashboard";
import { DashboardCard } from "../shared/dashboard-card";

interface VerificationCardProps {
  user: AuthUser;
  identityStatus?: IdentityVerificationStatus;
}

export function VerificationCard({
  user,
  identityStatus = "NOT_STARTED",
}: VerificationCardProps) {
  const getIdentityBadge = () => {
    switch (identityStatus) {
      case "VERIFIED":
        return {
          label: "Verified Sister",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        };
      case "PENDING":
        return {
          label: "Under Review",
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="h-3.5 w-3.5" />,
        };
      case "REJECTED":
        return {
          label: "Action Required",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: <ShieldAlert className="h-3.5 w-3.5" />,
        };
      default:
        return {
          label: "Not Started",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <ShieldAlert className="h-3.5 w-3.5" />,
        };
    }
  };

  const badge = getIdentityBadge();

  return (
    <DashboardCard
      title="Trust & Verification"
      subtitle="Safeguarding our verified women-only community"
      icon={<ShieldCheck className="h-5 w-5" />}
      headerAction={
        <Link
          href="/member/profile/verification"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5B46F6] hover:underline"
        >
          <span>Manage</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="space-y-3.5">
        {/* Email Verification Row */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Email Verification</p>
              <p className="text-[11px] text-gray-500 truncate max-w-[180px] sm:max-w-xs">{user.email}</p>
            </div>
          </div>
          {user.emailVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </span>
          ) : (
            <Link
              href={`/verify-email?email=${encodeURIComponent(user.email)}`}
              className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 hover:bg-amber-100"
            >
              Verify Now
            </Link>
          )}
        </div>

        {/* Identity Verification Row */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Sisterhood Identity</p>
              <p className="text-[11px] text-gray-500">Official National ID or Student status</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
          >
            {badge.icon}
            {badge.label}
          </span>
        </div>

        <p className="text-[11px] leading-relaxed text-gray-500 pt-1">
          Identity verification unlocks our verified business directory badge, private sisterhood chat groups, and capital mentorship access.
        </p>
      </div>
    </DashboardCard>
  );
}
