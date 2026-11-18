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
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden"
    >
      {/* Desktop & Tablet Responsive Table View */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <table className="w-full text-left text-xs min-w-[1100px]">
          <thead className="bg-gradient-to-r from-gray-50/90 via-indigo-50/20 to-gray-50/90 dark:from-gray-800/80 dark:via-indigo-950/20 dark:to-gray-800/80 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200/80 dark:border-gray-800 text-[11px] tracking-wide">
            <tr>
              <th className="py-4 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all profiles on this page"
                  className="w-4 h-4 rounded text-[#5B46F6] focus:ring-[#5B46F6] dark:bg-gray-800 dark:border-gray-700 transition cursor-pointer"
                />
              </th>
              <th className="py-4 px-4 min-w-[240px]">Profile & Member</th>
              <th className="py-4 px-4 min-w-[180px]">Profession / Headline</th>
              <th className="py-4 px-4 min-w-[140px]">Category</th>
              <th className="py-4 px-4 min-w-[110px] text-center">Completeness</th>
              <th className="py-4 px-4 min-w-[130px]">Verification</th>
              <th className="py-4 px-4 min-w-[110px]">Visibility</th>
              <th className="py-4 px-4 min-w-[140px]">Approval</th>
              <th className="py-4 px-4 min-w-[90px] text-center">Featured</th>
              <th className="py-4 px-4 min-w-[120px]">Last Updated</th>
              <th className="py-4 px-4 min-w-[130px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/90 dark:divide-gray-800/80 text-gray-700 dark:text-gray-300">
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    <p className="font-medium text-sm text-gray-500">
                      No member profiles matched your active filter criteria.
                    </p>
                    <p className="text-xs text-gray-400">
                      Try clearing or adjusting search filters to see more results.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              profiles.map((profile) => {
                const isSelected = selectedIds.includes(profile.id);

                return (
                  <tr
                    key={profile.id}
                    className={`hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors duration-150 ${
                      isSelected
                        ? "bg-indigo-50/60 dark:bg-indigo-950/30"
                        : "even:bg-gray-50/30 dark:even:bg-gray-900/30"
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectOne(profile.id)}
                        aria-label={`Select profile for ${profile.fullName}`}
                        className="w-4 h-4 rounded text-[#5B46F6] focus:ring-[#5B46F6] dark:bg-gray-800 dark:border-gray-700 transition cursor-pointer"
                      />
                    </td>

                    {/* Member Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 text-[#5B46F6] dark:text-indigo-300 font-semibold text-sm flex items-center justify-center shrink-0 border border-indigo-100/80 dark:border-indigo-900 shadow-xs shadow-indigo-500/10">
                          {profile.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/profiles/${profile.id}`}
                            className="font-semibold text-sm text-gray-900 dark:text-white hover:text-[#5B46F6] dark:hover:text-indigo-400 transition-colors inline-block truncate max-w-[200px]"
                          >
                            {profile.fullName}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-gray-400">
                              {profile.memberId}
                            </span>
                            {profile.business.hasBusiness && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                                <Building2 className="w-2.5 h-2.5" />
                                <span>Shop Owner</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Profession */}
                    <td className="py-3.5 px-4">
                      <div className="max-w-[190px]">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {profile.profession}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {profile.occupation || profile.industry}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-[11px] border border-gray-200/60 dark:border-gray-700/60 shadow-xs">
                        {profile.category}
                      </span>
                    </td>

                    {/* Completeness */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {profile.profileCompletion}%
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
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
                    <td className="py-3.5 px-4">
                      <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                    </td>

                    {/* Visibility */}
                    <td className="py-3.5 px-4">
                      <ProfileVisibilityBadge visibility={profile.profileVisibility} />
                    </td>

                    {/* Approval */}
                    <td className="py-3.5 px-4">
                      <ProfileApprovalStatusBadge status={profile.approvalStatus} />
                    </td>

                    {/* Featured */}
                    <td className="py-3.5 px-4 text-center">
                      {profile.isFeatured ? (
                        <FeaturedBadge />
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 font-medium">—</span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 text-[11px] whitespace-nowrap">
                      {profile.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenPreview(profile)}
                          title="Preview Public Profile"
                          className="p-1.5 rounded-xl text-gray-500 hover:text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shadow-xs hover:shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/admin/profiles/${profile.id}`}
                          title="Inspect Profile Details"
                          className="p-1.5 rounded-xl text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shadow-xs hover:shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/admin/profiles/${profile.id}/edit`}
                          title="Edit Profile"
                          className="p-1.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-xs hover:shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Quick Decision Button for pending review */}
                        {profile.approvalStatus === "PENDING_REVIEW" && (
                          <button
                            type="button"
                            onClick={() => onOpenReview(profile, "APPROVE")}
                            title="Quick Approve"
                            className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shadow-xs shadow-emerald-500/10 hover:shadow-sm hover:shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
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

      {/* Mobile Card List View (Visible on small smartphones only) */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {profiles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No member profiles found.
          </div>
        ) : (
          profiles.map((profile) => (
            <div key={profile.id} className="p-4 space-y-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] font-semibold text-sm flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900 shadow-sm shadow-indigo-500/10">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div>
                    <Link
                      href={`/admin/profiles/${profile.id}`}
                      className="font-semibold text-xs text-gray-900 dark:text-white"
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
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {profile.category}
                </span>
                <ProfileVisibilityBadge visibility={profile.profileVisibility} />
                <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                {profile.isFeatured && <FeaturedBadge />}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] text-gray-500">
                  Completion: <strong className="font-semibold text-gray-800 dark:text-gray-200">{profile.profileCompletion}%</strong>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenPreview(profile)}
                    className="text-xs font-semibold text-[#5B46F6] hover:underline"
                  >
                    Preview
                  </button>
                  <Link
                    href={`/admin/profiles/${profile.id}`}
                    className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900"
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
      <div className="p-4 bg-gradient-to-r from-gray-50/90 via-white to-gray-50/90 dark:from-gray-800/60 dark:via-gray-900 dark:to-gray-800/60 border-t border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          Showing page{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>{" "}
          <span className="text-gray-400">({totalItems} total profiles)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <span className="px-3 py-1 font-semibold text-gray-800 dark:text-gray-200 bg-gray-100/70 dark:bg-gray-800 rounded-lg">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
