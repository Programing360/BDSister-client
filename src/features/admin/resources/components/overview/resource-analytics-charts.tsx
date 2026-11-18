"use client";

import React from "react";
import {
  TrendingUp,
  PieChart,
  BarChart3,
  FileText,
  Video,
  Download,
  GraduationCap,
} from "lucide-react";
import { DEMO_RESOURCE_GROWTH_SERIES, DEMO_RESOURCE_CATEGORIES } from "../../data/mock-resources";

export function ResourceAnalyticsCharts() {
  const maxViews = Math.max(...DEMO_RESOURCE_GROWTH_SERIES.map((d) => d.views));

  const typeDistribution = [
    { label: "Guides & Tutorials", count: 22, percentage: 32, color: "bg-emerald-500" },
    { label: "Articles & Editorial", count: 18, percentage: 26, color: "bg-blue-500" },
    { label: "Video Masterclasses", count: 14, percentage: 21, color: "bg-rose-500" },
    { label: "Templates & Spreadsheets", count: 8, percentage: 12, color: "bg-purple-500" },
    { label: "Courses & Curricula", count: 6, percentage: 9, color: "bg-brand-primary" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 6-Month Publication & View Activity Bar Chart */}
      <div
        data-aos="fade-up"
        className="lg:col-span-8 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-primary/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3 h-3" /> Monthly Consumption
            </div>
            <h3 className="text-lg font-semibold text-brand-navy">
              Resource Publishing & Reading Trends
            </h3>
            <p className="text-xs text-brand-muted font-normal">
              Monthly views and asset download frequency over the last 6 months.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-brand-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-primary"></span> Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-400"></span> Downloads
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-4 pt-2">
          {DEMO_RESOURCE_GROWTH_SERIES.map((pt) => {
            const viewsWidth = Math.round((pt.views / maxViews) * 100);
            const dlWidth = Math.round((pt.downloads / maxViews) * 100);

            return (
              <div key={pt.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-navy">
                  <span className="w-12 font-medium text-brand-muted">{pt.month}</span>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-brand-primary">
                      {pt.views.toLocaleString()} views
                    </span>
                    <span className="text-purple-600">
                      {pt.downloads.toLocaleString()} dl
                    </span>
                    <span className="text-slate-400 font-normal">
                      (+{pt.published} items)
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-brand-surface overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-primary transition-all duration-500"
                      style={{ width: `${viewsWidth}%` }}
                    ></div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-brand-surface overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-400 transition-all duration-500"
                      style={{ width: `${dlWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Type Distribution */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="lg:col-span-4 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-6 flex flex-col justify-between"
      >
        <div className="space-y-1 border-b border-brand-primary/10 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <PieChart className="w-3 h-3" /> Formats
          </div>
          <h3 className="text-lg font-semibold text-brand-navy">
            Type Breakdown
          </h3>
          <p className="text-xs text-brand-muted font-normal">
            Content distribution across delivery media.
          </p>
        </div>

        <div className="space-y-3.5 my-auto py-2">
          {typeDistribution.map((t) => (
            <div key={t.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-brand-navy">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${t.color}`}></span>
                  {t.label}
                </span>
                <span className="text-brand-muted text-[11px]">
                  {t.count} ({t.percentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-brand-surface overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.color}`}
                  style={{ width: `${t.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-brand-surface/70 border border-brand-primary/10 text-xs text-brand-muted">
          <p className="font-semibold text-brand-navy mb-0.5">Top Focus Area</p>
          Entrepreneurship & legal guides account for over 45% of user download requests.
        </div>
      </div>
    </div>
  );
}
