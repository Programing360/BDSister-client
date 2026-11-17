"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Building2,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  ProfileApprovalStatusBadge,
  ProfilePriorityBadge,
  ProfileVerificationBadgeTag,
} from "./profile-status-badges";
import {
  ProfileReviewDialog,
  ReviewDialogAction,
} from "./profile-review-dialog";
import { ProfilePreviewDialog } from "./profile-preview-dialog";
import {
  DEMO_ADMIN_PROFILES,
} from "../data/admin-profiles-data";
import type { AdminProfileItem } from "../types/admin-profile";

export function ProfilesPendingView() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(
    DEMO_ADMIN_PROFILES.filter(
      (p) => p.approvalStatus === "PENDING_REVIEW" || p.approvalStatus === "UNDER_REVIEW"
    )
  );
  const [search, setSearch] = useState("");
  const [reviewTarget, setReviewTarget] = useState<{
    profile: AdminProfileItem;
    action: ReviewDialogAction;
  } | null>(null);
  const [previewTarget, setPreviewTarget] = useState<AdminProfileItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const filtered = profiles.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.memberId.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleConfirmReview = (
    action: ReviewDialogAction,
    payload: { reason?: string; internalNote?: string; changesRequested?: string }
  ) => {
    if (!reviewTarget) return;
    const target = reviewTarget.profile;

    let updatedStatus = target.approvalStatus;
    let toast = "";

    switch (action) {
      case "APPROVE":
        updatedStatus = "PUBLISHED";
        toast = `Profile for ${target.fullName} approved and published!`;
        break;
      case "REJECT":
        updatedStatus = "REJECTED";
        toast = `Profile for ${target.fullName} rejected.`;
        break;
      case "REQUEST_CHANGES":
        updatedStatus = "CHANGES_REQUESTED";
        toast = `Changes requested from ${target.fullName}.`;
        break;
    }

    setProfiles((prev) => prev.filter((p) => p.id !== target.id));
    setFeedbackToast(toast);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

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
        <span className="font-semibold text-gray-900 dark:text-white">Pending Approval Queue</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Pending Profile Approvals
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Profiles submitted by sisters awaiting administrative review before public spotlight
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
          placeholder="Filter pending profiles by name, profession, or ID..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-[#5B46F6]"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-400">
            No profiles currently waiting in the approval queue.
          </div>
        ) : (
          filtered.map((profile) => (
            <div
              key={profile.id}
              className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 font-bold text-base flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      {profile.fullName}
                    </h3>
                    <p className="text-xs text-[#5B46F6] font-semibold mt-0.5">
                      {profile.profession}
                    </p>
                    <span className="font-mono text-[10px] text-gray-400">
                      {profile.memberId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <ProfilePriorityBadge priority={profile.reviewPriority} />
                  <ProfileApprovalStatusBadge status={profile.approvalStatus} />
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl">
                {profile.bio || "No biography provided yet."}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {profile.category}
                </span>
                <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                <span className="text-[11px] text-gray-400">
                  Submitted: {profile.submittedAt}
                </span>
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Completeness: {profile.profileCompletion}%
                </span>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTarget(profile)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <Link
                    href={`/admin/profiles/${profile.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors"
                  >
                    <span>Full Review</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setReviewTarget({ profile, action: "REQUEST_CHANGES" })}
                    className="p-1.5 rounded-xl text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-orange-200 dark:border-orange-800 transition-colors"
                    title="Request Changes"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewTarget({ profile, action: "REJECT" })}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors"
                    title="Reject Profile"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewTarget({ profile, action: "APPROVE" })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <ProfileReviewDialog
        isOpen={reviewTarget !== null}
        action={reviewTarget?.action || null}
        profile={reviewTarget?.profile || null}
        onClose={() => setReviewTarget(null)}
        onConfirm={handleConfirmReview}
      />

      {/* Preview Dialog */}
      <ProfilePreviewDialog
        isOpen={previewTarget !== null}
        onClose={() => setPreviewTarget(null)}
        profile={previewTarget}
      />
    </div>
  );
}
