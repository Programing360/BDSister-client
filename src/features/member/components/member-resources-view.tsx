"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Download,
    FileText,
    Video,
    RefreshCw,
    Loader2,
    ExternalLink,
    Search,
    BookOpen,
    User,
    Clock,
    FileSpreadsheet,
    CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface ResourceItem {
    _id: string;
    title: string;
    description?: string;
    type?: "Article" | "Video" | "Downloadable" | "Audio" | "Worksheet" | "Curated";
    format?: "Downloadable" | "Video" | "Article" | "Audio" | "Worksheet" | "Curated";
    wing?: string;
    curatedBySister?: string;
    fileSizeOrDuration?: string;
    fileUrl?: string;
    videoUrl?: string;
    externalUrl?: string;
    downloadsCount?: number;
    downloadCount?: number;
    viewCount?: number;
    accessLevel?: string;
    createdAt?: string;
}

export function MemberResourcesView() {
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchResources = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: ResourceItem[] }>(
                `${API_ENDPOINTS.resources.list}?limit=100`
            );
            const raw = res as unknown as { data?: ResourceItem[] } | ResourceItem[];
            const list = Array.isArray(raw) ? raw : raw.data || [];
            setResources(list);
        } catch {
            setResources([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    // Synchronized with GET /api/resources/:id/download
    const handleAccessResource = async (item: ResourceItem) => {
        let launchUrl = item.fileUrl || item.videoUrl || item.externalUrl;
        try {
            // Trigger backend atomic $inc
            const res = await apiClient.get<{
                data?: { fileUrl?: string; downloadsOrReads?: number; downloadCount?: number };
                downloadsOrReads?: number;
                downloadCount?: number;
            }>(API_ENDPOINTS.resources.download(item._id));

            const raw = res as unknown as {
                data?: { fileUrl?: string; downloadsOrReads?: number; downloadCount?: number };
                downloadsOrReads?: number;
                downloadCount?: number;
            };

            const backendCount =
                raw.data?.downloadsOrReads ??
                raw.downloadsOrReads ??
                raw.data?.downloadCount ??
                raw.downloadCount;

            const nextCount =
                backendCount !== undefined && !isNaN(Number(backendCount))
                    ? Number(backendCount)
                    : Number(item.downloadsCount ?? item.downloadCount ?? 0) + 1;

            if (raw.data?.fileUrl) {
                launchUrl = raw.data.fileUrl;
            }

            setResources((prev) =>
                prev.map((r) =>
                    r._id === item._id
                        ? {
                            ...r,
                            downloadsCount: nextCount,
                            downloadCount: nextCount,
                        }
                        : r
                )
            );
        } catch {
            // Fallback: local exact +1 increment
            setResources((prev) =>
                prev.map((r) =>
                    r._id === item._id
                        ? {
                            ...r,
                            downloadsCount: Number(r.downloadsCount ?? r.downloadCount ?? 0) + 1,
                            downloadCount: Number(r.downloadCount ?? r.downloadsCount ?? 0) + 1,
                        }
                        : r
                )
            );
        }

        if (launchUrl) {
            window.open(launchUrl, "_blank", "noopener,noreferrer");
            showToast(`Opening "${item.title}"...`);
        } else {
            showToast(`Resource "${item.title}" accessed.`);
        }
    };

    // Filter tabs with "Curated" (renamed from "Curateds")
    const FILTER_TABS = [
        { id: "ALL", label: "All Resources" },
        { id: "Downloadable", label: "Downloadables" },
        { id: "Video", label: "Videos" },
        { id: "Article", label: "Articles" },
        { id: "Worksheet", label: "Worksheets" },
        { id: "Curated", label: "Curated" },
    ];

    const filtered = useMemo(() => {
        return resources.filter((item) => {
            const itemType = item.format || item.type || "Article";
            if (activeFilter !== "ALL" && itemType !== activeFilter) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const titleMatch = item.title?.toLowerCase().includes(q);
                const descMatch = item.description?.toLowerCase().includes(q);
                const wingMatch = item.wing?.toLowerCase().includes(q);
                const sisterMatch = item.curatedBySister?.toLowerCase().includes(q);
                if (!titleMatch && !descMatch && !wingMatch && !sisterMatch) {
                    return false;
                }
            }
            return true;
        });
    }, [resources, activeFilter, searchQuery]);

    const formatBadge = (item: ResourceItem) => {
        const type = item.format || item.type || "Article";
        switch (type) {
            case "Video":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                        <Video className="h-3 w-3" /> Video Talk
                    </span>
                );
            case "Downloadable":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        <Download className="h-3 w-3" /> Downloadable
                    </span>
                );
            case "Worksheet":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D98408]/15 border border-[#D98408]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                        <FileSpreadsheet className="h-3 w-3" /> Worksheet
                    </span>
                );
            case "Curated":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                        <BookOpen className="h-3 w-3" /> Curated
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#5B9891]/15 border border-[#5B9891]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#5B9891]">
                        <FileText className="h-3 w-3" /> Article
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6 pb-14">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74] animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28] sm:text-3xl">
                            Sisterhood Resource Library
                        </h1>
                        <SectionHelpTooltip
                            title="Curated Knowledge & TSPP Publications"
                            explanation="Access verified guides, Islamic parenting resources, business templates, and video talks."
                        />
                    </div>
                    <p className="mt-1 text-xs text-stone-600">
                        Explore authentic articles, recorded sessions, and downloadable toolkits designed by verified sisters.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchResources}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#FAF8F5] transition-colors"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {FILTER_TABS.map((tab) => {
                        const count =
                            tab.id === "ALL"
                                ? resources.length
                                : resources.filter((r) => (r.format || r.type || "Article") === tab.id).length;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveFilter(tab.id)}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${activeFilter === tab.id
                                    ? "bg-[#5B9891] text-white shadow-xs"
                                    : "bg-white border border-stone-200 text-stone-600 hover:bg-[#F7DFC7]/30"
                                    }`}
                            >
                                {tab.label} ({count})
                            </button>
                        );
                    })}
                </div>

                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="search"
                        placeholder="Search resources, topics, sisters..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-[#5B9891] focus:outline-none"
                    />
                </div>
            </div>

            {/* Resources Grid */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center text-xs text-stone-400 shadow-2xs">
                    No resources found matching your search or filter.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item) => {
                        const downloads = item.downloadsCount ?? item.downloadCount ?? item.viewCount ?? 0;
                        const isVideo = (item.format || item.type) === "Video";
                        const isDownload = (item.format || item.type) === "Downloadable";

                        return (
                            <div
                                key={item._id}
                                className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-2xs hover:border-[#5B9891]/40 transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    {/* Top meta tags */}
                                    <div className="flex items-center justify-between gap-2">
                                        {formatBadge(item)}
                                        <span className="text-[10px] font-bold text-[#D98408] rounded-full bg-[#F7DFC7]/60 border border-[#D98408]/30 px-2 py-0.5">
                                            {item.wing || "TSPP"}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <div>
                                        <h3 className="text-sm font-bold text-[#111E28] leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-stone-600 line-clamp-3 mt-1 leading-relaxed">
                                            {item.description || "Curated educational material for BDSisters members."}
                                        </p>
                                    </div>

                                    {/* Curated By & Duration Metadata */}
                                    <div className="rounded-2xl bg-[#FAF8F5] p-3 border border-stone-100 text-xs space-y-1.5">
                                        <div className="flex items-center justify-between text-stone-600">
                                            <span className="flex items-center gap-1.5 text-stone-700">
                                                <User className="w-3.5 h-3.5 text-[#5B9891]" />
                                                <span className="truncate max-w-[140px] font-medium">
                                                    {item.curatedBySister || "BDSisters Curators"}
                                                </span>
                                            </span>
                                            {item.fileSizeOrDuration && (
                                                <span className="text-[11px] font-bold text-[#D98408]">
                                                    {item.fileSizeOrDuration}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/50">
                                            <span>
                                                {isVideo ? "Session Plays" : "Downloads"}:
                                            </span>
                                            <span className="font-bold text-[#111E28] font-mono">
                                                {downloads} {isVideo ? "views" : "downloads"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleAccessResource(item)}
                                    className="w-full cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F7DFC7] px-3.5 py-2.5 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/80 transition-colors shadow-2xs"
                                >
                                    {isDownload ? (
                                        <>
                                            <Download className="h-3.5 w-3.5" /> Download Guide
                                        </>
                                    ) : isVideo ? (
                                        <>
                                            <Video className="h-3.5 w-3.5" /> Watch Recording
                                        </>
                                    ) : (
                                        <>
                                            <ExternalLink className="h-3.5 w-3.5" /> Open Resource
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
