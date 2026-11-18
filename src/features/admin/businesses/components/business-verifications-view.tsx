"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowLeft,
  Building2,
  CalendarDays,
  X,
} from "lucide-react";

import type { BusinessVerificationRecord } from "../types/admin-business.ts";
import { DEMO_BUSINESS_VERIFICATIONS } from "../data/admin-business-verifications-data.ts";
import { BusinessVerificationBadge } from "./business-status-badges.tsx";

export function BusinessVerificationsView() {
  const [verifications, setVerifications] = useState<BusinessVerificationRecord[]>(
    DEMO_BUSINESS_VERIFICATIONS
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredVerifications = verifications.filter((v) => {
    if (statusFilter !== "ALL" && v.status !== statusFilter) return false;

    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      v.businessName.toLowerCase().includes(query) ||
      v.businessCode.toLowerCase().includes(query) ||
      v.documentNumber.toLowerCase().includes(query) ||
      v.ownerName.toLowerCase().includes(query)
    );
  });

  const verifiedCount = verifications.filter(
    (v) => v.status === "VERIFIED"
  ).length;

  const pendingCount = verifications.filter(
    (v) => v.status === "PENDING"
  ).length;

  const handleToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickApprove = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
            ...v,
            status: "VERIFIED",
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Admin Sadia Rahman",
            reviewerNotes: "Trade license and documentation validated.",
          }
          : v
      )
    );

    handleToast("Verification document marked as VERIFIED.");
  };

  const handleQuickReject = (id: string) => {
    const reason = window.prompt(
      "Enter rejection reason for this verification submission:"
    );

    if (!reason?.trim()) return;

    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
            ...v,
            status: "REJECTED",
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Admin Sadia Rahman",
            rejectionReason: reason.trim(),
          }
          : v
      )
    );

    handleToast("Verification submission marked as REJECTED.");
  };

  return (
    <div className="min-w-0 space-y-5">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div className="min-w-0 space-y-2">

          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Businesses
          </Link>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Business Verifications
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">
              Review trade licenses, TIN certificates and business
              registration documents submitted by members.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />

            <div className="">
              <p className="text-sm font-semibold leading-none text-gray-900">
                {verifiedCount}
              </p>
              <p className="mt-1 text-[10px] font-medium text-gray-500">
                Verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <FileText className="h-4 w-4 text-amber-600" />

            <div>
              <p className="text-sm font-semibold leading-none text-gray-900">
                {pendingCount}
              </p>
              <p className="mt-1 text-[10px] font-medium text-gray-500">
                Pending
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= TOAST ================= */}

      {toastMessage && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

            <span className="text-xs font-medium text-emerald-800">
              {toastMessage}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-md p-1 text-emerald-600 hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ================= SEARCH & FILTER ================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* Search */}
          <div className="relative min-w-0 flex-1">

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search businesses, owners or documents..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/70 pl-9 pr-9 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#5B46F6] focus:bg-white focus:ring-2 focus:ring-[#5B46F6]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 sm:w-auto">

            <label
              htmlFor="verification-status"
              className="shrink-0 text-xs font-medium text-gray-500"
            >
              Status
            </label>

            <select
              id="verification-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-[#5B46F6] sm:w-44 sm:flex-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

        </div>

        {/* Results Information */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">

          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredVerifications.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {verifications.length}
            </span>{" "}
            records
          </p>

          {(search || statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="text-xs font-semibold text-[#5B46F6] hover:underline"
            >
              Clear filters
            </button>
          )}

        </div>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}

      <div className="space-y-3 lg:hidden">

        {filteredVerifications.length > 0 ? (
          filteredVerifications.map((v) => (
            <article
              key={v.id}
              className="rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
            >

              {/* Business */}
              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                  <Building2 className="h-5 w-5 text-gray-500" />
                </div>

                <div className="min-w-0 flex-1">

                  <Link
                    href={`/admin/businesses/${v.businessId}`}
                    className="block truncate text-sm font-semibold text-gray-900 hover:text-[#5B46F6]"
                  >
                    {v.businessName}
                  </Link>

                  <p className="mt-1 truncate font-mono text-[11px] text-gray-400">
                    {v.businessCode}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    Owner: {v.ownerName}
                  </p>
                </div>

                <div className="shrink-0">
                  <BusinessVerificationBadge status={v.status} size="sm" />
                </div>

              </div>

              {/* Document Details */}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-gray-100 pt-4">

                <div className="min-w-0">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Document Type
                  </p>

                  <div className="flex items-start gap-1.5">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5B46F6]" />

                    <span className="text-xs font-medium leading-5 text-gray-800">
                      {v.documentType.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Document Number
                  </p>

                  <p className="break-all font-mono text-xs font-medium text-gray-700">
                    {v.documentNumber}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Issuing Authority
                  </p>

                  <p className="text-xs leading-5 text-gray-700">
                    {v.issuingAuthority || "Bangladesh Authority"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Submission Date
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                    <span className="whitespace-nowrap">
                      {new Date(v.submissionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {v.expiryDate && (
                  <div className="col-span-2">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Expiry Date
                    </p>

                    <p className="text-xs text-gray-700">
                      {v.expiryDate}
                    </p>
                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">

                <Link
                  href={`/admin/businesses/verifications/${v.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#5B46F6]"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Link>

                <div className="flex items-center gap-2">

                  {v.status !== "VERIFIED" && (
                    <button
                      type="button"
                      onClick={() => handleQuickApprove(v.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </button>
                  )}

                  {v.status !== "REJECTED" && (
                    <button
                      type="button"
                      onClick={() => handleQuickReject(v.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  )}

                </div>
              </div>

            </article>
          ))
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">

            <FileText className="mx-auto h-9 w-9 text-gray-300" />

            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              No verification records found
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Try changing your search or status filter.
            </p>

          </div>
        )}

      </div>

      {/* ================= DESKTOP TABLE ================= */}

      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white lg:block">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] border-collapse text-left">

            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70">

                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-gray-600">
                  Business & Owner
                </th>

                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-gray-600">
                  Document
                </th>

                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-gray-600">
                  Document Number
                </th>

                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-gray-600">
                  Authority
                </th>

                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-gray-600">
                  Status
                </th>

                <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-gray-600">
                  Submitted
                </th>

                <th className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-semibold text-gray-600">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredVerifications.map((v) => (
                <tr
                  key={v.id}
                  className="transition-colors hover:bg-gray-50/70"
                >

                  {/* Business */}
                  <td className="max-w-[240px] px-5 py-4">

                    <Link
                      href={`/admin/businesses/${v.businessId}`}
                      className="block truncate text-sm font-semibold text-gray-900 transition-colors hover:text-[#5B46F6]"
                      title={v.businessName}
                    >
                      {v.businessName}
                    </Link>

                    <p className="mt-1 truncate font-mono text-[11px] text-gray-400">
                      {v.businessCode}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {v.ownerName}
                    </p>

                  </td>

                  {/* Document */}
                  <td className="max-w-[190px] px-5 py-4">

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-[#5B46F6]" />

                      <span className="truncate text-xs font-medium text-gray-800">
                        {v.documentType.replace(/_/g, " ")}
                      </span>
                    </div>

                    <span className="ml-6 mt-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      Watermarked Specimen
                    </span>

                  </td>

                  {/* Document Number */}
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-medium text-gray-700">
                    {v.documentNumber}
                  </td>

                  {/* Authority */}
                  <td className="max-w-[180px] px-5 py-4">

                    <p className="truncate text-xs text-gray-700">
                      {v.issuingAuthority || "Bangladesh Authority"}
                    </p>

                    {v.expiryDate && (
                      <p className="mt-1 whitespace-nowrap text-[11px] text-gray-400">
                        Expires: {v.expiryDate}
                      </p>
                    )}

                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <BusinessVerificationBadge
                      status={v.status}
                      size="sm"
                    />
                  </td>

                  {/* Submission Date */}
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-600">
                    {new Date(v.submissionDate).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-5 py-4">

                    <div className="flex items-center justify-end gap-1">

                      <Link
                        href={`/admin/businesses/verifications/${v.id}`}
                        title="View document details"
                        aria-label="View document details"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#5B46F6]"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      {v.status !== "VERIFIED" && (
                        <button
                          type="button"
                          onClick={() => handleQuickApprove(v.id)}
                          title="Quick approve"
                          aria-label="Approve verification"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}

                      {v.status !== "REJECTED" && (
                        <button
                          type="button"
                          onClick={() => handleQuickReject(v.id)}
                          title="Reject verification"
                          aria-label="Reject verification"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {/* Desktop Empty State */}
          {filteredVerifications.length === 0 && (
            <div className="px-5 py-16 text-center">

              <FileText className="mx-auto h-9 w-9 text-gray-300" />

              <h3 className="mt-3 text-sm font-semibold text-gray-900">
                No verification records found
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}