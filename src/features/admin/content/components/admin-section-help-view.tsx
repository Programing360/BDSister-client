"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    HelpCircle,
    RefreshCw,
    Save,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Info,
    BookOpen,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface ExplainerCmsBlock {
    _id: string;
    sectionKey: string;
    blockType: string;
    title: string;          // Section key identifier, e.g. "hero", "wings", "shop"
    subtitle?: string;       // Friendly title, e.g. "About BDSisters.org Platform"
    content: string;         // Detailed explanation text
    hoverTooltip?: string;   // Short tooltip preview
    order: number;
    isPublished: boolean;
    metadata?: {
        islamicOrSisterhoodNote?: string;
        howItWorks?: string[];
        [key: string]: any;
    };
}

export function AdminSectionHelpView() {
    const [explainers, setExplainers] = useState<ExplainerCmsBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingId, setIsSavingId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchExplainers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: ExplainerCmsBlock[] }>(
                `${API_ENDPOINTS.cms.blocks}?sectionKey=sectionExplainers&all=true`
            );
            const raw = res as unknown as { data?: ExplainerCmsBlock[] } | ExplainerCmsBlock[];
            const list = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                    ? raw.data
                    : [];
            setExplainers(list.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load section explainers.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExplainers();
    }, [fetchExplainers]);

    const handleSaveExplainer = async (block: ExplainerCmsBlock) => {
        setIsSavingId(block._id);
        setError(null);
        try {
            await apiClient.patch(API_ENDPOINTS.cms.updateBlockDirect(block._id), {
                subtitle: block.subtitle || "",
                content: block.content || "",
                hoverTooltip: block.hoverTooltip || "",
                isPublished: block.isPublished,
                metadata: block.metadata || {},
            });
            showToast(`Section explainer for "${block.title}" saved.`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save section explainer.");
        } finally {
            setIsSavingId(null);
        }
    };

    const updateBlockField = (
        id: string,
        field: keyof ExplainerCmsBlock | "islamicOrSisterhoodNote",
        value: any
    ) => {
        setExplainers((prev) =>
            prev.map((b) => {
                if (b._id !== id) return b;
                if (field === "islamicOrSisterhoodNote") {
                    return {
                        ...b,
                        metadata: {
                            ...(b.metadata || {}),
                            islamicOrSisterhoodNote: value,
                        },
                    };
                }
                return { ...b, [field]: value };
            })
        );
    };

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

            {/* Header Banner in Brand Colors */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28] sm:text-3xl">
                            Section Hover Help (Tooltips & Modals)
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <HelpCircle className="h-3.5 w-3.5" />
                            Live CMS Explainers
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 max-w-2xl">
                        Manage the hovering info modals and tooltip text shown next to section headers across BDSisters.org (Hero, Wings, Key Areas, Shop, Forums, Profile Engine, Events, and Resources).
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchExplainers}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Explainer Cards List */}
            <div className="space-y-5">
                {isLoading && explainers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-gray-500 rounded-2xl border border-gray-200 bg-white">
                        <RefreshCw className="h-6 w-6 animate-spin text-[#5B9891] mb-2" />
                        <span>Loading section explainers from database...</span>
                    </div>
                ) : explainers.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-500 rounded-2xl border border-gray-200 bg-white">
                        No section explainers found. Seed data may need to be loaded.
                    </div>
                ) : (
                    explainers.map((block) => {
                        const isSaving = isSavingId === block._id;
                        return (
                            <div
                                key={block._id}
                                className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-4 transition hover:border-[#5B9891]/40"
                            >
                                {/* Top Meta Row */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-md bg-[#5B9891]/15 px-2.5 py-1 text-xs font-mono font-bold text-[#467A74]">
                                            sectionKey: {block.title}
                                        </span>
                                        <span className="rounded-md bg-[#F7DFC7] px-2 py-0.5 text-[10px] font-bold text-[#D98408]">
                                            Order: #{block.order}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateBlockField(block._id, "isPublished", !block.isPublished)
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

                                        <button
                                            type="button"
                                            onClick={() => handleSaveExplainer(block)}
                                            disabled={isSaving}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#467A74] transition"
                                        >
                                            <Save className="h-3.5 w-3.5" />
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Friendly Section Title (Modal Header)
                                        </label>
                                        <input
                                            type="text"
                                            value={block.subtitle || ""}
                                            onChange={(e) =>
                                                updateBlockField(block._id, "subtitle", e.target.value)
                                            }
                                            placeholder="e.g. About BDSisters.org Platform"
                                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Short Hover Tooltip Preview
                                        </label>
                                        <input
                                            type="text"
                                            value={block.hoverTooltip || ""}
                                            onChange={(e) =>
                                                updateBlockField(block._id, "hoverTooltip", e.target.value)
                                            }
                                            placeholder="Quick tooltip preview on mouse hover..."
                                            className="w-full rounded-xl border border-[#D98408]/30 bg-[#FAF8F5] px-3.5 py-2 text-xs text-gray-800 focus:border-[#D98408] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Detailed Section Explanation (Shown inside Hover Dialog)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={block.content || ""}
                                        onChange={(e) =>
                                            updateBlockField(block._id, "content", e.target.value)
                                        }
                                        placeholder="Detailed explanation of what this section does and how sisters can benefit..."
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-gray-800 leading-relaxed focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        <BookOpen className="h-3 w-3 text-[#D98408]" />
                                        Islamic / Sisterhood Principles Note (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={block.metadata?.islamicOrSisterhoodNote || ""}
                                        onChange={(e) =>
                                            updateBlockField(block._id, "islamicOrSisterhoodNote", e.target.value)
                                        }
                                        placeholder="e.g. Adhering to Islamic principles of trust (Amanah), sisterhood, and mutual empowerment."
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-gray-700 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
