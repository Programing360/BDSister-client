"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Inbox
} from "lucide-react";
import {
  DEMO_EMAIL_TEMPLATES,
  DEMO_EMAIL_LOGS,
  formatDate
} from "../../data/mock-communication";
import { DeliveryStatusBadge } from "../common/communication-status-badges";

export function EmailOverviewView() {
  const totalLogs = DEMO_EMAIL_LOGS.length;
  const delivered = DEMO_EMAIL_LOGS.filter((l) => l.status === "delivered").length;
  const deliveredPct = Math.round((delivered / totalLogs) * 100);
  const bounced = DEMO_EMAIL_LOGS.filter((l) => l.status === "bounced").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Mail className="h-3.5 w-3.5" />
              <span>Email Delivery & Template System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Email Management
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Transactional templates, webhook delivery verifications, automated notifications, and outbound mail tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/email/templates"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <FileCode className="h-4 w-4" />
              Templates
            </Link>
            <Link
              href="/admin/communication/email/logs"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Send className="h-4 w-4" />
              Delivery Logs
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Templates</span>
            <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <FileCode className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {DEMO_EMAIL_TEMPLATES.filter((t) => t.isActive).length}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Out of {DEMO_EMAIL_TEMPLATES.length} total defined</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Rate</span>
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600">
              {deliveredPct}%
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Target: &gt;98.5% inbox rate</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Volume</span>
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Send className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              14,250
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Via Resend SMTP / HTTP API</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bounce Count</span>
            <span className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {bounced}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Suppressed automatically</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: Active Templates + Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates Quick List */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Configured Templates</h2>
              <p className="text-xs text-slate-400">Core transactional and automated dispatches</p>
            </div>
            <Link
              href="/admin/communication/email/templates"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_EMAIL_TEMPLATES.slice(0, 4).map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3.5 hover:bg-slate-100 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 text-sm">{tpl.name}</span>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 uppercase">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{tpl.slug}</p>
                </div>

                <Link
                  href={`/admin/communication/email/templates/${tpl.id}`}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:text-indigo-600"
                >
                  Preview
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Dispatch Logs */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Recent Email Logs</h2>
              <p className="text-xs text-slate-400">Latest automated outbound deliveries</p>
            </div>
            <Link
              href="/admin/communication/email/logs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Full log <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_EMAIL_LOGS.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3.5 hover:bg-slate-100 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-medium text-slate-900 text-sm truncate max-w-[200px] sm:max-w-xs">
                    {log.recipientEmail || log.recipient}
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">
                    {log.subject}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <DeliveryStatusBadge status={(log.status as any)} />
                  <p className="text-[11px] text-slate-400">{formatDate(log.sentAt || log.createdDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
