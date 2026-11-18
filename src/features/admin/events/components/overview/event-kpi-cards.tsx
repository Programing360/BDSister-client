import React from "react";
import {
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  Radio,
  CalendarCheck,
  XCircle,
  Ticket,
  Users,
} from "lucide-react";
import { DEMO_EVENT_KPIS } from "../../data/mock-events";

export function EventKpiCards() {
  const cards = [
    {
      label: "Total Events",
      value: DEMO_EVENT_KPIS.totalEvents.toLocaleString(),
      subtext: "Conferences & workshops",
      icon: Calendar,
      glow: "shadow-purple-500/10 border-purple-200/60 bg-gradient-to-br from-white to-purple-50/30",
      iconBg: "bg-purple-100 text-purple-700",
    },
    {
      label: "Published & Active",
      value: DEMO_EVENT_KPIS.publishedEvents.toLocaleString(),
      subtext: "Live on platform",
      icon: CheckCircle,
      glow: "shadow-emerald-500/10 border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/30",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Upcoming Events",
      value: DEMO_EVENT_KPIS.upcomingEvents.toLocaleString(),
      subtext: "Open for registration",
      icon: Clock,
      glow: "shadow-blue-500/10 border-blue-200/60 bg-gradient-to-br from-white to-blue-50/30",
      iconBg: "bg-blue-100 text-blue-700",
      highlight: true,
    },
    {
      label: "Live / Ongoing",
      value: DEMO_EVENT_KPIS.ongoingEvents.toLocaleString(),
      subtext: "Happening today",
      icon: Radio,
      glow: "shadow-teal-500/10 border-teal-200/60 bg-gradient-to-br from-white to-teal-50/30",
      iconBg: "bg-teal-100 text-teal-700",
      live: true,
    },
    {
      label: "Drafts in Prep",
      value: DEMO_EVENT_KPIS.draftEvents.toLocaleString(),
      subtext: "Unpublished drafts",
      icon: FileText,
      glow: "shadow-indigo-500/10 border-indigo-200/60 bg-gradient-to-br from-white to-indigo-50/30",
      iconBg: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Completed Events",
      value: DEMO_EVENT_KPIS.completedEvents.toLocaleString(),
      subtext: "Archived & past",
      icon: CalendarCheck,
      glow: "shadow-slate-500/10 border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30",
      iconBg: "bg-slate-100 text-slate-700",
    },
    {
      label: "Total Registrations",
      value: DEMO_EVENT_KPIS.totalRegistrations.toLocaleString(),
      subtext: "Passes claimed",
      icon: Ticket,
      glow: "shadow-pink-500/10 border-pink-200/60 bg-gradient-to-br from-white to-pink-50/30",
      iconBg: "bg-pink-100 text-pink-700",
    },
    {
      label: "Total Attendees",
      value: DEMO_EVENT_KPIS.totalAttendees.toLocaleString(),
      subtext: "81.2% turn-out rate",
      icon: Users,
      glow: "shadow-amber-500/10 border-amber-200/60 bg-gradient-to-br from-white to-amber-50/30",
      iconBg: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-aos="fade-up">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 shadow-lg ${card.glow}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.label}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {card.value}
              </h3>
              {card.live && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              )}
              {card.highlight && !card.live && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Open
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
