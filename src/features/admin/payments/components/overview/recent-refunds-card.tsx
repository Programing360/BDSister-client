"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight, ChevronRight, AlertCircle } from "lucide-react";
import { DEMO_REFUNDS, formatBDT } from "../../data/mock-payments";

export function RecentRefundsCard() {
  const refundsList = DEMO_REFUNDS.slice(0, 4);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="250"
      className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Recent Refund Claims & Inquiries
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Customer support reversals and store claim status
            </p>
          </div>
        </div>

        <Link
          href="/admin/payments/refunds"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline"
        >
          <span>Refund Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {refundsList.map((ref) => (
          <div
            key={ref.id}
            className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-start justify-between gap-3 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                  {ref.refundCode}
                </span>
                <span className="font-medium text-xs text-gray-600 dark:text-gray-300">
                  • {ref.memberName}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {ref.refundReason}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span>Requested: {ref.requestDate}</span>
                <span>•</span>
                <span>Target: {ref.relatedEntity.name}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                {formatBDT(ref.requestedAmountBDT)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  ref.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : ref.status === "UNDER_REVIEW"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {ref.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
