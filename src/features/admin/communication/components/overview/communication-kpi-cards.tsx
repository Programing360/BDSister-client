import React from "react";
import {
  Inbox,
  LifeBuoy,
  ShieldAlert,
  CheckCircle2,
  Users,
  Megaphone,
  Mail,
  Bell,
  Clock,
} from "lucide-react";
import type { CommunicationKPIs } from "../../types/communication";

interface CommunicationKpiCardsProps {
  kpis: CommunicationKPIs;
}

export function CommunicationKpiCards({ kpis }: CommunicationKpiCardsProps) {
  const cards = [
    {
      label: "Contact Messages",
      value: kpis.totalContactMessages,
      secondary: `${kpis.unreadMessages} unread`,
      icon: Inbox,
      color: "text-indigo-600 bg-indigo-50",
      alert: kpis.unreadMessages > 0,
    },
    {
      label: "Open Tickets",
      value: kpis.openSupportTickets,
      secondary: "Needs agent review",
      icon: LifeBuoy,
      color: "text-blue-600 bg-blue-50",
      alert: kpis.openSupportTickets > 10,
    },
    {
      label: "Pending Complaints",
      value: kpis.pendingComplaints,
      secondary: "Escalated disputes",
      icon: ShieldAlert,
      color: "text-rose-600 bg-rose-50",
      alert: kpis.pendingComplaints > 0,
    },
    {
      label: "Resolved Tickets",
      value: kpis.resolvedTickets,
      secondary: "All-time resolved",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Newsletter Subscribers",
      value: kpis.totalNewsletterSubscribers.toLocaleString(),
      secondary: "+12.4% this month",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Active Announcements",
      value: kpis.activeAnnouncements,
      secondary: "Across web & portals",
      icon: Megaphone,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Monthly Emails",
      value: kpis.emailsSentMonth.toLocaleString(),
      secondary: "Transactional & bulk",
      icon: Mail,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Avg Resolution Time",
      value: `${kpis.avgResolutionHours}h`,
      secondary: "Target: < 8 hours",
      icon: Clock,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {card.label}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs">
                {card.alert && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
                <span className={card.alert ? "font-semibold text-rose-600" : "text-slate-500"}>
                  {card.secondary}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
