"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  Search,
  Pin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import {
  DEMO_ANNOUNCEMENTS,
  formatDate
} from "../../data/mock-communication";
import {
  AnnouncementStatusBadge,
  AnnouncementTypeBadge
} from "../common/communication-status-badges";
import type {
  PlatformAnnouncement,
  AnnouncementStatus
} from "../../types/communication";

export function AnnouncementsListView() {
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(
    DEMO_ANNOUNCEMENTS
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AnnouncementStatus | "all">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
    showToast("Announcement pin state updated (Demo action)");
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast("Announcement removed from view (Demo action)");
  };

  const filtered = announcements.filter((item) => {
    const contentText = item.content || item.description || "";
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      contentText.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
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
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Megaphone className="h-3.5 w-3.5" />
              <span>Platform Notification Banners & Alerts</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Platform Announcements
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Broadcast critical platform notices, maintenance alerts, festive greetings, and member bulletins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/announcements/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Announcement
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
              placeholder="Search announcements by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "active", "draft", "scheduled", "expired"] as const).map(
              (status) => (
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
              )
            )}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <AnnouncementTypeBadge type={(item.type || item.announcementType || "info") as any} />
                  <AnnouncementStatusBadge status={(item.status || "active") as any} />

                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 capitalize">
                    Audience: {item.targetAudience || "all"}
                  </span>

                  {item.isPinned && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      <Pin className="h-3 w-3 fill-amber-500" />
                      Pinned Banner
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {item.content || item.description || ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Published {formatDate(item.publishedAt || item.startDate)}
                  </span>
                  {(item.expiresAt || item.endDate) && (
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <Clock className="h-3.5 w-3.5" />
                      Expires {formatDate(item.expiresAt || item.endDate)}
                    </span>
                  )}
                  {(item.actionLabel || item.actionText) && item.actionUrl && (
                    <span className="text-indigo-600 font-medium">
                      Link: {item.actionLabel || item.actionText} ({item.actionUrl})
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleTogglePin(item.id)}
                  title={item.isPinned ? "Unpin Announcement" : "Pin as Top Banner"}
                  className={`rounded-xl p-2 transition-colors ${
                    item.isPinned
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  <Pin className="h-4 w-4" />
                </button>

                <Link
                  href={`/admin/communication/announcements/${item.id}`}
                  className="rounded-xl p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                  title="View Detail"
                >
                  <Eye className="h-4 w-4" />
                </Link>

                <Link
                  href={`/admin/communication/announcements/${item.id}/edit`}
                  className="rounded-xl p-2 bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  title="Edit Announcement"
                >
                  <Edit className="h-4 w-4" />
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-xl p-2 bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Delete Announcement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
