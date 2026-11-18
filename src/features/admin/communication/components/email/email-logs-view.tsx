"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Search,
  RotateCw,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  MailCheck,
  Ban
} from "lucide-react";
import {
  DEMO_EMAIL_LOGS,
  formatDate
} from "../../data/mock-communication";
import { DeliveryStatusBadge } from "../common/communication-status-badges";
import type {
  EmailLog,
  EmailDeliveryStatus
} from "../../types/communication";

export function EmailLogsView() {
  const [logs, setLogs] = useState<EmailLog[]>(DEMO_EMAIL_LOGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmailDeliveryStatus | "all">("all");
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRetry = (logId: string) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? { ...l, status: "sent", errorSummary: undefined }
          : l
      )
    );
    showToast("Re-queue triggered (Simulated client action)");
  };

  const filtered = logs.filter((log) => {
    const recipient = log.recipientEmail || log.recipient || "";
    const matchesSearch =
      recipient.toLowerCase().includes(search.toLowerCase()) ||
      log.subject.toLowerCase().includes(search.toLowerCase()) ||
      log.templateName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || log.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium shadow-2xl shadow-indigo-500/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/email/templates"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Send className="h-3.5 w-3.5" />
                <span>Audit & Delivery Monitoring</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Email Dispatch Logs
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Inspect transaction records, delivery confirmations, webhook events, and failure diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Logs refreshed from live queue")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <RotateCw className="h-4 w-4" />
              Refresh Logs
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Delivered</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <MailCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {logs.filter((l) => l.status === "delivered").length}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending / In-Transit</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {logs.filter((l) => l.status === "pending" || l.status === "sent").length}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bounced</span>
            <span className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {logs.filter((l) => l.status === "bounced").length}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Failed</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Ban className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {logs.filter((l) => l.status === "failed").length}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by recipient email, subject, or template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "delivered", "sent", "bounced", "failed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Subject & Template</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sent At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {log.recipientEmail}
                    </div>
                    {log.errorSummary && (
                      <p className="mt-0.5 text-xs text-rose-500 line-clamp-1">
                        {log.errorSummary}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 line-clamp-1">
                      {log.subject}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Template: <span className="font-medium text-slate-700">{log.templateName}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <DeliveryStatusBadge status={log.status} />
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(log.sentAt)}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(log.status === "failed" || log.status === "bounced") && (
                        <button
                          onClick={() => handleRetry(log.id)}
                          className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Retry Sending"
                        >
                          <RotateCw className="h-4 w-4" />
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

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-lg">
                Email Dispatch Details
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400">Recipient</span>
                <p className="font-semibold text-slate-800">{selectedLog.recipientEmail}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Subject</span>
                <p className="font-medium text-slate-800">{selectedLog.subject}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Template</span>
                <p className="text-slate-700">{selectedLog.templateName}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Status</span>
                  <div className="mt-1">
                    <DeliveryStatusBadge status={selectedLog.status} />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Sent Date</span>
                  <p className="text-slate-700">{formatDate(selectedLog.sentAt)}</p>
                </div>
              </div>

              {selectedLog.errorSummary && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-800">
                  <span className="font-semibold block mb-0.5">Error Diagnosis:</span>
                  {selectedLog.errorSummary}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
