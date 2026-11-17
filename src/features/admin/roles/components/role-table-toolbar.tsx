"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus, RotateCcw, KeyRound } from "lucide-react";
import { RoleFilterState, RoleType, RoleStatus, RoleCategory } from "../types/admin-role";

interface RoleTableToolbarProps {
  filters: RoleFilterState;
  onFilterChange: (updates: Partial<RoleFilterState>) => void;
  onReset: () => void;
  totalFiltered: number;
  totalRoles: number;
}

export function RoleTableToolbar({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
  totalRoles: _totalRoles,
}: RoleTableToolbarProps) {
  const isFiltered =
    filters.query.trim().length > 0 ||
    filters.typeFilter !== "ALL" ||
    filters.statusFilter !== "ALL" ||
    filters.categoryFilter !== "ALL";

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value, page: 1 })}
            placeholder="Search by role name, slug, or description..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#5B46F6] transition"
          />
        </div>

        {/* Action Buttons: Add Custom Role & Matrix */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/permissions"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Permissions Matrix</span>
          </Link>

          <Link
            href="/admin/roles/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Role</span>
          </Link>
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={filters.typeFilter}
            onChange={(e) =>
              onFilterChange({
                typeFilter: e.target.value as "ALL" | RoleType,
                page: 1,
              })
            }
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="ALL">Role Type: All</option>
            <option value="BUILT_IN">Built-in System</option>
            <option value="CUSTOM">Custom Created</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.categoryFilter}
            onChange={(e) =>
              onFilterChange({
                categoryFilter: e.target.value as "ALL" | RoleCategory,
                page: 1,
              })
            }
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="ALL">Category: All</option>
            <option value="PLATFORM">Platform Operations</option>
            <option value="COMMUNITY">Community & Moderation</option>
            <option value="COMMERCE">Commerce & Products</option>
            <option value="FINANCE">Financial Governance</option>
            <option value="SYSTEM">System & Security</option>
            <option value="CUSTOM">Custom Slices</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onFilterChange({
                statusFilter: e.target.value as "ALL" | RoleStatus,
                page: 1,
              })
            }
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Sort By */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                RoleFilterState["sortBy"],
                RoleFilterState["sortOrder"]
              ];
              onFilterChange({ sortBy, sortOrder, page: 1 });
            }}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
            <option value="permissionsCount-desc">Permissions: High to Low</option>
            <option value="permissionsCount-asc">Permissions: Low to High</option>
            <option value="assignedMembersCount-desc">Assigned Members: High to Low</option>
            <option value="updatedAt-desc">Recently Updated</option>
          </select>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Counter */}
        <span className="text-[11px] text-gray-500 dark:text-gray-400">
          Showing <strong className="text-gray-900 dark:text-white font-mono">{totalFiltered}</strong> roles
        </span>
      </div>
    </div>
  );
}
