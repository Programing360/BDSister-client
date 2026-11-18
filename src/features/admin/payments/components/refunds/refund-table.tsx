"use client";

import React from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import type { RefundItem, RefundStatus } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";

interface RefundTableProps {
  refunds: RefundItem[];
  onOpenReview: (refund: RefundItem, action: "APPROVE" | "REJECT" | "VIEW") => void;
}

export function RefundTable({ refunds, onOpenReview }: RefundTableProps) {
  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-500/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{status === "COMPLETED" ? "Completed" : "Approved"}</span>
          </span>
        );
      case "UNDER_REVIEW":
      case "REQUESTED":
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm shadow-amber-500/15">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>{status === "UNDER_REVIEW" ? "Under Review" : status === "PROCESSING" ? "Processing" : "Requested"}</span>
          </span>
        );
      case "REJECTED":
      case "FAILED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm shadow-rose-500/10">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{status === "REJECTED" ? "Rejected" : "Failed"}</span>
          </span>
        );
    }
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden"
    >
      <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <table className="w-full text-left text-xs min-w-[1000px]">
          <thead className="bg-gradient-to-r from-gray-50/90 via-indigo-50/20 to-gray-50/90 dark:from-gray-800/80 dark:via-indigo-950/20 dark:to-gray-800/80 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200/80 dark:border-gray-800 text-[11px] tracking-wide">
            <tr>
              <th className="py-4 px-4 min-w-[140px]">Refund Code</th>
              <th className="py-4 px-4 min-w-[180px]">Original Transaction</th>
              <th className="py-4 px-4 min-w-[180px]">Sister Member</th>
              <th className="py-4 px-4 min-w-[180px]">Related Order / Plan</th>
              <th className="py-4 px-4 min-w-[130px]">Amount</th>
              <th className="py-4 px-4 min-w-[140px]">Status</th>
              <th className="py-4 px-4 min-w-[130px]">Requested Date</th>
              <th className="py-4 px-4 min-w-[140px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/90 dark:divide-gray-800/80 text-gray-700 dark:text-gray-300">
            {refunds.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-gray-300" />
                    <p className="font-semibold text-sm text-gray-500">
                      No refund claims found in this queue.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              refunds.map((ref) => (
                <tr key={ref.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-xs text-gray-900 dark:text-white">
                    {ref.refundCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/payments/transactions/${ref.originalTransactionId}`}
                      className="font-mono text-xs text-[#5B46F6] hover:underline"
                    >
                      {ref.originalTrxCode}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{ref.memberName}</div>
                    <span className="font-mono text-[10px] text-gray-400">{ref.memberId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="max-w-[170px] truncate font-medium text-gray-800 dark:text-gray-200">
                      {ref.relatedEntity.name}
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">{ref.relatedEntity.id}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-xs text-gray-900 dark:text-white">
                    {formatBDT(ref.requestedAmountBDT)}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(ref.status)}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                    {ref.requestDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenReview(ref, "VIEW")}
                        className="px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-xs cursor-pointer"
                      >
                        Inspect
                      </button>
                      {ref.status === "UNDER_REVIEW" || ref.status === "REQUESTED" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onOpenReview(ref, "REJECT")}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Reject Claim"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenReview(ref, "APPROVE")}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-xs cursor-pointer"
                          >
                            Approve
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {refunds.map((ref) => (
          <div key={ref.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">{ref.refundCode}</span>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{ref.memberName}</p>
                <p className="text-[11px] text-gray-500">{ref.relatedEntity.name}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{formatBDT(ref.requestedAmountBDT)}</span>
                {getStatusBadge(ref.status)}
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl">
              {ref.refundReason}
            </p>
            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => onOpenReview(ref, "VIEW")}
                className="text-xs font-semibold text-[#5B46F6]"
              >
                Inspect Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
