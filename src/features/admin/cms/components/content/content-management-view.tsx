"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";
import { DEMO_WEBSITE_CONTENT } from "../../data/mock-cms";
import type { WebsiteContentItem } from "../../types/cms";

export function ContentManagementView() {
  const [contentItems, setContentItems] = useState<WebsiteContentItem[]>(DEMO_WEBSITE_CONTENT);
  const defaultItem = DEMO_WEBSITE_CONTENT[0] || {
    id: "cnt-01",
    contentType: "ABOUT" as const,
    title: "About BDSisters.org",
    content: "Empowering Bangladeshi women entrepreneurs.",
    status: "PUBLISHED" as const,
    lastUpdated: "2026-02-12T09:30:00Z",
    updatedBy: "Sabrina Hossain",
    version: 1,
  };
  const [selectedId, setSelectedId] = useState<string>(defaultItem.id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeItem = contentItems.find((c) => c.id === selectedId) || defaultItem;
  const [title, setTitle] = useState(activeItem.title);
  const [content, setContent] = useState(activeItem.content);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectId = (id: string) => {
    setSelectedId(id);
    const target = contentItems.find((c) => c.id === id);
    if (target) {
      setTitle(target.title);
      setContent(target.content);
    }
  };

  const handleSave = () => {
    const updated = contentItems.map((c) =>
      c.id === selectedId
        ? {
            ...c,
            title,
            content,
            lastUpdated: new Date().toISOString(),
            version: c.version + 1,
          }
        : c
    );
    setContentItems(updated);
    triggerToast(`"${title}" saved successfully (Demo UI)`);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to CMS Overview
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Core Website Documents
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Static Content & Policies Management
            </h1>
            <p className="text-sm text-slate-300">
              Maintain regulatory terms, privacy notices, community guidelines, and about narratives for BDSisters.org.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Document Changes
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Main Workspace (Left Document Selector & Right Editor) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Document Selector Column */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Standard Documents ({contentItems.length})
          </h3>
          <div className="space-y-2">
            {contentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectId(item.id)}
                className={`w-full text-left rounded-2xl p-4 transition-all ${
                  selectedId === item.id
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"
                    : "bg-white text-slate-700 shadow-lg shadow-slate-200/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className={`h-4 w-4 ${selectedId === item.id ? "text-indigo-200" : "text-indigo-600"}`} />
                  <span className="text-xs font-bold">{item.title}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] opacity-75">
                  <span>v{item.version} • {item.status}</span>
                  <span>{item.contentType}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor & Preview Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                  Type: {activeItem.contentType} • Version {activeItem.version}
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full text-xl font-bold text-slate-900 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Document Body Content (Markdown & Plaintext supported)
              </label>
              <textarea
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 p-5 font-mono text-xs leading-relaxed text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner"
              />
            </div>

            {/* Live Reading Preview */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Live Public Reader Preview
              </h4>
              <div className="rounded-2xl bg-slate-50/60 p-6 leading-relaxed text-xs text-slate-700 space-y-3">
                {content.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
