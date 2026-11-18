"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingDown,
  Search,
  ChevronRight,
  Info,
  ArrowLeft,
} from "lucide-react";
import { RefundTable } from "./refund-table";
import { RefundReviewDialog } from "./refund-review-dialog";
import {
  DEMO_REFUNDS,
  DEMO_PAYMENT_DISCLAIMER,
  formatBDT,
} from "../../data/mock-payments";
import type { RefundItem, RefundStatus } from "../../types/payment";

export function RefundsListView() {
  const [refunds, setRefunds] = useState<RefundItem[]>(DEMO_REFUNDS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | RefundStatus>("ALL");
  const [reviewTarget, setReviewTarget] = useState<{
    refund: RefundItem;
    action: "APPROVE" | "REJECT" | "VIEW";
  } | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [search, statusFilter]);

  const filteredRefunds = useMemo(() => {
    return refunds.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCode = r.refundCode.toLowerCase().includes(q);
        const matchTrx = r.originalTrxCode.toLowerCase().includes(q);
        const matchName = r.memberName.toLowerCase().includes(q);
        const matchEntity = r.relatedEntity.name.toLowerCase().includes(q);
        if (!matchCode && !matchTrx && !matchName && !matchEntity) return false;
      }

      if (statusFilter !== "ALL" && r.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [refunds, search, statusFilter]);

  const handleConfirmReview = (
    refundId: string,
    action: "APPROVE" | "REJECT",
    payload: { note?: string; rejectionReason?: string }
  ) => {
    const updatedStatus: RefundStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: updatedStatus,
              internalNote: payload.note || r.internalNote,
              rejectionReason: payload.rejectionReason || r.rejectionReason,
              processedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : r
      )
    );

    setFeedbackToast(
      action === "APPROVE"
        ? "Refund claim approved (Simulation: ZiniPay reversal request dispatched)."
        : "Refund claim rejected with documented rationale."
    );
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const totalRefundedSum = refunds
    .filter((r) => r.status === "COMPLETED" || r.status === "APPROVED")
    .reduce((acc, r) => acc + r.requestedAmountBDT, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl shadow-purple-900/40 flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav
        data-aos="fade-down"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/payments" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Payments
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">Refund Management</span>
      </nav>

      {/* Header Banner */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/60 dark:to-pink-950/40 text-purple-600 flex items-center justify-center border border-purple-200/80 dark:border-purple-800 shadow-lg shadow-purple-500/10">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Refunds & Dispute Management
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Audit customer refund submissions, damaged artisan returns, and automated ZiniPay reversal logs
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-md shadow-gray-200/50 dark:shadow-none hover:shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Payment Overview</span>
        </Link>
      </div>

      {/* Demo Notice */}
      <div
        data-aos="fade-up"
        className="bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 shadow-md shadow-amber-500/5"
      >
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold">Simulated Reversal Workflow: </span>
          {DEMO_PAYMENT_DISCLAIMER}
        </div>
      </div>

      {/* Refund KPI Cards */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-purple-500/8 space-y-1">
          <span className="text-xs font-semibold text-gray-500">Total Refund Claims</span>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{refunds.length} Claims</div>
          <p className="text-[10px] text-gray-400">All recorded dispute inquiries</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-amber-500/10 space-y-1">
          <span className="text-xs font-semibold text-amber-600">Under Review</span>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {refunds.filter((r) => r.status === "UNDER_REVIEW" || r.status === "REQUESTED").length} Pending
          </div>
          <p className="text-[10px] text-gray-400">Awaiting staff inspection</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-emerald-500/8 space-y-1">
          <span className="text-xs font-semibold text-emerald-600">Settled / Approved</span>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {refunds.filter((r) => r.status === "COMPLETED" || r.status === "APPROVED").length} Approved
          </div>
          <p className="text-[10px] text-gray-400">Reversed to customer wallet</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-purple-500/8 space-y-1">
          <span className="text-xs font-semibold text-purple-700">Total Settled BDT</span>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{formatBDT(totalRefundedSum)}</div>
          <p className="text-[10px] text-gray-400">Refund payout volume</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search refund claims by code, member, transaction, or item..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all shadow-md shadow-purple-500/5"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-2xl text-xs font-semibold">
          {(
            [
              { id: "ALL", label: "All Claims" },
              { id: "UNDER_REVIEW", label: "Under Review" },
              { id: "COMPLETED", label: "Completed" },
              { id: "REJECTED", label: "Rejected" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-gray-900 text-[#5B46F6] shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <RefundTable
        refunds={filteredRefunds}
        onOpenReview={(ref, action) => setReviewTarget({ refund: ref, action })}
      />

      {/* Review Dialog */}
      <RefundReviewDialog
        isOpen={reviewTarget !== null}
        action={reviewTarget?.action || null}
        refund={reviewTarget?.refund || null}
        onClose={() => setReviewTarget(null)}
        onConfirm={handleConfirmReview}
      />
    </div>
  );
}
