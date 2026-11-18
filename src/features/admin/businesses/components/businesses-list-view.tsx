"use client";

import React, { useState, useMemo } from "react";
import type { AdminBusinessItem, BusinessApprovalStatus, BusinessKpiData } from "../types/admin-business.ts";
import { BusinessKpiCards } from "./business-kpi-cards.tsx";
import { BusinessTableToolbar } from "./business-table-toolbar.tsx";
import { BusinessTable } from "./business-table.tsx";
import { BusinessReviewDialog } from "./business-review-dialog.tsx";
import { calculateBusinessKpis } from "../data/admin-businesses-data.ts";
import { CheckCircle2 } from "lucide-react";

interface BusinessesListViewProps {
  initialBusinesses: AdminBusinessItem[];
  initialKpis: BusinessKpiData;
}

export function BusinessesListView({
  initialBusinesses,
  initialKpis,
}: BusinessesListViewProps) {
  const [businesses, setBusinesses] = useState<AdminBusinessItem[]>(initialBusinesses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewingBusiness, setReviewingBusiness] = useState<AdminBusinessItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered list
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query);
        const matchesCode = b.businessCode.toLowerCase().includes(query);
        const matchesOwner = b.ownerName.toLowerCase().includes(query);
        const matchesCity = b.location.city.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesOwner && !matchesCity) return false;
      }
      // Status
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      // Verification
      if (verificationFilter !== "ALL" && b.verificationStatus !== verificationFilter) return false;
      // Category
      if (categoryFilter !== "ALL" && b.category !== categoryFilter) return false;

      return true;
    });
  }, [businesses, search, statusFilter, verificationFilter, categoryFilter]);

  // Paginated list
  const paginatedBusinesses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBusinesses.slice(start, start + pageSize);
  }, [filteredBusinesses, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / pageSize));

  // Recalculate KPIs
  const currentKpis = useMemo(() => {
    return calculateBusinessKpis(businesses);
  }, [businesses]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedBusinesses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBusinesses.map((b) => b.id));
    }
  };

  const handleBulkApprove = () => {
    setBusinesses((prev) =>
      prev.map((b) =>
        selectedIds.includes(b.id)
          ? { ...b, status: "APPROVED", approvedAt: new Date().toISOString(), approvedBy: "Admin Sadia Rahman" }
          : b
      )
    );
    setToastMessage(`Successfully approved ${selectedIds.length} businesses.`);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBulkReject = () => {
    setBusinesses((prev) =>
      prev.map((b) =>
        selectedIds.includes(b.id)
          ? { ...b, status: "REJECTED", rejectionReason: "Bulk administrative decline" }
          : b
      )
    );
    setToastMessage(`Marked ${selectedIds.length} businesses as rejected.`);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(null), 3000);
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
              suspensionReason: action === "SUSPENDED" ? rejectionReason : undefined,
              approvedAt: action === "APPROVED" ? new Date().toISOString() : b.approvedAt,
              approvedBy: action === "APPROVED" ? "Admin Sadia Rahman" : b.approvedBy,
            }
          : b
      )
    );
    setToastMessage(`Business status updated to ${action}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFeatured = (biz: AdminBusinessItem) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === biz.id ? { ...b, isFeatured: !b.isFeatured, featuredOrder: !b.isFeatured ? 1 : undefined } : b
      )
    );
    setToastMessage(biz.isFeatured ? "Removed from featured spotlights" : "Marked as featured business!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCsv = () => {
    const csvContent = [
      ["Business Code", "Name", "Category", "Type", "Status", "Owner", "Products", "Revenue (BDT)"].join(","),
      ...filteredBusinesses.map((b) =>
        [
          `"${b.businessCode}"`,
          `"${b.name}"`,
          `"${b.category}"`,
          `"${b.businessType}"`,
          `"${b.status}"`,
          `"${b.ownerName}"`,
          b.productCount,
          b.totalRevenueBDT,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bdsisters-businesses-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setVerificationFilter("ALL");
    setCategoryFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <BusinessKpiCards kpis={currentKpis} />

      {/* Filter Toolbar */}
      <BusinessTableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => {
          setStatusFilter(v);
          setCurrentPage(1);
        }}
        verificationFilter={verificationFilter}
        onVerificationFilterChange={(v) => {
          setVerificationFilter(v);
          setCurrentPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(v) => {
          setCategoryFilter(v);
          setCurrentPage(1);
        }}
        selectedCount={selectedIds.length}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        onExportCsv={handleExportCsv}
        onResetFilters={handleResetFilters}
      />

      {/* Business Table */}
      <BusinessTable
        businesses={paginatedBusinesses}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onOpenReviewDialog={(biz) => setReviewingBusiness(biz)}
        onToggleFeatured={handleToggleFeatured}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 text-xs text-gray-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredBusinesses.length)} of {filteredBusinesses.length} businesses
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-2 font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
