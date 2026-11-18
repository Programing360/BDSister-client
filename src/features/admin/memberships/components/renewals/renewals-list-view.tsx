"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Info,
  ArrowLeft,
  Mail,
  UserCheck,
} from "lucide-react";
import { RenewalReviewModal } from "./renewal-review-modal";
import {
  DEMO_RENEWAL_REVIEWS,
  DEMO_MEMBERSHIP_DISCLAIMER,
} from "../../data/mock-memberships";
import { formatBDT } from "../../../payments/data/mock-payments";
import type { RenewalReviewItem } from "../../types/membership";

export function RenewalsListView() {
  const [reviews, setReviews] = useState<RenewalReviewItem[]>(DEMO_RENEWAL_REVIEWS);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<"ALL" | "EXPIRING_SOON" | "EXPIRED" | "UPCOMING">("ALL");
  const [selectedReview, setSelectedReview] = useState<RenewalReviewItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [search, statusTab]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCode = r.subscriptionCode.toLowerCase().includes(q);
        const matchName = r.memberName.toLowerCase().includes(q);
        const matchPlan = r.planName.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchPlan) return false;
      }

      if (statusTab !== "ALL" && r.status !== statusTab) {
        return false;
      }

      return true;
    });
  }, [reviews, search, statusTab]);

  const handleConfirmRenewal = (renewalId: string, action: "APPROVE_MANUAL" | "SEND_REMINDER") => {
    if (action === "APPROVE_MANUAL") {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === renewalId
            ? { ...r, status: "UPCOMING", daysRemaining: 365, adminNotes: "Manually renewed by staff." }
            : r
        )
      );
      setFeedbackToast("Manual renewal simulated: 12 months added to subscription.");
    } else {
      setFeedbackToast("Renewal reminder email & SMS simulated to member's phone.");
    }
    setTimeout(() => setFeedbackToast(null), 3500);
  };

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
        <Link href="/admin/subscriptions" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Subscriptions
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">Renewals Review Queue</span>
      </nav>

      {/* Header */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center border border-amber-200/80 dark:border-amber-800 shadow-lg shadow-amber-500/10">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Subscription Renewals & Expiration Queue
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Review upcoming expirations, dispatch renewal reminders, and manually confirm settled renewals
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/subscriptions"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Subscriptions</span>
        </Link>
      </div>

      {/* Demo Notice */}
      <div
        data-aos="fade-up"
        className="bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 shadow-md shadow-amber-500/5"
      >
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold">Manual Renewal Workflow: </span>
          {DEMO_MEMBERSHIP_DISCLAIMER} Any manual renewal confirmation executed in this queue is demonstration only and will not activate a live membership or charge real payment gateways.
        </div>
      </div>

      {/* Search & Tabs */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search renewal queue by member name, code, or tier..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all shadow-md shadow-amber-500/5"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-2xl text-xs font-semibold">
          {(
            [
              { id: "ALL", label: "All Items" },
              { id: "EXPIRING_SOON", label: "Expiring Soon" },
              { id: "EXPIRED", label: "Overdue Expired" },
              { id: "UPCOMING", label: "Upcoming / Active" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusTab === tab.id
                  ? "bg-white dark:bg-gray-900 text-[#5B46F6] shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Renewals Table */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-amber-500/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-gradient-to-r from-gray-50/90 via-amber-50/20 to-gray-50/90 text-gray-600 font-semibold border-b border-gray-200 text-[11px]">
              <tr>
                <th className="py-4 px-4">Subscription Code</th>
                <th className="py-4 px-4">Member Sister</th>
                <th className="py-4 px-4">Tier Plan</th>
                <th className="py-4 px-4">Renewal Amount</th>
                <th className="py-4 px-4">Expiration Date</th>
                <th className="py-4 px-4">Days Left</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 dark:text-gray-300">
              {filteredReviews.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-gray-900 dark:text-white">
                    {item.subscriptionCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{item.memberName}</div>
                    <span className="font-mono text-[10px] text-gray-400">{item.memberId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-purple-700 dark:text-purple-300">
                    {item.planName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                    {formatBDT(item.amountBDT)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">{item.currentExpiryDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold ${
                        item.daysRemaining < 0
                          ? "text-rose-600"
                          : item.daysRemaining <= 15
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.daysRemaining < 0
                        ? `${Math.abs(item.daysRemaining)}d overdue`
                        : `${item.daysRemaining} days`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.status === "UPCOMING"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.status === "EXPIRING_SOON"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReview(item)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 shadow-xs cursor-pointer"
                    >
                      <span>Review Renewal</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <RenewalReviewModal
        isOpen={selectedReview !== null}
        onClose={() => setSelectedReview(null)}
        item={selectedReview}
        onConfirmRenewal={handleConfirmRenewal}
      />
    </div>
  );
}
