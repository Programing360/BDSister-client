"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Monitor,
  Smartphone,
  Layers,
  ArrowLeft,
  Users,
  Briefcase,
  ShoppingBag,
  Calendar,
  GraduationCap,
  MessageSquare,
  Mail,
} from "lucide-react";
import type { CMSSection } from "../../types/cms";
import { DEMO_CMS_SECTIONS_HOMEPAGE } from "../../data/mock-cms";

export function HomepageManagementView() {
  const [sections, setSections] = useState<CMSSection[]>(
    DEMO_CMS_SECTIONS_HOMEPAGE
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"sections" | "hero_config">("sections");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hero specific state
  const heroSection = sections.find((s) => s.sectionType === "HERO");
  const [heroTitle, setHeroTitle] = useState(
    heroSection?.title || "Empowering Bangladeshi Women Entrepreneurs & Artisans"
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    heroSection?.subtitle || "The Premier Network for Growth, Commerce & Sisterhood"
  );
  const [heroContent, setHeroContent] = useState(
    heroSection?.content ||
      "Connect with over 15,000 verified women business owners, expand your market across Bangladesh and globally, and access exclusive capital and mentorship."
  );
  const [heroPrimaryCta, setHeroPrimaryCta] = useState("Join the Sisterhood");
  const [heroPrimaryUrl, setHeroPrimaryUrl] = useState("/register");
  const [heroSecondaryCta, setHeroSecondaryCta] = useState("Explore Marketplace");
  const [heroSecondaryUrl, setHeroSecondaryUrl] = useState("/marketplace");
  const [heroImage, setHeroImage] = useState(
    heroSection?.imageUrl ||
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    const target = updated[targetIdx];
    if (!temp || !target) return;
    updated[index] = target;
    updated[targetIdx] = temp;
    setSections(updated);
    showToast("Homepage section ordering updated. (Demo only)");
  };

  const handleToggleVisibility = (id: string) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      )
    );
    showToast("Homepage section visibility toggled. (Demo only)");
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    setSections(
      sections.map((s) =>
        s.sectionType === "HERO"
          ? {
              ...s,
              title: heroTitle,
              subtitle: heroSubtitle,
              content: heroContent,
              imageUrl: heroImage,
              ctaText: heroPrimaryCta,
              ctaUrl: heroPrimaryUrl,
            }
          : s
      )
    );
    showToast("Hero section configuration updated. (Demo only)");
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
            <span className="text-slate-900 font-medium">Homepage</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Homepage Management & Curated Layout
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Configure hero headlines, reorder public landing sections, and toggle featured content modules.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Viewport switch */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                previewMode === "desktop"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                previewMode === "mobile"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </button>
          </div>

          <a
            href="https://bdsisters.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-black transition"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live
          </a>
        </div>
      </div>

      {/* Demo notification banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50/50 p-3.5 shadow-lg shadow-indigo-500/5 text-xs text-indigo-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-bold text-[#5B46F6]">Homepage Layout Engine:</span>
          <span>DEMO DATA — Live public homepage is safely preserved.</span>
        </div>
        <span className="text-slate-500 font-medium hidden sm:inline text-[11px]">
          {sections.length} Sections Configured
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

      {/* Tab Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "sections"
              ? "bg-[#5B46F6] text-white shadow-lg shadow-indigo-500/25"
              : "bg-white text-slate-700 shadow-md shadow-slate-200/50 hover:bg-slate-50"
          }`}
        >
          1. Sections Hierarchy & Ordering ({sections.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hero_config")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "hero_config"
              ? "bg-[#5B46F6] text-white shadow-lg shadow-indigo-500/25"
              : "bg-white text-slate-700 shadow-md shadow-slate-200/50 hover:bg-slate-50"
          }`}
        >
          2. Hero Section Content & CTAs
        </button>
      </div>

      {activeTab === "sections" ? (
        /* Sections Hierarchy Table / Cards */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-3">
            <div className="rounded-2xl bg-white p-5 shadow-xl shadow-indigo-500/5 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Live Public Homepage Sections
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order represents top-to-bottom display hierarchy on BDSisters.org.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`rounded-2xl p-4 transition flex items-center justify-between gap-4 shadow-sm ${
                      sec.isVisible
                        ? "bg-slate-50/80 hover:bg-slate-50"
                        : "bg-slate-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-xs font-bold text-[#5B46F6] shadow-sm shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {sec.title}
                        </div>
                        <div className="text-[11px] text-slate-400 capitalize truncate">
                          {sec.sectionType.replace(/_/g, " ").toLowerCase()} •{" "}
                          {sec.subtitle || "Standard layout block"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-[#5B46F6] disabled:opacity-30 transition shadow-sm"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === sections.length - 1}
                        className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-[#5B46F6] disabled:opacity-30 transition shadow-sm"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(sec.id)}
                        className={`p-1.5 rounded-lg transition shadow-sm ${
                          sec.isVisible
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                        }`}
                        title={sec.isVisible ? "Visible" : "Hidden"}
                      >
                        {sec.isVisible ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Preview */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className={`rounded-2xl bg-white p-5 shadow-xl shadow-indigo-500/5 space-y-4 mx-auto ${
                previewMode === "mobile" ? "max-w-xs" : "w-full"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900">
                  Live Flow Preview
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {previewMode === "mobile" ? "Mobile" : "Desktop"}
                </span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {sections
                  .filter((s) => s.isVisible)
                  .map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-3 rounded-xl bg-slate-50 text-[11px] space-y-1 shadow-sm"
                    >
                      <div className="font-bold text-slate-800 line-clamp-1">
                        {idx + 1}. {sec.title}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {sec.sectionType.toLowerCase()} section
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hero Configuration Form */
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-indigo-500/5 max-w-4xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Homepage Hero Section Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the primary headline, value proposition, and CTA conversion buttons on the front page.
            </p>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Eyebrow / Subtitle
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none transition shadow-inner font-semibold text-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none transition shadow-inner font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supporting Description
              </label>
              <textarea
                rows={3}
                value={heroContent}
                onChange={(e) => setHeroContent(e.target.value)}
                className="w-full rounded-xl bg-slate-50 p-4 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none transition shadow-inner leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={heroPrimaryCta}
                  onChange={(e) => setHeroPrimaryCta(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={heroPrimaryUrl}
                  onChange={(e) => setHeroPrimaryUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  value={heroSecondaryCta}
                  onChange={(e) => setHeroSecondaryCta(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={heroSecondaryUrl}
                  onChange={(e) => setHeroSecondaryUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Image URL (Safe Placeholder)
              </label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B46F6] text-white text-xs font-semibold shadow-xl shadow-indigo-500/25 hover:bg-[#4a36e2] transition"
              >
                <Save className="h-4 w-4" /> Save Hero Configuration
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
