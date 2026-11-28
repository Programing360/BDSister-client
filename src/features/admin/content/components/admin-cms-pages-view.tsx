"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    FileText,
    Save,
    RefreshCw,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    Layers,
    Sparkles,
    Code,
    HelpCircle,
    Globe,
    X,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface BackendCmsBlock {
    _id?: string;
    blockId: string;
    title: string;
    subtitle?: string;
    content: string;
    order: number;
    isVisible: boolean;
    hoverTooltip?: string;
}

export interface BackendCmsPage {
    _id: string;
    slug: string;
    title: string;
    metaDescription?: string;
    isPublished: boolean;
    showInNav: boolean;
    showInHeader?: boolean;
    navLabel?: string;
    navOrder: number;
    blocks: BackendCmsBlock[];
}

export interface BackendCmsBlockItem {
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
}

const KNOWN_SECTIONS: Record<string, { name: string; description: string; icon: any }> = {
    hero: {
        name: "Home: Hero",
        description: "Main platform headline, subtitle, primary CTA button, and link.",
        icon: Sparkles,
    },
    wings: {
        name: "Home: Sister Wings",
        description: "The 6 collaborative wings of Muhsina Organization (CoP, TSPP, MIDJ, etc.).",
        icon: Layers,
    },
    keyAreas: {
        name: "Home: 8 Key Areas",
        description: "The 8 core platform pillars (Profiles, Businesses, E-Commerce, Forums, etc.).",
        icon: Globe,
    },
    whoWeAre: {
        name: "Home: Who We Are & Principles",
        description: "Mission, vision, and the 4 Islamic Sisterhood Principles (Amanah, Ukhuwwah, etc.).",
        icon: FileText,
    },
    sectionExplainers: {
        name: "Section Explainers",
        description: "Hovering explainer dialogs and tooltip descriptions for platform sections.",
        icon: HelpCircle,
    },
};

type SelectedTarget =
    | { type: "section"; sectionKey: string }
    | { type: "page"; pageId: string };

export function AdminCmsPagesView() {
    const [pages, setPages] = useState<BackendCmsPage[]>([]);
    const [blocks, setBlocks] = useState<BackendCmsBlockItem[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<SelectedTarget>({
        type: "section",
        sectionKey: "hero",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Create Page modal / inline
    const [showCreatePageModal, setShowCreatePageModal] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState("");
    const [newPageSlug, setNewPageSlug] = useState("");

    // Create Section Block modal
    const [showCreateBlockModal, setShowCreateBlockModal] = useState(false);
    const [newBlockTitle, setNewBlockTitle] = useState("");
    const [newBlockSubtitle, setNewBlockSubtitle] = useState("");
    const [newBlockType, setNewBlockType] = useState("info");
    const [newBlockContent, setNewBlockContent] = useState("");
    const [newBlockCtaText, setNewBlockCtaText] = useState("");
    const [newBlockCtaLink, setNewBlockCtaLink] = useState("");

    // Raw JSON metadata editing state per block ID
    const [metadataStrings, setMetadataStrings] = useState<Record<string, string>>({});
    const [metadataErrors, setMetadataErrors] = useState<Record<string, string | null>>({});

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    // ─── Data Fetching ──────────────────────────────────────────────────────────

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [pagesRes, blocksRes] = await Promise.all([
                apiClient.get<{ data?: BackendCmsPage[] }>(API_ENDPOINTS.cms.adminPages).catch(async () => {
                    return apiClient.get<{ data?: BackendCmsPage[] }>(API_ENDPOINTS.cms.pages);
                }),
                apiClient.get<{ data?: BackendCmsBlockItem[] }>(`${API_ENDPOINTS.cms.blocks}?all=true`),
            ]);

            const rawPages = pagesRes as unknown as { data?: BackendCmsPage[] } | BackendCmsPage[];
            const pageList = Array.isArray(rawPages)
                ? rawPages
                : Array.isArray(rawPages?.data)
                    ? rawPages.data
                    : [];
            setPages(pageList);

            const rawBlocks = blocksRes as unknown as { data?: BackendCmsBlockItem[] } | BackendCmsBlockItem[];
            const blockList = Array.isArray(rawBlocks)
                ? rawBlocks
                : Array.isArray(rawBlocks?.data)
                    ? rawBlocks.data
                    : [];
            setBlocks(blockList);

            // Populate metadata JSON strings
            const metaMap: Record<string, string> = {};
            blockList.forEach((b) => {
                if (b.metadata && Object.keys(b.metadata).length > 0) {
                    metaMap[b._id] = JSON.stringify(b.metadata, null, 2);
                } else {
                    metaMap[b._id] = "{}";
                }
            });
            setMetadataStrings(metaMap);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load CMS content.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ─── Grouped Home Page Sections ─────────────────────────────────────────────

    const sectionGroups = useMemo(() => {
        const groups: {
            sectionKey: string;
            displayName: string;
            description: string;
            icon: any;
            blocks: BackendCmsBlockItem[];
        }[] = [];

        // Seeded known keys first in preferred display order
        const order = ["hero", "wings", "keyAreas", "whoWeAre", "sectionExplainers"];
        const foundKeys = new Set(blocks.map((b) => b.sectionKey));

        order.forEach((key) => {
            const info = KNOWN_SECTIONS[key];
            const sectionBlocks = blocks
                .filter((b) => b.sectionKey === key)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            groups.push({
                sectionKey: key,
                displayName: info?.name || `Section: ${key}`,
                description: info?.description || "Configured platform section.",
                icon: info?.icon || Layers,
                blocks: sectionBlocks,
            });
            foundKeys.delete(key);
        });

        // Any additional dynamic sectionKeys found in MongoDB
        foundKeys.forEach((key) => {
            const sectionBlocks = blocks
                .filter((b) => b.sectionKey === key)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            groups.push({
                sectionKey: key,
                displayName: `Section: ${key}`,
                description: "Custom CMS section blocks.",
                icon: Layers,
                blocks: sectionBlocks,
            });
        });

        return groups;
    }, [blocks]);

    // Currently selected item resolution
    const activeSection = useMemo(() => {
        if (selectedTarget.type !== "section") return null;
        return (
            sectionGroups.find((g) => g.sectionKey === selectedTarget.sectionKey) ||
            sectionGroups[0] ||
            null
        );
    }, [selectedTarget, sectionGroups]);

    const activePage = useMemo(() => {
        if (selectedTarget.type !== "page") return null;
        return pages.find((p) => p._id === selectedTarget.pageId) || null;
    }, [selectedTarget, pages]);

    // ─── Section Blocks Handlers ────────────────────────────────────────────────

    const handleUpdateBlockField = (
        blockId: string,
        field: keyof BackendCmsBlockItem,
        val: any
    ) => {
        setBlocks((prev) =>
            prev.map((b) => (b._id === blockId ? { ...b, [field]: val } : b))
        );
    };

    const handleMetadataChange = (blockId: string, rawJson: string) => {
        setMetadataStrings((prev) => ({ ...prev, [blockId]: rawJson }));
        try {
            const parsed = JSON.parse(rawJson);
            setMetadataErrors((prev) => ({ ...prev, [blockId]: null }));
            setBlocks((prev) =>
                prev.map((b) => (b._id === blockId ? { ...b, metadata: parsed } : b))
            );
        } catch (e) {
            setMetadataErrors((prev) => ({
                ...prev,
                [blockId]: "Invalid JSON format",
            }));
        }
    };

    const handleSaveSectionBlock = async (block: BackendCmsBlockItem) => {
        if (metadataErrors[block._id]) {
            setError(`Cannot save: Fix JSON syntax error in block "${block.title}".`);
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            await apiClient.patch(API_ENDPOINTS.cms.updateBlockDirect(block._id), {
                title: block.title,
                subtitle: block.subtitle || "",
                content: block.content || "",
                ctaText: block.ctaText || "",
                ctaLink: block.ctaLink || "",
                order: Number(block.order) || 0,
                isPublished: Boolean(block.isPublished),
                imageUrl: block.imageUrl || "",
                hoverTooltip: block.hoverTooltip || "",
                metadata: block.metadata || {},
                blockType: block.blockType || "info",
            });
            showToast(`Block "${block.title}" saved successfully.`);
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update block.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSectionBlock = async (blockId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        setIsSaving(true);
        try {
            await apiClient.delete(API_ENDPOINTS.cms.deleteBlockDirect(blockId));
            showToast(`Block "${title}" deleted.`);
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete block.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateSectionBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSection || !newBlockTitle.trim()) return;

        setIsSaving(true);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.cms.createBlock, {
                sectionKey: activeSection.sectionKey,
                blockType: newBlockType.trim() || "info",
                title: newBlockTitle.trim(),
                subtitle: newBlockSubtitle.trim(),
                content: newBlockContent.trim(),
                ctaText: newBlockCtaText.trim(),
                ctaLink: newBlockCtaLink.trim(),
                order: (activeSection.blocks.length || 0) + 1,
                isPublished: true,
                metadata: {},
            });

            setNewBlockTitle("");
            setNewBlockSubtitle("");
            setNewBlockContent("");
            setNewBlockCtaText("");
            setNewBlockCtaLink("");
            setShowCreateBlockModal(false);
            showToast(`New block added to ${activeSection.displayName}.`);
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create block.");
        } finally {
            setIsSaving(false);
        }
    };

    // ─── CMS Page Handlers ──────────────────────────────────────────────────────

    const handleCreatePage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPageTitle.trim() || !newPageSlug.trim()) return;
        setIsSaving(true);
        try {
            const res = await apiClient.post<{ data?: BackendCmsPage }>(API_ENDPOINTS.admin.createPage, {
                title: newPageTitle.trim(),
                slug: newPageSlug.trim().toLowerCase().replace(/\s+/g, "-"),
                isPublished: true,
                showInNav: true,
                navLabel: newPageTitle.trim(),
                navOrder: pages.length + 1,
            });

            const created = (res as any)?.data;
            setNewPageTitle("");
            setNewPageSlug("");
            setShowCreatePageModal(false);
            showToast("New CMS page created.");
            await fetchData();
            if (created?._id) {
                setSelectedTarget({ type: "page", pageId: created._id });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create page.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePageMeta = async () => {
        if (!activePage) return;
        setIsSaving(true);
        try {
            await apiClient.patch(API_ENDPOINTS.cms.updatePage(activePage._id), {
                title: activePage.title,
                isPublished: activePage.isPublished,
                showInNav: activePage.showInNav,
                navLabel: activePage.navLabel || activePage.title,
                navOrder: activePage.navOrder,
            });
            showToast(`Page "${activePage.title}" updated.`);
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update page.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddPageBlock = async () => {
        if (!activePage) return;
        const blockCount = activePage.blocks?.length || 0;
        const blockId = `section-${Date.now().toString().slice(-5)}`;
        setIsSaving(true);
        try {
            await apiClient.post(API_ENDPOINTS.admin.addBlock(activePage._id), {
                blockId,
                title: "New Section Heading",
                content: "Write section description or mission/vision content here...",
                order: blockCount + 1,
                isVisible: true,
                hoverTooltip: "Information about this section.",
            });
            showToast("Section block added to page.");
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add block.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePageBlock = async (block: BackendCmsBlock) => {
        if (!activePage) return;
        setIsSaving(true);
        try {
            await apiClient.patch(
                API_ENDPOINTS.cms.updateBlock(activePage._id, block.blockId),
                {
                    title: block.title,
                    content: block.content,
                    hoverTooltip: block.hoverTooltip,
                    isVisible: block.isVisible,
                }
            );
            showToast(`Block "${block.title}" saved.`);
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save block.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePageBlock = async (blockId: string) => {
        if (!activePage) return;
        if (!confirm("Are you sure you want to delete this block?")) return;
        try {
            await apiClient.delete(API_ENDPOINTS.admin.deleteBlock(activePage._id, blockId));
            showToast("Content block deleted.");
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete block.");
        }
    };

    const handleReorderPageBlock = async (index: number, dir: -1 | 1) => {
        if (!activePage) return;
        const sorted = [...activePage.blocks].sort((a, b) => a.order - b.order);
        const target = index + dir;
        if (target < 0 || target >= sorted.length) return;

        const currentItem = sorted[index];
        const targetItem = sorted[target];
        if (!currentItem || !targetItem) return;

        sorted[index] = targetItem;
        sorted[target] = currentItem;
        const blockOrders = sorted.map((b, idx) => ({
            blockId: b.blockId,
            order: idx + 1,
        }));

        try {
            await apiClient.patch(API_ENDPOINTS.cms.reorderBlocks(activePage._id), {
                blockOrders,
            });
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reorder blocks.");
        }
    };

    return (
        <div className="space-y-6 pb-16">
            {/* Toast message */}
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Top Brand Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28] sm:text-3xl">
                            Pages & Blocks CMS
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <FileText className="h-3.5 w-3.5" />
                            Unified Content Manager
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 max-w-2xl">
                        Manage live Home Page sections (Hero, Wings, Key Areas, Who We Are, Explainers) and dynamic CMS pages from one centralized dashboard.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setShowCreatePageModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#D98408] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#b86f06] transition"
                    >
                        <Plus className="h-4 w-4" /> New Page
                    </button>
                    <button
                        type="button"
                        onClick={fetchData}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#5B9891]/30 bg-white px-3.5 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Layout: Sidebar & Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Sidebar: ALL PAGES / SECTIONS */}
                <div className="lg:col-span-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs space-y-5">
                    {/* Category 1: Home Page & Platform Sections */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 py-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#467A74]">
                                Home Sections ({sectionGroups.length})
                            </span>
                            <span className="rounded-full bg-[#5B9891]/15 px-2 py-0.5 text-[10px] font-bold text-[#5B9891]">
                                Live Seeded
                            </span>
                        </div>

                        <div className="space-y-1">
                            {sectionGroups.map((group) => {
                                const IconComponent = group.icon;
                                const isSelected =
                                    selectedTarget.type === "section" &&
                                    selectedTarget.sectionKey === group.sectionKey;
                                return (
                                    <button
                                        key={group.sectionKey}
                                        type="button"
                                        onClick={() =>
                                            setSelectedTarget({
                                                type: "section",
                                                sectionKey: group.sectionKey,
                                            })
                                        }
                                        className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition ${
                                            isSelected
                                                ? "bg-[#5B9891] text-white font-bold shadow-xs"
                                                : "text-gray-700 hover:bg-[#F7DFC7]/30 font-medium"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            <IconComponent
                                                className={`h-4 w-4 shrink-0 ${
                                                    isSelected ? "text-[#F7DFC7]" : "text-[#5B9891]"
                                                }`}
                                            />
                                            <span className="truncate">{group.displayName}</span>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                                                isSelected
                                                    ? "bg-white/20 text-white"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {group.blocks.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category 2: Dynamic CMS Pages */}
                    <div className="space-y-1.5 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between px-2 py-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                Dynamic Pages ({pages.length})
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowCreatePageModal(true)}
                                className="text-[11px] font-bold text-[#D98408] hover:underline"
                            >
                                + Add
                            </button>
                        </div>

                        {pages.length === 0 ? (
                            <p className="px-2 py-2 text-[11px] text-gray-400 italic">
                                No custom pages created yet.
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {pages.map((p) => {
                                    const isSelected =
                                        selectedTarget.type === "page" &&
                                        selectedTarget.pageId === p._id;
                                    return (
                                        <button
                                            key={p._id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedTarget({
                                                    type: "page",
                                                    pageId: p._id,
                                                })
                                            }
                                            className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition ${
                                                isSelected
                                                    ? "bg-[#5B9891] text-white font-bold shadow-xs"
                                                    : "text-gray-700 hover:bg-[#F7DFC7]/30 font-medium"
                                            }`}
                                        >
                                            <div className="truncate">
                                                <p className="truncate">{p.title}</p>
                                                <p
                                                    className={`text-[10px] font-mono ${
                                                        isSelected ? "text-white/80" : "text-gray-400"
                                                    }`}
                                                >
                                                    /{p.slug}
                                                </p>
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                                                    isSelected
                                                        ? "bg-white/20 text-white"
                                                        : p.isPublished
                                                            ? "bg-[#5B9891]/15 text-[#467A74]"
                                                            : "bg-[#F2B55D]/25 text-[#D98408]"
                                                }`}
                                            >
                                                {p.isPublished ? "Live" : "Draft"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Editor Panel */}
                <div className="lg:col-span-8 space-y-5">
                    {/* SECTION EDITOR (Home Page Blocks) */}
                    {selectedTarget.type === "section" && activeSection && (
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-6">
                            {/* Section Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-[#111E28]">
                                            {activeSection.displayName}
                                        </h2>
                                        <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-xs font-bold text-[#D98408]">
                                            sectionKey: {activeSection.sectionKey}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {activeSection.description}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowCreateBlockModal(true)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                                >
                                    <Plus className="h-4 w-4" /> Add Block
                                </button>
                            </div>

                            {/* Section Blocks List */}
                            <div className="space-y-5">
                                {activeSection.blocks.length === 0 ? (
                                    <p className="py-12 text-center text-xs text-gray-400">
                                        No blocks found in this section. Click &quot;Add Block&quot; to create one.
                                    </p>
                                ) : (
                                    activeSection.blocks.map((block, idx) => {
                                        const jsonErr = metadataErrors[block._id];
                                        return (
                                            <div
                                                key={block._id}
                                                className="rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-5 space-y-4 transition hover:border-[#5B9891]/40"
                                            >
                                                {/* Block Header Row */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 pb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-[#5B9891]">
                                                            #{block.order || idx + 1}
                                                        </span>
                                                        <span className="rounded bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-mono text-gray-600">
                                                            type: {block.blockType || "block"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {/* Published toggle */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateBlockField(
                                                                    block._id,
                                                                    "isPublished",
                                                                    !block.isPublished
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                                                                block.isPublished
                                                                    ? "border-[#5B9891]/30 bg-[#5B9891]/10 text-[#467A74]"
                                                                    : "border-[#F2B55D]/50 bg-[#F2B55D]/20 text-[#D98408]"
                                                            }`}
                                                        >
                                                            {block.isPublished ? (
                                                                <>
                                                                    <Eye className="h-3.5 w-3.5" /> Published
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <EyeOff className="h-3.5 w-3.5" /> Draft
                                                                </>
                                                            )}
                                                        </button>

                                                        {/* Delete Block */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteSectionBlock(
                                                                    block._id,
                                                                    block.title
                                                                )
                                                            }
                                                            className="p-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition"
                                                            title="Delete Block"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>

                                                        {/* Save Block */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSaveSectionBlock(block)
                                                            }
                                                            disabled={isSaving}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#467A74] transition"
                                                        >
                                                            <Save className="h-3.5 w-3.5" /> Save
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Block Content Fields */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                            Title / Heading
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={block.title}
                                                            onChange={(e) =>
                                                                handleUpdateBlockField(
                                                                    block._id,
                                                                    "title",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Block Title"
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-[#111E28] focus:border-[#5B9891] focus:outline-hidden"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                            Subtitle / Tagline
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={block.subtitle || ""}
                                                            onChange={(e) =>
                                                                handleUpdateBlockField(
                                                                    block._id,
                                                                    "subtitle",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Optional subtitle or tagline"
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                        Body Content / Description
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={block.content}
                                                        onChange={(e) =>
                                                            handleUpdateBlockField(
                                                                block._id,
                                                                "content",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Write detailed section description or copy..."
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 leading-relaxed focus:border-[#5B9891] focus:outline-hidden"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                            CTA Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={block.ctaText || ""}
                                                            onChange={(e) =>
                                                                handleUpdateBlockField(
                                                                    block._id,
                                                                    "ctaText",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. Join the Wing"
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                            CTA Link
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={block.ctaLink || ""}
                                                            onChange={(e) =>
                                                                handleUpdateBlockField(
                                                                    block._id,
                                                                    "ctaLink",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. /register or https://"
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-mono text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                            Display Order
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={block.order}
                                                            onChange={(e) =>
                                                                handleUpdateBlockField(
                                                                    block._id,
                                                                    "order",
                                                                    parseInt(e.target.value) || 0
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-mono text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                        Hover Tooltip
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={block.hoverTooltip || ""}
                                                        onChange={(e) =>
                                                            handleUpdateBlockField(
                                                                block._id,
                                                                "hoverTooltip",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Hovering helper text..."
                                                        className="w-full rounded-xl border border-[#D98408]/30 bg-white px-3.5 py-1.5 text-xs text-gray-700 focus:border-[#D98408] focus:outline-hidden"
                                                    />
                                                </div>

                                                {/* Structured Metadata JSON Editor */}
                                                <div className="pt-2 border-t border-gray-200/60">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                                                            <Code className="h-3.5 w-3.5 text-[#5B9891]" />
                                                            Structured Metadata (JSON)
                                                        </label>
                                                        {jsonErr ? (
                                                            <span className="text-[10px] font-bold text-rose-600">
                                                                {jsonErr}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-medium text-gray-400">
                                                                Valid JSON
                                                            </span>
                                                        )}
                                                    </div>
                                                    <textarea
                                                        rows={4}
                                                        value={metadataStrings[block._id] || "{}"}
                                                        onChange={(e) =>
                                                            handleMetadataChange(
                                                                block._id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`w-full font-mono text-[11px] rounded-xl border bg-white p-3 leading-relaxed focus:outline-hidden ${
                                                            jsonErr
                                                                ? "border-rose-400 focus:border-rose-500"
                                                                : "border-gray-200 focus:border-[#5B9891]"
                                                        }`}
                                                        placeholder='{\n  "badgeColor": "#D98408",\n  "features": ["Feature 1"]\n}'
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC CMS PAGE EDITOR */}
                    {selectedTarget.type === "page" && activePage && (
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-6">
                            {/* Page Meta Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                        Page Title
                                    </label>
                                    <input
                                        type="text"
                                        value={activePage.title}
                                        onChange={(e) => {
                                            const updated = pages.map((p) =>
                                                p._id === activePage._id
                                                    ? { ...p, title: e.target.value }
                                                    : p
                                            );
                                            setPages(updated);
                                        }}
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-sm font-bold text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex items-center gap-2 self-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = pages.map((p) =>
                                                p._id === activePage._id
                                                    ? { ...p, isPublished: !p.isPublished }
                                                    : p
                                            );
                                            setPages(updated);
                                        }}
                                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                                            activePage.isPublished
                                                ? "border-[#5B9891]/30 bg-[#5B9891]/10 text-[#467A74]"
                                                : "border-[#F2B55D]/50 bg-[#F2B55D]/20 text-[#D98408]"
                                        }`}
                                    >
                                        {activePage.isPublished ? (
                                            <>
                                                <Eye className="h-3.5 w-3.5" /> Published
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="h-3.5 w-3.5" /> Draft
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleUpdatePageMeta}
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                                    >
                                        <Save className="h-3.5 w-3.5" /> Save Page
                                    </button>
                                </div>
                            </div>

                            {/* Page Blocks Section */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-gray-500">
                                    Content Blocks ({activePage.blocks?.length || 0})
                                </span>
                                <button
                                    type="button"
                                    onClick={handleAddPageBlock}
                                    className="inline-flex items-center gap-1 rounded-xl bg-[#F7DFC7] px-3.5 py-1.5 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/40 transition"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add Block
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(activePage.blocks || []).map((block, idx) => (
                                    <div
                                        key={block.blockId}
                                        className="rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-4 space-y-3 transition hover:border-[#5B9891]/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[11px] font-bold text-[#5B9891]">
                                                #{idx + 1} • {block.blockId}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReorderPageBlock(idx, -1)
                                                    }
                                                    disabled={idx === 0}
                                                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-40"
                                                    title="Move Up"
                                                >
                                                    <ArrowUp className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReorderPageBlock(idx, 1)
                                                    }
                                                    disabled={
                                                        idx === activePage.blocks.length - 1
                                                    }
                                                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-40"
                                                    title="Move Down"
                                                >
                                                    <ArrowDown className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeletePageBlock(block.blockId)
                                                    }
                                                    className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600"
                                                    title="Delete Block"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <input
                                            type="text"
                                            value={block.title}
                                            onChange={(e) => {
                                                const updated = activePage.blocks.map((b) =>
                                                    b.blockId === block.blockId
                                                        ? { ...b, title: e.target.value }
                                                        : b
                                                );
                                                setPages((prev) =>
                                                    prev.map((p) =>
                                                        p._id === activePage._id
                                                            ? { ...p, blocks: updated }
                                                            : p
                                                    )
                                                );
                                            }}
                                            placeholder="Section Title"
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-[#111E28] focus:border-[#5B9891] focus:outline-hidden"
                                        />

                                        <textarea
                                            rows={3}
                                            value={block.content}
                                            onChange={(e) => {
                                                const updated = activePage.blocks.map((b) =>
                                                    b.blockId === block.blockId
                                                        ? { ...b, content: e.target.value }
                                                        : b
                                                );
                                                setPages((prev) =>
                                                    prev.map((p) =>
                                                        p._id === activePage._id
                                                            ? { ...p, blocks: updated }
                                                            : p
                                                    )
                                                );
                                            }}
                                            placeholder="Section text content..."
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 leading-relaxed focus:border-[#5B9891] focus:outline-hidden"
                                        />

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={block.hoverTooltip || ""}
                                                onChange={(e) => {
                                                    const updated = activePage.blocks.map((b) =>
                                                        b.blockId === block.blockId
                                                            ? { ...b, hoverTooltip: e.target.value }
                                                            : b
                                                    );
                                                    setPages((prev) =>
                                                        prev.map((p) =>
                                                            p._id === activePage._id
                                                                ? { ...p, blocks: updated }
                                                                : p
                                                        )
                                                    );
                                                }}
                                                placeholder="Hover Tooltip Explanation..."
                                                className="flex-1 rounded-xl border border-[#D98408]/30 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-[#D98408] focus:outline-hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleSavePageBlock(block)}
                                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#5B9891] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#467A74] transition"
                                            >
                                                <Save className="h-3 w-3" /> Save Block
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Create New CMS Page */}
            {showCreatePageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-base font-bold text-[#111E28]">
                                Create New CMS Page
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowCreatePageModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePage} className="space-y-3.5">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Page Title
                                </label>
                                <input
                                    type="text"
                                    value={newPageTitle}
                                    onChange={(e) => {
                                        setNewPageTitle(e.target.value);
                                        if (!newPageSlug) {
                                            setNewPageSlug(
                                                e.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, "-")
                                                    .replace(/^-|-$/g, "")
                                            );
                                        }
                                    }}
                                    placeholder="e.g. Terms & Sisterhood Policy"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    value={newPageSlug}
                                    onChange={(e) => setNewPageSlug(e.target.value)}
                                    placeholder="e.g. terms-policy"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreatePageModal(false)}
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                                >
                                    Create Page
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Create New Section Block */}
            {showCreateBlockModal && activeSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-[#111E28]">
                                    Add Block to {activeSection.displayName}
                                </h3>
                                <p className="text-[11px] text-gray-500">
                                    sectionKey: {activeSection.sectionKey}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreateBlockModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSectionBlock} className="space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newBlockTitle}
                                        onChange={(e) => setNewBlockTitle(e.target.value)}
                                        placeholder="Block Title"
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Block Type
                                    </label>
                                    <input
                                        type="text"
                                        value={newBlockType}
                                        onChange={(e) => setNewBlockType(e.target.value)}
                                        placeholder="e.g. wing, keyArea, hero, info"
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={newBlockSubtitle}
                                    onChange={(e) => setNewBlockSubtitle(e.target.value)}
                                    placeholder="Optional subtitle"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-gray-700 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Content
                                </label>
                                <textarea
                                    rows={3}
                                    value={newBlockContent}
                                    onChange={(e) => setNewBlockContent(e.target.value)}
                                    placeholder="Block description..."
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-gray-800 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        CTA Text
                                    </label>
                                    <input
                                        type="text"
                                        value={newBlockCtaText}
                                        onChange={(e) => setNewBlockCtaText(e.target.value)}
                                        placeholder="e.g. Learn More"
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-1.5 text-xs text-gray-700 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        CTA Link
                                    </label>
                                    <input
                                        type="text"
                                        value={newBlockCtaLink}
                                        onChange={(e) => setNewBlockCtaLink(e.target.value)}
                                        placeholder="e.g. /wings"
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-1.5 text-xs font-mono text-gray-700 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateBlockModal(false)}
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                                >
                                    Add Block
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
