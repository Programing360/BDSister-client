"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Megaphone,
  CheckCircle2,
  Pin,
  Calendar,
  AlertCircle,
  Eye,
  Sparkles
} from "lucide-react";
import {
  DEMO_ANNOUNCEMENTS
} from "../../data/mock-communication";
import {
  AnnouncementTypeBadge
} from "../common/communication-status-badges";
import type {
  PlatformAnnouncement,
  AnnouncementType
} from "../../types/communication";

interface Props {
  announcementId?: string;
}

export function AnnouncementForm({ announcementId }: Props) {
  const router = useRouter();
  const existing = announcementId
    ? DEMO_ANNOUNCEMENTS.find((a) => a.id === announcementId)
    : undefined;

  const [title, setTitle] = useState(existing?.title || "");
  const [content, setContent] = useState(existing?.content || existing?.description || "");
  const [type, setType] = useState<AnnouncementType>(
    (existing?.type || existing?.announcementType || "info") as AnnouncementType
  );
  const [targetAudience, setTargetAudience] = useState<"all" | "public" | "members" | "admins">(
    ((existing?.targetAudience as any) || "all")
  );
  const [isPinned, setIsPinned] = useState(existing?.isPinned || false);
  const [actionLabel, setActionLabel] = useState(existing?.actionLabel || existing?.actionText || "");
  const [actionUrl, setActionUrl] = useState(existing?.actionUrl || "");
  const [expiresAt, setExpiresAt] = useState(existing?.expiresAt || existing?.endDate || "");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      existing
        ? "Announcement updated successfully! (Demo action)"
        : "Announcement published successfully! (Demo action)"
    );
    setTimeout(() => {
      router.push("/admin/communication/announcements");
    }, 1200);
  };

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
                href="/admin/communication/announcements"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Megaphone className="h-3.5 w-3.5" />
                <span>Banner & Broadcast Authoring</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {existing ? "Edit Announcement" : "Create Platform Announcement"}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Configure banner alerts, target audience filters, expiration schedules, and call-to-action buttons.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls (2 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Announcement Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Scheduled Maintenance: Database optimization window"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Announcement Message
              </label>
              <textarea
                rows={5}
                placeholder="Write the full announcement text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 p-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Action Link Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Learn More / Register Now"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Action Target URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /events/annual-summit"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                href="/admin/communication/announcements"
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors"
              >
                {existing ? "Update Announcement" : "Publish Announcement"}
              </button>
            </div>
          </div>
        </form>

        {/* Sidebar Settings & Preview (1 Col) */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <h3 className="font-semibold text-slate-900 text-base">Display & Targeting</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Announcement Severity
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["info", "warning", "success", "critical"] as AnnouncementType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-xl py-2 px-3 text-xs font-semibold capitalize transition-all ${
                      type === t
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
                <option value="all">All Visitors & Members</option>
                <option value="public">Public Anonymous Visitors</option>
                <option value="members">Verified Logged-in Members</option>
                <option value="admins">Admin Team Only</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Pin to Top of Dashboard
                  </span>
                  <span className="text-[11px] text-slate-500">
                    High priority global alert banner
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Auto-Expire Date (Optional)
              </label>
              <input
                type="date"
                value={expiresAt ? expiresAt.split("T")[0] : ""}
                onChange={(e) => setExpiresAt(e.target.value ? `${e.target.value}T23:59:59Z` : "")}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {/* Live Banner Preview Card */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm">Banner Live Preview</h3>
            <div
              className={`rounded-xl p-4 text-xs space-y-2 ${
                type === "critical"
                  ? "bg-rose-50 text-rose-900"
                  : type === "warning"
                  ? "bg-amber-50 text-amber-900"
                  : type === "success"
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-blue-50 text-blue-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <AnnouncementTypeBadge type={type} />
                {isPinned && (
                  <span className="text-[10px] font-bold text-amber-700 uppercase">
                    📌 Pinned
                  </span>
                )}
              </div>
              <p className="font-bold">{title || "Your Announcement Title"}</p>
              <p className="text-[11px] opacity-90">
                {content || "Your message preview will appear here..."}
              </p>
              {actionLabel && (
                <span className="inline-block font-semibold underline text-[11px] mt-1">
                  {actionLabel} &rarr;
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
