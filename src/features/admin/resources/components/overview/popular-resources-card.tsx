"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Eye, Download, Award } from "lucide-react";
import type { ResourceItem } from "../../types/resource";
import { ResourceTypeBadge } from "../common/resource-status-badge";

interface PopularResourcesCardProps {
  resources: ResourceItem[];
}

export function PopularResourcesCard({ resources }: PopularResourcesCardProps) {
  const topItems = [...resources]
    .sort((a, b) => b.viewsCount + b.downloadsCount - (a.viewsCount + a.downloadsCount))
    .slice(0, 4);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="100"
      className="p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
    >
      <div className="flex items-center justify-between border-b border-brand-primary/10 pb-3">
        <div>
          <h3 className="text-base font-semibold text-brand-navy flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-primary" />
            Top Performing Resources
          </h3>
          <p className="text-xs text-brand-muted font-normal">
            Most consumed learning assets and downloadable tools.
          </p>
        </div>
        <Link
          href="/admin/resources/featured"
          className="text-xs font-semibold text-brand-primary hover:underline"
        >
          Featured Hub →
        </Link>
      </div>

      <div className="divide-y divide-brand-primary/5">
        {topItems.map((res, idx) => (
          <div
            key={res.id}
            className="py-3 first:pt-1 last:pb-1 flex items-center gap-3.5 hover:bg-brand-surface/40 p-2 rounded-xl transition"
          >
            <span className="w-6 text-center font-bold text-sm text-brand-primary/70 shrink-0">
              #{idx + 1}
            </span>

            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
              <Image
                src={res.coverImageUrl}
                alt={res.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/resources/${res.id}`}
                className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
              >
                {res.title}
              </Link>
              <p className="text-[11px] text-brand-muted truncate">
                {res.categoryName} • Author: {res.author.name}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-brand-navy flex items-center justify-end gap-1">
                <Eye className="w-3 h-3 text-brand-primary" />
                {res.viewsCount.toLocaleString()}
              </p>
              <p className="text-[10px] text-purple-600 font-medium flex items-center justify-end gap-1">
                <Download className="w-2.5 h-2.5" />
                {res.downloadsCount.toLocaleString()} dl
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
