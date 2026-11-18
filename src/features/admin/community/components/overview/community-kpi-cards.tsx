import React from "react";
import {
  Users,
  UserCheck,
  MessageSquare,
  FileText,
  MessagesSquare,
  ShieldAlert,
  Flag,
  ShieldCheck,
} from "lucide-react";
import { DEMO_COMMUNITY_KPIS } from "../../data/mock-community";

export function CommunityKpiCards() {
  const cards = [
    {
      label: "Total Community Members",
      value: DEMO_COMMUNITY_KPIS.totalCommunityMembers.toLocaleString(),
      subtext: "+8.4% from last month",
      icon: Users,
      glow: "shadow-purple-500/10 border-purple-200/60 bg-gradient-to-br from-white to-purple-50/30",
      iconBg: "bg-purple-100 text-purple-700",
    },
    {
      label: "Active Members (30d)",
      value: DEMO_COMMUNITY_KPIS.activeMembers.toLocaleString(),
      subtext: "43.2% engagement rate",
      icon: UserCheck,
      glow: "shadow-emerald-500/10 border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/30",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Discussions",
      value: DEMO_COMMUNITY_KPIS.totalDiscussions.toLocaleString(),
      subtext: "Across 6 public categories",
      icon: MessageSquare,
      glow: "shadow-blue-500/10 border-blue-200/60 bg-gradient-to-br from-white to-blue-50/30",
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Posts",
      value: DEMO_COMMUNITY_KPIS.totalPosts.toLocaleString(),
      subtext: "~4.8 posts per discussion",
      icon: FileText,
      glow: "shadow-indigo-500/10 border-indigo-200/60 bg-gradient-to-br from-white to-indigo-50/30",
      iconBg: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Total Comments",
      value: DEMO_COMMUNITY_KPIS.totalComments.toLocaleString(),
      subtext: "Healthy sisterhood replies",
      icon: MessagesSquare,
      glow: "shadow-pink-500/10 border-pink-200/60 bg-gradient-to-br from-white to-pink-50/30",
      iconBg: "bg-pink-100 text-pink-700",
    },
    {
      label: "Pending Moderation",
      value: DEMO_COMMUNITY_KPIS.pendingModeration.toLocaleString(),
      subtext: "Requires admin review",
      icon: ShieldAlert,
      glow: "shadow-amber-500/10 border-amber-200/60 bg-gradient-to-br from-white to-amber-50/30",
      iconBg: "bg-amber-100 text-amber-700",
      highlight: true,
    },
    {
      label: "Reported Content",
      value: DEMO_COMMUNITY_KPIS.reportedContent.toLocaleString(),
      subtext: "Spam & dispute flags",
      icon: Flag,
      glow: "shadow-rose-500/10 border-rose-200/60 bg-gradient-to-br from-white to-rose-50/30",
      iconBg: "bg-rose-100 text-rose-700",
      highlight: true,
    },
    {
      label: "Active Moderators",
      value: DEMO_COMMUNITY_KPIS.activeModerators.toLocaleString(),
      subtext: "Vetted community leaders",
      icon: ShieldCheck,
      glow: "shadow-teal-500/10 border-teal-200/60 bg-gradient-to-br from-white to-teal-50/30",
      iconBg: "bg-teal-100 text-teal-700",
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
              {card.highlight && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                  Action Queue
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
