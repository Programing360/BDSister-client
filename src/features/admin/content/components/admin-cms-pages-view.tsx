"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

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
    navLabel?: string;
    navOrder: number;
    blocks: BackendCmsBlock[];
}

export function AdminCmsPagesView() {
    const [pages, setPages] = useState<BackendCmsPage[]>([]);
    const [selectedPage, setSelectedPage] = useState<BackendCmsPage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Create Page modal/inline state
    const [newPageTitle, setNewPageTitle] = useState("");
    const [newPageSlug, setNewPageSlug] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchPages = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: BackendCmsPage[] }>(
                API_ENDPOINTS.cms.adminPages
            );
            const raw = res as unknown as { data?: BackendCmsPage[] } | BackendCmsPage[];
            const list = Array.isArray(raw) ? raw : raw.data || [];
            setPages(list);

            if (list.length > 0) {
                const first = list[0] ?? null;
                setSelectedPage((prev) =>
                    prev ? (list.find((p) => p._id === prev._id) ?? first) : first
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load CMS pages.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const handleCreatePage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPageTitle.trim() || !newPageSlug.trim()) return;
        setIsSaving(true);
        try {
            await apiClient.post(API_ENDPOINTS.admin.createPage, {
                title: newPageTitle.trim(),
                slug: newPageSlug.trim().toLowerCase().replace(/\s+/g, "-"),
                isPublished: true,
                showInNav: true,
                navLabel: newPageTitle.trim(),
                navOrder: pages.length + 1,
            });
            setNewPageTitle("");
            setNewPageSlug("");
            showToast("New CMS page created.");
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create page.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePageMeta = async () => {
        if (!selectedPage) return;
        setIsSaving(true);
        try {
            await apiClient.patch(API_ENDPOINTS.cms.updatePage(selectedPage._id), {
                title: selectedPage.title,
                isPublished: selectedPage.isPublished,
                showInNav: selectedPage.showInNav,
                navLabel: selectedPage.navLabel || selectedPage.title,
                navOrder: selectedPage.navOrder,
            });
            showToast(`Page "${selectedPage.title}" settings updated.`);
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update page.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddBlock = async () => {
        if (!selectedPage) return;
        const blockCount = selectedPage.blocks?.length || 0;
        const blockId = `section-${Date.now().toString().slice(-5)}`;
        setIsSaving(true);
        try {
            await apiClient.post(API_ENDPOINTS.admin.addBlock(selectedPage._id), {
                blockId,
                title: "New Section Heading",
                content: "Write section description or mission/vision content here...",
                order: blockCount + 1,
                isVisible: true,
                hoverTooltip: "Information about this section.",
            });
            showToast("Section block added.");
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add block.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveBlock = async (block: BackendCmsBlock) => {
        if (!selectedPage) return;
        setIsSaving(true);
        try {
            await apiClient.patch(
                API_ENDPOINTS.cms.updateBlock(selectedPage._id, block.blockId),
                {
                    title: block.title,
                    content: block.content,
                    hoverTooltip: block.hoverTooltip,
                    isVisible: block.isVisible,
                }
            );
            showToast(`Block "${block.title}" saved.`);
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save block.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReorderBlock = async (index: number, dir: -1 | 1) => {
        if (!selectedPage) return;
        const sorted = [...selectedPage.blocks].sort((a, b) => a.order - b.order);
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
            await apiClient.patch(API_ENDPOINTS.cms.reorderBlocks(selectedPage._id), {
                blockOrders,
            });
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reorder blocks.");
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        if (!selectedPage) return;
        try {
            await apiClient.delete(API_ENDPOINTS.admin.deleteBlock(selectedPage._id, blockId));
            showToast("Content block deleted.");
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete block.");
        }
    };

    const sortedBlocks = selectedPage
        ? [...(selectedPage.blocks || [])].sort((a, b) => a.order - b.order)
        : [];

    return (
        <div className="space-y-6 pb-12">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Pages & Blocks CMS
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <FileText className="h-3.5 w-3.5" />
                            Live Page Builder
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Create pages (e.g. Who We Are / About), edit blocks, reorder positions, and publish/unpublish.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchPages}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Quick Create Page Bar */}
            <form
                onSubmit={handleCreatePage}
                className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs"
            >
                <input
                    type="text"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="New Page Title (e.g. Who We Are)"
                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                    required
                />
                <input
                    type="text"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    placeholder="URL Slug (e.g. about)"
                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                    required
                />
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                >
                    <Plus className="h-4 w-4" /> Create Page
                </button>
            </form>

            {/* Editor Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Pages List */}
                <div className="lg:col-span-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs space-y-2 h-fit">
                    <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        All Pages ({pages.length})
                    </p>
                    {pages.map((p) => {
                        const active = selectedPage?._id === p._id;
                        return (
                            <button
                                key={p._id}
                                type="button"
                                onClick={() => setSelectedPage(p)}
                                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-xs transition ${active
                                    ? "bg-[#5B9891] text-white font-bold"
                                    : "text-gray-700 hover:bg-[#F7DFC7]/35 font-semibold"
                                    }`}
                            >
                                <div>
                                    <p>{p.title}</p>
                                    <p className={`text-[10px] ${active ? "text-white/80" : "text-gray-400"}`}>
                                        /{p.slug}
                                    </p>
                                </div>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active
                                        ? "bg-white/20 text-white"
                                        : p.isPublished
                                            ? "bg-[#5B9891]/15 text-[#467A74]"
                                            : "bg-[#F2B55D]/25 text-[#D98408]"
                                        }`}
                                >
                                    {p.isPublished ? "Published" : "Draft"}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Blocks Editor */}
                <div className="lg:col-span-8 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-5">
                    {selectedPage ? (
                        <>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                                <input
                                    type="text"
                                    value={selectedPage.title}
                                    onChange={(e) =>
                                        setSelectedPage({ ...selectedPage, title: e.target.value })
                                    }
                                    className="flex-1 min-w-[200px] rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-sm font-bold text-gray-900"
                                />

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedPage({
                                                ...selectedPage,
                                                isPublished: !selectedPage.isPublished,
                                            })
                                        }
                                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${selectedPage.isPublished
                                            ? "border-[#5B9891]/30 bg-[#5B9891]/10 text-[#467A74]"
                                            : "border-[#F2B55D]/50 bg-[#F2B55D]/20 text-[#D98408]"
                                            }`}
                                    >
                                        {selectedPage.isPublished ? (
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
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74]"
                                    >
                                        <Save className="h-3.5 w-3.5" /> Save Page
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-gray-500">
                                    Content Blocks ({sortedBlocks.length})
                                </span>
                                <button
                                    type="button"
                                    onClick={handleAddBlock}
                                    className="inline-flex items-center gap-1 rounded-lg bg-[#F7DFC7] px-3 py-1.5 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/40"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add Block
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sortedBlocks.map((block, idx) => (
                                    <div
                                        key={block.blockId}
                                        className="rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[11px] font-bold text-[#5B9891]">
                                                #{idx + 1} • {block.blockId}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleReorderBlock(idx, -1)}
                                                    disabled={idx === 0}
                                                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-40"
                                                >
                                                    <ArrowUp className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReorderBlock(idx, 1)}
                                                    disabled={idx === sortedBlocks.length - 1}
                                                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-40"
                                                >
                                                    <ArrowDown className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteBlock(block.blockId)}
                                                    className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <input
                                            type="text"
                                            value={block.title}
                                            onChange={(e) => {
                                                const updated = selectedPage.blocks.map((b) =>
                                                    b.blockId === block.blockId ? { ...b, title: e.target.value } : b
                                                );
                                                setSelectedPage({ ...selectedPage, blocks: updated });
                                            }}
                                            placeholder="Section Title"
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-900"
                                        />

                                        <textarea
                                            rows={3}
                                            value={block.content}
                                            onChange={(e) => {
                                                const updated = selectedPage.blocks.map((b) =>
                                                    b.blockId === block.blockId ? { ...b, content: e.target.value } : b
                                                );
                                                setSelectedPage({ ...selectedPage, blocks: updated });
                                            }}
                                            placeholder="Section text content..."
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700"
                                        />

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={block.hoverTooltip || ""}
                                                onChange={(e) => {
                                                    const updated = selectedPage.blocks.map((b) =>
                                                        b.blockId === block.blockId
                                                            ? { ...b, hoverTooltip: e.target.value }
                                                            : b
                                                    );
                                                    setSelectedPage({ ...selectedPage, blocks: updated });
                                                }}
                                                placeholder="Hover Tooltip Explanation (what this section is about)..."
                                                className="flex-1 rounded-xl border border-[#D98408]/30 bg-white px-3 py-1.5 text-xs text-gray-700"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleSaveBlock(block)}
                                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#5B9891] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#467A74]"
                                            >
                                                <Save className="h-3 w-3" /> Save Block
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="py-12 text-center text-xs text-gray-400">
                            Create or select a page to manage its content blocks.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}