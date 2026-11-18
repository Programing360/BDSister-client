"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Inbox,
  LifeBuoy,
  Mail,
  Users,
  Megaphone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Radio,
  Settings,
  ShieldAlert,
  Send,
  Bell,
  RefreshCw,
} from "lucide-react";
import {
  DEMO_COMMUNICATION_KPIS,
  DEMO_CONTACT_SUBMISSIONS,
  DEMO_SUPPORT_TICKETS,
  DEMO_COMMUNICATION_CHANNELS,
} from "../../data/mock-communication";
import { CommunicationKpiCards } from "./communication-kpi-cards";
import {
  PriorityBadge,
  TicketStatusBadge,
  ContactStatusBadge,
} from "../common/communication-status-badges";

export function CommunicationOverviewView() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast("Channels synchronized. Inboxes up to date (Demo UI).");
    }, 800);
  };

  const quickNav = [
    {
      title: "Support Tickets Desk",
      desc: "Manage 28 open sister inquiries, payment disputes & escalations.",
      href: "/admin/communication/support/tickets",
      icon: LifeBuoy,
      badge: "28 Open",
      badgeColor: "bg-blue-50 text-blue-700",
    },
    {
      title: "Contact Submissions",
      desc: "Inquiries from partners, universities, sponsors & press.",
      href: "/admin/communication/contacts",
      icon: Inbox,
      badge: "14 Unread",
      badgeColor: "bg-rose-50 text-rose-700",
    },
    {
      title: "Email & Template Studio",
      desc: "Inspect delivery logs, variables & safe transactional templates.",
      href: "/admin/communication/email",
      icon: Mail,
      badge: "6 Templates",
      badgeColor: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Newsletter & Subscribers",
      desc: "Manage 8,420 subscribers, campaigns, and monthly founder digests.",
      href: "/admin/communication/newsletter",
      icon: Users,
      badge: "8.4k Subs",
      badgeColor: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Platform Announcements",
      desc: "Broadcast important banners across web, member, and admin portals.",
      href: "/admin/communication/announcements",
      icon: Megaphone,
      badge: "4 Active",
      badgeColor: "bg-amber-50 text-amber-700",
    },
    {
      title: "Live Chat Inbox",
      desc: "Live concierge support hub for verified sisters & entrepreneurs.",
      href: "/admin/communication/live-chat",
      icon: MessageSquare,
      badge: "Live Now",
      badgeColor: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <Radio className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Communication & Support Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Communications, Support & Alerts Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Centralized command center for managing sister support tickets, contact submissions, email templates, newsletter broadcasts, and live chat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-md hover:bg-slate-700 transition-all active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Sync Inboxes
            </button>
            <Link
              href="/admin/communication/bulk-email/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              Compose Broadcast
            </Link>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* KPI Cards */}
      <CommunicationKpiCards kpis={DEMO_COMMUNICATION_KPIS} />

      {/* Quick Access Grid (6 Modules) */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">
          Communication Modules
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickNav.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>Open workspace</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Channel Status Overview */}
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Communication Channels & Gateways</h2>
            <p className="text-xs text-slate-500">Live operational status across integrated and placeholder notification providers.</p>
          </div>
          <Link
            href="/admin/communication/channels"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Configure Channels →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DEMO_COMMUNICATION_CHANNELS.map((channel) => (
            <div
              key={channel.id}
              className="flex flex-col justify-between rounded-xl bg-slate-50/70 p-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {channel.type.replace("_", " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      channel.connectionStatus === "CONNECTED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {channel.connectionStatus === "CONNECTED" ? "Active" : "Placeholder"}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {channel.name}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                  {channel.description}
                </p>
              </div>

              <div className="mt-3 border-t border-slate-200/60 pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{channel.accountHandle || "—"}</span>
                <span>{channel.lastActivity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Section: Recent Contacts & Support Tickets */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Contact Messages */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Contact Inquiries</h2>
              <p className="text-xs text-slate-500">External submissions from public website contact form.</p>
            </div>
            <Link
              href="/admin/communication/contacts"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All ({DEMO_CONTACT_SUBMISSIONS.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_CONTACT_SUBMISSIONS.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/admin/communication/contacts/${item.id}`}
                className="group flex flex-col justify-between rounded-xl bg-slate-50 p-4 hover:bg-slate-100/70 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                        {item.senderName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.email}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {item.subject}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <PriorityBadge priority={item.priority} />
                    <ContactStatusBadge status={item.status} />
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                  {item.message}
                </p>

                <div className="mt-2 text-[10px] text-slate-400">
                  Submitted on {item.submissionDate}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Support Tickets */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Support Tickets</h2>
              <p className="text-xs text-slate-500">Active member help desk tickets and payout inquiries.</p>
            </div>
            <Link
              href="/admin/communication/support/tickets"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All ({DEMO_SUPPORT_TICKETS.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_SUPPORT_TICKETS.slice(0, 4).map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/communication/support/tickets/${ticket.id}`}
                className="group flex flex-col justify-between rounded-xl bg-slate-50 p-4 hover:bg-slate-100/70 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                        {ticket.memberName}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {ticket.subject}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <PriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Assigned: {ticket.assignedAdmin}</span>
                  <span>Updated: {ticket.lastUpdated}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
