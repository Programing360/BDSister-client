"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Share2,
  Sparkles,
  Eye,
  Check,
  Search,
} from "lucide-react";
import { DEMO_SEO_SETTINGS } from "../../data/mock-cms";
import type { SEOSettings } from "../../types/cms";

export function SEOManagementView() {
  const [seoList, setSeoList] = useState<SEOSettings[]>(DEMO_SEO_SETTINGS);
  const defaultSeo = DEMO_SEO_SETTINGS[0] || {
    id: "seo-1",
    pageId: "page-001",
    pageTitle: "Home",
    slug: "/",
    metaTitle: "BDSisters",
    metaDescription: "BDSisters Platform",
    canonicalUrl: "https://bdsisters.org",
    metaRobots: "index, follow" as const,
    ogTitle: "BDSisters",
    ogDescription: "BDSisters Platform",
    twitterCard: "summary_large_image" as const,
    score: 90,
    missingFields: [],
    lastChecked: "2026-02-17T10:00:00Z",
  };
  const [selectedId, setSelectedId] = useState<string>(defaultSeo.id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeSeo = seoList.find((s) => s.id === selectedId) || defaultSeo;
  const [seo, setSeo] = useState<SEOSettings>(activeSeo);

  const handleSelectId = (id: string) => {
    setSelectedId(id);
    const target = seoList.find((s) => s.id === id);
    if (target) {
      setSeo(target);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveSeo = () => {
    let score = 50;
    if (seo.metaTitle.length >= 40 && seo.metaTitle.length <= 65) score += 20;
    if (seo.metaDescription.length >= 100 && seo.metaDescription.length <= 165) score += 20;
    if (seo.ogImageUrl) score += 10;

    const missing: string[] = [];
    if (!seo.metaDescription) missing.push("metaDescription");
    if (!seo.ogImageUrl) missing.push("ogImageUrl");
    if (!seo.ogTitle) missing.push("ogTitle");

    const updatedSeo: SEOSettings = {
      ...seo,
      score: Math.min(score, 100),
      missingFields: missing,
      lastChecked: new Date().toISOString(),
    };
    setSeo(updatedSeo);

    setSeoList((prev) =>
      prev.map((s) => (s.id === selectedId ? updatedSeo : s))
    );
    triggerToast(`SEO updated for "${activeSeo.pageTitle}" (Score: ${updatedSeo.score}/100)`);
  };

  const titleCharCount = seo.metaTitle.length;
  const isTitleIdeal = titleCharCount >= 45 && titleCharCount <= 65;

  const descCharCount = seo.metaDescription.length;
  const isDescIdeal = descCharCount >= 100 && descCharCount <= 160;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to CMS Overview
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Search Engine Optimization
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              SEO & Social Metadata Studio
            </h1>
            <p className="text-sm text-slate-300">
              Optimize SERP rankings, meta descriptions, OpenGraph sharing cards, canonical URLs, and indexing controls.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveSeo}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save SEO Settings
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Page Selector Bar */}
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1">Select Page to Optimize</label>
          <p className="text-xs text-slate-500">Pick any CMS page to inspect its search snippet and OG card.</p>
        </div>
        <select
          value={selectedId}
          onChange={(e) => handleSelectId(e.target.value)}
          className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
        >
          {seoList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.pageTitle} ({s.slug}) — SEO Score: {s.score}/100
            </option>
          ))}
        </select>
      </div>

      {/* Live SERP Google Snippet Preview & Social Share Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Google SERP Snippet Preview */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Google SERP Snippet</h2>
              <p className="text-xs text-slate-500">How this page appears in organic search results.</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              <Search className="h-3 w-3 text-indigo-600" />
              <span>Google Desktop</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-5 shadow-inner">
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                BD
              </div>
              <div className="truncate">
                <span className="font-semibold text-slate-800">bdsisters.org</span>
                <span className="text-slate-400"> › {seo.slug.replace(/^\//, "")}</span>
              </div>
            </div>
            <h3 className="text-base font-medium text-blue-700 hover:underline cursor-pointer line-clamp-1 leading-snug">
              {seo.metaTitle || seo.pageTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {seo.metaDescription || "No meta description defined yet. Add one to attract higher organic clicks."}
            </p>
          </div>

          {/* Quick Health Feedback */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                isTitleIdeal ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              Title: {titleCharCount}/60 chars ({isTitleIdeal ? "Optimal" : "Needs adjustment"})
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                isDescIdeal ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              Description: {descCharCount}/160 chars ({isDescIdeal ? "Optimal" : "Too short/long"})
            </span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
              Score: {seo.score}/100
            </span>
          </div>
        </div>

        {/* OpenGraph Social Card Preview */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Social Share Card</h2>
              <p className="text-xs text-slate-500">Facebook, LinkedIn, and Twitter preview.</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              <Share2 className="h-3 w-3 text-indigo-600" />
              <span>OpenGraph</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-slate-50 shadow-inner">
            {seo.ogImageUrl ? (
              <div className="relative h-44 w-full">
                <Image src={seo.ogImageUrl} alt="OG Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center bg-slate-200 text-xs font-semibold text-slate-500">
                No OpenGraph Image configured
              </div>
            )}
            <div className="p-4 bg-white">
              <span className="text-[10px] uppercase font-bold text-slate-400">bdsisters.org</span>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                {seo.ogTitle || seo.metaTitle || seo.pageTitle}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                {seo.ogDescription || seo.metaDescription || "Empowering Bangladeshi women entrepreneurs with market access and resources."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Form Controls */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Search Meta */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Search Engine Meta Tags</h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Meta Title</label>
              <span className="text-[11px] font-mono text-slate-400">{titleCharCount}/60</span>
            </div>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Meta Description</label>
              <span className="text-[11px] font-mono text-slate-400">{descCharCount}/160</span>
            </div>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Canonical URL</label>
            <input
              type="url"
              value={seo.canonicalUrl}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Robots Meta Directive</label>
            <select
              value={seo.metaRobots}
              onChange={(e) => setSeo({ ...seo, metaRobots: e.target.value as any })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            >
              <option value="index, follow">Index, Follow (Recommended)</option>
              <option value="noindex, follow">Noindex, Follow</option>
              <option value="index, nofollow">Index, Nofollow</option>
              <option value="noindex, nofollow">Noindex, Nofollow</option>
            </select>
          </div>
        </div>

        {/* OpenGraph & Social Cards */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Social Media & OpenGraph (OG)</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">OG Title</label>
            <input
              type="text"
              value={seo.ogTitle}
              onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">OG Description</label>
            <textarea
              rows={2}
              value={seo.ogDescription}
              onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">OpenGraph Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={seo.ogImageUrl || ""}
              onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Twitter Card Style</label>
            <select
              value={seo.twitterCard}
              onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value as any })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            >
              <option value="summary_large_image">Large Image Card (Recommended)</option>
              <option value="summary">Small Summary Card</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
