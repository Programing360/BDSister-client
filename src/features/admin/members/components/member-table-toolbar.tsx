import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { MemberFilterState } from "../types/admin-member";

interface MemberTableToolbarProps {
  filters: MemberFilterState;
  onFilterChange: (updates: Partial<MemberFilterState>) => void;
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
    filters.accountStatus !== "ALL" ||
    filters.membershipType !== "ALL" ||
    filters.verificationStatus !== "ALL";

  return (
    <div className="rounded-2xl  border-gray-200/80 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value, page: 1 })}
            placeholder="Search by sister name, email, or member ID..."
            className="w-full rounded-xl outline-0 border  border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-0 transition"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Account Status Filter */}
          <select
            value={filters.accountStatus}
            onChange={(e) => onFilterChange({ accountStatus: e.target.value, page: 1 })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="ALL">Account Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Membership Type Filter */}
          <select
            value={filters.membershipType}
            onChange={(e) => onFilterChange({ membershipType: e.target.value, page: 1 })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="ALL">Membership: All</option>
            <option value="FREE">Free Tier</option>
            <option value="PAID">Paid (Pro)</option>
          </select>

          {/* Identity Verification Status Filter */}
          <select
            value={filters.verificationStatus}
            onChange={(e) => onFilterChange({ verificationStatus: e.target.value, page: 1 })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="ALL">Identity Verification: All</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="PENDING">Pending Review</option>
            <option value="ACTION_REQUIRED">Action Required</option>
            <option value="REJECTED">Rejected</option>
            <option value="NOT_SUBMITTED">Not Submitted</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                MemberFilterState["sortBy"],
                MemberFilterState["sortOrder"]
              ];
              onFilterChange({ sortBy, sortOrder });
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B46F6] focus:outline-hidden"
          >
            <option value="joinedDate-desc">Joined: Newest First</option>
            <option value="joinedDate-asc">Joined: Oldest First</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="profileCompletion-desc">Profile: Highest %</option>
          </select>

          {/* Reset Filters CTA */}
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

      {/* Filter status strip */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
        <span>
          Showing <strong>{totalFiltered}</strong> matching members
        </span>
        {isFiltered && (
          <span className="text-[11px] text-[#5B46F6] font-semibold">
            Filtered view active
          </span>
        )}
      </div>
    </div>
  );
}
