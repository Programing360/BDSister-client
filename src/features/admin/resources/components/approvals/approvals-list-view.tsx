"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type {
  ResourceApprovalRecord,
  ApprovalStatus,
  ApprovalPriority,
} from "../../types/resource";
import { DEMO_APPROVALS } from "../../data/mock-resources";
import {
  ApprovalPriorityBadge,
  ApprovalStatusBadge,
  ResourceTypeBadge,
} from "../common/resource-status-badge";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  FileCheck2,
  Check,
  X,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

interface ApprovalsListViewProps {
  initialApprovals?: ResourceApprovalRecord[];
}

export function ApprovalsListView({
  initialApprovals,
}: ApprovalsListViewProps) {
  const [approvals, setApprovals] =
    useState<ResourceApprovalRecord[]>(initialApprovals || DEMO_APPROVALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [selectedRecord, setSelectedRecord] =
    useState<ResourceApprovalRecord | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const filteredApprovals = useMemo(() => {
    return approvals.filter((appr) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = appr.resourceTitle.toLowerCase().includes(q);
        const matchesAuthor =
          appr.contributorName.toLowerCase().includes(q) ||
          appr.contributorEmail.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor) return false;
      }
      if (statusFilter !== "ALL" && appr.reviewStatus !== statusFilter) return false;
      if (priorityFilter !== "ALL" && appr.priority !== priorityFilter)
        return false;
      return true;
    });
  }, [approvals, searchQuery, statusFilter, priorityFilter]);

  const handleApprove = (record: ResourceApprovalRecord) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === record.id
          ? {
              ...a,
              reviewStatus: "APPROVED",
              timeline: [
                ...a.timeline,
                {
                  status: "APPROVED",
                  timestamp: new Date().toISOString(),
                  reviewer: "Admin Reviewer",
                  note: "Submission meets editorial standards.",
                },
              ],
            }
          : a
      )
    );
    setFeedbackMessage(
      `Resource "${record.resourceTitle}" approved and published to live catalog! (Demo only - not persisted to backend)`
    );
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const openRejectModal = (record: ResourceApprovalRecord) => {
    setSelectedRecord(record);
    setRejectReasonInput("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedRecord) return;
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === selectedRecord.id
          ? {
              ...a,
              reviewStatus: "REJECTED",
              internalNotes:
                rejectReasonInput.trim() ||
                "Does not meet editorial guidelines for public distribution.",
              timeline: [
                ...a.timeline,
                {
                  status: "REJECTED",
                  timestamp: new Date().toISOString(),
                  reviewer: "Admin Reviewer",
                  note: rejectReasonInput.trim() || "Rejected by editorial board.",
                },
              ],
            }
          : a
      )
    );
    setIsRejectModalOpen(false);
    setFeedbackMessage(
      `Submission for "${selectedRecord.resourceTitle}" rejected. Author notified. (Demo only)`
    );
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const handleRequestRevision = (record: ResourceApprovalRecord) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === record.id
          ? {
              ...a,
              reviewStatus: "CHANGES_REQUESTED",
              internalNotes: "Editorial team requested citations and high-res cover image.",
              timeline: [
                ...a.timeline,
                {
                  status: "CHANGES_REQUESTED",
                  timestamp: new Date().toISOString(),
                  reviewer: "Admin Reviewer",
                  note: "Revision requested.",
                },
              ],
            }
          : a
      )
    );
    setFeedbackMessage(
      `Revision requested for "${record.resourceTitle}". (Demo only)`
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const pendingCount = approvals.filter((a) => a.reviewStatus === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link
              href="/admin/resources"
              className="hover:text-[#5B46F6] transition-colors"
            >
              Resources
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Approvals</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE6F7] text-[#5B46F6]">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Editorial Reviews & Approvals
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Review community and mentor submissions, enforce quality guidelines, approve, or request revisions.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-pink-50/20 p-3.5 text-xs text-indigo-950 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-semibold text-[#5B46F6]">
            Editorial Workflow Queue:
          </span>
          <span>DEMO DATA — Not connected to live learning services.</span>
        </div>
        <span className="text-slate-500 font-medium hidden sm:inline">
          {pendingCount} Submissions Awaiting Moderation
        </span>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <span className="font-medium">{feedbackMessage}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search submissions by title or author..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="CHANGES_REQUESTED">Changes Requested</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approvals Table / Grid */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {filteredApprovals.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No submissions match your current review queue filters.
            </div>
          ) : (
            filteredApprovals.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <ApprovalStatusBadge status={item.reviewStatus} />
                    <ApprovalPriorityBadge priority={item.priority} />
                    <ResourceTypeBadge type={item.resourceType} />
                    <span className="text-xs font-medium text-slate-500">
                      {item.categoryName}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.resourceTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-[#EAE6F7] flex items-center justify-center font-bold text-[10px] text-[#5B46F6]">
                        {item.contributorName.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-700">
                        {item.contributorName}
                      </span>
                      <span className="text-slate-400">({item.contributorEmail})</span>
                    </div>

                    <span>
                      Submitted: {new Date(item.submittedDate).toLocaleDateString()}
                    </span>
                  </div>

                  {item.internalNotes && (
                    <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item.internalNotes}</span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
                  <Link
                    href={`/admin/resources/${item.resourceId}`}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-[#5B46F6] hover:bg-slate-50 transition"
                    title="Inspect Resource"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  {(item.reviewStatus === "PENDING" || item.reviewStatus === "UNDER_REVIEW") && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRequestRevision(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition"
                      >
                        Revision
                      </button>

                      <button
                        type="button"
                        onClick={() => openRejectModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-600" />
                Reject Submission
              </h3>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Provide feedback for <span className="font-bold text-slate-900">"{selectedRecord.resourceTitle}"</span>. The submitting author will receive this message.
            </p>

            <textarea
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder="Specify rationale (e.g. promotional content, missing citations, copyright issues)..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-rose-500 focus:outline-none transition shadow-sm"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 transition shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
