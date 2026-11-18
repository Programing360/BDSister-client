"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ExternalLink, Eye, Download, BookOpen } from "lucide-react";
import type { ResourceItem } from "../../types/resource";
import { ResourceTypeBadge, ResourceStatusBadge } from "../common/resource-status-badge";

interface RecentResourcesCardProps {
  resources: ResourceItem[];
}

export function RecentResourcesCard({ resources }: RecentResourcesCardProps) {
  const recentItems = resources.slice(0, 4);

  return (
    <div
      data-aos="fade-up"
      className="p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
    >
      <div className="flex items-center justify-between border-b border-brand-primary/10 pb-3">
        <div>
          <h3 className="text-base font-semibold text-brand-navy">
            Recently Added & Updated
          </h3>
          <p className="text-xs text-brand-muted font-normal">
            Latest learning modules, articles, and templates added to the library.
          </p>
        </div>
        <Link
          href="/admin/resources/all"
          className="text-xs font-semibold text-brand-primary hover:underline"
        >
          View Catalogue →
        </Link>
      </div>

      <div className="divide-y divide-brand-primary/5">
        {recentItems.map((res) => (
          <div
            key={res.id}
            className="py-3 first:pt-1 last:pb-1 flex items-start gap-3.5 hover:bg-brand-surface/40 p-2 rounded-xl transition"
          >
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
              <Image
                src={res.coverImageUrl}
                alt={res.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <ResourceTypeBadge type={res.resourceType} />
                <span className="text-[11px] text-brand-muted truncate">
                  {res.categoryName}
                </span>
              </div>
              <Link
                href={`/admin/resources/${res.id}`}
                className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
              >
                {res.title}
              </Link>
              <div className="flex items-center gap-3 text-[11px] text-brand-muted">
                <span>By {res.author.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-brand-primary" /> {res.viewsCount}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3 text-purple-600" /> {res.downloadsCount}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <ResourceStatusBadge status={res.status} />
              <p className="text-[10px] text-brand-muted mt-1">{res.publicationDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
