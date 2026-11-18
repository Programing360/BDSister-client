"use client";

import React from "react";
import { Search, Filter, X, Download, Plus } from "lucide-react";
import Link from "next/link";
import { INITIAL_BUSINESS_CATEGORIES } from "../constants/business-categories.ts";

interface BusinessTableToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  verificationFilter: string;
  onVerificationFilterChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  selectedCount: number;
  onBulkApprove?: () => void;
  onBulkReject?: () => void;
  onExportCsv?: () => void;
  onResetFilters: () => void;
}

export function BusinessTableToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  verificationFilter,
  onVerificationFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onExportCsv,
  onResetFilters,
}: BusinessTableToolbarProps) {
  const hasActiveFilters = search || statusFilter !== "ALL" || verificationFilter !== "ALL" || categoryFilter !== "ALL";

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by business name, code, owner or city..."
            className="w-full pl-9 pr-3.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] text-gray-900 placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-2 bg-[#EAE6F7] text-[#5B46F6] px-3 py-1.5 rounded-lg text-xs font-medium">
              <span>{selectedCount} selected</span>
              {onBulkApprove && (
                <button
                  onClick={onBulkApprove}
                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
                >
                  Approve
                </button>
              )}
              {onBulkReject && (
                <button
                  onClick={onBulkReject}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors"
                >
                  Reject
                </button>
              )}
            </div>
          ) : null}

          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Export CSV</span>
            </button>
          )}

          <Link
            href="/admin/businesses/verifications"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#5B46F6] hover:bg-[#4f3ad8] rounded-lg transition-colors shadow-xs"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Verifications</span>
          </Link>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2.5 flex-wrap pt-1 border-t border-gray-100 text-xs">
        <span className="text-gray-400 font-medium">Filters:</span>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B46F6] text-gray-700"
        >
          <option value="ALL">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="REJECTED">Rejected</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="DRAFT">Draft</option>
        </select>

        {/* Verification */}
        <select
          value={verificationFilter}
          onChange={(e) => onVerificationFilterChange(e.target.value)}
          className="px-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B46F6] text-gray-700"
        >
          <option value="ALL">All Verifications</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending Review</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="REJECTED">Rejected</option>
          <option value="NOT_SUBMITTED">Not Submitted</option>
        </select>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B46F6] text-gray-700 max-w-xs truncate"
        >
          <option value="ALL">All Categories</option>
          {INITIAL_BUSINESS_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
