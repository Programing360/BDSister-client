"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HelpCircle, RefreshCw, Save, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { BackendCmsPage, BackendCmsBlock } from "./admin-cms-pages-view";

export function AdminSectionHelpView() {
    const [pages, setPages] = useState<BackendCmsPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const fetchPages = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: BackendCmsPage[] }>(
                API_ENDPOINTS.cms.adminPages
            );
            const raw = res as unknown as { data?: BackendCmsPage[] } | BackendCmsPage[];
            setPages(Array.isArray(raw) ? raw : raw.data || []);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const handleSaveTooltip = async (pageId: string, block: BackendCmsBlock) => {
        await apiClient.patch(API_ENDPOINTS.cms.updateBlock(pageId, block.blockId), {
            hoverTooltip: block.hoverTooltip || "",
        });
        setToast(`Hover explanation updated for "${block.title}".`);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="space-y-6 pb-12">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Section Hover Help (Tooltips)
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <HelpCircle className="h-3.5 w-3.5" />
                            Block Explanations
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Manage the hovering info button text for every section across all website pages.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchPages}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="space-y-4">
                {pages.map((page) =>
                    (page.blocks || []).map((block) => (
                        <div
                            key={`${page._id}-${block.blockId}`}
                            className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-2.5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="rounded bg-[#F7DFC7] px-2 py-0.5 text-[10px] font-bold text-[#D98408] mr-2">
                                        /{page.slug}
                                    </span>
                                    <span className="text-xs font-bold text-gray-900">{block.title}</span>
                                </div>
                                <span className="font-mono text-[10px] text-gray-400">{block.blockId}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={block.hoverTooltip || ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setPages((prev) =>
                                            prev.map((p) =>
                                                p._id === page._id
                                                    ? {
                                                        ...p,
                                                        blocks: p.blocks.map((b) =>
                                                            b.blockId === block.blockId
                                                                ? { ...b, hoverTooltip: val }
                                                                : b
                                                        ),
                                                    }
                                                    : p
                                            )
                                        );
                                    }}
                                    placeholder="Enter hovering explanation text for this section..."
                                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSaveTooltip(page._id, block)}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74]"
                                >
                                    <Save className="h-3.5 w-3.5" /> Save Tooltip
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}