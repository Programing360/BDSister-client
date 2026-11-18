"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Plus,
  Search,
  Calendar,
  Eye,
  MailCheck,
  MousePointerClick,
  CheckCircle2,
  Clock,
  ArrowLeft
} from "lucide-react";
import {
  DEMO_NEWSLETTER_CAMPAIGNS,
  formatDate
} from "../../data/mock-communication";
import type {
  NewsletterCampaign,
  CampaignStatus
} from "../../types/communication";

export function CampaignsListView() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>(
    DEMO_NEWSLETTER_CAMPAIGNS
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");

  const filtered = campaigns.filter((camp) => {
    const title = camp.title || camp.name || "";
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      camp.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || camp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/newsletter"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Send className="h-3.5 w-3.5" />
                <span>Broadcast Broadcasts & Newsletters</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Newsletter Campaigns
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Track delivery performance, engagement rates, and scheduled publication runs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/newsletter/campaigns/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "sent", "scheduled", "draft"] as const).map((status) => (
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

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((camp) => (
          <div
            key={camp.id}
            className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    camp.status === "sent"
                      ? "bg-emerald-50 text-emerald-700"
                      : camp.status === "scheduled"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      camp.status === "sent"
                        ? "bg-emerald-500"
                        : camp.status === "scheduled"
                        ? "bg-blue-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {camp.status}
                </span>

                <span className="text-xs text-slate-400 capitalize">
                  Audience: <strong className="text-slate-700">{camp.audience}</strong>
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">
                  {camp.title || camp.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                  Subject: <span className="text-slate-700 font-medium">{camp.subject}</span>
                </p>
              </div>

              {camp.status === "sent" ? (
                <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50/80 p-3 text-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Recipients</span>
                    <span className="text-sm font-bold text-slate-900">
                      {(camp.recipientCount || camp.subscriberCount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Open Rate</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {camp.openRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Click Rate</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {camp.clickRate}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50/80 p-3 text-xs text-slate-600 flex items-center justify-between">
                  <span>Planned Volume: {(camp.recipientCount || camp.subscriberCount || 0).toLocaleString()} recipients</span>
                  {camp.scheduledFor && (
                    <span className="font-medium text-blue-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(camp.scheduledFor)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {camp.sentAt
                  ? `Dispatched ${formatDate(camp.sentAt)}`
                  : `Created ${formatDate(camp.createdAt)}`}
              </span>

              <Link
                href={`/admin/communication/newsletter/campaigns/${camp.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                View Campaign
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
