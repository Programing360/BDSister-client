"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  X,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
} from "lucide-react";
import type { CMSPage, PageStatus, PageType } from "../../types/cms";
import { DEMO_CMS_PAGES } from "../../data/mock-cms";
import { PageTable } from "./page-table";

interface PagesListViewProps {
  initialPages?: CMSPage[];
}

export function PagesListView({
  initialPages = DEMO_CMS_PAGES,
}: PagesListViewProps) {
  const [pages, setPages] = useState<CMSPage[]>(initialPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [seoFilter, setSeoFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = page.title.toLowerCase().includes(q);
        const matchesSlug = page.slug.toLowerCase().includes(q);
        const matchesSummary = page.contentSummary.toLowerCase().includes(q);
        const matchesAuthor = page.author.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesSummary && !matchesAuthor) {
          return false;
        }
      }
      if (statusFilter !== "ALL" && page.status !== statusFilter) return false;
      if (typeFilter !== "ALL" && page.pageType !== typeFilter) return false;
      if (seoFilter !== "ALL" && page.seoStatus !== seoFilter) return false;
      return true;
    });
  }, [pages, searchQuery, statusFilter, typeFilter, seoFilter]);

  const handleDuplicate = (id: string) => {
    const target = pages.find((p) => p.id === id);
    if (!target) return;
    const duplicated: CMSPage = {
      ...target,
      id: `page-${Date.now().toString().slice(-4)}`,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy`,
      status: "DRAFT",
      lastUpdated: new Date().toISOString(),
    };
    setPages((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${target.title}" as draft. (Demo only)`);
  };

  const handleArchive = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "ARCHIVED", lastUpdated: new Date().toISOString() }
          : p
      )
    );
    showToast(`Page archived successfully. (Demo only)`);
  };

  const handleStatusChange = (id: string, newStatus: PageStatus) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: newStatus, lastUpdated: new Date().toISOString() }
          : p
      )
    );
    showToast(`Page status changed to ${newStatus}. (Demo only)`);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    seoFilter !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setSeoFilter("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link
              href="/admin/cms"
              className="hover:text-[#5B46F6] transition-colors"
            >
              CMS
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Pages</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#5B46F6]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Website Pages Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Manage, publish, duplicate, and configure all static and marketing landing pages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms/page-builder"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-md shadow-slate-200/50 hover:bg-slate-50 transition"
          >
            <Layers className="h-4 w-4 text-[#5B46F6]" />
            Page Builder
          </Link>
          <Link
            href="/admin/cms/pages/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B46F6] text-xs font-semibold text-white shadow-xl shadow-indigo-500/25 hover:bg-[#4a36e2] transition"
          >
            <Plus className="h-4 w-4" />
            Create Page
          </Link>
        </div>
      </div>

      {/* Demo notification banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50/50 p-3.5 shadow-lg shadow-indigo-500/5 text-xs text-indigo-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-bold text-[#5B46F6]">Page Registry:</span>
          <span>DEMO DATA — Not connected to live CMS services.</span>
        </div>
        <span className="text-slate-500 font-medium hidden sm:inline text-[11px]">
          {pages.length} Pages Configured
        </span>
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

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-500/5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, slug, or content..."
              className="w-full rounded-xl bg-slate-50 pl-10 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition shadow-inner"
            />
          </div>

          {/* Type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Page Types</option>
              <option value="STANDARD">Standard</option>
              <option value="LANDING">Landing</option>
              <option value="INFORMATIONAL">Informational</option>
              <option value="CAMPAIGN">Campaign</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* SEO Status */}
          <div>
            <select
              value={seoFilter}
              onChange={(e) => setSeoFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All SEO Health</option>
              <option value="OPTIMIZED">Optimized (90+)</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="MISSING">Missing Meta</option>
            </select>
          </div>
        </div>

        {/* Counters & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredPages.length}</span> of{" "}
            <span className="font-bold text-slate-900">{pages.length}</span> pages
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Pages Table */}
      <PageTable
        pages={filteredPages}
        onStatusChange={handleStatusChange}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
      />
    </div>
  );
}
