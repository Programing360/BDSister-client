"use client";

import React from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  CreditCard,
  SlidersHorizontal,
} from "lucide-react";
import type {
  PaymentFilterState,
  PaymentStatus,
  PaymentType,
  PaymentMethod,
} from "../../types/payment";

interface TransactionTableToolbarProps {
  filters: PaymentFilterState;
  onFilterChange: (filters: Partial<PaymentFilterState>) => void;
  onReset: () => void;
  onOpenExport: () => void;
  totalFiltered: number;
}

export function TransactionTableToolbar({
  filters,
  onFilterChange,
  onReset,
  onOpenExport,
  totalFiltered,
}: TransactionTableToolbarProps) {
  const isFiltered =
    filters.query !== "" ||
    filters.status !== "ALL" ||
    filters.paymentType !== "ALL" ||
    filters.paymentMethod !== "ALL" ||
    filters.dateRange !== "all";

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="150"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs rounded-3xl border border-gray-200/80 dark:border-gray-800 p-4 space-y-4 shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value, page: 1 })}
            placeholder="Search by transaction ID, member name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-gray-50/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all shadow-xs"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as "ALL" | PaymentStatus,
                page: 1,
              })
            }
            aria-label="Filter by payment status"
            className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6] shadow-xs cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESSFUL">Successful</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Payment Type Filter */}
          <select
            value={filters.paymentType}
            onChange={(e) =>
              onFilterChange({
                paymentType: e.target.value as "ALL" | PaymentType,
                page: 1,
              })
            }
            aria-label="Filter by payment type"
            className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6] shadow-xs cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="MEMBERSHIP_SUBSCRIPTION">Membership Subscription</option>
            <option value="MARKETPLACE_ORDER">Marketplace Order</option>
            <option value="COURSE_ENROLLMENT">Course Enrollment</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              onFilterChange({
                paymentMethod: e.target.value as "ALL" | PaymentMethod,
                page: 1,
              })
            }
            aria-label="Filter by payment method"
            className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6] shadow-xs cursor-pointer"
          >
            <option value="ALL">All ZiniPay Channels</option>
            <option value="ZINIPAY_BKASH">ZiniPay (bKash)</option>
            <option value="ZINIPAY_NAGAD">ZiniPay (Nagad)</option>
            <option value="ZINIPAY_ROCKET">ZiniPay (Rocket)</option>
            <option value="ZINIPAY_CARD">ZiniPay (Cards)</option>
            <option value="ZINIPAY_INTERNET_BANKING">ZiniPay (Net Banking)</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) =>
              onFilterChange({
                dateRange: e.target.value as PaymentFilterState["dateRange"],
                page: 1,
              })
            }
            aria-label="Filter by date range"
            className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden focus:border-[#5B46F6] shadow-xs cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="year">Past Year</option>
          </select>

          {/* Export Action */}
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2.5 border-t border-gray-100 dark:border-gray-800/80">
        <span>
          Showing <span className="font-semibold text-gray-900 dark:text-white">{totalFiltered}</span> matching transaction records
        </span>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as PaymentFilterState["sortBy"],
              })
            }
            aria-label="Sort transactions by"
            className="text-xs bg-transparent font-semibold text-gray-700 dark:text-gray-300 border-0 focus:outline-hidden cursor-pointer"
          >
            <option value="date">Date & Time</option>
            <option value="amount">Amount (BDT)</option>
            <option value="member">Member Name</option>
          </select>
        </div>
      </div>
    </div>
  );
}
