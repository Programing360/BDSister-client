"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Send,
  Calendar,
  Users,
  Eye,
  MousePointerClick,
  AlertCircle,
  CheckCircle2,
  Share2
} from "lucide-react";
import {
  DEMO_NEWSLETTER_CAMPAIGNS,
  formatDate
} from "../../data/mock-communication";
import type { NewsletterCampaign } from "../../types/communication";

interface Props {
  campaignId: string;
}

export function CampaignDetailView({ campaignId }: Props) {
  const campaign =
    (DEMO_NEWSLETTER_CAMPAIGNS.find((c) => c.id === campaignId) ||
    DEMO_NEWSLETTER_CAMPAIGNS[0])!;
  const recipientCount = campaign.recipientCount || campaign.subscriberCount || 0;
  const campaignTitle = campaign.title || campaign.name || "Broadcast Campaign";

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
                <span>Campaign Analytics & Details</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {campaignTitle}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Subject: <span className="font-semibold text-white">{campaign.subject}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Campaign report link copied")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Total Recipients</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {recipientCount.toLocaleString()}
          </div>
          <span className="mt-1 text-xs text-slate-500 capitalize">
            Audience: {campaign.audience}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Open Rate</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            {campaign.openRate !== undefined ? `${campaign.openRate}%` : "—"}
          </div>
          <span className="mt-1 text-xs text-emerald-600">
            {campaign.openRate
              ? `${Math.round((recipientCount * campaign.openRate) / 100).toLocaleString()} opens`
              : "Pending dispatch"}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Click Rate</span>
          <div className="mt-2 text-2xl font-bold text-indigo-600">
            {campaign.clickRate !== undefined ? `${campaign.clickRate}%` : "—"}
          </div>
          <span className="mt-1 text-xs text-indigo-600">
            {campaign.clickRate
              ? `${Math.round((recipientCount * campaign.clickRate) / 100).toLocaleString()} clicks`
              : "Pending dispatch"}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-medium text-slate-400 block">Status</span>
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                campaign.status === "sent"
                  ? "bg-emerald-50 text-emerald-700"
                  : campaign.status === "scheduled"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  campaign.status === "sent"
                    ? "bg-emerald-500"
                    : campaign.status === "scheduled"
                    ? "bg-blue-500"
                    : "bg-slate-400"
                }`}
              />
              {campaign.status}
            </span>
          </div>
          <span className="mt-2 block text-xs text-slate-400">
            {campaign.sentAt
              ? formatDate(campaign.sentAt)
              : campaign.scheduledFor
              ? `Scheduled for ${formatDate(campaign.scheduledFor)}`
              : "Draft created"}
          </span>
        </div>
      </div>

      {/* Campaign Content Preview */}
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Rendered Broadcast Preview</h2>
          <p className="text-xs text-slate-400">
            What subscribers see inside Gmail, Apple Mail, and mobile clients
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-6 space-y-4 max-w-3xl mx-auto">
          <div className="border-b border-slate-200 pb-4 space-y-1 text-xs text-slate-600">
            <div>
              <strong className="text-slate-800">From:</strong> BDSisters Community &lt;newsletter@bdsisters.org&gt;
            </div>
            <div>
              <strong className="text-slate-800">To:</strong> [Subscriber Email]
            </div>
            <div>
              <strong className="text-slate-800">Subject:</strong> {campaign.subject}
            </div>
          </div>

          <div
            className="prose prose-sm prose-slate max-w-none text-slate-700 pt-2"
            dangerouslySetInnerHTML={{ __html: campaign.content }}
          />
        </div>
      </div>
    </div>
  );
}
