"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, Eye, Edit } from "lucide-react";
import type { CMSPage } from "../../types/cms";
import { PageStatusBadge, PageTypeBadge } from "../common/cms-status-badge";

interface RecentPagesCardProps {
  pages: CMSPage[];
}

export function RecentPagesCard({ pages }: RecentPagesCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-[#5B46F6]" />
            Recently Updated Pages
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Static pages and marketing landing routes edited recently
          </p>
        </div>
        <Link
          href="/admin/cms/pages"
          className="text-xs font-semibold text-[#5B46F6] hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {pages.slice(0, 5).map((page) => (
          <div
            key={page.id}
            className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group transition"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                  {page.title}
                </span>
                <span className="text-[11px] font-mono text-slate-400 truncate">
                  /{page.slug}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PageTypeBadge type={page.pageType} />
                <PageStatusBadge status={page.status} />
                <span className="text-[11px] text-slate-400">
                  {new Date(page.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href={`/admin/cms/pages/${page.id}`}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-[#5B46F6] hover:bg-indigo-50 transition shadow-sm"
                title="View Page Details"
              >
                <Eye className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/admin/cms/pages/${page.id}/edit`}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-[#5B46F6] hover:bg-indigo-50 transition shadow-sm"
                title="Edit Page"
              >
                <Edit className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
