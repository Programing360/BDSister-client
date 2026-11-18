"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  ArrowLeft,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Save,
  KeyRound,
  AlertCircle,
  Sparkles
} from "lucide-react";
import {
  DEMO_COMMUNICATION_SETTINGS
} from "../../data/mock-communication";
import type { CommunicationSettings } from "../../types/communication";

export function CommunicationSettingsView() {
  const [settings, setSettings] = useState<CommunicationSettings>(
    DEMO_COMMUNICATION_SETTINGS
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Communication settings updated (Demo local state)");
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
                href="/admin/communication/channels"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Settings className="h-3.5 w-3.5" />
                <span>Global Protocol Configuration</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Communication Settings
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Configure support dispatch mailboxes, automated SLA response timelines, and delivery webhooks.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email & Dispatch Settings */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600" />
              System Email Sender Identities
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Support Mailbox Address
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  setSettings({ ...settings, supportEmail: e.target.value })
                }
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Outbound Notification Display Name
              </label>
              <input
                type="text"
                value={settings.notificationSenderName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationSenderName: e.target.value
                  })
                }
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Reply-To Address
              </label>
              <input
                type="email"
                value={settings.defaultReplyTo}
                onChange={(e) =>
                  setSettings({ ...settings, defaultReplyTo: e.target.value })
                }
                required
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Daily Email Blast Quota Limit
              </label>
              <input
                type="number"
                value={settings.dailyEmailLimit}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dailyEmailLimit: parseInt(e.target.value, 10) || 1000
                  })
                }
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {/* Help Desk & SLA Automation */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-5">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              SLA & Auto-Responder
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target SLA Resolution Window (Hours)
              </label>
              <input
                type="number"
                value={settings.ticketSlaHours}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    ticketSlaHours: parseInt(e.target.value, 10) || 24
                  })
                }
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard resolution commitment displayed on user support tickets.
              </span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.autoResponderEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoResponderEnabled: e.target.checked
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Enable Automatic Inbound Auto-Responder
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Instantly emails submitter a ticket receipt with tracking code.
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Auto-Responder Acknowledgement Message
              </label>
              <textarea
                rows={4}
                value={settings.autoResponderMessage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoResponderMessage: e.target.value
                  })
                }
                className="w-full rounded-xl bg-slate-50 p-4 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Webhook & Integration Endpoint Verification */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-indigo-600" />
            Resend Webhook & Inbound Relay
          </h3>

          <div className="rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-700 space-y-1">
            <div className="text-slate-400">Webhook Receiver URL (Configured in DNS/Resend):</div>
            <div className="font-semibold text-indigo-700 select-all">
              https://bdsisters.org/api/webhooks/email/resend
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
