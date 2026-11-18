"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Eye,
  GitPullRequest,
  Check,
  RotateCcw,
} from "lucide-react";
import { DEMO_CONTENT_REVIEWS } from "../../data/mock-cms";
import type { ContentReview } from "../../types/cms";

export function ContentReviewsView() {
  const [reviews, setReviews] = useState<ContentReview[]>(DEMO_CONTENT_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === "all") return true;
    return r.reviewStatus === statusFilter;
  });

  const handleApprove = (id: string, title: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              reviewStatus: "APPROVED",
              reviewedBy: "Admin Superuser",
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    triggerToast(`Approved and published "${title}" (Demo UI)`);
  };

  const handleReject = (id: string, title: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              reviewStatus: "REJECTED",
              reviewedBy: "Admin Superuser",
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    triggerToast(`Rejected submission "${title}"`);
  };

  const getStatusBadge = (status: ContentReview["reviewStatus"]) => {
    switch (status) {
      case "APPROVED":
        return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Approved</span>;
      case "PENDING":
        return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">Pending Review</span>;
      case "UNDER_REVIEW":
        return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">Under Review</span>;
      case "CHANGES_REQUESTED":
        return <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">Changes Requested</span>;
      case "REJECTED":
        return <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">Rejected</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to CMS Overview
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Editorial Governance
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Content Review & Publishing Queue
            </h1>
            <p className="text-sm text-slate-300">
              Audit pending submissions from content writers and department leads before pushing changes live to production.
            </p>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto rounded-xl bg-slate-100 p-1">
          {["all", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st.toLowerCase().replace("_", " ")}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredReviews.length} submission(s)
        </span>
      </div>

      {/* Reviews Queue List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="overflow-hidden rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {review.contentType}
                  </span>
                  {getStatusBadge(review.reviewStatus)}
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {review.contentId}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {review.contentTitle}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Submitted by <strong className="text-slate-700">{review.submittedBy}</strong> on {review.submittedAt}
                </p>
                {review.notes && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    <strong className="text-slate-800">Submission Note:</strong> {review.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:self-center">
                {(review.reviewStatus === "PENDING" || review.reviewStatus === "UNDER_REVIEW") && (
                  <>
                    <button
                      onClick={() => handleApprove(review.id, review.contentTitle)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleReject(review.id, review.contentTitle)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </>
                )}
                {review.reviewStatus !== "PENDING" && review.reviewStatus !== "UNDER_REVIEW" && (
                  <span className="text-xs text-slate-400 font-medium">
                    Reviewed by {review.reviewedBy || "Admin"} on {review.reviewedAt}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
