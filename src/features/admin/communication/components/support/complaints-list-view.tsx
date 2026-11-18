"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  Sparkles,
  Eye,
  Check,
  XCircle,
  FileText,
} from "lucide-react";
import { DEMO_COMPLAINTS } from "../../data/mock-communication";
import {
  PriorityBadge,
  ComplaintStatusBadge,
} from "../common/communication-status-badges";
import type { Complaint, ComplaintStatus } from "../../types/communication";

export function ComplaintsListView() {
  const [complaints, setComplaints] = useState<Complaint[]>(DEMO_COMPLAINTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.complaintNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reportedUserOrContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.reviewStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: ComplaintStatus, resolution?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              reviewStatus: newStatus,
              resolutionSummary: resolution || c.resolutionSummary,
              resolvedDate: newStatus === "RESOLVED" ? new Date().toISOString().split("T")[0] : c.resolvedDate,
            }
          : c
      )
    );
    setSelectedComplaint(null);
    setResolutionSummary("");
    triggerToast(`Complaint status set to ${newStatus} (Demo UI)`);
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
                href="/admin/communication/support/tickets"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Support Tickets
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Safety & Marketplace Integrity
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Member Complaints & Dispute Resolution
            </h1>
            <p className="text-sm text-slate-300">
              Investigate reports of counterfeit goods, courier fulfillment disputes, community harassment, and policy violations.
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search complaints, reported users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          >
            <option value="ALL">All Review Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </span>
      </div>

      {/* Complaints List Cards */}
      <div className="space-y-4">
        {filteredComplaints.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {item.complaintNumber}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {item.category.replace("_", " ")}
                  </span>
                  <PriorityBadge priority={item.priority} />
                  <ComplaintStatusBadge status={item.reviewStatus} />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  Target: {item.reportedUserOrContent}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.details}
                </p>

                {item.resolutionSummary && (
                  <div className="mt-2 rounded-xl bg-emerald-50/70 p-3 text-xs text-emerald-900">
                    <strong>Resolution Summary:</strong> {item.resolutionSummary}
                  </div>
                )}

                <div className="text-[11px] text-slate-400">
                  Filed by <strong className="text-slate-600">{item.reporterName}</strong> on {item.filedDate}
                  {item.resolvedDate && ` • Resolved on ${item.resolvedDate}`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:self-center">
                {item.reviewStatus === "PENDING" && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, "INVESTIGATING")}
                    className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                  >
                    Start Investigation
                  </button>
                )}

                {(item.reviewStatus === "PENDING" || item.reviewStatus === "INVESTIGATING") && (
                  <>
                    <button
                      onClick={() => setSelectedComplaint(item)}
                      className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                    >
                      Resolve Dispute
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "DISMISSED", "Dismissed after compliance review.")}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Resolve {selectedComplaint.complaintNumber}
                </h3>
                <p className="text-xs text-slate-500">{selectedComplaint.reportedUserOrContent}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resolution Summary & Actions Taken
              </label>
              <textarea
                rows={4}
                required
                placeholder="State the resolution outcome (e.g. refund issued, listing unlisted, warning issued)..."
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                className="w-full rounded-xl bg-slate-50 p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    selectedComplaint.id,
                    "RESOLVED",
                    resolutionSummary || "Resolved in accordance with community guidelines."
                  )
                }
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-500"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
