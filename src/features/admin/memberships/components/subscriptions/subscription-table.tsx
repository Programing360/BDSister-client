"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import type { MembershipSubscription } from "../../types/membership";
import { formatBDT } from "../../../payments/data/mock-payments";
import { SubscriptionStatusBadge } from "../common/subscription-status-badge";

interface SubscriptionTableProps {
  subscriptions: MembershipSubscription[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export function SubscriptionTable({
  subscriptions,
  page,
  pageSize,
  totalItems,
  onPageChange,
}: SubscriptionTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden"
    >
      <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <table className="w-full text-left text-xs min-w-[1050px]">
          <thead className="bg-gradient-to-r from-gray-50/90 via-indigo-50/20 to-gray-50/90 dark:from-gray-800/80 dark:via-indigo-950/20 dark:to-gray-800/80 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200/80 dark:border-gray-800 text-[11px] tracking-wide">
            <tr>
              <th className="py-4 px-4 min-w-[160px]">Subscription ID</th>
              <th className="py-4 px-4 min-w-[180px]">Member Sister</th>
              <th className="py-4 px-4 min-w-[180px]">Membership Plan</th>
              <th className="py-4 px-4 min-w-[120px]">Amount</th>
              <th className="py-4 px-4 min-w-[120px]">Start Date</th>
              <th className="py-4 px-4 min-w-[120px]">Expiry Date</th>
              <th className="py-4 px-4 min-w-[130px]">Status</th>
              <th className="py-4 px-4 min-w-[130px]">Renewal Type</th>
              <th className="py-4 px-4 min-w-[100px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/90 dark:divide-gray-800/80 text-gray-700 dark:text-gray-300">
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-gray-300" />
                    <p className="font-semibold text-sm text-gray-500">
                      No subscription records matched your active filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/subscriptions/${sub.id}`}
                      className="font-mono font-semibold text-xs text-gray-900 dark:text-white hover:text-[#5B46F6]"
                    >
                      {sub.subscriptionCode}
                    </Link>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {sub.paymentReference}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{sub.memberName}</div>
                    <span className="font-mono text-[10px] text-gray-400">{sub.memberId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-medium text-[11px] border border-purple-200/80">
                      {sub.planName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-xs text-gray-900 dark:text-white">
                    {formatBDT(sub.amountBDT)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                    {sub.startDate}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                    {sub.expiryDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <SubscriptionStatusBadge status={sub.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      <span>Manual Review</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/subscriptions/${sub.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors border border-indigo-200/60 shadow-xs"
                    >
                      <span>Manage</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card view */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/admin/subscriptions/${sub.id}`}
                  className="font-mono text-xs font-semibold text-gray-900 dark:text-white"
                >
                  {sub.subscriptionCode}
                </Link>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">{sub.memberName}</p>
                <p className="text-[11px] text-purple-700 font-medium">{sub.planName}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-semibold text-sm">{formatBDT(sub.amountBDT)}</span>
                <SubscriptionStatusBadge status={sub.status} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800">
              <span>Expires: {sub.expiryDate}</span>
              <Link href={`/admin/subscriptions/${sub.id}`} className="font-semibold text-[#5B46F6]">
                Manage →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-50/90 via-white to-gray-50/90 dark:from-gray-800/60 dark:via-gray-900 dark:to-gray-800/60 border-t border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          Showing page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> ({totalItems} subscriptions)
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold">{page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
