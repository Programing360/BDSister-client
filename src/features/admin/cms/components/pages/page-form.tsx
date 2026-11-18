"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  Globe,
  Lock,
} from "lucide-react";
import type { CMSPage, PageStatus, PageType } from "../../types/cms";

interface PageFormProps {
  initialPage?: CMSPage;
  isEdit?: boolean;
}

export function PageForm({ initialPage, isEdit = false }: PageFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialPage?.title || "");
  const [slug, setSlug] = useState(initialPage?.slug || "");
  const [pageType, setPageType] = useState<PageType>(
    initialPage?.pageType || "STANDARD"
  );
  const [contentSummary, setContentSummary] = useState(
    initialPage?.contentSummary || ""
  );
  const [status, setStatus] = useState<PageStatus>(
    initialPage?.status || "DRAFT"
  );
  const [visibility, setVisibility] = useState<
    "PUBLIC" | "MEMBERS_ONLY" | "UNLISTED"
  >(initialPage?.visibility || "PUBLIC");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialPage?.coverImageUrl ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
  );
  const [authorName, setAuthorName] = useState(
    initialPage?.author.name || "BDSisters Staff"
  );
  const [authorEmail, setAuthorEmail] = useState(
    initialPage?.author.email || "staff@bdsisters.org"
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMessage(
      isEdit
        ? `Page "${title}" saved successfully. (Demo only - not persisted to backend)`
        : `Page "${title}" created successfully. (Demo only - not persisted to backend)`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/cms/pages");
    }, 1500);
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
          <span className="text-slate-900 font-medium">
            {isEdit ? `Edit: ${initialPage?.title}` : "Create Page"}
          </span>
        </div>

        <Link
          href="/admin/cms/pages"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-md shadow-slate-200/50 hover:bg-slate-50 transition self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Pages
        </Link>
      </div>

      {/* Demo notification banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50/50 p-3.5 shadow-lg shadow-indigo-500/5 text-xs text-indigo-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-bold text-[#5B46F6]">Page Authoring Form:</span>
          <span>DEMO DATA — Not connected to live CMS services.</span>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 shadow-lg shadow-emerald-500/10 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-5">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Page Details & URL Structure
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Page Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Micro-Grant Seed Fund 2026"
                    className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-50 px-3 shadow-inner">
                    <span className="text-xs text-slate-400 font-mono">
                      bdsisters.org/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="seed-fund-2026"
                      className="w-full bg-transparent px-1.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Content Summary & Purpose
                  </label>
                  <textarea
                    rows={4}
                    value={contentSummary}
                    onChange={(e) => setContentSummary(e.target.value)}
                    placeholder="Brief description of the page content for internal indexing and search previews..."
                    className="w-full rounded-xl bg-slate-50 p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Cover Image & Author Attribution
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Author / Editor Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Author Email
                  </label>
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cover Image URL (Safe Placeholder)
                  </label>
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Publishing */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 space-y-5">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Page Publishing & Archetype
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Page Archetype
                  </label>
                  <select
                    value={pageType}
                    onChange={(e) => setPageType(e.target.value as PageType)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none transition shadow-sm"
                  >
                    <option value="STANDARD">Standard Page</option>
                    <option value="LANDING">Marketing Landing</option>
                    <option value="INFORMATIONAL">Informational / Legal</option>
                    <option value="CAMPAIGN">Campaign Promotion</option>
                    <option value="CUSTOM">Custom Layout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PageStatus)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none transition shadow-sm"
                  >
                    <option value="DRAFT">Draft (Unpublished)</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="PUBLISHED">Published Live</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Access Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) =>
                      setVisibility(
                        e.target.value as "PUBLIC" | "MEMBERS_ONLY" | "UNLISTED"
                      )
                    }
                    className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none transition shadow-sm"
                  >
                    <option value="PUBLIC">Public (Search Indexed)</option>
                    <option value="MEMBERS_ONLY">Members Only</option>
                    <option value="UNLISTED">Unlisted (Direct Link Only)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/admin/cms/pages"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B46F6] text-white text-xs font-semibold shadow-xl shadow-indigo-500/25 hover:bg-[#4a36e2] disabled:opacity-50 transition"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
