"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
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

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [search]);

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
      <nav
        data-aos="fade-down"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
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
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800 shadow-lg shadow-emerald-500/15">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-md shadow-gray-200/50 dark:shadow-none hover:shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Profiles</span>
        </Link>
      </div>

      {/* Search Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="relative max-w-md"
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search published profiles by name, category, or profession..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all shadow-md shadow-emerald-500/5"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div
            data-aos="fade-up"
            className="col-span-full p-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-400 shadow-lg shadow-emerald-500/5"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400/80 mx-auto mb-2" />
            <p className="font-semibold text-sm text-gray-600 dark:text-gray-300">
              No published profiles matched your search.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          filtered.map((profile, idx) => (
            <div
              key={profile.id}
              data-aos="fade-up"
              data-aos-delay={(idx % 9) * 50 + 100}
              className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-emerald-500/8 hover:shadow-xl hover:shadow-emerald-500/18 hover:border-emerald-200 dark:hover:border-emerald-800/60 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-sm flex items-center justify-center shrink-0 border border-emerald-200/80 dark:border-emerald-800 shadow-xs shadow-emerald-500/10">
                      {profile.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-gray-900 dark:text-white">
                        {profile.fullName}
                      </h3>
                      <p className="text-[11px] text-[#5B46F6] font-medium">
                        {profile.profession}
                      </p>
                      <span className="font-mono text-[10px] text-gray-400">
                        {profile.memberId}
                      </span>
                    </div>
                  </div>

                  {profile.isFeatured && <FeaturedBadge />}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed bg-gray-50/50 dark:bg-gray-800/40 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {profile.bio || "No biography narrative provided."}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60">
                    {profile.category}
                  </span>
                  <ProfileVisibilityBadge visibility={profile.profileVisibility} />
                  <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-gray-400 font-medium">
                  Approved: {profile.approvedAt ? profile.approvedAt.slice(0, 10) : "2026-09-13"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTarget(profile)}
                    className="font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Preview
                  </button>
                  <Link
                    href={`/admin/profiles/${profile.id}`}
                    className="font-semibold text-[#5B46F6] hover:underline inline-flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                  >
                    <span>Manage</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
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
