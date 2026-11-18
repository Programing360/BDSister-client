"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminBusinessItem, BusinessApprovalStatus } from "../types/admin-business.ts";
import { BusinessTable } from "./business-table.tsx";
import { BusinessReviewDialog } from "./business-review-dialog.tsx";
import { CheckCircle2, ArrowLeft, Star } from "lucide-react";

export function BusinessesApprovedView({ initialBusinesses }: { initialBusinesses: AdminBusinessItem[] }) {
  const [businesses, setBusinesses] = useState<AdminBusinessItem[]>(
    initialBusinesses.filter((b) => b.status === "APPROVED")
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewingBusiness, setReviewingBusiness] = useState<AdminBusinessItem | null>(null);

  const handleToggleFeatured = (biz: AdminBusinessItem) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === biz.id ? { ...b, isFeatured: !b.isFeatured } : b))
    );
  };

  const handleSaveReview = (
    businessId: string,
    action: BusinessApprovalStatus,
    notes: string,
    rejectionReason?: string
  ) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? {
              ...b,
              status: action,
              moderationNotes: notes || b.moderationNotes,
              rejectionReason: action === "REJECTED" ? rejectionReason : undefined,
            }
          : b
      )
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Businesses</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Approved & Live Businesses</h1>
          <p className="text-xs text-gray-500">
            Active verified enterprises currently operational on the BDSisters marketplace and community directory.
          </p>
        </div>
        <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{businesses.length} Active Businesses</span>
        </div>
      </div>

      <BusinessTable
        businesses={businesses}
        selectedIds={selectedIds}
        onToggleSelect={(id) =>
          setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
        }
        onSelectAll={() =>
          setSelectedIds((prev) => (prev.length === businesses.length ? [] : businesses.map((b) => b.id)))
        }
        onOpenReviewDialog={(biz) => setReviewingBusiness(biz)}
        onToggleFeatured={handleToggleFeatured}
      />

      <BusinessReviewDialog
        business={reviewingBusiness}
        isOpen={!!reviewingBusiness}
        onClose={() => setReviewingBusiness(null)}
        onSaveAction={handleSaveReview}
      />
    </div>
  );
}
