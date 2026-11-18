"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  ArrowLeft,
  Edit,
  ExternalLink,
  Layers,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Archive,
  Globe,
  Lock,
} from "lucide-react";
import type { CMSPage, PageStatus } from "../../types/cms";
import {
  PageStatusBadge,
  PageTypeBadge,
  SeoScoreBadge,
} from "../common/cms-status-badge";

interface PageDetailViewProps {
  page: CMSPage;
}

export function PageDetailView({ page: initialPage }: PageDetailViewProps) {
  const [page, setPage] = useState<CMSPage>(initialPage);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStatusChange = (newStatus: PageStatus) => {
    setPage((prev) => ({
      ...prev,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    }));
    showToast(`Page status changed to ${newStatus}. (Demo only)`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/admin/cms"
            className="hover:text-[#5B46F6] transition-colors"
          >
            CMS
          </Link>
          <span>/</span>
          <Link
            href="/admin/cms/pages"
            className="hover:text-[#5B46F6] transition-colors"
          >
            Pages
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">
            {page.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/cms/pages"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-md shadow-slate-200/50 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Pages
          </Link>
          <Link
            href={`/admin/cms/pages/${page.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5B46F6] text-xs font-semibold text-white shadow-xl shadow-indigo-500/25 hover:bg-[#4a36e2] transition"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Page
          </Link>
          <a
            href={`https://bdsisters.org/${page.slug === "home" ? "" : page.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-black transition"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Live Preview
          </a>
        </div>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50/50 p-3.5 shadow-lg shadow-indigo-500/5 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-bold text-[#5B46F6]">Page Inspector:</span>
          <span>DEMO DATA — Not connected to live CMS services.</span>
        </div>
        <div className="text-slate-500 font-medium text-[11px]">
          Page ID: {page.id}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 shadow-lg shadow-emerald-500/10 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* 2-Column Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cover & Quick Actions */}
        <div className="lg:col-span-5 space-y-6" data-aos="fade-right">
          {/* Cover Image Showcase */}
          <div className="rounded-2xl bg-white overflow-hidden shadow-xl shadow-indigo-500/5">
            <div className="relative aspect-video w-full bg-slate-900 group">
              <Image
                src={
                  page.coverImageUrl ||
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
                }
                alt={page.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <PageStatusBadge status={page.status} />
                <PageTypeBadge type={page.pageType} />
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[11px] font-mono text-white/70">
                  /{page.slug}
                </div>
                <div className="text-lg font-bold truncate">{page.title}</div>
              </div>
            </div>

            {/* Quick Status Management */}
            <div className="p-4 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">
                Publishing State:
              </span>
              <div className="flex items-center gap-2">
                {page.status !== "PUBLISHED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("PUBLISHED")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition"
                  >
                    Publish
                  </button>
                )}
                {page.status === "PUBLISHED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("DRAFT")}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800 shadow-sm transition"
                  >
                    Unpublish
                  </button>
                )}
                {page.status !== "ARCHIVED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("ARCHIVED")}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 shadow-sm transition"
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Author & Editorial Metadata */}
          <div className="rounded-2xl bg-white p-5 shadow-xl shadow-indigo-500/5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Editorial Attribution
            </h3>

            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-full bg-[#EAE6F7] text-[#5B46F6] font-bold text-base flex items-center justify-center shrink-0">
                {page.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {page.author.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {page.author.email}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Created:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(page.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Last Modified:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(page.lastUpdated).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400">Visibility:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  {page.visibility === "PUBLIC" ? (
                    <Globe className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Lock className="h-3 w-3 text-amber-600" />
                  )}
                  {page.visibility}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Page Content, Sections & SEO */}
        <div className="lg:col-span-7 space-y-6" data-aos="fade-left">
          {/* Main Info Card */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#5B46F6] uppercase tracking-wider">
                Page Overview & Purpose
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {page.title}
              </h1>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {page.contentSummary}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/cms/page-builder"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5B46F6] text-white text-xs font-semibold shadow-md shadow-indigo-500/25 hover:bg-[#4a36e2] transition"
              >
                <Layers className="h-4 w-4" /> Open in Visual Page Builder
              </Link>
              <Link
                href="/admin/cms/seo"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Manage SEO
              </Link>
            </div>
          </div>

          {/* Configured Sections List */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-[#5B46F6]" />
                  Page Builder Sections
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {page.sections.length} structured visual blocks embedded in this page layout
                </p>
              </div>
              <Link
                href="/admin/cms/page-builder"
                className="text-xs font-semibold text-[#5B46F6] hover:underline"
              >
                Edit Canvas &rarr;
              </Link>
            </div>

            {page.sections.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50/70 rounded-xl">
                No sections added yet. Click "Open in Visual Page Builder" to compose your layout.
              </div>
            ) : (
              <div className="space-y-2.5">
                {page.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-3.5 rounded-xl bg-slate-50/80 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-xs font-bold text-[#5B46F6] shadow-sm shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {sec.title}
                        </div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {sec.sectionType.replace(/_/g, " ").toLowerCase()} section
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sec.isVisible
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {sec.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
