"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Eye,
  Building2,
  MoveUp,
  MoveDown,
} from "lucide-react";
import {
  ProfileVerificationBadgeTag,
  ProfileVisibilityBadge,
} from "./profile-status-badges";
import { ProfilePreviewDialog } from "./profile-preview-dialog";
import { DEMO_ADMIN_PROFILES } from "../data/admin-profiles-data";
import type { AdminProfileItem } from "../types/admin-profile";

export function FeaturedProfilesView() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(DEMO_ADMIN_PROFILES);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<AdminProfileItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const featuredProfiles = profiles
    .filter((p) => p.isFeatured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));

  const availableToFeature = profiles.filter(
    (p) => !p.isFeatured && p.approvalStatus === "PUBLISHED"
  );

  const handleRemoveFeatured = (id: string, name: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: false, featuredOrder: undefined } : p))
    );
    setFeedbackToast(`Removed ${name} from featured spotlight.`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAddFeatured = (id: string, name: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isFeatured: true,
              featuredOrder: featuredProfiles.length + 1,
              featuredDate: new Date().toISOString().slice(0, 10),
            }
          : p
      )
    );
    setIsAddModalOpen(false);
    setFeedbackToast(`Added ${name} to featured spotlights!`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleMoveOrder = (id: string, direction: "up" | "down") => {
    const index = featuredProfiles.findIndex((p) => p.id === id);
    if (index === -1) return;

    const newProfiles = [...featuredProfiles];
    const current = newProfiles[index];
    if (!current) return;

    if (direction === "up" && index > 0) {
      const prev = newProfiles[index - 1];
      if (prev) {
        newProfiles[index] = prev;
        newProfiles[index - 1] = current;
      }
    } else if (direction === "down" && index < newProfiles.length - 1) {
      const next = newProfiles[index + 1];
      if (next) {
        newProfiles[index] = next;
        newProfiles[index + 1] = current;
      }
    }

    // Reassign orders
    const updatedIds = newProfiles.map((p, idx) => ({ id: p.id, order: idx + 1 }));
    setProfiles((prev) =>
      prev.map((p) => {
        const found = updatedIds.find((u) => u.id === p.id);
        return found ? { ...p, featuredOrder: found.order } : p;
      })
    );
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
        <span className="font-semibold text-gray-900 dark:text-white">Featured Spotlights</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Featured Member Spotlights
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Curate inspirational sisters pinned to community portal hero sections and monthly newsletters
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Spotlight Another Sister</span>
          </button>

          <Link
            href="/admin/profiles"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Profiles</span>
          </Link>
        </div>
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredProfiles.map((profile, idx) => (
          <div
            key={profile.id}
            className="relative p-6 rounded-3xl bg-linear-to-br from-amber-50/40 via-white to-orange-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            {/* Priority Pin Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>Priority #{profile.featuredOrder || idx + 1}</span>
              </span>

              {/* Order Adjustment Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveOrder(profile.id, "up")}
                  disabled={idx === 0}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  title="Move Up in Spotlight"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveOrder(profile.id, "down")}
                  disabled={idx === featuredProfiles.length - 1}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  title="Move Down in Spotlight"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#5B46F6]/10 text-[#5B46F6] font-bold text-base flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
                  {profile.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    {profile.fullName}
                  </h3>
                  <p className="text-xs text-[#5B46F6] font-semibold">
                    {profile.profession}
                  </p>
                  <span className="font-mono text-[10px] text-gray-400">
                    {profile.memberId}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {profile.bio || "No narrative provided."}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-700 dark:text-gray-300">
                  {profile.category}
                </span>
                <ProfileVerificationBadgeTag status={profile.verificationStatus} />
              </div>
            </div>

            {/* Footer controls */}
            <div className="pt-3 border-t border-amber-100/80 dark:border-gray-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setPreviewTarget(profile)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Card Preview</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/profiles/${profile.id}`}
                  className="font-semibold text-[#5B46F6] hover:underline"
                >
                  Manage
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemoveFeatured(profile.id, profile.fullName)}
                  className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                  title="Remove from Featured Spotlight"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Add Member to Featured Spotlight
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select an approved published member profile to feature on platform hero banners
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              {availableToFeature.length === 0 ? (
                <p className="p-6 text-center text-gray-400">
                  All published profiles are currently already featured.
                </p>
              ) : (
                availableToFeature.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{p.fullName}</p>
                      <p className="text-[11px] text-gray-500">{p.profession} ({p.category})</p>
                      <span className="font-mono text-[10px] text-gray-400">{p.memberId}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddFeatured(p.id, p.fullName)}
                      className="px-3 py-1.5 font-semibold text-xs text-white bg-[#5B46F6] hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                    >
                      Feature Sister
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <ProfilePreviewDialog
        isOpen={previewTarget !== null}
        onClose={() => setPreviewTarget(null)}
        profile={previewTarget}
      />
    </div>
  );
}
