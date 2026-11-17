"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  UserCheck,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { AdminVerificationSubmission } from "../types/admin-verification";
import { IdentityVerificationBadge } from "@/features/admin/members/components/member-status-badges";

interface VerificationTableProps {
  submissions: AdminVerificationSubmission[];
  initialStatusFilter?: string;
  onRefresh?: () => void;
}

export function VerificationTable({
  submissions,
  initialStatusFilter = "ALL",
}: VerificationTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [documentTypeFilter, setDocumentTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = item.memberName.toLowerCase().includes(q);
        const matchesEmail = item.memberEmail.toLowerCase().includes(q);
        const matchesSubId = item.submissionId.toLowerCase().includes(q);
        const matchesMemId = item.memberId.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesSubId && !matchesMemId) return false;
      }

      // Status
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      // Document Type
      if (documentTypeFilter !== "ALL" && item.documentType !== documentTypeFilter) {
        return false;
      }

      return true;
    });
  }, [submissions, query, statusFilter, documentTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, page, pageSize]);

  const handleReset = () => {
    setQuery("");
    setStatusFilter("ALL");
    setDocumentTypeFilter("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by sister name, email, or submission ID..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#5B46F6] transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
            >
              <option value="ALL">Status: All Submissions</option>
              <option value="PENDING">Pending Review</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Document Type */}
            <select
              value={documentTypeFilter}
              onChange={(e) => {
                setDocumentTypeFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
            >
              <option value="ALL">Document: All Types</option>
              <option value="NATIONAL_ID">National ID (NID)</option>
              <option value="PASSPORT">Passport</option>
            </select>

            {/* Reset */}
            {(query || statusFilter !== "ALL" || documentTypeFilter !== "ALL") && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
          <span>
            Showing <strong className="text-gray-900 dark:text-white font-mono">{filteredSubmissions.length}</strong> verification requests
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4">Member Information</th>
                <th className="py-3 px-4">Submission & Priority</th>
                <th className="py-3 px-4">Document Details</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Auditor</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-gray-700 dark:text-gray-200">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <AlertCircle className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      No verification submissions match your criteria.
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Try adjusting filters or clearing your search term.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition group"
                  >
                    {/* Member Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#5B46F6] to-[#7366F7] flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {item.memberName.charAt(0)}
                        </div>
                        <div>
                          <Link
                            href={`/admin/members/${item.memberId}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-[#5B46F6] transition"
                          >
                            {item.memberName}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                            <span className="font-mono text-indigo-600 dark:text-indigo-400">{item.memberId}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{item.memberLocation}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Submission ID & Priority */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="font-mono font-semibold text-gray-900 dark:text-white block">
                          {item.submissionId}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.submittedAt}
                          </span>
                          {item.isUrgent && (
                            <span className="px-1.5 py-0.2 rounded-sm bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-[10px] font-bold">
                              URGENT
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Document Details */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.documentType === "NATIONAL_ID" ? "National ID (NID)" : "Passport"}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-gray-500 block">
                          {item.documentNumberMasked}
                        </span>
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-4">
                      <IdentityVerificationBadge status={item.status} />
                    </td>

                    {/* Auditor */}
                    <td className="py-3.5 px-4">
                      {item.assignedReviewer ? (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {item.assignedReviewer.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">Unassigned</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/verifications/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-2xs"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Page <strong className="text-gray-900 dark:text-white">{page}</strong> of{" "}
              <strong className="text-gray-900 dark:text-white">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
