"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import type { PaymentTransaction } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";
import {
  PaymentStatusBadge,
  PaymentTypeBadge,
  PaymentMethodBadge,
} from "../common/payment-status-badge";

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string) => void;
  onOpenDrawer: (transaction: PaymentTransaction) => void;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export function TransactionTable({
  transactions,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onOpenDrawer,
  page,
  pageSize,
  totalItems,
  onPageChange,
}: TransactionTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const isAllSelected =
    transactions.length > 0 &&
    transactions.every((t) => selectedIds.includes(t.id));

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden"
    >
      {/* Desktop & Tablet View */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <table className="w-full text-left text-xs min-w-[1100px]">
          <thead className="bg-gradient-to-r from-gray-50/90 via-indigo-50/20 to-gray-50/90 dark:from-gray-800/80 dark:via-indigo-950/20 dark:to-gray-800/80 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200/80 dark:border-gray-800 text-[11px] tracking-wide">
            <tr>
              <th className="py-4 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all transactions on page"
                  className="w-4 h-4 rounded text-[#5B46F6] focus:ring-[#5B46F6] dark:bg-gray-800 dark:border-gray-700 transition cursor-pointer"
                />
              </th>
              <th className="py-4 px-4 min-w-[200px]">Transaction & Reference</th>
              <th className="py-4 px-4 min-w-[200px]">Member / Sister</th>
              <th className="py-4 px-4 min-w-[140px]">Payment Type</th>
              <th className="py-4 px-4 min-w-[180px]">Related Order / Plan</th>
              <th className="py-4 px-4 min-w-[130px]">Amount (BDT)</th>
              <th className="py-4 px-4 min-w-[160px]">Method (ZiniPay)</th>
              <th className="py-4 px-4 min-w-[130px]">Status</th>
              <th className="py-4 px-4 min-w-[120px]">Date & Time</th>
              <th className="py-4 px-4 min-w-[110px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/90 dark:divide-gray-800/80 text-gray-700 dark:text-gray-300">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    <p className="font-medium text-sm text-gray-500">
                      No payment transactions matched your filters.
                    </p>
                    <p className="text-xs text-gray-400">
                      Try clearing search parameters to see more records.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isSelected = selectedIds.includes(tx.id);

                return (
                  <tr
                    key={tx.id}
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
                        onChange={() => onSelectOne(tx.id)}
                        aria-label={`Select transaction ${tx.transactionId}`}
                        className="w-4 h-4 rounded text-[#5B46F6] focus:ring-[#5B46F6] dark:bg-gray-800 dark:border-gray-700 transition cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/payments/transactions/${tx.id}`}
                        className="font-mono font-semibold text-xs text-gray-900 dark:text-white hover:text-[#5B46F6] dark:hover:text-indigo-400 transition-colors"
                      >
                        {tx.transactionId}
                      </Link>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                        <span className="font-mono">{tx.gatewayTrxId}</span>
                        <span>•</span>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">ZiniPay</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {tx.memberName}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {tx.memberId} • {tx.memberPhone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <PaymentTypeBadge type={tx.paymentType} />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="max-w-[170px] truncate font-medium text-gray-800 dark:text-gray-200" title={tx.relatedEntity.name}>
                        {tx.relatedEntity.name}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {tx.relatedEntity.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-xs text-gray-900 dark:text-white">
                        {formatBDT(tx.amountBDT)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Net: {formatBDT(tx.netAmountBDT)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <PaymentMethodBadge method={tx.paymentMethod} />
                    </td>

                    <td className="py-3.5 px-4">
                      <PaymentStatusBadge status={tx.status} />
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 text-[11px] whitespace-nowrap">
                      {tx.initiatedAt}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenDrawer(tx)}
                          title="Quick Preview Drawer"
                          className="p-1.5 rounded-xl text-gray-500 hover:text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shadow-xs hover:shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/payments/transactions/${tx.id}`}
                          title="Full Details Page"
                          className="p-1.5 rounded-xl text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shadow-xs hover:shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No transactions found.
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="p-4 space-y-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/admin/payments/transactions/${tx.id}`}
                    className="font-mono font-semibold text-xs text-gray-900 dark:text-white"
                  >
                    {tx.transactionId}
                  </Link>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                    {tx.memberName}
                  </p>
                  <span className="font-mono text-[10px] text-gray-400">
                    {tx.memberId}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {formatBDT(tx.amountBDT)}
                  </span>
                  <PaymentStatusBadge status={tx.status} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <PaymentTypeBadge type={tx.paymentType} />
                <PaymentMethodBadge method={tx.paymentMethod} />
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] text-gray-400">
                  {tx.initiatedAt}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenDrawer(tx)}
                    className="font-semibold text-[#5B46F6]"
                  >
                    Quick View
                  </button>
                  <Link
                    href={`/admin/payments/transactions/${tx.id}`}
                    className="font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Full Details →
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
          <span className="text-gray-400">({totalItems} total transactions)</span>
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
