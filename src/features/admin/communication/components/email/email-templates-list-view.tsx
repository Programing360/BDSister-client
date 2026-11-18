"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Eye,
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  Code2,
  Send,
  FileText,
  AlertCircle
} from "lucide-react";
import {
  DEMO_EMAIL_TEMPLATES,
  formatDate
} from "../../data/mock-communication";
import type {
  EmailTemplate,
  EmailTemplateCategory
} from "../../types/communication";

const CATEGORY_TABS: { key: EmailTemplateCategory | "all"; label: string }[] = [
  { key: "all", label: "All Templates" },
  { key: "auth", label: "Authentication" },
  { key: "membership", label: "Membership" },
  { key: "orders", label: "Orders & Billing" },
  { key: "notifications", label: "Notifications" },
  { key: "marketing", label: "Marketing" }
];

export function EmailTemplatesListView() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEMO_EMAIL_TEMPLATES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EmailTemplateCategory | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = templates.filter((tpl) => {
    const slug = tpl.slug || tpl.id || "";
    const matchesSearch =
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.subject.toLowerCase().includes(search.toLowerCase()) ||
      slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || tpl.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopySlug = (slug: string, id: string) => {
    navigator.clipboard?.writeText?.(slug);
    setCopiedId(id);
    showToast(`Template key "${slug}" copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    showToast("Template status updated (Demo state)");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium shadow-2xl shadow-indigo-500/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Mail className="h-3.5 w-3.5" />
              <span>System & Transactional Email Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Email Templates
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Manage system transactional emails, notifications, and event triggers with live variable insertion.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/email/logs"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <Send className="h-4 w-4" />
              Delivery Logs
            </Link>
            <Link
              href="/admin/communication/email/templates/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Template
            </Link>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by template name, subject, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === tab.key
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 capitalize">
                  <FileText className="h-3 w-3" />
                  {tpl.category}
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

              {/* Title & Subject */}
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {tpl.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                  Subject: <span className="text-slate-700">{tpl.subject}</span>
                </p>
              </div>

              {/* Code slug */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Code2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{tpl.slug}</span>
                </div>
                <button
                  onClick={() => handleCopySlug(tpl.slug || tpl.id, tpl.id)}
                  title="Copy slug identifier"
                  className="ml-2 text-slate-400 hover:text-indigo-600 shrink-0"
                >
                  {copiedId === tpl.id ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Variables preview */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Available Merge Tags
                </span>
                <div className="flex flex-wrap gap-1">
                  {tpl.variables.slice(0, 4).map((v) => (
                    <span
                      key={v}
                      className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                  {tpl.variables.length > 4 && (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                      +{tpl.variables.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Updated {formatDate(tpl.lastUpdated)}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/communication/email/templates/${tpl.id}`}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                  title="Preview Template"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/communication/email/templates/${tpl.id}/edit`}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  title="Edit Template"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center shadow-xl shadow-slate-200/50">
          <Mail className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-semibold text-slate-800">No templates found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search filters or create a new template.
          </p>
        </div>
      )}
    </div>
  );
}
