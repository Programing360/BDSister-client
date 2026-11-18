"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { BusinessReportItem } from "../types/admin-business.ts";
import { DEMO_BUSINESS_REPORTS } from "../data/admin-business-reports-data.ts";
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Building2,
  ShieldAlert,
} from "lucide-react";

export function BusinessReportsView() {
  const [reports, setReports] = useState<BusinessReportItem[]>(DEMO_BUSINESS_REPORTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.businessName.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleResolve = (id: string) => {
    const notes = prompt("Enter resolution summary notes for this moderation ticket:");
    if (!notes) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "RESOLVED",
              resolutionNotes: notes,
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Admin Sadia Rahman",
            }
          : r
      )
    );
    setToastMessage("Report ticket marked as RESOLVED.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDismiss = (id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "DISMISSED",
              resolutionNotes: "Deemed unsubstantiated or compliant after audit.",
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Admin Sadia Rahman",
            }
          : r
      )
    );
    setToastMessage("Report ticket DISMISSED.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Businesses</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Business Reports & Moderation Grievances</h1>
          <p className="text-xs text-gray-500">
            Review member flags regarding non-compliant businesses, copyright disputes, or fraudulent solicitations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{reports.filter((r) => r.status === "PENDING" || r.status === "INVESTIGATING").length} Open Tickets</span>
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by business, reason, or reporter..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B46F6]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium"
          >
            <option value="ALL">All Reports</option>
            <option value="PENDING">Pending</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 font-medium">
                <th className="py-3 px-4 font-semibold">Reported Business</th>
                <th className="py-3 px-4 font-semibold">Violation Reason & Details</th>
                <th className="py-3 px-4 font-semibold">Reporter</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Resolution Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/businesses/${r.businessId}`}
                      className="font-semibold text-gray-900 hover:text-[#5B46F6] transition-colors"
                    >
                      {r.businessName}
                    </Link>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">{r.businessCode}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-md">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px] uppercase">
                      {r.reason.replace(/_/g, " ")}
                    </span>
                    <p className="text-gray-700 mt-1 line-clamp-2">{r.description}</p>
                    {r.resolutionNotes && (
                      <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200">
                        <span className="font-semibold">Resolution:</span> {r.resolutionNotes}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-900">{r.reporterName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{r.reporterEmail}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        r.priority === "URGENT"
                          ? "bg-rose-100 text-rose-800 border-rose-300 animate-pulse"
                          : r.priority === "HIGH"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {r.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        r.status === "RESOLVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : r.status === "DISMISSED"
                          ? "bg-gray-100 text-gray-600 border-gray-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {r.status !== "RESOLVED" && (
                        <button
                          onClick={() => handleResolve(r.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors shadow-xs"
                        >
                          Resolve
                        </button>
                      )}
                      {r.status !== "DISMISSED" && (
                        <button
                          onClick={() => handleDismiss(r.id)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-medium transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
