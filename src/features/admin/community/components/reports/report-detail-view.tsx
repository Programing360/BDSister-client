"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flag,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Send,
  User,
  ExternalLink,
} from "lucide-react";
import { CommunityReport, ReportStatus } from "../../types/community";
import {
  ReportStatusBadge,
  ReportCategoryBadge,
  ModerationPriorityBadge,
} from "../common/community-status-badge";

interface ReportDetailViewProps {
  report: CommunityReport;
}

export function ReportDetailView({ report: initialData }: ReportDetailViewProps) {
  const [report, setReport] = useState(initialData);
  const [resolutionNotes, setResolutionNotes] = useState(
    initialData.resolutionNotes || ""
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = (newStatus: ReportStatus) => {
    setReport((prev) => ({
      ...prev,
      status: newStatus,
      resolutionNotes,
      history: [
        {
          action: `STATUS_CHANGED_${newStatus}`,
          actor: "Admin (You)",
          timestamp: new Date().toISOString(),
          note: resolutionNotes || `Report status transitioned to ${newStatus}`,
        },
        ...prev.history,
      ],
    }));
    showToast(`Report marked as ${newStatus} (DEMO ONLY — simulated action).`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/admin/community/reports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {report.status !== "RESOLVED" && (
            <button
              type="button"
              onClick={() => handleStatusChange("RESOLVED")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Resolve Report
            </button>
          )}
          {report.status !== "ESCALATED" && (
            <button
              type="button"
              onClick={() => handleStatusChange("ESCALATED")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Escalate to Lead
            </button>
          )}
          {report.status !== "DISMISSED" && (
            <button
              type="button"
              onClick={() => handleStatusChange("DISMISSED")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Dismiss Report
            </button>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Report Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {report.reportId}
              </span>
              <ReportCategoryBadge category={report.category} />
              <ModerationPriorityBadge priority={report.priority} />
              <ReportStatusBadge status={report.status} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Community Grievance Investigation
            </h1>
            <p className="text-xs text-gray-400">
              Reported on{" "}
              {new Date(report.reportedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Reason Banner */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Reported Violation Summary:
          </span>
          <p className="text-sm font-medium">{report.reason}</p>
        </div>

        {/* Reporter vs Reported Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reporter */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Filing Sister (Reporter)
            </span>
            <p className="text-sm font-bold text-gray-900">{report.reporter.name}</p>
            <p className="text-xs text-gray-500">{report.reporter.email}</p>
            <span className="text-[11px] text-emerald-600 font-semibold block pt-1">
              Protected Identity • Privacy Shield Active
            </span>
          </div>

          {/* Reported Member */}
          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
              Reported Member Account
            </span>
            <p className="text-sm font-bold text-gray-900">{report.reportedMember.name}</p>
            <p className="text-xs text-gray-500">{report.reportedMember.role}</p>
            {report.reportedMember.warningCount > 0 ? (
              <span className="text-[11px] text-rose-700 font-semibold block pt-1">
                ⚠️ {report.reportedMember.warningCount} prior official warnings on record
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 block pt-1">
                First reported offense
              </span>
            )}
          </div>
        </div>

        {/* Reported Content Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Reported Item Context ({report.content.type})
            </span>
            <Link
              href={report.content.url}
              className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
            >
              Open Original Target
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800 whitespace-pre-line leading-relaxed">
            {report.content.title && (
              <p className="font-bold text-sm text-gray-900 mb-1">
                {report.content.title}
              </p>
            )}
            {report.content.preview}
          </div>
        </div>

        {/* Resolution Notes Input */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Resolution Finding & Internal Action Log
          </label>
          <textarea
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Document administrative decision rationale, communication with parties, or remedial actions..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
          />
        </div>

        {/* Audit History */}
        {report.history && report.history.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Report Audit Trail
            </span>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 text-xs bg-gray-50/30">
              {report.history.map((h, i) => (
                <div key={i} className="p-3">
                  <span className="font-bold text-gray-900">{h.action}</span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-gray-600 font-medium">{h.actor}</span>
                  <p className="text-gray-500 mt-0.5">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
