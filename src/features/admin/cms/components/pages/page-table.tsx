"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Eye,
  Edit,
  Copy,
  Archive,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import type { CMSPage, PageStatus } from "../../types/cms";
import {
  PageStatusBadge,
  PageTypeBadge,
  SeoScoreBadge,
} from "../common/cms-status-badge";

interface PageTableProps {
  pages: CMSPage[];
  onStatusChange?: (id: string, newStatus: PageStatus) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function PageTable({
  pages,
  onStatusChange,
  onDuplicate,
  onArchive,
}: PageTableProps) {
  if (pages.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-xl shadow-indigo-500/5">
        <FileText className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-3 text-sm font-bold text-slate-800">
          No website pages found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          No static or dynamic pages match your current filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl bg-white overflow-hidden shadow-xl shadow-indigo-500/5">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-4 px-5">Page Title & Slug</th>
              <th className="py-4 px-4">Archetype</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">SEO Health</th>
              <th className="py-4 px-4">Author & Editor</th>
              <th className="py-4 px-4">Last Updated</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50/70 transition">
                {/* Title & Slug */}
                <td className="py-3.5 px-5">
                  <div className="space-y-0.5">
                    <Link
                      href={`/admin/cms/pages/${page.id}`}
                      className="font-bold text-slate-900 hover:text-[#5B46F6] text-xs sm:text-sm transition line-clamp-1"
                    >
                      {page.title}
                    </Link>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <span>/{page.slug}</span>
                      <a
                        href={`https://bdsisters.org/${page.slug === "home" ? "" : page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-300 hover:text-[#5B46F6] transition"
                        title="Preview Public Route"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3.5 px-4">
                  <PageTypeBadge type={page.pageType} />
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <PageStatusBadge status={page.status} />
                </td>

                {/* SEO Health */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      page.seoStatus === "OPTIMIZED"
                        ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10"
                        : page.seoStatus === "NEEDS_REVIEW"
                        ? "bg-amber-50 text-amber-700 shadow-sm shadow-amber-500/10"
                        : "bg-rose-50 text-rose-700 shadow-sm shadow-rose-500/10"
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {page.seoStatus.replace("_", " ")}
                  </span>
                </td>

                {/* Author */}
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="font-semibold text-slate-800">
                    {page.author.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {page.author.email}
                  </div>
                </td>

                {/* Last Updated */}
                <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                  <div className="font-medium text-slate-700">
                    {new Date(page.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="text-slate-400">
                    {new Date(page.lastUpdated).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/cms/pages/${page.id}`}
                      className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-[#5B46F6] hover:bg-indigo-50 transition shadow-sm"
                      title="Inspect Page"
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

                    {onDuplicate && (
                      <button
                        type="button"
                        onClick={() => onDuplicate(page.id)}
                        className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm"
                        title="Duplicate Page"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {onArchive && page.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={() => onArchive(page.id)}
                        className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition shadow-sm"
                        title="Archive Page"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-3.5 lg:hidden">
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-2xl bg-white p-5 shadow-xl shadow-indigo-500/5 space-y-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/cms/pages/${page.id}`}
                  className="font-bold text-slate-900 text-sm hover:text-[#5B46F6] transition"
                >
                  {page.title}
                </Link>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  /{page.slug}
                </div>
              </div>
              <PageStatusBadge status={page.status} />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <PageTypeBadge type={page.pageType} />
              <span className="text-[11px] text-slate-400">
                By {page.author.name} • {new Date(page.lastUpdated).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {page.contentSummary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <Link
                href={`/admin/cms/pages/${page.id}`}
                className="font-semibold text-[#5B46F6] hover:underline"
              >
                Inspect Details &rarr;
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/cms/pages/${page.id}/edit`}
                  className="px-3 py-1.5 rounded-lg bg-[#5B46F6] text-white font-semibold text-xs shadow-md shadow-indigo-500/20"
                >
                  Edit Page
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
