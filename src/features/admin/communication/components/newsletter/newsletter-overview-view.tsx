"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Send,
  Plus,
  MailCheck,
  TrendingUp,
  MousePointerClick,
  UserCheck,
  ArrowRight,
  Sparkles,
  Calendar
} from "lucide-react";
import {
  DEMO_NEWSLETTER_SUBSCRIBERS,
  DEMO_NEWSLETTER_CAMPAIGNS,
  formatDate
} from "../../data/mock-communication";

export function NewsletterOverviewView() {
  const activeSubscribers = DEMO_NEWSLETTER_SUBSCRIBERS.filter(
    (s) => s.status === "subscribed"
  ).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Users className="h-3.5 w-3.5" />
              <span>Community Engagement & Marketing</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Newsletter & Broadcasts
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Curate newsletters, inspect subscriber growth, monitor campaign engagement metrics, and segment audiences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/newsletter/subscribers"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <Users className="h-4 w-4" />
              Subscribers
            </Link>
            <Link
              href="/admin/communication/newsletter/campaigns/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Subscribers
            </span>
            <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">8,420</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+14.2% from last month</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Opt-In
            </span>
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <UserCheck className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              96.8%
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Verified double opt-in email addresses</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg. Open Rate
            </span>
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <MailCheck className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">42.6%</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-blue-600">
              <span>Industry benchmark: 21.3%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Click-Through Rate
            </span>
            <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <MousePointerClick className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">12.4%</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Top links: Grants & Summit stalls</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Column Section: Recent Campaigns & Growth Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Recent Campaigns</h2>
              <p className="text-xs text-slate-400">Published and scheduled newsletter broadcasts</p>
            </div>
            <Link
              href="/admin/communication/newsletter/campaigns"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              All campaigns <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_NEWSLETTER_CAMPAIGNS.map((camp) => (
              <div
                key={camp.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50/80 p-4 hover:bg-slate-100 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {camp.title}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${
                        camp.status === "sent"
                          ? "bg-emerald-50 text-emerald-700"
                          : camp.status === "scheduled"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Subject: <span className="text-slate-700">{camp.subject}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Target: {(camp.recipientCount || camp.subscriberCount || 0).toLocaleString()} {camp.audience}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  {camp.openRate !== undefined && (
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {camp.openRate}%
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">Open Rate</span>
                    </div>
                  )}
                  <Link
                    href={`/admin/communication/newsletter/campaigns/${camp.id}`}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:text-indigo-600"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Segment Breakdown (1 col) */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Subscriber Segments</h2>
            <p className="text-xs text-slate-400">Active distribution by member tier</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Verified Entrepreneurs</span>
                <span className="font-bold">3,840 (45.6%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-600 w-[45.6%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>VIP & Premium Members</span>
                <span className="font-bold">2,150 (25.5%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 w-[25.5%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>General Newsletter Signups</span>
                <span className="font-bold">1,890 (22.4%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500 w-[22.4%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Event Registrants</span>
                <span className="font-bold">540 (6.5%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500 w-[6.5%]" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/admin/communication/newsletter/subscribers"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 transition-colors"
            >
              Manage All Subscribers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
