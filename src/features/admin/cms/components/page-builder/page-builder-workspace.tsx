"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Save,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  LayoutTemplate,
  Sliders,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { CMSSection, SectionType } from "../../types/cms";
import { DEMO_CMS_SECTIONS_HOMEPAGE } from "../../data/mock-cms";

const AVAILABLE_SECTION_TEMPLATES: Array<{
  type: SectionType;
  title: string;
  desc: string;
  icon: string;
}> = [
  { type: "HERO", title: "Hero Banner", desc: "Top headline with CTA and key visual", icon: "Sparkles" },
  { type: "STATS", title: "Statistics & Counter", desc: "Key platform metrics in 4-column grid", icon: "BarChart" },
  { type: "ABOUT", title: "About Overview", desc: "Narrative story with founder quote", icon: "FileText" },
  { type: "FEATURE_GRID", title: "Feature Grid", desc: "3 or 4 column service cards with icons", icon: "Grid" },
  { type: "CARD_GRID", title: "Product / Card Grid", desc: "Curated marketplace items or events", icon: "Layers" },
  { type: "MISSION_VISION", title: "Mission & Vision", desc: "Two-card statement of organizational goals", icon: "Compass" },
  { type: "TESTIMONIALS", title: "Testimonial Carousel", desc: "Member success stories with badges", icon: "MessageSquare" },
  { type: "CTA", title: "Call to Action", desc: "High-contrast registration banner", icon: "Zap" },
  { type: "FAQ", title: "FAQ Accordion", desc: "Collapsible questions and answers", icon: "HelpCircle" },
  { type: "NEWSLETTER", title: "Newsletter Strip", desc: "Email subscription capture form", icon: "Mail" },
  { type: "TEAM", title: "Team / Council Grid", desc: "Leadership bios with headshots", icon: "Users" },
  { type: "CONTACT", title: "Contact Information", desc: "Office address, phone, and inquiry form", icon: "Phone" },
];

export function PageBuilderWorkspace() {
  const [sections, setSections] = useState<CMSSection[]>(
    DEMO_CMS_SECTIONS_HOMEPAGE
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    DEMO_CMS_SECTIONS_HOMEPAGE[0]?.id || ""
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [mobileTab, setMobileTab] = useState<"library" | "canvas" | "properties">(
    "canvas"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddSection = (type: SectionType, defaultTitle: string) => {
    const newSection: CMSSection = {
      id: `sec-${Date.now().toString().slice(-4)}`,
      sectionType: type,
      title: defaultTitle,
      subtitle: "New custom subtitle",
      content: "Add engaging descriptive content for this section.",
      isVisible: true,
      order: sections.length + 1,
      ctaText: "Learn More",
      ctaUrl: "/about",
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
    showToast(`Added "${defaultTitle}" block to canvas.`);
    setMobileTab("properties");
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
  };

  const handleDuplicate = (id: string) => {
    const target = sections.find((s) => s.id === id);
    if (!target) return;
    const duplicated: CMSSection = {
      ...target,
      id: `sec-${Date.now().toString().slice(-4)}`,
      title: `${target.title} (Copy)`,
      order: sections.length + 1,
    };
    setSections([...sections, duplicated]);
    setSelectedSectionId(duplicated.id);
    showToast(`Duplicated section. (Demo only)`);
  };

  const handleDelete = (id: string) => {
    if (sections.length <= 1) {
      showToast("Cannot delete the only section on the page.");
      return;
    }
    const updated = sections.filter((s) => s.id !== id);
    setSections(updated);
    if (selectedSectionId === id) {
      setSelectedSectionId(updated[0]?.id || "");
    }
    showToast("Section removed from canvas.");
  };

  const handleToggleVisibility = (id: string) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      )
    );
  };

  const updateSelectedProperty = (field: keyof CMSSection, val: any) => {
    if (!selectedSectionId) return;
    setSections(
      sections.map((s) =>
        s.id === selectedSectionId ? { ...s, [field]: val } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Builder Control Toolbar */}
      <div className="rounded-2xl bg-white p-4 shadow-xl shadow-indigo-500/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-[#5B46F6] hover:bg-indigo-50 transition shadow-sm"
            title="Exit Page Builder"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                Visual Page Builder Workspace
              </span>
              <span className="rounded-full bg-indigo-50 text-[#5B46F6] text-[10px] font-bold px-2 py-0.5">
                Homepage Canvas
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {sections.length} blocks configured • Responsive canvas preview
            </p>
          </div>
        </div>

        {/* Viewport switch and actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Desktop / Mobile preview mode */}
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

          <button
            type="button"
            onClick={() =>
              showToast(
                "Canvas draft saved to local UI demonstration. (Demo only)"
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-md shadow-slate-200/50 hover:bg-slate-50 transition"
          >
            <Save className="h-3.5 w-3.5" /> Save Draft
          </button>

          <button
            type="button"
            onClick={() =>
              showToast(
                "Published layout changes simulated. (Demo only - not persisted)"
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B46F6] text-xs font-semibold text-white shadow-xl shadow-indigo-500/25 hover:bg-[#4a36e2] transition"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Publish Canvas
          </button>
        </div>
      </div>

      {/* Mobile Tab Selector (for screens < 1024px) */}
      <div className="grid grid-cols-3 gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("library")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            mobileTab === "library"
              ? "bg-[#5B46F6] text-white shadow-md shadow-indigo-500/20"
              : "bg-white text-slate-600 shadow-sm"
          }`}
        >
          1. Blocks Library
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("canvas")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            mobileTab === "canvas"
              ? "bg-[#5B46F6] text-white shadow-md shadow-indigo-500/20"
              : "bg-white text-slate-600 shadow-sm"
          }`}
        >
          2. Page Canvas ({sections.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("properties")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            mobileTab === "properties"
              ? "bg-[#5B46F6] text-white shadow-md shadow-indigo-500/20"
              : "bg-white text-slate-600 shadow-sm"
          }`}
        >
          3. Properties
        </button>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 shadow-lg shadow-emerald-500/10 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =========================================================
            PANEL 1 (LEFT): Available Section Blocks Library
           ========================================================= */}
        <div
          className={`lg:col-span-3 rounded-2xl bg-white p-5 shadow-xl shadow-indigo-500/5 space-y-4 ${
            mobileTab !== "library" ? "hidden lg:block" : ""
          }`}
        >
          <div className="pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutTemplate className="h-4 w-4 text-[#5B46F6]" /> Section Library
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click "+ Add" to append block to canvas
            </p>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {AVAILABLE_SECTION_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.type}
                className="p-3 rounded-xl bg-slate-50/80 hover:bg-indigo-50/50 transition group flex items-center justify-between gap-2 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs group-hover:text-[#5B46F6] transition truncate">
                    {tmpl.title}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {tmpl.desc}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddSection(tmpl.type, tmpl.title)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white group-hover:bg-[#5B46F6] group-hover:text-white text-xs font-semibold text-[#5B46F6] shadow-sm transition shrink-0"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            PANEL 2 (CENTER): Interactive Canvas Preview
           ========================================================= */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            mobileTab !== "canvas" ? "hidden lg:block" : ""
          }`}
        >
          <div
            className={`mx-auto transition-all duration-300 ${
              previewMode === "mobile" ? "max-w-sm" : "w-full"
            }`}
          >
            {/* Canvas Header / Frame */}
            <div className="rounded-t-2xl bg-slate-900 p-3 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono text-slate-300 ml-2">
                  https://bdsisters.org
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {previewMode === "mobile" ? "390px Viewport" : "Fluid 1440px Canvas"}
              </span>
            </div>

            {/* Canvas Body: List of Sections */}
            <div className="rounded-b-2xl bg-slate-100 p-4 space-y-3.5 min-h-[640px] shadow-2xl shadow-indigo-500/10">
              {sections.map((section, idx) => {
                const isSelected = section.id === selectedSectionId;

                return (
                  <div
                    key={section.id}
                    onClick={() => {
                      setSelectedSectionId(section.id);
                      setMobileTab("properties");
                    }}
                    className={`rounded-2xl transition-all duration-200 cursor-pointer p-4 ${
                      isSelected
                        ? "bg-white ring-2 ring-[#5B46F6] shadow-xl shadow-indigo-500/15"
                        : "bg-white/95 hover:bg-white shadow-md shadow-slate-200/50"
                    } ${!section.isVisible ? "opacity-50" : ""}`}
                  >
                    {/* Section Top Controls */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-[10px] font-bold text-[#5B46F6]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900">
                          {section.title}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 capitalize">
                          {section.sectionType.toLowerCase()}
                        </span>
                      </div>

                      {/* Reorder & Action Buttons */}
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-50 text-slate-500 hover:text-[#5B46F6] disabled:opacity-30 transition"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === sections.length - 1}
                          className="p-1 rounded bg-slate-50 text-slate-500 hover:text-[#5B46F6] disabled:opacity-30 transition"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(section.id)}
                          className="p-1 rounded bg-slate-50 text-slate-500 hover:text-amber-600 transition"
                          title={section.isVisible ? "Hide Block" : "Show Block"}
                        >
                          {section.isVisible ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-slate-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(section.id)}
                          className="p-1 rounded bg-slate-50 text-slate-500 hover:text-blue-600 transition"
                          title="Duplicate Block"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(section.id)}
                          className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                          title="Delete Block"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Section Body Preview Presentation */}
                    <div className="space-y-2">
                      {section.subtitle && (
                        <div className="text-[11px] font-semibold text-[#5B46F6]">
                          {section.subtitle}
                        </div>
                      )}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {section.content || "Content block loaded in template..."}
                      </p>

                      {section.ctaText && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#5B46F6] text-white text-[10px] font-bold shadow-sm">
                            {section.ctaText} &rarr;
                          </span>
                        </div>
                      )}

                      {/* Items Preview if available */}
                      {section.items && section.items.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {section.items.slice(0, 4).map((it) => (
                            <div
                              key={it.id}
                              className="rounded-lg bg-slate-50 p-2 text-[11px]"
                            >
                              <div className="font-bold text-slate-800 truncate">
                                {it.title}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {it.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            PANEL 3 (RIGHT): Selected Section Properties Editor
           ========================================================= */}
        <div
          className={`lg:col-span-3 rounded-2xl bg-white p-5 shadow-xl shadow-indigo-500/5 space-y-4 ${
            mobileTab !== "properties" ? "hidden lg:block" : ""
          }`}
        >
          <div className="pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-[#5B46F6]" /> Block Properties
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live edit content for selected section
            </p>
          </div>

          {!selectedSection ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Select a section in the canvas to edit its properties.
            </div>
          ) : (
            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={selectedSection.title}
                  onChange={(e) =>
                    updateSelectedProperty("title", e.target.value)
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eyebrow / Subtitle
                </label>
                <input
                  type="text"
                  value={selectedSection.subtitle || ""}
                  onChange={(e) =>
                    updateSelectedProperty("subtitle", e.target.value)
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descriptive Body Content
                </label>
                <textarea
                  rows={4}
                  value={selectedSection.content || ""}
                  onChange={(e) =>
                    updateSelectedProperty("content", e.target.value)
                  }
                  className="w-full rounded-xl bg-slate-50 p-3 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={selectedSection.ctaText || ""}
                    onChange={(e) =>
                      updateSelectedProperty("ctaText", e.target.value)
                    }
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={selectedSection.ctaUrl || ""}
                    onChange={(e) =>
                      updateSelectedProperty("ctaUrl", e.target.value)
                    }
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Background Visual Image URL
                </label>
                <input
                  type="url"
                  value={selectedSection.imageUrl || ""}
                  onChange={(e) =>
                    updateSelectedProperty("imageUrl", e.target.value)
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none transition shadow-inner"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-600">
                  Block Visibility
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateSelectedProperty(
                      "isVisible",
                      !selectedSection.isVisible
                    )
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedSection.isVisible
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {selectedSection.isVisible ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
