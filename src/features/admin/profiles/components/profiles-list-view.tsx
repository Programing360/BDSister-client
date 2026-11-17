"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  RefreshCw,
  Sparkles,
  Layers,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import { ProfileKpiCards } from "./profile-kpi-cards";
import { ProfileTableToolbar } from "./profile-table-toolbar";
import { ProfileTable } from "./profile-table";
import {
  ProfileReviewDialog,
  ReviewDialogAction,
} from "./profile-review-dialog";
import { ProfilePreviewDialog } from "./profile-preview-dialog";
import {
  DEMO_ADMIN_PROFILES,
  DEMO_PROFILE_KPIS,
  DEMO_PROFILES_DISCLAIMER,
} from "../data/admin-profiles-data";
import type {
  AdminProfileItem,
  ProfileFilterState,
  ProfileApprovalStatus,
} from "../types/admin-profile";

export function ProfilesListView() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(DEMO_ADMIN_PROFILES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Review & Preview Dialog States
  const [reviewTarget, setReviewTarget] = useState<{
    profile: AdminProfileItem;
    action: ReviewDialogAction;
  } | null>(null);
  const [previewTarget, setPreviewTarget] = useState<AdminProfileItem | null>(null);

  // Filters State
  const [filters, setFilters] = useState<ProfileFilterState>({
    query: "",
    approvalStatus: "ALL",
    verificationStatus: "ALL",
    category: "ALL",
    visibility: "ALL",
    isFeatured: "ALL",
    sortBy: "lastUpdated",
    sortDirection: "desc",
    page: 1,
    pageSize: 8,
  });

  const handleFilterChange = (updates: Partial<ProfileFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: "",
      approvalStatus: "ALL",
      verificationStatus: "ALL",
      category: "ALL",
      visibility: "ALL",
      isFeatured: "ALL",
      sortBy: "lastUpdated",
      sortDirection: "desc",
      page: 1,
      pageSize: 8,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setFeedbackToast("Refreshed profile directory simulation cache.");
      setTimeout(() => setFeedbackToast(null), 3000);
    }, 500);
  };

  // Filter and Sort Logic
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((p) => {
        // Query search
        if (filters.query.trim()) {
          const q = filters.query.toLowerCase();
          const matchName = p.fullName.toLowerCase().includes(q);
          const matchEmail = p.email.toLowerCase().includes(q);
          const matchId = p.memberId.toLowerCase().includes(q);
          const matchProfession = p.profession.toLowerCase().includes(q);
          const matchHeadline = (p.headline || "").toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchId && !matchProfession && !matchHeadline) {
            return false;
          }
        }

        // Approval status
        if (filters.approvalStatus !== "ALL" && p.approvalStatus !== filters.approvalStatus) {
          return false;
        }

        // Verification status
        if (
          filters.verificationStatus !== "ALL" &&
          p.verificationStatus !== filters.verificationStatus
        ) {
          return false;
        }

        // Category
        if (filters.category !== "ALL" && p.category !== filters.category) {
          return false;
        }

        // Visibility
        if (filters.visibility !== "ALL" && p.profileVisibility !== filters.visibility) {
          return false;
        }

        // Featured
        if (filters.isFeatured === "FEATURED" && !p.isFeatured) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "fullName") {
          return a.fullName.localeCompare(b.fullName);
        }
        if (filters.sortBy === "profileCompletion") {
          return b.profileCompletion - a.profileCompletion;
        }
        if (filters.sortBy === "submittedAt") {
          return b.submittedAt.localeCompare(a.submittedAt);
        }
        return b.lastUpdated.localeCompare(a.lastUpdated);
      });
  }, [profiles, filters]);

  // Paginated slice
  const paginatedProfiles = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredProfiles.slice(start, start + filters.pageSize);
  }, [filteredProfiles, filters.page, filters.pageSize]);

  // Bulk Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedProfiles.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Review Execution
  const handleConfirmReview = (
    action: ReviewDialogAction,
    payload: { reason?: string; internalNote?: string; changesRequested?: string }
  ) => {
    if (!reviewTarget) return;
    const target = reviewTarget.profile;

    let updatedStatus = target.approvalStatus;
    let isFeatured = target.isFeatured;
    let toast = "";

    switch (action) {
      case "APPROVE":
        updatedStatus = "PUBLISHED";
        toast = `Profile for ${target.fullName} approved and published live!`;
        break;
      case "REJECT":
        updatedStatus = "REJECTED";
        toast = `Profile for ${target.fullName} rejected. Reason recorded.`;
        break;
      case "REQUEST_CHANGES":
        updatedStatus = "CHANGES_REQUESTED";
        toast = `Modifications requested from ${target.fullName}.`;
        break;
      case "SUSPEND":
        updatedStatus = "SUSPENDED";
        toast = `Profile for ${target.fullName} suspended.`;
        break;
      case "RESTORE":
        updatedStatus = "PUBLISHED";
        toast = `Profile for ${target.fullName} restored to published status.`;
        break;
      case "TOGGLE_FEATURED":
        isFeatured = !target.isFeatured;
        toast = isFeatured
          ? `Added ${target.fullName} to featured spotlights!`
          : `Removed ${target.fullName} from featured spotlights.`;
        break;
    }

    setProfiles((prev) =>
      prev.map((p) =>
        p.id === target.id
          ? {
              ...p,
              approvalStatus: updatedStatus,
              isFeatured,
              rejectionReason: payload.reason || p.rejectionReason,
              changesRequestedNote: payload.changesRequested || p.changesRequestedNote,
              internalNotes: payload.internalNote || p.internalNotes,
              lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : p
      )
    );

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
        <span className="font-semibold text-gray-900 dark:text-white">Profile Management</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Member Profile Management
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Audit, review, approve, and spotlight public artisan and professional profiles
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/profiles/pending"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 rounded-xl transition-colors border border-amber-200 dark:border-amber-800 shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review (142)</span>
          </Link>

          <Link
            href="/admin/profiles/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#5B46F6]" />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/profiles/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 rounded-xl transition-colors border border-red-200 dark:border-red-800 shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Reports & Flags (18)</span>
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-xs"
            title="Refresh Directory Cache"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#5B46F6]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Simulated Profile Repository: </span>
          {DEMO_PROFILES_DISCLAIMER}
        </div>
      </div>

      {/* KPI Cards */}
      <ProfileKpiCards
        kpis={DEMO_PROFILE_KPIS}
        activeFilter={filters.approvalStatus}
        onFilterSelect={(status) => handleFilterChange({ approvalStatus: status, page: 1 })}
      />

      {/* Table Toolbar */}
      <ProfileTableToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={filteredProfiles.length}
      />

      {/* Main Table */}
      <ProfileTable
        profiles={paginatedProfiles}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onOpenReview={(p, action) => setReviewTarget({ profile: p, action })}
        onOpenPreview={(p) => setPreviewTarget(p)}
        page={filters.page}
        pageSize={filters.pageSize}
        totalItems={filteredProfiles.length}
        onPageChange={(p) => handleFilterChange({ page: p })}
      />

      {/* Review Dialog */}
      <ProfileReviewDialog
        isOpen={reviewTarget !== null}
        action={reviewTarget?.action || null}
        profile={reviewTarget?.profile || null}
        onClose={() => setReviewTarget(null)}
        onConfirm={handleConfirmReview}
      />

      {/* Visual Preview Modal */}
      <ProfilePreviewDialog
        isOpen={previewTarget !== null}
        onClose={() => setPreviewTarget(null)}
        profile={previewTarget}
      />
    </div>
  );
}
