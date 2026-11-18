"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Layers,
  Sparkles,
  Search,
  Globe,
  Settings,
  Image,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  History,
  FileCheck2,
} from "lucide-react";
import type { CMSKpis, CMSPage, CMSBanner } from "../../types/cms";
import {
  DEMO_CMS_KPIS,
  DEMO_CMS_PAGES,
  DEMO_BANNERS,
  DEMO_CMS_GROWTH_SERIES,
} from "../../data/mock-cms";
import { CmsKpiCards } from "./cms-kpi-cards";
import { CmsAnalyticsCharts } from "./cms-analytics-charts";
import { RecentPagesCard } from "./recent-pages-card";
import { ActiveBannersCard } from "./active-banners-card";

interface CmsOverviewViewProps {
  kpis?: CMSKpis;
  pages?: CMSPage[];
  banners?: CMSBanner[];
}

export function CmsOverviewView({
  kpis = DEMO_CMS_KPIS,
  pages = DEMO_CMS_PAGES,
  banners = DEMO_BANNERS,
}: CmsOverviewViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const quickNavItems = [
    {
      title: "Visual Page Builder",
      desc: "Drag-free structured block layout editor",
      href: "/admin/cms/page-builder",
      icon: Layers,
      color: "text-[#5B46F6]",
      bg: "bg-indigo-50",
    },
    {
      title: "Homepage Management",
      desc: "Hero, value pillars, and section hierarchy",
      href: "/admin/cms/homepage",
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Navigation & Menus",
      desc: "Public header dropdowns & footer groups",
      href: "/admin/cms/navigation",
      icon: Settings,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "SEO Management",
      desc: "Meta descriptions, Open Graph & SERP previews",
      href: "/admin/cms/seo",
      icon: ShieldCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Media Library",
      desc: "Curated imagery and asset storage",
      href: "/admin/cms/media",
      icon: Image,
      color: "text-slate-700",
      bg: "bg-slate-100",
    },
    {
      title: "Editorial Reviews",
      desc: "Staff moderation and publishing approval queue",
      href: "/admin/cms/reviews",
      icon: FileCheck2,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5B46F6] text-white shadow-lg shadow-indigo-500/25">
              <FileText className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                CMS & Website Content Management
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Author, structure, and curate all public website pages, navigation hierarchies, banners, and SEO metadata.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/cms/page-builder"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-lg shadow-slate-200/50 hover:bg-slate-50 transition-all duration-200"
          >
            <Layers className="h-4 w-4 text-[#5B46F6]" />
            Page Builder
          </Link>
          <Link
            href="/admin/cms/pages/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B46F6] text-xs font-semibold text-white shadow-xl shadow-indigo-500/30 hover:bg-[#4a36e2] transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Create Page
          </Link>
        </div>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50/50 p-4 shadow-lg shadow-indigo-500/5 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-bold text-[#5B46F6]">Headless CMS Workspace:</span>
          <span className="text-slate-700">DEMO DATA — Not connected to live CMS services.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-medium text-[11px]">
          <span>{pages.length} Pages Managed</span>
          <span>•</span>
          <span>Next.js 16 App Router SSG</span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <CmsKpiCards kpis={kpis} />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5" data-aos="fade-up">
        {quickNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#5B46F6] group-hover:translate-x-0.5 transition" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#5B46F6] transition">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {item.desc}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <CmsAnalyticsCharts
        growthSeries={DEMO_CMS_GROWTH_SERIES}
        pages={pages}
      />

      {/* Split Cards: Recent Pages & Active Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-aos="fade-up">
        <div className="lg:col-span-7">
          <RecentPagesCard pages={pages} />
        </div>
        <div className="lg:col-span-5">
          <ActiveBannersCard banners={banners} />
        </div>
      </div>
    </div>
  );
}

export const CMSOverviewView = CmsOverviewView;

