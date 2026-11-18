"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Search,
  Eye,
  Clock,
  User,
  Layers,
} from "lucide-react";
import { DEMO_REVISIONS } from "../../data/mock-cms";
import type { ContentRevision } from "../../types/cms";

export function RevisionsListView() {
  const [revisions, setRevisions] = useState<ContentRevision[]>(DEMO_REVISIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRevision, setSelectedRevision] = useState<ContentRevision | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredRevisions = revisions.filter((rev) => {
    const query = searchQuery.toLowerCase();
    return (
      rev.contentTitle.toLowerCase().includes(query) ||
      rev.editorName.toLowerCase().includes(query) ||
      rev.changeSummary.toLowerCase().includes(query) ||
      rev.contentType.toLowerCase().includes(query)
    );
  });

  const handleRestore = (rev: ContentRevision) => {
    triggerToast(`Restored "${rev.contentTitle}" to Revision #${rev.revisionNumber} (Demo UI).`);
    setSelectedRevision(null);
  };

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
                Audit Trail & Recovery
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Revision History & Rollbacks
            </h1>
            <p className="text-sm text-slate-300">
              Time-travel through previous snapshot versions of published pages, inspect editorial changelogs, and restore with one click.
            </p>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, editor, or change note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredRevisions.length} revision snapshot(s)
        </span>
      </div>

      {/* Revisions Timeline List */}
      <div className="space-y-4">
        {filteredRevisions.map((rev) => (
          <div
            key={rev.id}
            className="overflow-hidden rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-mono font-bold text-xs text-indigo-700 shadow-sm">
                  r{rev.revisionNumber}
                </span>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {rev.contentTitle}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-500">
                      {rev.contentType}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      rev.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {rev.changeSummary}
                  </p>

                  <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{rev.editorName} ({rev.editorEmail})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{rev.revisionDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedRevision(rev)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => handleRestore(rev)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restore r{rev.revisionNumber}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Snapshot Details Modal */}
      {selectedRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Revision #{selectedRevision.revisionNumber} Snapshot
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRevision.contentTitle} • {selectedRevision.revisionDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRevision(null)}
                className="rounded-lg bg-slate-100 p-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500">Editor:</span>
                <span className="ml-2 text-xs font-bold text-slate-900">
                  {selectedRevision.editorName} ({selectedRevision.editorEmail})
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Editorial Summary:</span>
                <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                  {selectedRevision.changeSummary}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Revision Details:</span>
                <div className="mt-1 rounded-xl bg-slate-950 p-4 text-[11px] font-mono text-emerald-400 space-y-1">
                  <div>Content ID: {selectedRevision.contentId}</div>
                  <div>Content Type: {selectedRevision.contentType}</div>
                  <div>Status: {selectedRevision.status}</div>
                  <div>Timestamp: {selectedRevision.revisionDate}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => setSelectedRevision(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleRestore(selectedRevision)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore This Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
