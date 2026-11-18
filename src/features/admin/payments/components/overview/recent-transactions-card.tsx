"use client";

import React from "react";
import Link from "next/link";
import {
  CreditCard,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { DEMO_PAYMENT_TRANSACTIONS, formatBDT } from "../../data/mock-payments";
import {
  PaymentStatusBadge,
  PaymentTypeBadge,
  PaymentMethodBadge,
} from "../common/payment-status-badge";

export function RecentTransactionsCard() {
  const recentList = DEMO_PAYMENT_TRANSACTIONS.slice(0, 5);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B46F6] flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Recent Payment Transactions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live settlement stream through ZiniPay gateway
            </p>
          </div>
        </div>

        <Link
          href="/admin/payments/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B46F6] hover:text-indigo-700 transition-colors"
        >
          <span>View All Transactions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-gray-50/70 dark:bg-gray-800/50 text-gray-500 font-semibold border-b border-gray-100 dark:border-gray-800 text-[11px]">
            <tr>
              <th className="py-3 px-3">Transaction ID</th>
              <th className="py-3 px-3">Sister Member</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Method</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            {recentList.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                    {tx.transactionId}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {tx.initiatedAt.slice(0, 16)}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {tx.memberName}
                  </div>
                  <span className="font-mono text-[10px] text-gray-400">
                    {tx.memberId}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <PaymentTypeBadge type={tx.paymentType} />
                </td>
                <td className="py-3 px-3">
                  <PaymentMethodBadge method={tx.paymentMethod} />
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatBDT(tx.amountBDT)}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Fee: {formatBDT(tx.feeBDT)}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <PaymentStatusBadge status={tx.status} />
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href={`/admin/payments/transactions/${tx.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
