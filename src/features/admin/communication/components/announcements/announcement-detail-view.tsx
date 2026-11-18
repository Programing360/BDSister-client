"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Megaphone,
  Edit,
  Pin,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  Users,
  ExternalLink
} from "lucide-react";
import {
  DEMO_ANNOUNCEMENTS,
  formatDate
} from "../../data/mock-communication";
import {
  AnnouncementStatusBadge,
  AnnouncementTypeBadge
} from "../common/communication-status-badges";
import type { PlatformAnnouncement, AnnouncementStatus, AnnouncementType } from "../../types/communication";

interface Props {
  announcementId: string;
}

export function AnnouncementDetailView({ announcementId }: Props) {
  const initial =
    DEMO_ANNOUNCEMENTS.find((a) => a.id === announcementId) ||
    DEMO_ANNOUNCEMENTS[0]!;

  const [announcement, setAnnouncement] = useState<PlatformAnnouncement>(initial);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePin = () => {
    setAnnouncement((prev) => ({ ...prev, isPinned: !prev.isPinned }));
    showToast(
      announcement.isPinned
        ? "Announcement unpinned from global banner"
        : "Announcement pinned to global dashboard banner"
    );
  };

  const statusVal = (announcement.status || "active") as AnnouncementStatus;
  const typeVal = (announcement.type || announcement.announcementType || "info") as AnnouncementType;

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
                <span>Platform Notice</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {announcement.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Published: {formatDate(announcement.publishedAt || announcement.startDate)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePin}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                announcement.isPinned
                  ? "bg-amber-500 text-slate-900 font-semibold"
                  : "bg-white/10 hover:bg-white/15 text-white"
              }`}
            >
              <Pin className="h-4 w-4" />
              {announcement.isPinned ? "Pinned Globally" : "Pin Banner"}
            </button>
            <Link
              href={`/admin/communication/announcements/${announcement.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Status</span>
          <div className="mt-2">
            <AnnouncementStatusBadge status={statusVal} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Severity Level</span>
          <div className="mt-2">
            <AnnouncementTypeBadge type={typeVal} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Audience Target</span>
          <div className="mt-2 text-sm font-semibold text-slate-900 capitalize">
            {announcement.targetAudience || "all"}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Expiration</span>
          <div className="mt-2 text-xs font-medium text-slate-700">
            {announcement.expiresAt || announcement.endDate
              ? formatDate(announcement.expiresAt || announcement.endDate)
              : "Never (Permanent)"}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Notice Content</h2>
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {announcement.content || announcement.description || ""}
          </div>
        </div>

        {(announcement.actionLabel || announcement.actionText) && (announcement.actionUrl) && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Call to Action Link</span>
              <span className="text-sm font-semibold text-slate-900">
                {announcement.actionLabel || announcement.actionText}
              </span>
              <p className="text-xs text-indigo-600 font-mono mt-0.5">{announcement.actionUrl}</p>
            </div>
            <a
              href={announcement.actionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors"
            >
              Test Link <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
