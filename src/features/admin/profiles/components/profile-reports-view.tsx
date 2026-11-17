"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  X,
  Filter,
} from "lucide-react";
import {
  ProfileReportStatusBadge,
  ProfilePriorityBadge,
} from "./profile-status-badges";
import { DEMO_PROFILE_REPORTS } from "../data/admin-profile-reports-data";
import type {
  ProfileReportItem,
  ProfileReportStatus,
  ProfileReportReason,
} from "../types/admin-profile";

export function ProfileReportsView() {
  const [reports, setReports] = useState<ProfileReportItem[]>(DEMO_PROFILE_REPORTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProfileReportStatus>("ALL");
  const [selectedReport, setSelectedReport] = useState<ProfileReportItem | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const filtered = reports.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.profileName.toLowerCase().includes(q) ||
        r.reportingMemberName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleResolve = (status: "RESOLVED" | "DISMISSED") => {
    if (!selectedReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? {
              ...r,
              status,
              resolutionNote: resolutionNote.trim() || (status === "RESOLVED" ? "Marked as resolved." : "Dismissed after review."),
              resolvedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : r
      )
    );

    setFeedbackToast(`Report ${selectedReport.id} marked as ${status.toLowerCase()}!`);
    setSelectedReport(null);
    setResolutionNote("");
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/profiles" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Profile Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">Profile Reports & Flags</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Profile Reports & Safety Inquiries
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Investigate member-reported inaccurate claims, impersonation, copyright, or spam
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/profiles"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-800 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Profiles</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by reported name, reporting sister, ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-[#5B46F6]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | ProfileReportStatus)}
            className="px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium"
          >
            <option value="ALL">All Report Statuses</option>
            <option value="PENDING">Pending Investigation</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200/80 dark:border-gray-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Reported Member</th>
                <th className="p-4">Reported By</th>
                <th className="p-4">Reason Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {filtered.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-gray-900 dark:text-white">
                    {report.id}
                  </td>
                  <td className="p-4">
                    <div>
                      <Link
                        href={`/admin/profiles/${report.profileId}`}
                        className="font-bold text-gray-900 dark:text-white hover:text-[#5B46F6]"
                      >
                        {report.profileName}
                      </Link>
                      <p className="text-[11px] text-gray-400">{report.profileProfession}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{report.reportingMemberName}</p>
                    <span className="font-mono text-[10px] text-gray-400">{report.reportingMemberId}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                      {report.reason.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <ProfilePriorityBadge priority={report.priority} />
                  </td>
                  <td className="p-4">
                    <ProfileReportStatusBadge status={report.status} />
                  </td>
                  <td className="p-4 text-gray-400 text-[11px]">
                    {report.submittedAt}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Report #{selectedReport.id}: {selectedReport.reason.replace(/_/g, " ")}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Submitted by {selectedReport.reportingMemberName} on {selectedReport.submittedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 block text-[10px]">Reported Profile</span>
                  <Link
                    href={`/admin/profiles/${selectedReport.profileId}`}
                    className="font-bold text-gray-900 dark:text-white hover:text-[#5B46F6]"
                  >
                    {selectedReport.profileName} ({selectedReport.profileMemberId})
                  </Link>
                </div>
                <ProfilePriorityBadge priority={selectedReport.priority} />
              </div>

              <div>
                <span className="text-gray-400 font-semibold block mb-1">Reporter Statement</span>
                <p className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.resolutionNote && (
                <div>
                  <span className="text-gray-400 font-semibold block mb-1">Staff Resolution Note</span>
                  <p className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {selectedReport.resolutionNote}
                  </p>
                </div>
              )}

              {selectedReport.status !== "RESOLVED" && selectedReport.status !== "DISMISSED" && (
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Staff Resolution Explanation
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Log resolution steps taken (e.g., contacted member, removed misleading images)..."
                    className="w-full p-2.5 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-hidden focus:border-[#5B46F6]"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <Link
                href={`/admin/profiles/${selectedReport.profileId}`}
                className="text-xs font-semibold text-[#5B46F6] hover:underline flex items-center gap-1"
              >
                <span>Open Full Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              {selectedReport.status !== "RESOLVED" && selectedReport.status !== "DISMISSED" ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleResolve("DISMISSED")}
                    className="px-3.5 py-1.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Dismiss Report
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve("RESOLVED")}
                    className="px-3.5 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    Resolve Report
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-1.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
