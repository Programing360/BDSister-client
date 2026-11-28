"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Globe,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  Code,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface LiveCmsBlock {
  _id: string;
  sectionKey: string;
  blockType: string;
  title: string;
  subtitle?: string;
  content: string;
  order: number;
  isPublished: boolean;
  imageUrl?: string;
  hoverTooltip?: string;
  ctaText?: string;
  ctaLink?: string;
  metadata?: Record<string, any>;
  updatedAt?: string;
}

export function HomepageManagementView() {
  const [blocks, setBlocks] = useState<LiveCmsBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"all_blocks" | "hero_config">("all_blocks");
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>("all");

  // Edit modal
  const [editingBlock, setEditingBlock] = useState<LiveCmsBlock | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editOrder, setEditOrder] = useState<number>(0);
  const [editIsPublished, setEditIsPublished] = useState<boolean>(true);
  const [editCtaText, setEditCtaText] = useState("");
  const [editCtaLink, setEditCtaLink] = useState("");
  const [editMetadataJson, setEditMetadataJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Hero specific state
  const heroBlock = blocks.find(
    (b) => b.sectionKey === "hero" || b.blockType === "hero"
  );
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroContent, setHeroContent] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");
  const [heroCtaLink, setHeroCtaLink] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data?: LiveCmsBlock[] }>(
        API_ENDPOINTS.cms.blocks
      );
      const raw = res as any;
      const list: LiveCmsBlock[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];
      setBlocks(list);

      const h = list.find((b) => b.sectionKey === "hero" || b.blockType === "hero");
      if (h) {
        setHeroTitle(h.title || "");
        setHeroSubtitle(h.subtitle || "");
        setHeroContent(h.content || "");
        setHeroCtaText(h.ctaText || "Join Sisterhood Free");
        setHeroCtaLink(h.ctaLink || "/register");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CMS blocks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleOpenEdit = (block: LiveCmsBlock) => {
    setEditingBlock(block);
    setEditTitle(block.title || "");
    setEditSubtitle(block.subtitle || "");
    setEditContent(block.content || "");
    setEditOrder(block.order || 0);
    setEditIsPublished(block.isPublished !== false);
    setEditCtaText(block.ctaText || "");
    setEditCtaLink(block.ctaLink || "");
    setEditMetadataJson(
      block.metadata ? JSON.stringify(block.metadata, null, 2) : ""
    );
    setJsonError(null);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    let parsedMetadata = editingBlock.metadata;
    if (editMetadataJson.trim()) {
      try {
        parsedMetadata = JSON.parse(editMetadataJson);
        setJsonError(null);
      } catch (err) {
        setJsonError("Invalid JSON in metadata. Please fix before saving.");
        return;
      }
    }

    setIsSaving(true);
    try {
      await apiClient.patch(API_ENDPOINTS.cms.updateBlockDirect(editingBlock._id), {
        title: editTitle.trim(),
        subtitle: editSubtitle.trim() || undefined,
        content: editContent,
        order: Number(editOrder) || 0,
        isPublished: editIsPublished,
        ctaText: editCtaText.trim() || undefined,
        ctaLink: editCtaLink.trim() || undefined,
        metadata: parsedMetadata,
      });

      showToast(`CMS Block "${editTitle}" updated successfully in MongoDB.`);
      setEditingBlock(null);
      await fetchBlocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save CMS block.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (block: LiveCmsBlock) => {
    setIsSaving(true);
    try {
      await apiClient.patch(API_ENDPOINTS.cms.updateBlockDirect(block._id), {
        isPublished: !block.isPublished,
      });
      showToast(
        `Block "${block.title}" is now ${
          !block.isPublished ? "Published" : "Draft"
        }.`
      );
      await fetchBlocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroBlock) {
      setError("No hero block found in database to update.");
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.patch(API_ENDPOINTS.cms.updateBlockDirect(heroBlock._id), {
        title: heroTitle.trim(),
        subtitle: heroSubtitle.trim(),
        content: heroContent.trim(),
        ctaText: heroCtaText.trim(),
        ctaLink: heroCtaLink.trim(),
      });
      showToast("Hero section updated live in MongoDB.");
      await fetchBlocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save Hero block.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBlocks = blocks.filter((b) => {
    if (selectedSectionKey === "all") return true;
    return b.sectionKey?.toLowerCase() === selectedSectionKey.toLowerCase();
  });

  const sectionKeys = Array.from(
    new Set(blocks.map((b) => b.sectionKey).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/cms" className="hover:text-[#5B46F6] transition-colors">
              CMS
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Homepage & Sections</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Homepage & Platform CMS Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Edit live headlines, Sister Wings, 8 Key Areas, Section Explainers, and metadata stored in MongoDB.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchBlocks}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-black transition"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Public Home
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-medium text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all_blocks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "all_blocks"
              ? "bg-[#5B46F6] text-white shadow-md shadow-indigo-500/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All CMS Blocks ({blocks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hero_config")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "hero_config"
              ? "bg-[#5B46F6] text-white shadow-md shadow-indigo-500/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Hero Headline & CTAs
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-[#5B46F6] animate-spin" />
        </div>
      ) : activeTab === "all_blocks" ? (
        <div className="space-y-4">
          {/* Section filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedSectionKey("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSectionKey === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Sections ({blocks.length})
            </button>
            {sectionKeys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedSectionKey(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  selectedSectionKey === k
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {k} ({blocks.filter((b) => b.sectionKey === k).length})
              </button>
            ))}
          </div>

          {/* Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlocks.map((b) => (
              <div
                key={b._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#5B46F6]/40 transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-[#5B46F6]">
                      {b.sectionKey} • {b.blockType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Order: #{b.order}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {b.title}
                  </h3>

                  {b.subtitle && (
                    <p className="text-xs font-semibold text-[#D98408] line-clamp-1">
                      {b.subtitle}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-3">
                    {b.content || "No text content specified."}
                  </p>

                  {b.metadata && Object.keys(b.metadata).length > 0 && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Code className="h-3 w-3 text-slate-400" />
                      <span>{Object.keys(b.metadata).length} metadata fields configured</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(b)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      b.isPublished
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {b.isPublished ? (
                      <>
                        <Eye className="h-3 w-3" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" /> Draft
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(b)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#5B46F6] text-white text-xs font-semibold hover:bg-[#4834e0] transition shadow-xs"
                  >
                    <Edit3 className="h-3 w-3" /> Edit Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Hero Configuration Form */
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 max-w-4xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Homepage Hero Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Directly updates the seeded hero CmsBlock in MongoDB. Changes reflect instantly on the public website.
            </p>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6] transition font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Subtitle / Value Proposition
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6] transition font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Description / Platform Mission
              </label>
              <textarea
                rows={4}
                value={heroContent}
                onChange={(e) => setHeroContent(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6] transition leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6] transition font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6] transition"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5B46F6] text-white text-xs font-semibold shadow-md shadow-indigo-500/25 hover:bg-[#4a36e2] transition disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Hero Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Edit Block */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit CMS Block: {editingBlock.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {editingBlock.sectionKey} • {editingBlock.blockType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBlock(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Content / Description
                </label>
                <textarea
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editOrder}
                    onChange={(e) => setEditOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editIsPublished ? "true" : "false"}
                    onChange={(e) => setEditIsPublished(e.target.value === "true")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft / Hidden</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={editCtaText}
                    onChange={(e) => setEditCtaText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CTA Destination URL
                  </label>
                  <input
                    type="text"
                    value={editCtaLink}
                    onChange={(e) => setEditCtaLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metadata JSON (Features, howItWorks, icons, etc.)
                </label>
                <textarea
                  rows={4}
                  value={editMetadataJson}
                  onChange={(e) => setEditMetadataJson(e.target.value)}
                  className="w-full font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]"
                  placeholder='{ "icon": "UserCheck", "features": ["Feature 1"] }'
                />
                {jsonError && (
                  <p className="text-xs text-red-600 mt-1">{jsonError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#5B46F6] text-white text-xs font-semibold shadow-md shadow-indigo-500/25 hover:bg-[#4834e0] transition disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
