"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowLeft,
  Eye,
  Search,
  ExternalLink,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  ProfileVisibilityBadge,
  ProfileVerificationBadgeTag,
  FeaturedBadge,
} from "./profile-status-badges";
import { ProfilePreviewDialog } from "./profile-preview-dialog";
import { DEMO_ADMIN_PROFILES } from "../data/admin-profiles-data";
import type { AdminProfileItem } from "../types/admin-profile";

export function ProfilesPublishedView() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(
    DEMO_ADMIN_PROFILES.filter((p) => p.approvalStatus === "PUBLISHED")
  );
  const [search, setSearch] = useState("");
  const [previewTarget, setPreviewTarget] = useState<AdminProfileItem | null>(null);

  const filtered = profiles.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q) ||
      p.memberId.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
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
        <span className="font-semibold text-gray-900 dark:text-white">Published Profiles</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Published Member Profiles
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Profiles approved by administrators and active in public or member search indexes
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
          placeholder="Search published profiles by name, category, or profession..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-[#5B46F6]"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((profile) => (
          <div
            key={profile.id}
            className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-900 dark:text-white">
                      {profile.fullName}
                    </h3>
                    <p className="text-[11px] text-[#5B46F6] font-semibold">
                      {profile.profession}
                    </p>
                    <span className="font-mono text-[10px] text-gray-400">
                      {profile.memberId}
                    </span>
                  </div>
                </div>

                {profile.isFeatured && <FeaturedBadge />}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {profile.bio || "No biography narrative provided."}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-700 dark:text-gray-300">
                  {profile.category}
                </span>
                <ProfileVisibilityBadge visibility={profile.profileVisibility} />
                <ProfileVerificationBadgeTag status={profile.verificationStatus} />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-gray-400">
                Approved: {profile.approvedAt ? profile.approvedAt.slice(0, 10) : "2026-09-13"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTarget(profile)}
                  className="font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900"
                >
                  Preview
                </button>
                <Link
                  href={`/admin/profiles/${profile.id}`}
                  className="font-semibold text-[#5B46F6] hover:underline"
                >
                  Manage →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <ProfilePreviewDialog
        isOpen={previewTarget !== null}
        onClose={() => setPreviewTarget(null)}
        profile={previewTarget}
      />
    </div>
  );
}
