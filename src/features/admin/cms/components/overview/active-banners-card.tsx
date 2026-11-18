"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Calendar, MousePointer } from "lucide-react";
import type { CMSBanner } from "../../types/cms";
import { BannerStatusBadge } from "../common/cms-status-badge";

interface ActiveBannersCardProps {
  banners: CMSBanner[];
}

export function ActiveBannersCard({ banners }: ActiveBannersCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-amber-500" />
            Active Banners & Announcements
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hero promotions, event notices, and sticky headers currently live
          </p>
        </div>
        <Link
          href="/admin/cms/banners"
          className="text-xs font-semibold text-[#5B46F6] hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {banners.slice(0, 4).map((banner) => (
          <div
            key={banner.id}
            className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group transition"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                  {banner.title}
                </span>
                <BannerStatusBadge status={banner.status} />
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="capitalize font-medium text-slate-600">
                  {banner.displayLocation.replace(/_/g, " ").toLowerCase()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Until {new Date(banner.endDate).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[#5B46F6]">
                  <MousePointer className="h-3 w-3" /> {banner.clicksCount} clicks
                </span>
              </div>
            </div>

            <Link
              href="/admin/cms/banners"
              className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-[#5B46F6] hover:bg-indigo-50 transition shadow-sm shrink-0"
              title="Manage Banner"
            >
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
