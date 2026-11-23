"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Download,
    FileText,
    Video,
    RefreshCw,
    Loader2,
    ExternalLink,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface ResourceItem {
    _id: string;
    title: string;
    description?: string;
    type?: "Article" | "Video" | "Downloadable" | "Curated";
    wing?: string;
    fileUrl?: string;
    externalUrl?: string;
    downloadsCount?: number;
}

export function MemberResourcesView() {
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);

    const fetchResources = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: ResourceItem[] }>(
                API_ENDPOINTS.resources.list
            );
            const raw = res as unknown as { data?: ResourceItem[] } | ResourceItem[];
            setResources(Array.isArray(raw) ? raw : raw.data || []);
        } catch {
            setResources([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    // Synchronized with POST /api/resources/:id/download
    const handleAccessResource = async (item: ResourceItem) => {
        try {
            await apiClient.post(API_ENDPOINTS.resources.trackDownload(item._id));
        } catch {
            // Proceed even if analytics tracking fails
        }

        const targetUrl = item.fileUrl || item.externalUrl;
        if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
        }
    };

    const filtered =
        activeFilter === "ALL"
            ? resources
            : resources.filter((r) => (r.type || "Article") === activeFilter);

    return (
        <div className="space-y-6 pb-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Sisterhood Resource Library
                        </h1>
                        <SectionHelpTooltip
                            title="Curated Knowledge & TSPP Publications"
                            explanation="Access verified guides, Islamic parenting resources, business templates, and video talks."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Explore articles, recorded sessions, and downloadable toolkits.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchResources}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {["ALL", "Article", "Video", "Downloadable", "Curated"].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveFilter(tab)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${activeFilter === tab
                                ? "bg-[#5B9891] text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-[#FAF8F5]"
                            }`}
                    >
                        {tab === "ALL" ? "All Resources" : `${tab}s`}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center text-xs text-gray-400">
                    No resources available in this category yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((item) => (
                        <div
                            key={item._id}
                            className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#5B9891]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#467A74]">
                                        {item.type === "Video" ? (
                                            <Video className="h-3 w-3" />
                                        ) : item.type === "Downloadable" ? (
                                            <Download className="h-3 w-3" />
                                        ) : (
                                            <FileText className="h-3 w-3" />
                                        )}
                                        {item.type || "Article"}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#D98408]">
                                        {item.wing || "TSPP"}
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-3">
                                    {item.description ||
                                        "Curated educational material for BDSisters members."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleAccessResource(item)}
                                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F7DFC7] px-3.5 py-2 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/45 transition"
                            >
                                {item.type === "Downloadable" ? (
                                    <>
                                        <Download className="h-3.5 w-3.5" /> Download Guide
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink className="h-3.5 w-3.5" /> Open Resource
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}