"use client";

import React from "react";
import type { CMSKpis } from "../../types/cms";
import {
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Image,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CmsKpiCardsProps {
  kpis: CMSKpis;
}

export function CmsKpiCards({ kpis }: CmsKpiCardsProps) {
  const cards = [
    {
      label: "Total Pages",
      value: kpis.totalPages,
      desc: "Managed website pages",
      icon: FileText,
      iconBg: "bg-indigo-50",
      iconColor: "text-[#5B46F6]",
      shadow: "shadow-xl shadow-indigo-500/5",
    },
    {
      label: "Published Pages",
      value: kpis.publishedPages,
      desc: "Live public content",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      shadow: "shadow-xl shadow-emerald-500/5",
    },
    {
      label: "Draft Content",
      value: kpis.draftPages,
      desc: "In progress / staging",
      icon: Clock,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      shadow: "shadow-xl shadow-slate-500/5",
    },
    {
      label: "Scheduled",
      value: kpis.scheduledPages,
      desc: "Timed launch dates",
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      shadow: "shadow-xl shadow-blue-500/5",
    },
    {
      label: "Content Sections",
      value: kpis.totalSections,
      desc: "Across page builders",
      icon: Layers,
      iconBg: "bg-indigo-50",
      iconColor: "text-[#5B46F6]",
      shadow: "shadow-xl shadow-indigo-500/5",
    },
    {
      label: "Active Banners",
      value: kpis.activeBanners,
      desc: "Hero & announcements",
      icon: Sparkles,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      shadow: "shadow-xl shadow-amber-500/5",
    },
    {
      label: "Pending Reviews",
      value: kpis.pendingReviewsCount,
      desc: "Requires staff sign-off",
      icon: AlertCircle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      shadow: "shadow-xl shadow-rose-500/5",
    },
    {
      label: "Media Library",
      value: kpis.mediaCount,
      desc: "Curated image assets",
      icon: Image,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      shadow: "shadow-xl shadow-slate-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4" data-aos="fade-up">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-2xl bg-white p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${card.shadow}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {card.label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                {card.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
