"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Info,
  Clock,
  Loader2,
} from "lucide-react";
import { VerificationKpiCards } from "./verification-kpi-cards";
import { VerificationTable } from "./verification-table";
import {
  DEMO_VERIFICATION_SUBMISSIONS,
  DEMO_VERIFICATION_KPIS,
  DEMO_VERIFICATION_DISCLAIMER,
} from "../data/admin-verifications-data";
import { AdminVerificationSubmission } from "../types/admin-verification";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface VerificationsListViewProps {
  initialStatusFilter?: string;
  isPendingQueueOnly?: boolean;
}

export function VerificationsListView({
  initialStatusFilter = "ALL",
  isPendingQueueOnly = false,
}: VerificationsListViewProps) {
  const [activeFilter, setActiveFilter] = useState(initialStatusFilter);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<AdminVerificationSubmission[]>(
    DEMO_VERIFICATION_SUBMISSIONS
  );
  const [kpis, setKpis] = useState(DEMO_VERIFICATION_KPIS);

  const fetchLiveSubmissions = async () => {
    try {
      const res = await apiClient.get<any[]>(API_ENDPOINTS.verification.adminList);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const liveList = res.data.map((item) => ({
          id: item.id,
          submissionId: item.id.startsWith("ver_") || item.id.startsWith("BDS-")
            ? item.id
            : `BDS-VER-${item.id.slice(-6).toUpperCase()}`,
          memberId: item.userId || "BDS-MEM-NEW",
          memberName: item.userName || "Sister Member",
          memberEmail: item.userEmail || "",
          memberPhone: "+880 1700-000000",
          memberAvatar: null,
          memberLocation: "Dhaka, Bangladesh",
          documentType: item.docType === "PASSPORT" ? "PASSPORT" : "NATIONAL_ID",
          documentNumberMasked: item.idNumberMasked
            ? `${item.docType || "NID"}: ${item.idNumberMasked}`
            : "NID: ****",
          submittedAt: item.submittedAt
            ? new Date(item.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent",
          status: item.status,
          assignedReviewer: item.assignedOfficerName
            ? { name: item.assignedOfficerName, role: "Female Verification Officer" }
            : undefined,
          priority: item.priority || "NORMAL",
          isUrgent: item.status === "PENDING",
          documents: [
            {
              id: `doc_${item.id}_front`,
              type: item.docType === "PASSPORT" ? "PASSPORT_PAGE" : "NID_FRONT",
              title: `${item.docType || "NID"} Front Scan`,
              samplePreviewWatermark: "BDSISTERS SECURE VAULT",
              uploadedAt: item.submittedAt || new Date().toISOString(),
              fileSize: "2.4 MB",
              fileFormat: "IMAGE/PDF",
            },
          ],
          reviewHistory: [],
          rejectionReason: item.rejectionReason,
          adminReviewNotes: item.adminNotes,
        }));

        setSubmissions(liveList as AdminVerificationSubmission[]);

        // Recalculate KPIs based on live records
        const pending = liveList.filter((s) => s.status === "PENDING").length;
        const underReview = liveList.filter((s) => s.status === "UNDER_REVIEW").length;
        const verified = liveList.filter((s) => s.status === "APPROVED").length;
        const rejected = liveList.filter((s) => s.status === "REJECTED").length;
        const actionReq = liveList.filter((s) => s.status === "ACTION_REQUIRED").length;

        setKpis({
          totalSubmissions: liveList.length,
          pendingReview: pending,
          underReview,
          verified,
          rejected,
          actionRequired: actionReq,
        });
      }
    } catch {
      // Retain demo fallback dataset
    }
  };

  useEffect(() => {
    fetchLiveSubmissions();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveSubmissions();
    setIsRefreshing(false);
    setFeedbackToast("Verification submissions refreshed from queue.");
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const displayedSubmissions = isPendingQueueOnly
    ? submissions.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW")
    : submissions;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedbackToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          {feedbackToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 dark:border-gray-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-[#111827] dark:text-white sm:text-3xl">
              {isPendingQueueOnly ? "Pending Identity Verifications" : "Identity Verifications"}
            </h1>
            <span className="rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 px-3 py-0.5 text-xs font-bold text-[#5B46F6]">
              {isPendingQueueOnly ? "Focused Queue" : "Compliance Portal"}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-400">
            {isPendingQueueOnly
              ? "Priority queue of submissions awaiting auditor inspection and verification decision."
              : "Review Bangladeshi national identity documents, passports, and audit compliance submissions."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {isPendingQueueOnly ? (
            <Link
              href="/admin/verifications"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition"
            >
              All Verifications
            </Link>
          ) : (
            <Link
              href="/admin/verifications/pending"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition shadow-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              Pending Queue (38)
            </Link>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh queue"
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 shadow-2xs hover:border-[#5B46F6]/40 hover:text-[#5B46F6] transition disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#5B46F6]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Synthetic Demonstration Disclaimer Banner */}
      <div className="rounded-2xl border border-purple-200/70 bg-purple-50/60 dark:bg-purple-950/20 dark:border-purple-900/40 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#5B46F6] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5B46F6] uppercase tracking-wider">
                Synthetic Document Simulation Mode
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#4B5563] dark:text-gray-300">
              {DEMO_VERIFICATION_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <VerificationKpiCards
        kpis={kpis}
        activeFilter={activeFilter}
        onFilterClick={(status) => setActiveFilter(status)}
      />

      {/* Submissions Table */}
      <VerificationTable
        submissions={displayedSubmissions}
        initialStatusFilter={activeFilter}
      />
    </div>
  );
}
