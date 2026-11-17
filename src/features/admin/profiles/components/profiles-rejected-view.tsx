"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  Search,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import {
  ProfileVerificationBadgeTag,
} from "./profile-status-badges";
import { DEMO_ADMIN_PROFILES } from "../data/admin-profiles-data";
import type { AdminProfileItem } from "../types/admin-profile";

export function ProfilesRejectedView() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(
    DEMO_ADMIN_PROFILES.filter((p) => p.approvalStatus === "REJECTED" || p.approvalStatus === "SUSPENDED")
  );
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q) ||
      p.memberId.toLowerCase().includes(q) ||
      (p.rejectionReason || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/profiles" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Profile Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">Rejected & Suspended Profiles</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Rejected & Suspended Profiles
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Profiles declined due to representation guidelines or temporarily suspended under compliance investigation
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/profiles"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-800 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Profiles</span>
        </Link>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, member ID, or reason..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-rose-500"
        />
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {filtered.map((profile) => (
          <div
            key={profile.id}
            className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 font-bold text-sm flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                  {profile.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white">
                    {profile.fullName}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {profile.headline || profile.profession}
                  </p>
                  <span className="font-mono text-[10px] text-gray-400">
                    {profile.memberId}
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                profile.approvalStatus === "SUSPENDED"
                  ? "bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300"
                  : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400"
              }`}>
                {profile.approvalStatus === "SUSPENDED" ? "Account Suspended" : "Submission Rejected"}
              </span>
            </div>

            {/* Rejection / Suspension Details Box */}
            <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-rose-800 dark:text-rose-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Administrative Decision Grounds:</span>
                </span>
                <span className="text-[11px] font-normal text-rose-600 dark:text-rose-400">
                  Logged: {profile.rejectionDate || profile.lastUpdated}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-5">
                {profile.rejectionReason || profile.suspendedReason || "No specific reason provided."}
              </p>
              {profile.rejectedBy && (
                <p className="text-[11px] text-gray-500 pl-5">
                  Reviewing Staff: <strong>{profile.rejectedBy}</strong>
                </p>
              )}
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                <span className="text-[11px] text-gray-400">
                  Resubmission Permitted: <strong>{profile.approvalStatus === "SUSPENDED" ? "Blocked Pending Appeal" : "Yes (Action Required)"}</strong>
                </span>
              </div>

              <Link
                href={`/admin/profiles/${profile.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B46F6] hover:underline"
              >
                <span>Re-evaluate Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
