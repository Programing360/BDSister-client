"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  Users,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Info
} from "lucide-react";

export function BulkEmailCreateView() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [criteria, setCriteria] = useState("all_verified_sellers");
  const [body, setBody] = useState(
    "<p>Hello {{firstName}},</p>\n<p>We are reaching out to inform you regarding key operational updates on the BDSisters marketplace portal.</p>\n<p>Best regards,<br>BDSisters Admin Team</p>"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getRecipientEstimate = () => {
    switch (criteria) {
      case "all_verified_sellers":
        return 1240;
      case "unverified_sellers":
        return 380;
      case "event_attendees":
        return 820;
      case "inactive_30_days":
        return 650;
      default:
        return 2450;
    }
  };

  const handleLaunchBlast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) {
      showToast("Please provide both title and subject line");
      return;
    }

    showToast("Bulk campaign simulated! Demo preview only: no email sent.");
    setTimeout(() => {
      router.push("/admin/communication/bulk-email");
    }, 1500);
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

      {/* Mandatory Step 13 Warning Banner */}
      <div className="rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 p-6 text-amber-950 shadow-xl shadow-amber-500/10 flex items-start gap-4">
        <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-base font-bold text-amber-900 flex items-center gap-2">
            <span>MANDATORY SYSTEM NOTICE</span>
            <span className="rounded-md bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">
              Demo Environment
            </span>
          </h2>
          <p className="text-sm font-semibold text-amber-800">
            This is a demo preview. No email will be sent.
          </p>
          <p className="text-xs text-amber-700">
            All recipient counts, dispatch queues, and campaign executions are simulated in client memory. No external SMTP services or mail relays are invoked.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/bulk-email"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Send className="h-3.5 w-3.5" />
                <span>Bulk Message Composer</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Create Bulk Email Campaign
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Target registered user cohorts with urgent announcements, policy advisories, or survey requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Hide Preview" : "Live Preview"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Main (2 Cols) */}
        <form onSubmit={handleLaunchBlast} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Internal Campaign Reference
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 2026 Seller Tax Compliance Notification"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Important: Action Required for BDSisters Seller Verification"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  HTML Body Content
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Tags: {"{{firstName}}"}, {"{{businessName}}"}
                </span>
              </div>
              <textarea
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                href="/admin/communication/bulk-email"
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors"
              >
                Simulate Bulk Blast (Demo)
              </button>
            </div>
          </div>

          {/* Live Preview If Toggled */}
          {showPreview && (
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">Realtime Reader Preview</h3>
              <div className="rounded-xl bg-slate-50 p-6 space-y-3">
                <div className="text-xs text-slate-500 border-b border-slate-200 pb-2">
                  <strong>Subject:</strong> {subject || "(No subject set)"}
                </div>
                <div
                  className="prose prose-sm prose-slate max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: body
                      .replace(/{{firstName}}/g, "Fatima")
                      .replace(/{{businessName}}/g, "Nokshi Boutique")
                  }}
                />
              </div>
            </div>
          )}
        </form>

        {/* Audience Estimator & Safety Controls (1 Col) */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <h3 className="font-semibold text-slate-900 text-base">Audience Criteria</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Target Cohort Filter
              </label>
              <select
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
                <option value="all_verified_sellers">All Verified Sellers (NID & Trade Approved)</option>
                <option value="unverified_sellers">Unverified Sellers with Pending NID</option>
                <option value="event_attendees">Attendees of Recent 2026 Summits</option>
                <option value="inactive_30_days">Inactive Sellers (No listings in 30 days)</option>
              </select>
            </div>

            <div className="rounded-xl bg-indigo-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900">Estimated Reach:</span>
                <span className="text-base font-bold text-indigo-700">
                  {getRecipientEstimate().toLocaleString()} recipients
                </span>
              </div>
              <p className="text-[11px] text-indigo-600">
                Calculated dynamically across matching registered profiles in the BDSisters database.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block">Dispatch Rules:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Automatic rate-limiting: 50 msgs / second</li>
                <li>One-click unsubscribe headers injected</li>
                <li>Suppressed bounce list respected</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
