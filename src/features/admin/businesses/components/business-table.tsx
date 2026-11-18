
"use client";

import Link from "next/link";
import {
  Building2,
  Eye,
  Edit,
  Star,
  ShoppingBag,
} from "lucide-react";

import type { AdminBusinessItem } from "../types/admin-business.ts";
import {
  BusinessStatusBadge,
  BusinessVerificationBadge,
} from "./business-status-badges.tsx";

interface BusinessTableProps {
  businesses: AdminBusinessItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onOpenReviewDialog: (business: AdminBusinessItem) => void;
  onToggleFeatured?: (business: AdminBusinessItem) => void;
}

export function BusinessTable({
  businesses,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onOpenReviewDialog,
  onToggleFeatured,
}: BusinessTableProps) {
  const isAllSelected =
    businesses.length > 0 &&
    businesses.every((biz) => selectedIds.includes(biz.id));

  const formatRevenue = (amount: number) =>
    `৳${(amount / 1000).toLocaleString()} k`;

  // Empty State
  if (businesses.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
          <Building2 className="h-6 w-6 text-gray-400" />
        </div>

        <h3 className="text-sm font-semibold text-gray-900">
          No businesses found
        </h3>

        <p className="mt-1.5 max-w-sm text-sm leading-6 text-gray-500">
          No business records match your current search or filters.
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

      {/* =====================================================
          MOBILE & TABLET CARD VIEW
      ====================================================== */}

      <div className="divide-y divide-gray-100 lg:hidden">

        {/* Select All */}
        <div className="flex items-center justify-between bg-gray-50/70 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-gray-600">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]/20"
            />
            Select all businesses
          </label>

          <span className="text-xs font-medium text-gray-400">
            {businesses.length} businesses
          </span>
        </div>

        {businesses.map((biz) => {
          const isSelected = selectedIds.includes(biz.id);

          return (
            <article
              key={biz.id}
              className={`p - 4 transition - colors ${isSelected ? "bg-[#5B46F6]/[0.035]" : "bg-white"
                } `}
            >
              {/* Business Header */}
              <div className="flex items-start gap-3">

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(biz.id)}
                  aria-label={`Select ${biz.name} `}
                  className="mt-3 h-4 w-4 shrink-0 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]/20"
                />

                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {biz.logo ? (
                    <img
                      src={biz.logo}
                      alt={`${biz.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/ admin / businesses / ${biz.id} `}
                      className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-[#5B46F6]"
                    >
                      {biz.name}
                    </Link>

                    {biz.isFeatured && (
                      <Star
                        className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500"
                        aria-label="Featured business"
                      />
                    )}
                  </div>

                  <p className="mt-1 truncate font-mono text-[11px] text-gray-400">
                    {biz.businessCode}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {biz.location.city}, {biz.location.district}
                  </p>
                </div>
              </div>

              {/* Business Details */}
              <div className="ml-7 mt-4 grid grid-cols-2 gap-x-4 gap-y-4">

                <div className="min-w-0">
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Category
                  </p>

                  <p className="truncate text-sm font-medium text-gray-800">
                    {biz.category}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {biz.businessType}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Owner
                  </p>

                  <Link
                    href={`/ admin / members / ${biz.ownerId} `}
                    className="block truncate text-sm font-medium text-gray-800 hover:text-[#5B46F6]"
                  >
                    {biz.ownerName}
                  </Link>

                  <p className="mt-0.5 truncate font-mono text-[11px] text-gray-400">
                    {biz.ownerId}
                  </p>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Business Status
                  </p>

                  <BusinessStatusBadge status={biz.status} size="sm" />
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Verification
                  </p>

                  <BusinessVerificationBadge
                    status={biz.verificationStatus}
                    size="sm"
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Performance
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <ShoppingBag className="h-3.5 w-3.5 text-gray-400" />
                    {biz.productCount} products
                  </div>

                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    {formatRevenue(biz.totalRevenueBDT)} sales
                  </p>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Rating
                  </p>

                  {biz.rating > 0 ? (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />

                      <span className="font-semibold text-gray-900">
                        {biz.rating.toFixed(1)}
                      </span>

                      <span className="text-xs text-gray-400">
                        ({biz.reviewCount})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">
                      No reviews
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="ml-7 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">

                <div className="flex items-center gap-1">

                  <Link
                    href={`/ admin / businesses / ${biz.id} `}
                    title="View business"
                    aria-label={`View ${biz.name} `}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#5B46F6]"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/ admin / businesses / ${biz.id}/edit`}
                    title="Edit business"
                    aria-label={`Edit ${biz.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#5B46F6]"
                  >
                    <Edit className="h-4 w-4" />
                  </Link >

                  {onToggleFeatured && (
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(biz)}
                      title={biz.isFeatured ? "Remove featured" : "Mark featured"}
                      aria-label={biz.isFeatured ? "Remove featured" : "Mark featured"}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${biz.isFeatured
                        ? "text-amber-500 hover:bg-amber-50"
                        : "text-gray-400 hover:bg-gray-100 hover:text-amber-500"
                        }`}
                    >
                      <Star
                        className={`h-4 w-4 ${biz.isFeatured ? "fill-amber-400" : ""
                          }`}
                      />
                    </button>
                  )}
                </div >

                <button
                  type="button"
                  onClick={() => onOpenReviewDialog(biz)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#5B46F6]/30 hover:bg-[#5B46F6]/5 hover:text-[#5B46F6]"
                >
                  Review business
                </button>
              </div >
            </article >
          );
        })}
      </div >

      {/* =====================================================
          DESKTOP TABLE VIEW
      ====================================================== */}

      < div className="hidden overflow-x-auto lg:block" >
        <table className="w-full min-w-[1150px] border-collapse text-left">

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">

              <th className="w-12 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  aria-label="Select all businesses"
                  className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]/20"
                />
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-gray-600">
                Business
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-gray-600">
                Category
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-gray-600">
                Owner
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-gray-600">
                Status
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-gray-600">
                Verification
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-gray-600">
                Performance
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-gray-600">
                Rating
              </th>

              <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {businesses.map((biz) => {
              const isSelected = selectedIds.includes(biz.id);

              return (
                <tr
                  key={biz.id}
                  className={`transition-colors hover:bg-gray-50/70 ${isSelected ? "bg-[#5B46F6]/[0.035]" : ""
                    }`}
                >

                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(biz.id)}
                      aria-label={`Select ${biz.name}`}
                      className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]/20"
                    />
                  </td>

                  {/* Business */}
                  <td className="max-w-[270px] px-4 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        {biz.logo ? (
                          <img
                            src={biz.logo}
                            alt={`${biz.name} logo`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/businesses/${biz.id}`}
                            title={biz.name}
                            className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-[#5B46F6]"
                          >
                            {biz.name}
                          </Link>

                          {biz.isFeatured && (
                            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" />
                          )}
                        </div>

                        <p className="mt-1 truncate font-mono text-[11px] text-gray-400">
                          {biz.businessCode}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {biz.location.city}, {biz.location.district}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="max-w-[160px] px-4 py-4">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {biz.category}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {biz.businessType}
                    </p>
                  </td>

                  {/* Owner */}
                  <td className="max-w-[160px] px-4 py-4">
                    <Link
                      href={`/admin/members/${biz.ownerId}`}
                      className="block truncate text-sm font-medium text-gray-800 transition-colors hover:text-[#5B46F6]"
                    >
                      {biz.ownerName}
                    </Link>

                    <p className="mt-1 truncate font-mono text-[11px] text-gray-400">
                      {biz.ownerId}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <BusinessStatusBadge
                      status={biz.status}
                      size="sm"
                    />
                  </td>

                  {/* Verification */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <BusinessVerificationBadge
                      status={biz.verificationStatus}
                      size="sm"
                    />
                  </td>

                  {/* Performance */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <ShoppingBag className="h-3.5 w-3.5 text-gray-400" />
                      {biz.productCount} products
                    </div>

                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      {formatRevenue(biz.totalRevenueBDT)} sales
                    </p>
                  </td>

                  {/* Rating */}
                  <td className="whitespace-nowrap px-4 py-4">
                    {biz.rating > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />

                        <span className="text-sm font-semibold text-gray-900">
                          {biz.rating.toFixed(1)}
                        </span>

                        <span className="text-xs text-gray-400">
                          ({biz.reviewCount})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No reviews
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center justify-end gap-1">

                      <Link
                        href={`/admin/businesses/${biz.id}`}
                        title="View business"
                        aria-label={`View ${biz.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#5B46F6]"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/admin/businesses/${biz.id}/edit`}
                        title="Edit business"
                        aria-label={`Edit ${biz.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#5B46F6]"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      {onToggleFeatured && (
                        <button
                          type="button"
                          onClick={() => onToggleFeatured(biz)}
                          title={biz.isFeatured ? "Remove featured" : "Mark featured"}
                          aria-label={biz.isFeatured ? "Remove featured" : "Mark featured"}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${biz.isFeatured
                            ? "text-amber-500 hover:bg-amber-50"
                            : "text-gray-400 hover:bg-gray-100 hover:text-amber-500"
                            }`}
                        >
                          <Star
                            className={`h-4 w-4 ${biz.isFeatured ? "fill-amber-400" : ""
                              }`}
                          />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onOpenReviewDialog(biz)}
                        className="ml-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#5B46F6]/30 hover:bg-[#5B46F6]/5 hover:text-[#5B46F6]"
                      >
                        Review
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}

          </tbody>
        </table>
      </div >
    </div >
  );
}
