"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ArrowLeft,
  Search,
  CheckCircle2,
  Code2,
  Send,
  Eye,
  SlidersHorizontal,
  Smartphone,
  Mail,
  AppWindow
} from "lucide-react";
import {
  DEMO_NOTIFICATION_TEMPLATES
} from "../../data/mock-communication";
import type {
  NotificationTemplate,
  NotificationType
} from "../../types/communication";

export function NotificationTemplatesView() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(
    DEMO_NOTIFICATION_TEMPLATES
  );
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    showToast("Notification trigger status updated (Demo state)");
  };

  const filtered = templates.filter((tpl) => {
    const title = tpl.titleTemplate || tpl.title || "";
    const slug = tpl.slug || tpl.id || "";
    return (
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      slug.toLowerCase().includes(search.toLowerCase())
    );
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
                href="/admin/communication/notifications"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Bell className="h-3.5 w-3.5" />
                <span>Trigger Definitions</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Notification Templates
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Configure copy templates, dynamic variable placeholders, and delivery channels for automated alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates by trigger name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 capitalize">
                  {tpl.type}
                </span>

                <button
                  onClick={() => handleToggleActive(tpl.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    tpl.isActive
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      tpl.isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {tpl.isActive ? "Active" : "Disabled"}
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {tpl.name}
                </h3>
                <div className="mt-1 font-mono text-xs text-slate-500 truncate">
                  {tpl.slug}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs">
                <div className="font-medium text-slate-800 line-clamp-1">
                  Title: <span className="font-normal text-slate-600">{tpl.titleTemplate}</span>
                </div>
                <div className="font-normal text-slate-600 line-clamp-2">
                  Body: {tpl.bodyTemplate}
                </div>
              </div>

              {/* Channels */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Channels
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(tpl.channels || ["in_app", "email"]).map((ch) => (
                    <span
                      key={ch}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 capitalize"
                    >
                      {ch.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Variables */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Variables
                </span>
                <div className="flex flex-wrap gap-1">
                  {(tpl.variables || tpl.availableVariables || []).map((v) => (
                    <span
                      key={v}
                      className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
