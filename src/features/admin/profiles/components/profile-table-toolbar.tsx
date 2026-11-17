"use client";

import React from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import type {
  ProfileFilterState,
  ProfileApprovalStatus,
  ProfileVerificationBadge,
  ProfileVisibility,
} from "../types/admin-profile";
import { DEMO_PROFILE_CATEGORIES } from "../constants/profile-categories";

interface ProfileTableToolbarProps {
  filters: ProfileFilterState;
  onFilterChange: (filters: Partial<ProfileFilterState>) => void;
  onReset: () => void;
  totalFiltered: number;
}

export function ProfileTableToolbar({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
}: ProfileTableToolbarProps) {
  const isFiltered =
    filters.query !== "" ||
    filters.approvalStatus !== "ALL" ||
    filters.verificationStatus !== "ALL" ||
    filters.category !== "ALL" ||
    filters.visibility !== "ALL" ||
    filters.isFeatured !== "ALL";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value, page: 1 })}
            placeholder="Search by sister name, email, profession, or BDS-MEM ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Approval Status Filter */}
          <select
            value={filters.approvalStatus}
            onChange={(e) =>
              onFilterChange({
                approvalStatus: e.target.value as "ALL" | ProfileApprovalStatus,
                page: 1,
              })
            }
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6]"
          >
            <option value="ALL">All Approvals</option>
            <option value="PUBLISHED">Published Live</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6]"
          >
            <option value="ALL">All Categories</option>
            {DEMO_PROFILE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Visibility Filter */}
          <select
            value={filters.visibility}
            onChange={(e) =>
              onFilterChange({
                visibility: e.target.value as "ALL" | ProfileVisibility,
                page: 1,
              })
            }
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6]"
          >
            <option value="ALL">All Visibility</option>
            <option value="PUBLIC">Public</option>
            <option value="MEMBERS_ONLY">Members Only</option>
            <option value="PRIVATE">Private</option>
          </select>

          {/* Verification Badge Filter */}
          <select
            value={filters.verificationStatus}
            onChange={(e) =>
              onFilterChange({
                verificationStatus: e.target.value as "ALL" | ProfileVerificationBadge,
                page: 1,
              })
            }
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6]"
          >
            <option value="ALL">All Verification</option>
            <option value="VERIFIED">NID Verified</option>
            <option value="PENDING">In Review</option>
            <option value="NOT_SUBMITTED">Unverified</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Featured Status Filter */}
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                isFeatured:
                  filters.isFeatured === "FEATURED"
                    ? "ALL"
                    : "FEATURED",
                page: 1,
              })
            }
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              filters.isFeatured === "FEATURED"
                ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700"
                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured Only</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Counter summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800/80">
        <span>
          Showing <span className="font-semibold text-gray-900 dark:text-white">{totalFiltered}</span> matching profile profiles
        </span>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as ProfileFilterState["sortBy"],
              })
            }
            className="text-xs bg-transparent font-semibold text-gray-700 dark:text-gray-300 border-0 focus:outline-hidden cursor-pointer"
          >
            <option value="lastUpdated">Last Updated</option>
            <option value="submittedAt">Submission Date</option>
            <option value="fullName">Full Name</option>
            <option value="profileCompletion">Completion %</option>
          </select>
        </div>
      </div>
    </div>
  );
}
