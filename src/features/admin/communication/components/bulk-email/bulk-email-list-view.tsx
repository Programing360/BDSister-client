"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  MailCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  ShieldAlert
} from "lucide-react";
import {
  DEMO_BULK_EMAIL_CAMPAIGNS,
  formatDate
} from "../../data/mock-communication";
import type { BulkEmailCampaign } from "../../types/communication";

export function BulkEmailListView() {
  const [campaigns, setCampaigns] = useState<BulkEmailCampaign[]>(
    DEMO_BULK_EMAIL_CAMPAIGNS
  );
  const [search, setSearch] = useState("");

  const filtered = campaigns.filter((c) => {
    const title = c.title || c.name || "";
    const criteria = c.targetCriteria || (c.audience as string) || "";
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      criteria.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Send className="h-3.5 w-3.5" />
              <span>Bulk Direct Email Dispatcher</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Bulk Email Campaigns
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Execute targeted bulk outreach to user groups, event attendees, or entrepreneurs based on dynamic filters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/bulk-email/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Bulk Dispatch
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Notice Warning */}
      <div className="rounded-2xl bg-amber-50 p-5 shadow-xl shadow-amber-500/5 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 space-y-1">
          <span className="font-bold block text-sm text-amber-900">
            Bulk Email Sandboxed Mode Notice
          </span>
          <p>
            This module provides preview capabilities and client simulated execution. In this frontend stage, no live emails are sent. Always check delivery criteria and spam compliance before initiating large-scale blasts.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bulk dispatches by title or criteria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    item.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "scheduled"
                      ? "bg-blue-50 text-blue-700"
                      : item.status === "sending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.status === "completed"
                        ? "bg-emerald-500"
                        : item.status === "scheduled"
                        ? "bg-blue-500"
                        : item.status === "sending"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {item.status}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  {item.recipientCount.toLocaleString()} recipients
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">
                  {item.title || item.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                  Subject: <span className="font-medium text-slate-700">{item.subject}</span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 space-y-1 text-xs">
                <div className="text-slate-500">
                  Target Criteria: <strong className="text-slate-800">{item.targetCriteria || item.audience || "All"}</strong>
                </div>
              </div>

              {item.status === "completed" && (
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 p-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sent</span>
                    <span className="text-xs font-bold text-slate-900">
                      {item.recipientCount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Delivered</span>
                    <span className="text-xs font-bold text-emerald-600">
                      {(item.deliveredCount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Failed</span>
                    <span className="text-xs font-bold text-rose-600">
                      {(item.failedCount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{formatDate(item.createdAt || item.createdDate)}</span>
              <span className="font-medium text-indigo-600">
                Created by {item.createdBy || "Admin"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
