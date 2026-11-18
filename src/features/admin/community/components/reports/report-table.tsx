"use client";

import React from "react";
import Link from "next/link";
import {
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { CommunityReport } from "../../types/community";
import {
  ReportStatusBadge,
  ReportCategoryBadge,
  ModerationPriorityBadge,
} from "../common/community-status-badge";

interface ReportTableProps {
  reports: CommunityReport[];
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  onEscalate: (id: string) => void;
}

export function ReportTable({
  reports,
  onResolve,
  onDismiss,
  onEscalate,
}: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-md">
        <Flag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-800">No grievance reports found</h3>
        <p className="text-xs text-gray-500 mt-1">Try clearing filters or search queries.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-xl shadow-purple-500/5">
        <table className="w-full text-left text-xs min-w-[1050px]">
          <thead className="bg-gray-50/75 border-b border-gray-100 uppercase tracking-wider text-gray-500 font-semibold">
            <tr>
              <th className="py-3.5 px-4 min-w-[200px]">Report Details</th>
              <th className="py-3.5 px-4 min-w-[150px]">Category</th>
              <th className="py-3.5 px-4 min-w-[220px]">Reported Content / Reason</th>
              <th className="py-3.5 px-4 min-w-[160px]">Reported Member</th>
              <th className="py-3.5 px-4 text-center">Priority</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <span className="font-mono text-purple-700 font-bold block">
                      {r.reportId}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      From: <strong className="text-gray-700">{r.reporter.name}</strong>
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      {new Date(r.reportedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <ReportCategoryBadge category={r.category} />
                </td>
                <td className="py-3.5 px-4">
                  <div className="space-y-1 max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                        {r.content.type}
                      </span>
                      <p className="font-semibold text-gray-900 truncate">
                        {r.content.title || r.content.preview}
                      </p>
                    </div>
                    <p className="text-xs text-amber-800 line-clamp-1 italic">
                      &ldquo;{r.reason}&rdquo;
                    </p>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-gray-900">{r.reportedMember.name}</p>
                    <span className="text-[11px] text-gray-500">{r.reportedMember.role}</span>
                    {r.reportedMember.warningCount > 0 && (
                      <span className="text-[10px] text-rose-600 block font-semibold">
                        ⚠️ {r.reportedMember.warningCount} prior warnings
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <ModerationPriorityBadge priority={r.priority} />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <ReportStatusBadge status={r.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/community/reports/${r.id}`}
                      className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </Link>
                    {r.status !== "RESOLVED" && (
                      <button
                        type="button"
                        onClick={() => onResolve(r.id)}
                        className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Mark Resolved"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {r.status !== "DISMISSED" && (
                      <button
                        type="button"
                        onClick={() => onDismiss(r.id)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Dismiss"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Fallback */}
      <div className="md:hidden space-y-3">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-xl border border-gray-100 bg-white shadow-md space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-purple-700 font-bold text-xs block">
                  {r.reportId}
                </span>
                <span className="text-xs text-gray-500">From {r.reporter.name}</span>
              </div>
              <ReportStatusBadge status={r.status} />
            </div>

            <div className="flex items-center gap-2">
              <ReportCategoryBadge category={r.category} />
              <ModerationPriorityBadge priority={r.priority} />
            </div>

            <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded-lg font-medium">
              Reason: {r.reason}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>Target: <strong>{r.reportedMember.name}</strong></span>
              <Link
                href={`/admin/community/reports/${r.id}`}
                className="px-3 py-1 rounded-lg bg-purple-600 text-white font-semibold text-xs"
              >
                Inspect
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
