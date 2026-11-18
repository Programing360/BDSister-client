"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Calendar,
  Sparkles,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import type { CampaignAudience } from "../../types/communication";

export function CreateCampaignView() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState<CampaignAudience>("all");
  const [content, setContent] = useState(
    "<h2>Welcome to this edition of the BDSisters Dispatch!</h2>\n<p>Dear Sisters, this month we are spotlighting incredible milestones across our women entrepreneurs community.</p>\n<p>Highlights:</p>\n<ul>\n<li>Exclusive Micro-grants application deadline</li>\n<li>Dhaka SME Winter Showcase stall allocations</li>\n<li>Upcoming live webinar on scaling ecommerce logistics</li>\n</ul>"
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Campaign draft saved locally (Demo action)");
    setTimeout(() => {
      router.push("/admin/communication/newsletter/campaigns");
    }, 1000);
  };

  const handleSendOrSchedule = (type: "send" | "schedule") => {
    if (!title || !subject) {
      showToast("Please provide both a title and subject line");
      return;
    }
    showToast(
      type === "send"
        ? "Campaign queued for immediate dispatch! (Demo preview)"
        : `Campaign scheduled for ${scheduledDate || "tomorrow"}! (Demo preview)`
    );
    setTimeout(() => {
      router.push("/admin/communication/newsletter/campaigns");
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
                href="/admin/communication/newsletter/campaigns"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Send className="h-3.5 w-3.5" />
                <span>Campaign Composer</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Create Newsletter Campaign
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Author broadcast updates with audience segment targets and automated publication schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Hide Preview" : "Preview Email"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveDraft} className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Internal Campaign Name
              </label>
              <input
                type="text"
                placeholder="e.g. October Micro-Grants & Winter Expo Launch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Subject Line
              </label>
              <input
                type="text"
                placeholder="e.g. 🎉 Applications are open: Micro-grants for BDSisters members!"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  HTML Content Body
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Supports HTML tags</span>
              </div>
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </form>

          {/* Live HTML Preview Box if toggled */}
          {showPreview && (
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">Realtime Reader Preview</h3>
              <div className="rounded-xl bg-slate-50 p-6">
                <h4 className="font-bold text-slate-800 text-base mb-2">Subject: {subject || "(No subject set)"}</h4>
                <div
                  className="prose prose-sm prose-slate max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Audience & Delivery Controls (1 Col) */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <h3 className="font-semibold text-slate-900 text-base">Audience & Targeting</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Target Segment
              </label>
              <div className="space-y-2">
                {[
                  { key: "all", label: "All Active Subscribers (8,420)", desc: "Full list broadcast" },
                  { key: "entrepreneurs", label: "Verified Entrepreneurs (3,840)", desc: "Badge-holder sellers" },
                  { key: "members", label: "Premium & VIP Members (2,150)", desc: "Paid plan subscribers" },
                  { key: "inactive", label: "Re-engagement Segment (1,890)", desc: "No opens in 60 days" }
                ].map((seg) => (
                  <label
                    key={seg.key}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      audience === seg.key
                        ? "bg-indigo-50/80 shadow-md shadow-indigo-500/5"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="audience"
                      value={seg.key}
                      checked={audience === seg.key}
                      onChange={() => setAudience(seg.key as CampaignAudience)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{seg.label}</div>
                      <div className="text-[11px] text-slate-500">{seg.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Schedule Publication (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSendOrSchedule("send")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors"
              >
                <Send className="h-4 w-4" />
                Send Immediately
              </button>

              <button
                type="button"
                onClick={() => handleSendOrSchedule("schedule")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors"
              >
                <Clock className="h-4 w-4" />
                Schedule Campaign
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/80 p-5 shadow-xl shadow-blue-500/5 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs">
              <AlertCircle className="h-4 w-4" />
              <span>Simulated Safe Environment</span>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              In this frontend development stage, sending will log the campaign state into local client memory without invoking third-party email providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
