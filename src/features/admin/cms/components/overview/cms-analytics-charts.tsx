"use client";

import React from "react";
import { BarChart3, PieChart, Layers, TrendingUp } from "lucide-react";
import type { CMSPage } from "../../types/cms";

interface CmsAnalyticsChartsProps {
  growthSeries: Array<{ month: string; published: number; updates: number }>;
  pages: CMSPage[];
}

export function CmsAnalyticsCharts({
  growthSeries,
  pages,
}: CmsAnalyticsChartsProps) {
  const maxUpdates = Math.max(...growthSeries.map((s) => s.updates));

  // Compute page type distribution
  const typeCounts: Record<string, number> = {};
  pages.forEach((p) => {
    typeCounts[p.pageType] = (typeCounts[p.pageType] || 0) + 1;
  });

  const typeEntries = Object.entries(typeCounts);
  const totalPages = pages.length || 1;

  const colorPalette = [
    "bg-[#5B46F6]",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-slate-500",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-aos="fade-up">
      {/* Monthly Content Activity Trend */}
      <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-5">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#5B46F6]" />
              Page Revision & Publishing Velocity (6-Month Trend)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly cadence of content updates and newly authored static pages
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#5B46F6]" /> Updates
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Published
            </span>
          </div>
        </div>

        <div className="space-y-3.5 pt-2">
          {growthSeries.map((item) => (
            <div key={item.month} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 w-14">
                  {item.month}
                </span>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                  <span className="text-[#5B46F6] font-semibold">
                    {item.updates} revisions
                  </span>
                  <span className="text-emerald-600 font-semibold">
                    {item.published} pages
                  </span>
                </div>
              </div>

              {/* Double Horizontal Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5B46F6] transition-all duration-500"
                    style={{
                      width: `${Math.round((item.updates / maxUpdates) * 100)}%`,
                    }}
                  />
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${Math.round((item.published / maxUpdates) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Type & Status Distribution */}
      <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-5">
        <div className="pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-[#5B46F6]" />
            Website Page Archetype Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown of active public routes by page type and template
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {typeEntries.map(([type, count], idx) => {
            const pct = Math.round((count / totalPages) * 100);
            const color = colorPalette[idx % colorPalette.length];

            return (
              <div key={type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 capitalize">
                    {type.toLowerCase()} Pages
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {count} pages ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-slate-50 p-4 space-y-1.5 shadow-sm">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#5B46F6]" /> Architecture Health
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            100% of website pages are statically prerendered with Next.js App Router for optimal SEO crawlers and sub-second page loads across Bangladesh mobile networks.
          </p>
        </div>
      </div>
    </div>
  );
}
