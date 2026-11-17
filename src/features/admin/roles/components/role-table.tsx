"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  Edit2,
  Copy,
  Trash2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Users,
} from "lucide-react";
import { AdminRoleDetail } from "../types/admin-role";
import {
  RoleTypeBadge,
  RoleStatusBadge,
  RoleCategoryBadge,
} from "./role-status-badge";

interface RoleTableProps {
  roles: AdminRoleDetail[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalRolesCount: number;
  onDuplicateClick: (role: AdminRoleDetail) => void;
  onDeleteClick: (role: AdminRoleDetail) => void;
}

export function RoleTable({
  roles,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalRolesCount,
  onDuplicateClick,
  onDeleteClick,
}: RoleTableProps) {
  const isAllSelected =
    roles.length > 0 && roles.every((r) => selectedIds.includes(r.id));

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="py-3 px-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all roles on page"
                  className="rounded-sm border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
                />
              </th>
              <th className="py-3 px-4">Role Name & Scope</th>
              <th className="py-3 px-4">Identifier / Slug</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Permissions</th>
              <th className="py-3 px-4">Assigned Members</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-gray-700 dark:text-gray-200">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-500">
                  <Shield className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm font-semibold">No roles match your search or filter.</p>
                </td>
              </tr>
            ) : (
              roles.map((role) => {
                const isSelected = selectedIds.includes(role.id);
                const isProtected = role.isProtected || role.type === "BUILT_IN";

                return (
                  <tr
                    key={role.id}
                    className={`hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition group ${
                      isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(role.id)}
                        aria-label={`Select role ${role.name}`}
                        className="rounded-sm border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
                      />
                    </td>

                    {/* Role Name */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/roles/${role.slug || role.id}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-[#5B46F6] transition"
                          >
                            {role.name}
                          </Link>
                          {isProtected && (
                            <span title="Protected System Role">
                              <Lock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-1 max-w-[240px] mt-0.5">
                          {role.description}
                        </p>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                        {role.slug}
                      </span>
                    </td>

                    {/* Type & Category */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <RoleTypeBadge type={role.type} />
                        <div>
                          <RoleCategoryBadge category={role.category} />
                        </div>
                      </div>
                    </td>

                    {/* Permissions Count */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-bold text-gray-900 dark:text-white font-mono">
                          {role.permissionsCount}
                        </span>
                        <span className="text-gray-400 text-[11px]">/ 72</span>
                      </div>
                    </td>

                    {/* Assigned Members */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {role.assignedMembersCount.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <RoleStatusBadge status={role.status} />
                    </td>

                    {/* Updated */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                      {role.updatedAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/roles/${role.slug || role.id}`}
                          title="View Role Details"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {!isProtected ? (
                          <Link
                            href={`/admin/roles/${role.slug || role.id}/edit`}
                            title="Edit Custom Role"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#5B46F6] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        ) : (
                          <span
                            title="System Role is Protected"
                            className="p-1.5 text-gray-300 dark:text-gray-700 cursor-not-allowed"
                          >
                            <Edit2 className="w-4 h-4" />
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => onDuplicateClick(role)}
                          title="Clone Role"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {!isProtected ? (
                          <button
                            type="button"
                            onClick={() => onDeleteClick(role)}
                            title="Delete Custom Role"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span
                            title="Protected from Deletion"
                            className="p-1.5 text-gray-300 dark:text-gray-700 cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </span>
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

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Page <strong className="text-gray-900 dark:text-white">{currentPage}</strong> of{" "}
            <strong className="text-gray-900 dark:text-white">{totalPages}</strong> ({totalRolesCount} items)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
