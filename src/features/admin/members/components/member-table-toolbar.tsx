import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { MemberFilters } from "./members-list-view";

interface MemberTableToolbarProps {
  filters: MemberFilters;
  onFilterChange: (updates: Partial<MemberFilters>) => void;
  onReset: () => void;
  totalFiltered: number;
}

export function MemberTableToolbar({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
}: MemberTableToolbarProps) {
  const isFiltered =
    filters.query.trim().length > 0 ||
    filters.status !== "ALL" ||
    filters.role !== "ALL";

  return (
    <div className="rounded-2xl border-gray-200/80 bg-white p-4 shadow-sm shadow-gray-400 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value, page: 1 })}
            placeholder="Search by sister name, email, or ID..."
            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#5B9891] focus:bg-white focus:outline-hidden transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
          >
            <option value="ALL">Status: All</option>
            <option value="Pending">Pending Review</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            value={filters.role}
            onChange={(e) => onFilterChange({ role: e.target.value, page: 1 })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
          >
            <option value="ALL">Role: All</option>
            <option value="Member">Member (Free)</option>
            <option value="PaidMember">PaidMember</option>
            <option value="Admin">Admin</option>
            <option value="SuperAdmin">SuperAdmin</option>
          </select>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                MemberFilters["sortBy"],
                MemberFilters["sortOrder"]
              ];
              onFilterChange({ sortBy, sortOrder });
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
          >
            <option value="createdAt-desc">Joined: Newest First</option>
            <option value="createdAt-asc">Joined: Oldest First</option>
            <option value="fullName-asc">Name: A to Z</option>
            <option value="fullName-desc">Name: Z to A</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>
          Showing <strong>{totalFiltered}</strong> registered members
        </span>
      </div>
    </div>
  );
}