"use client";

import React from "react";
import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  ExternalLink,
} from "lucide-react";
import type { AdminProfileItem, ProfileApprovalStatus } from "../types/admin-profile";
import {
  ProfileApprovalStatusBadge,
  ProfileVisibilityBadge,
  ProfileVerificationBadgeTag,
  FeaturedBadge,
} from "./profile-status-badges";
import type { ReviewDialogAction } from "./profile-review-dialog";

interface ProfileTableProps {
  profiles: AdminProfileItem[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string) => void;
  onOpenReview: (profile: AdminProfileItem, action: ReviewDialogAction) => void;
  onOpenPreview: (profile: AdminProfileItem) => void;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export function ProfileTable({
  profiles,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onOpenReview,
  onOpenPreview,
  page,
  pageSize,
  totalItems,
  onPageChange,
}: ProfileTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const isAllSelected =
    profiles.length > 0 && profiles.every((p) => selectedIds.includes(p.id));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200/80 dark:border-gray-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded text-[#5B46F6] focus:ring-[#5B46F6] dark:bg-gray-800 dark:border-gray-700"
                />
              </th>
              <th className="p-4">Profile & Member</th>
              <th className="p-4">Profession / Title</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-center">Completeness</th>
              <th className="p-4">Verification</th>
              <th className="p-4">Visibility</th>
              <th className="p-4">Approval</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4">Last Updated</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-gray-700 dark:text-gray-300">
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-12 text-center text-gray-400">
                  No member profiles matched your active filter criteria.
                </td>
              </tr>
            ) : (
              profiles.map((profile) => {
                const isSelected = selectedIds.includes(profile.id);

                return (
                  <tr
                    key={profile.id}
                    className={`hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors ${
                      isSelected ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectOne(profile.id)}
                        className="rounded text-[#5B46F6] focus:ring-[#5B46F6] dark:bg-gray-800 dark:border-gray-700"
                      />
                    </td>

                    {/* Member Name & ID */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
                          {profile.fullName.charAt(0)}
                        </div>
                        <div>
                          <Link
                            href={`/admin/profiles/${profile.id}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-[#5B46F6] dark:hover:text-indigo-400 transition-colors"
                          >
                            {profile.fullName}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-gray-400">
                              {profile.memberId}
                            </span>
                            {profile.business.hasBusiness && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                                <Building2 className="w-2.5 h-2.5" />
                                <span>Shop Owner</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Profession */}
                    <td className="p-4">
                      <div className="max-w-[160px]">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {profile.profession}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {profile.occupation || profile.industry}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-[11px]">
                        {profile.category}
                      </span>
                    </td>

                    {/* Completeness */}
                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {profile.profileCompletion}%
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              profile.profileCompletion >= 80
                                ? "bg-emerald-500"
                                : profile.profileCompletion >= 50
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${profile.profileCompletion}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Verification */}
                    <td className="p-4">
                      <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                    </td>

                    {/* Visibility */}
                    <td className="p-4">
                      <ProfileVisibilityBadge visibility={profile.profileVisibility} />
                    </td>

                    {/* Approval */}
                    <td className="p-4">
                      <ProfileApprovalStatusBadge status={profile.approvalStatus} />
                    </td>

                    {/* Featured */}
                    <td className="p-4 text-center">
                      {profile.isFeatured ? (
                        <FeaturedBadge />
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="p-4 text-gray-400 text-[11px] whitespace-nowrap">
                      {profile.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenPreview(profile)}
                          title="Preview Public Profile"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/admin/profiles/${profile.id}`}
                          title="Inspect Profile Details"
                          className="p-1.5 rounded-lg text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/profiles/${profile.id}/edit`}
                          title="Edit Profile"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        {/* Quick Decision Buttons for pending review */}
                        {profile.approvalStatus === "PENDING_REVIEW" && (
                          <button
                            type="button"
                            onClick={() => onOpenReview(profile, "APPROVE")}
                            title="Quick Approve"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card List View */}
      <div className="block xl:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {profiles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No member profiles found.
          </div>
        ) : (
          profiles.map((profile) => (
            <div key={profile.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div>
                    <Link
                      href={`/admin/profiles/${profile.id}`}
                      className="font-bold text-xs text-gray-900 dark:text-white"
                    >
                      {profile.fullName}
                    </Link>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {profile.headline || profile.profession}
                    </p>
                    <span className="font-mono text-[10px] text-gray-400">
                      {profile.memberId}
                    </span>
                  </div>
                </div>

                <ProfileApprovalStatusBadge status={profile.approvalStatus} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-700 dark:text-gray-300">
                  {profile.category}
                </span>
                <ProfileVisibilityBadge visibility={profile.profileVisibility} />
                <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                {profile.isFeatured && <FeaturedBadge />}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] text-gray-400">
                  Completion: <strong>{profile.profileCompletion}%</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenPreview(profile)}
                    className="text-xs font-semibold text-[#5B46F6]"
                  >
                    Preview
                  </button>
                  <Link
                    href={`/admin/profiles/${profile.id}`}
                    className="text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-gray-50/70 dark:bg-gray-800/40 border-t border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          Showing page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> ({totalItems} total profiles)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold text-gray-700 dark:text-gray-300">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
