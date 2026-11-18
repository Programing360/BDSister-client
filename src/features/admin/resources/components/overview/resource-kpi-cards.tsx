"use client";

import React from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Eye,
  Download,
  Star,
  FileText,
} from "lucide-react";
import type { ResourceKpis } from "../../types/resource";

interface ResourceKpiCardsProps {
  kpis: ResourceKpis;
}

export function ResourceKpiCards({ kpis }: ResourceKpiCardsProps) {
  const cards = [
    {
      label: "Total Resources",
      value: kpis.totalResources.toLocaleString(),
      subtext: "Catalogue library items",
      icon: BookOpen,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
      border: "border-brand-primary/20",
    },
    {
      label: "Published Live",
      value: kpis.publishedResources.toLocaleString(),
      subtext: `${Math.round((kpis.publishedResources / kpis.totalResources) * 100)}% active visibility`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Pending Review",
      value: kpis.pendingReviewCount.toLocaleString(),
      subtext: "Awaiting editorial check",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Draft Content",
      value: kpis.draftResources.toLocaleString(),
      subtext: "In authoring pipeline",
      icon: FileText,
      color: "text-slate-600",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
    },
    {
      label: "Resource Categories",
      value: kpis.totalCategories.toLocaleString(),
      subtext: "Domain classifications",
      icon: Layers,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      label: "Total Views",
      value: kpis.totalViews.toLocaleString(),
      subtext: "Platform reading sessions",
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Asset Downloads",
      value: kpis.totalDownloads.toLocaleString(),
      subtext: "Templates, PDFs & guides",
      icon: Download,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Featured Curations",
      value: kpis.featuredCount.toLocaleString(),
      subtext: "Promoted on discovery feeds",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            data-aos="fade-up"
            data-aos-delay={idx * 50}
            className={`p-5 rounded-2xl bg-white/95 backdrop-blur-md border ${card.border} shadow-[0_8px_30px_rgb(91,70,246,0.06)] hover:shadow-[0_12px_36px_rgb(91,70,246,0.12)] transition-all duration-300 space-y-3 group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-muted tracking-wide uppercase">
                {card.label}
              </span>
              <div
                className={`p-2 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
                {card.value}
              </p>
              <p className="text-[11px] font-medium text-brand-muted">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
