"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  AdminSellerItem,
  SellerKpiData,
  SellerApprovalStatus,
} from "../types/admin-seller.ts";

import { SellerKpiCards } from "./seller-kpi-cards.tsx";

import {
  SellerStatusBadge,
  SellerVerificationBadge,
  SellerTypeBadge,
} from "./seller-status-badges.tsx";

import { calculateSellerKpis } from "../data/admin-sellers-data.ts";

import {
  Users,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Star,
  ShoppingBag,
  CreditCard,
  Download,
  X,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

interface SellersListViewProps {
  initialSellers: AdminSellerItem[];
  initialKpis: SellerKpiData;
}

const inputClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/10";

const selectClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/10";

function formatCurrency(amount: number) {
  return `৳${(amount / 1000).toLocaleString()}k`;
}

function escapeCsvValue(value: string | number) {
  const text = String(value ?? "");

  // Prevent spreadsheet formula injection.
  const safeText = /^[\s]*[=+\-@]/.test(text)
    ? `'${text}`
    : text;

  return `"${safeText.replace(/"/g, '""')}"`;
}

/* -------------------------------------------------------------------------- */
/* Seller Identity                                                            */
/* -------------------------------------------------------------------------- */

function SellerIdentity({
  seller,
}: {
  seller: AdminSellerItem;
}) {
  return (
    <div className="flex w-full min-w-0 items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start gap-1.5">
          <Link
            href={`/admin/sellers/${seller.id}`}
            className="block min-w-0 break-words text-sm font-semibold text-gray-900 transition-colors hover:text-[#5B46F6]"
          >
            {seller.shopName}
          </Link>

          {seller.isTopSeller && (
            <span
              title="Top Seller"
              className="shrink-0"
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            </span>
          )}
        </div>

        <p className="mt-1 break-all font-mono text-xs text-gray-400">
          {seller.sellerCode}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Seller Action Buttons                                                      */
/* -------------------------------------------------------------------------- */

function SellerActionButtons({
  seller,
  onUpdateStatus,
}: {
  seller: AdminSellerItem;
  onUpdateStatus: (
    sellerId: string,
    status: SellerApprovalStatus
  ) => void;
}) {
  const handleSuspend = () => {
    const confirmed = window.confirm(
      `Are you sure you want to suspend ${seller.shopName}?`
    );

    if (confirmed) {
      onUpdateStatus(seller.id, "SUSPENDED");
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <Link
        href={`/admin/sellers/${seller.id}`}
        title="View Seller"
        aria-label={`View ${seller.shopName}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <Eye className="h-4 w-4" />
      </Link>

      {seller.status !== "APPROVED" && (
        <button
          type="button"
          onClick={() => onUpdateStatus(seller.id, "APPROVED")}
          title="Approve Seller"
          aria-label={`Approve ${seller.shopName}`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
      )}

      {seller.status !== "SUSPENDED" && (
        <button
          type="button"
          onClick={handleSuspend}
          title="Suspend Seller"
          aria-label={`Suspend ${seller.shopName}`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-amber-600 transition-colors hover:bg-amber-50"
        >
          <AlertTriangle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Seller Card                                                         */
/* -------------------------------------------------------------------------- */

function SellerMobileCard({
  seller,
  onUpdateStatus,
}: {
  seller: AdminSellerItem;
  onUpdateStatus: (
    sellerId: string,
    status: SellerApprovalStatus
  ) => void;
}) {
  return (
    <article className="min-w-0 rounded-xl border border-gray-200 bg-white p-4">
      {/* Seller Identity */}
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <SellerIdentity seller={seller} />
        </div>

        {seller.isTopSeller && (
          <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
            Top Seller
          </span>
        )}
      </div>

      {/* Status */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SellerStatusBadge status={seller.status} size="sm" />

        <SellerVerificationBadge
          status={seller.verificationStatus}
        />

        <SellerTypeBadge type={seller.sellerType} />
      </div>

      {/* Member Details */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-400">
          Seller / Member
        </p>

        <Link
          href={`/admin/members/${seller.memberId}`}
          className="mt-1 block break-words text-sm font-medium text-gray-800 hover:text-[#5B46F6]"
        >
          {seller.memberName}
        </Link>

        <p className="mt-1 break-all text-xs text-gray-500">
          {seller.memberId}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {seller.memberPhone}
        </p>
      </div>

      {/* Associated Business */}
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-400">
          Associated Business
        </p>

        {seller.businessId ? (
          <Link
            href={`/admin/businesses/${seller.businessId}`}
            className="mt-1 block break-words text-sm font-medium text-gray-800 hover:text-[#5B46F6]"
          >
            {seller.businessName || "View Business"}
          </Link>
        ) : (
          <p className="mt-1 text-sm text-gray-500">
            Individual Seller
          </p>
        )}

        {seller.businessCode && (
          <p className="mt-1 break-all font-mono text-xs text-gray-400">
            {seller.businessCode}
          </p>
        )}
      </div>

      {/* Seller Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-400">
            Products
          </p>

          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            {seller.productCount}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">
            Gross Merchandise Value
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-gray-900">
            {formatCurrency(seller.totalEarningsBDT)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">
            Payout Account
          </p>

          <p className="mt-1 break-words text-sm font-medium text-gray-800">
            {seller.payoutAccountType}
          </p>

          <p className="mt-1 break-all font-mono text-xs text-gray-400">
            {seller.payoutAccountNumber}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">
            Rating
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            {seller.rating > 0 ? (
              <>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />

                <span className="text-sm font-semibold text-gray-900">
                  {seller.rating.toFixed(1)}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400">
                No rating
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <Link
          href={`/admin/sellers/${seller.id}`}
          className="inline-flex min-w-0 items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          View Details
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Link>

        <SellerActionButtons
          seller={seller}
          onUpdateStatus={onUpdateStatus}
        />
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Sellers List View                                                     */
/* -------------------------------------------------------------------------- */

export function SellersListView({
  initialSellers,
  initialKpis,
}: SellersListViewProps) {
  const [sellers, setSellers] =
    useState<AdminSellerItem[]>(initialSellers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState("ALL");
  const [sellerTypeFilter, setSellerTypeFilter] = useState("ALL");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* KPI Calculation                                                          */
  /* ------------------------------------------------------------------------ */

  const currentKpis = useMemo(
    () =>
      sellers === initialSellers
        ? initialKpis
        : calculateSellerKpis(sellers),
    [sellers, initialSellers, initialKpis]
  );

  /* ------------------------------------------------------------------------ */
  /* Filtering                                                                */
  /* ------------------------------------------------------------------------ */

  const filteredSellers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sellers.filter((seller) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        seller.status === statusFilter;

      const matchesVerification =
        verificationFilter === "ALL" ||
        seller.verificationStatus === verificationFilter;

      const matchesSellerType =
        sellerTypeFilter === "ALL" ||
        seller.sellerType === sellerTypeFilter;

      const matchesSearch =
        !query ||
        [
          seller.memberName,
          seller.shopName,
          seller.sellerCode,
          seller.memberId,
          seller.memberPhone,
          seller.businessName,
          seller.businessCode,
        ].some((value) =>
          value?.toLowerCase().includes(query)
        );

      return (
        matchesStatus &&
        matchesVerification &&
        matchesSellerType &&
        matchesSearch
      );
    });
  }, [
    sellers,
    search,
    statusFilter,
    verificationFilter,
    sellerTypeFilter,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    verificationFilter !== "ALL" ||
    sellerTypeFilter !== "ALL";

  /* ------------------------------------------------------------------------ */
  /* Toast                                                                    */
  /* ------------------------------------------------------------------------ */

  const showToast = (message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToastMessage(message);

    toastTimer.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /* ------------------------------------------------------------------------ */
  /* Seller Status Update                                                     */
  /* ------------------------------------------------------------------------ */

  const handleUpdateStatus = (
    sellerId: string,
    status: SellerApprovalStatus
  ) => {
    setSellers((previousSellers) =>
      previousSellers.map((seller) =>
        seller.id === sellerId
          ? {
            ...seller,
            status,
            approvedAt:
              status === "APPROVED"
                ? new Date().toISOString()
                : seller.approvedAt,
            approvedBy:
              status === "APPROVED"
                ? "Admin Sadia Rahman"
                : seller.approvedBy,
            suspendedAt:
              status === "SUSPENDED"
                ? new Date().toISOString()
                : undefined,
          }
          : seller
      )
    );

    showToast(
      `Seller status updated to ${status.replace("_", " ")}.`
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Reset Filters                                                            */
  /* ------------------------------------------------------------------------ */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setVerificationFilter("ALL");
    setSellerTypeFilter("ALL");
  };

  /* ------------------------------------------------------------------------ */
  /* CSV Export                                                               */
  /* ------------------------------------------------------------------------ */

  const handleExportCsv = () => {
    if (filteredSellers.length === 0) {
      showToast("There are no sellers to export.");
      return;
    }

    const headers = [
      "Seller Code",
      "Shop Name",
      "Member Name",
      "Member ID",
      "Member Phone",
      "Business Name",
      "Business Code",
      "Seller Type",
      "Status",
      "Verification Status",
      "Products",
      "Earnings (BDT)",
      "Commission %",
      "Payout Account Type",
      "Payout Account Number",
      "Rating",
    ];

    const rows = filteredSellers.map((seller) => [
      seller.sellerCode,
      seller.shopName,
      seller.memberName,
      seller.memberId,
      seller.memberPhone,
      seller.businessName || "",
      seller.businessCode || "",
      seller.sellerType,
      seller.status,
      seller.verificationStatus,
      seller.productCount,
      seller.totalEarningsBDT,
      `${seller.commissionRatePercent}%`,
      seller.payoutAccountType,
      seller.payoutAccountNumber,
      seller.rating,
    ]);

    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) =>
        row.map(escapeCsvValue).join(",")
      ),
    ].join("\r\n");

    // UTF-8 BOM helps Excel display Bangla correctly.
    const blob = new Blob(
      ["\uFEFF", csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `bdsisters-sellers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Give the browser time to start downloading before cleanup.
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    showToast(
      `${filteredSellers.length} seller records exported successfully.`
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 overflow-x-clip pb-8">

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <div className="flex min-w-0 items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

            <p className="min-w-0 break-words text-sm text-emerald-800">
              {toastMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-md p-1 text-emerald-700 hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Overview */}
      <div className="w-full min-w-0">
        <SellerKpiCards kpis={currentKpis} />
      </div>

      {/* Page Toolbar */}
      <section className="w-full min-w-0 rounded-xl border border-gray-200 bg-white">

        {/* Toolbar Header */}
        <div className="flex min-w-0 flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900">
              All Sellers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage seller accounts, verification and performance.
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row lg:shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-4 w-4 shrink-0" />
              Export CSV
            </button>

            <Link
              href="/admin/sellers/pending"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#5B46F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4f3ad8]"
            >
              <Users className="h-4 w-4 shrink-0" />
              Pending Queue
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="min-w-0 border-t border-gray-100 p-4">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by shop, seller code, member or business..."
              aria-label="Search sellers"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="min-w-0 border-t border-gray-100 px-4 py-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-700">
              Filter Sellers
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-[#5B46F6]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset filters
              </button>
            )}
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="min-w-0">
              <label
                htmlFor="seller-status"
                className="mb-1.5 block text-xs font-medium text-gray-500"
              >
                Seller Status
              </label>

              <select
                id="seller-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className={selectClass}
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING_APPROVAL">
                  Pending Onboarding
                </option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="seller-verification"
                className="mb-1.5 block text-xs font-medium text-gray-500"
              >
                Verification
              </label>

              <select
                id="seller-verification"
                value={verificationFilter}
                onChange={(event) =>
                  setVerificationFilter(event.target.value)
                }
                className={selectClass}
              >
                <option value="ALL">All Verifications</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending Check</option>
                <option value="UNVERIFIED">Unverified</option>
              </select>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="seller-type"
                className="mb-1.5 block text-xs font-medium text-gray-500"
              >
                Seller Type
              </label>

              <select
                id="seller-type"
                value={sellerTypeFilter}
                onChange={(event) =>
                  setSellerTypeFilter(event.target.value)
                }
                className={selectClass}
              >
                <option value="ALL">All Seller Types</option>
                <option value="BUSINESS">Business Seller</option>
                <option value="INDIVIDUAL">
                  Individual Artisan
                </option>
                <option value="SERVICE_PROVIDER">
                  Service Provider
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Information */}
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredSellers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {sellers.length}
          </span>{" "}
          sellers
        </p>

        {hasActiveFilters && (
          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            Filters applied
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredSellers.length === 0 ? (
        <div className="w-full min-w-0 rounded-xl border border-gray-200 bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-900">
            No sellers found
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            No sellers match your current search or filter settings.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#5B46F6] hover:underline"
            >
              <RotateCcw className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Seller Cards */}
          <div className="grid w-full min-w-0 grid-cols-1 gap-3 lg:hidden">
            {filteredSellers.map((seller) => (
              <SellerMobileCard
                key={seller.id}
                seller={seller}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>

          {/* Desktop Sellers Table */}
          <div className="hidden w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white lg:block">

            {/* Horizontal Scroll Container */}
            <div
              className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain"
              role="region"
              aria-label="Sellers table"
              tabIndex={0}
            >
              <table className="w-full min-w-[1450px] table-fixed border-collapse text-left">

                {/* Fixed Column Widths: Total 1450px */}
                <colgroup>
                  <col style={{ width: "200px" }} />
                  <col style={{ width: "170px" }} />
                  <col style={{ width: "160px" }} />
                  <col style={{ width: "130px" }} />
                  <col style={{ width: "130px" }} />
                  <col style={{ width: "140px" }} />
                  <col style={{ width: "130px" }} />
                  <col style={{ width: "160px" }} />
                  <col style={{ width: "90px" }} />
                  <col style={{ width: "140px" }} />
                </colgroup>

                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Seller & Shop
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Member
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Business
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Seller Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Verification
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Products & GMV
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Payout
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Rating
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map((seller) => (
                    <tr
                      key={seller.id}
                      className="align-top transition-colors hover:bg-gray-50/70"
                    >
                      {/* Seller */}
                      <td className="min-w-0 px-4 py-4">
                        <SellerIdentity seller={seller} />
                      </td>

                      {/* Member */}
                      <td className="min-w-0 px-4 py-4">
                        <div className="min-w-0">
                          <Link
                            href={`/admin/members/${seller.memberId}`}
                            className="block break-words text-sm font-medium text-gray-800 hover:text-[#5B46F6]"
                          >
                            {seller.memberName}
                          </Link>

                          <p className="mt-1 break-all font-mono text-xs text-gray-400">
                            {seller.memberId}
                          </p>

                          <p className="mt-1 break-words text-xs text-gray-500">
                            {seller.memberPhone}
                          </p>
                        </div>
                      </td>

                      {/* Business */}
                      <td className="min-w-0 px-4 py-4">
                        <div className="min-w-0">
                          {seller.businessId ? (
                            <Link
                              href={`/admin/businesses/${seller.businessId}`}
                              className="block break-words text-sm font-medium text-gray-800 hover:text-[#5B46F6]"
                            >
                              {seller.businessName || "View Business"}
                            </Link>
                          ) : (
                            <span className="block break-words text-sm text-gray-400">
                              Individual Seller
                            </span>
                          )}

                          {seller.businessCode && (
                            <p className="mt-1 break-all font-mono text-xs text-gray-400">
                              {seller.businessCode}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Seller Type */}
                      <td className="min-w-0 px-4 py-4">
                        <div className="max-w-full">
                          <SellerTypeBadge type={seller.sellerType} />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="min-w-0 px-4 py-4">
                        <div className="max-w-full">
                          <SellerStatusBadge
                            status={seller.status}
                            size="sm"
                          />
                        </div>
                      </td>

                      {/* Verification */}
                      <td className="min-w-0 px-4 py-4">
                        <div className="max-w-full">
                          <SellerVerificationBadge
                            status={seller.verificationStatus}
                          />
                        </div>
                      </td>

                      {/* Products & GMV */}
                      <td className="min-w-0 px-4 py-4">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                            <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                            <span className="break-words">
                              {seller.productCount} items
                            </span>
                          </p>

                          <p className="mt-1 break-words text-xs font-medium text-gray-500">
                            {formatCurrency(seller.totalEarningsBDT)}
                          </p>
                        </div>
                      </td>

                      {/* Payout */}
                      <td className="min-w-0 px-4 py-4">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 break-words text-sm font-medium text-gray-700">
                            <CreditCard className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                            <span className="min-w-0 break-words">
                              {seller.payoutAccountType}
                            </span>
                          </p>

                          <p className="mt-1 break-all font-mono text-xs text-gray-400">
                            {seller.payoutAccountNumber}
                          </p>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="min-w-0 px-4 py-4">
                        {seller.rating > 0 ? (
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" />

                            {seller.rating.toFixed(1)}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No rating
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <SellerActionButtons
                            seller={seller}
                            onUpdateStatus={handleUpdateStatus}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}