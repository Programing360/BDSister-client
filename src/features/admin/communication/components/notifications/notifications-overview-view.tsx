"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  Send,
  FileCode,
  History,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Smartphone,
  Mail,
  ShieldAlert
} from "lucide-react";
import {
  DEMO_NOTIFICATION_TEMPLATES,
  DEMO_NOTIFICATION_HISTORY,
  formatDate
} from "../../data/mock-communication";

export function NotificationsOverviewView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Bell className="h-3.5 w-3.5" />
              <span>Multi-Channel Notification Dispatcher</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Notification Management
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Configure in-app alerts, SMS triggers, system badges, and multi-channel notification audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/notifications/templates"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <FileCode className="h-4 w-4" />
              Templates
            </Link>
            <Link
              href="/admin/communication/notifications/history"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <History className="h-4 w-4" />
              Dispatch History
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Templates Active
            </span>
            <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <FileCode className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {DEMO_NOTIFICATION_TEMPLATES.length}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              System alerts, verification & orders
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today's Dispatches
            </span>
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <Bell className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">1,480</div>
            <div className="mt-1 text-xs text-emerald-600">
              99.2% in-app delivery success
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              SMS Gateways
            </span>
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Smartphone className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">Active</div>
            <div className="mt-1 text-xs text-slate-500">
              SSL Wireless / Greenweb BD
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Unread in-app rate
            </span>
            <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">18.4%</div>
            <div className="mt-1 text-xs text-slate-500">
              Read within 2 hours
            </div>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Notification Triggers</h2>
              <p className="text-xs text-slate-400">Predefined system alert workflows</p>
            </div>
            <Link
              href="/admin/communication/notifications/templates"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              All templates <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_NOTIFICATION_TEMPLATES.slice(0, 4).map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3.5 hover:bg-slate-100 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 text-sm">{tpl.name}</span>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 uppercase">
                      {tpl.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{tpl.titleTemplate || tpl.title || ""}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  {(tpl.channels || ["in_app", "email"]).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Recent Dispatches</h2>
              <p className="text-xs text-slate-400">Recent events pushed to user feeds</p>
            </div>
            <Link
              href="/admin/communication/notifications/history"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Full history <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_NOTIFICATION_HISTORY.slice(0, 4).map((item) => {
              const isRead = item.isRead !== undefined ? item.isRead : item.readStatus === "READ";
              const recipientDisplay = item.recipientName || item.recipient || "Member";
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3.5 hover:bg-slate-100 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-slate-900 text-sm truncate max-w-[200px] sm:max-w-xs">
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-[220px]">
                      {recipientDisplay} ({item.recipientEmail})
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isRead
                          ? "bg-slate-100 text-slate-600"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {isRead ? "Read" : "Unread"}
                    </span>
                    <p className="text-[11px] text-slate-400">{formatDate(item.sentAt || item.createdDate)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
