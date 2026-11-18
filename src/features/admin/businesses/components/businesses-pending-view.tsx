"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminBusinessItem, BusinessApprovalStatus } from "../types/admin-business.ts";
import { BusinessTable } from "./business-table.tsx";
import { BusinessReviewDialog } from "./business-review-dialog.tsx";
import { Clock, AlertTriangle, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

interface BusinessesPendingViewProps {
  initialBusinesses: AdminBusinessItem[];
}

export function BusinessesPendingView({ initialBusinesses }: BusinessesPendingViewProps) {
  const [businesses, setBusinesses] = useState<AdminBusinessItem[]>(
    initialBusinesses.filter((b) => b.status === "PENDING_REVIEW" || b.status === "UNDER_REVIEW")
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewingBusiness, setReviewingBusiness] = useState<AdminBusinessItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const urgentCount = businesses.filter((b) => b.reviewPriority === "URGENT").length;
  const highCount = businesses.filter((b) => b.reviewPriority === "HIGH").length;

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === businesses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(businesses.map((b) => b.id));
    }
  };

  const handleSaveReview = (
    businessId: string,
    action: BusinessApprovalStatus,
    notes: string,
    rejectionReason?: string
  ) => {
    // If approved or rejected, remove from pending queue
    setBusinesses((prev) =>
      prev.filter((b) => b.id !== businessId)
    );
    setToastMessage(`Business reviewed and updated to ${action}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Businesses</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Pending Business Approvals Queue</h1>
          <p className="text-xs text-gray-500">
            Review new sister enterprise submissions, check trade licenses and eligibility before public activation.
          </p>
        </div>

        {/* Priority Counts */}
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>{urgentCount} Urgent Priority</span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{highCount} High Priority</span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <BusinessTable
        businesses={businesses}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onOpenReviewDialog={(biz) => setReviewingBusiness(biz)}
      />

      {/* Review Dialog */}
      <BusinessReviewDialog
        business={reviewingBusiness}
        isOpen={!!reviewingBusiness}
        onClose={() => setReviewingBusiness(null)}
        onSaveAction={handleSaveReview}
      />
    </div>
  );
}
