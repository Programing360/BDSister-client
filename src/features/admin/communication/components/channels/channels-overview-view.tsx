"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  Mail,
  MessageCircle,
  Send,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Settings
} from "lucide-react";
import {
  DEMO_COMMUNICATION_CHANNELS
} from "../../data/mock-communication";
import type { CommunicationChannel } from "../../types/communication";

export function ChannelsOverviewView() {
  const [channels, setChannels] = useState<CommunicationChannel[]>(
    DEMO_COMMUNICATION_CHANNELS
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
    showToast("Channel operational status updated (Demo state)");
  };

  const handleTestPing = (name: string) => {
    showToast(`Healthcheck ping sent to ${name} gateway — 200 OK (Latency: 42ms)`);
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5 text-indigo-600" />;
      case "whatsapp":
        return <MessageCircle className="h-5 w-5 text-emerald-600" />;
      case "telegram":
        return <Send className="h-5 w-5 text-blue-600" />;
      case "contact_form":
        return <FileText className="h-5 w-5 text-amber-600" />;
      case "live_chat":
        return <MessageSquare className="h-5 w-5 text-indigo-600" />;
      default:
        return <Radio className="h-5 w-5 text-slate-600" />;
    }
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
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Radio className="h-3.5 w-3.5" />
              <span>Omnichannel Messaging Connectors</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Communication Channels
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Monitor connectivity, webhook endpoints, and credentials for Email, WhatsApp, Telegram, and Web chat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/communication/settings"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
              Global Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    {getChannelIcon(ch.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{ch.name}</h3>
                    <p className="text-xs text-slate-400 capitalize">{ch.type.replace("_", " ")}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleChannel(ch.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    ch.isEnabled
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      ch.isEnabled ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {ch.isEnabled ? "Active" : "Disabled"}
                </button>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Provider:</span>
                  <span className="font-semibold text-slate-700">{ch.provider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Address:</span>
                  <span className="font-mono text-slate-700 truncate max-w-[180px]">
                    {ch.targetAddress}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleTestPing(ch.name)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Test Health
              </button>

              <Link
                href="/admin/communication/settings"
                className="text-xs font-medium text-slate-400 hover:text-slate-700"
              >
                Configure
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
