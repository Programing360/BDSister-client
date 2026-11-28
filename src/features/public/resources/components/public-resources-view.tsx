"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    BookOpen,
    Download,
    Search,
    FileText,
    Lock,
    Sparkles,
    Loader2,
    AlertCircle,
    Filter,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ResourceItem {
    _id: string;
    title: string;
    description?: string;
    category?: string;
    fileType?: string;
    fileUrl?: string;
    accessLevel?: "Public" | "Member" | "PaidMember" | string;
    downloadCount?: number;
    createdAt: string;
}

export function PublicResourcesView() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get("type") || "";
    const wingParam = searchParams.get("wing") || "";
    const categoryParam = searchParams.get("category") || "";

    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(categoryParam);
    const [typeFilter, setTypeFilter] = useState(typeParam);
    const [wingFilter, setWingFilter] = useState(wingParam);

    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Sync from URL params if they change
    useEffect(() => {
        if (typeParam !== undefined) setTypeFilter(typeParam);
        if (wingParam !== undefined) setWingFilter(wingParam);
        if (categoryParam !== undefined) setCategoryFilter(categoryParam);
    }, [typeParam, wingParam, categoryParam]);

    const fetchResources = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.set("search", searchQuery.trim());
            if (categoryFilter.trim()) params.set("category", categoryFilter.trim());
            if (typeFilter.trim()) params.set("type", typeFilter.trim());
            if (wingFilter.trim()) params.set("wing", wingFilter.trim());

            const qs = params.toString();
            const url = qs
                ? `${API_ENDPOINTS.resources.list}?${qs}`
                : API_ENDPOINTS.resources.list;

            const res = await apiClient.get<any>(url);
            const raw = res as any;
            const list: ResourceItem[] = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                ? raw.data
                : Array.isArray(raw?.data?.resources)
                ? raw.data.resources
                : Array.isArray(raw?.resources)
                ? raw.resources
                : [];
            setResources(list);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load Resource Library."
            );
            setResources([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, categoryFilter, typeFilter, wingFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResources();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchResources]);

    const handleDownload = async (resItem: ResourceItem) => {
        setDownloadingId(resItem._id);
        setError(null);
        try {
            const response = await apiClient.get<{
                data?: { fileUrl?: string; downloadUrl?: string };
                fileUrl?: string;
            }>(API_ENDPOINTS.resources.download(resItem._id));

            const raw = response as unknown as {
                data?: { fileUrl?: string; downloadUrl?: string };
                fileUrl?: string;
            };
            const targetUrl =
                raw.data?.fileUrl ||
                raw.data?.downloadUrl ||
                raw.fileUrl ||
                resItem.fileUrl;

            if (targetUrl) {
                window.open(targetUrl, "_blank", "noopener,noreferrer");
            }
            await fetchResources();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "This resource requires a verified BDSisters membership to download."
            );
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="rounded-3xl border border-[#D98408]/25 bg-gradient-to-r from-[#5B9891]/15 via-white to-[#F7DFC7]/60 p-8 shadow-xs">
                    <div className="max-w-3xl space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7DFC7] px-3 py-1 text-xs font-bold text-[#D98408]">
                            <BookOpen className="h-3.5 w-3.5" /> Guides, Toolkits & E-Books
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Sisterhood Resource Library
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Download curated templates, Islamic self-development guides, business toolkits, and
                            study materials prepared for BDSisters.
                        </p>
                    </div>

                    {/* Search & Category Filter */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-7 relative">
                            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search guides, planners, or business templates..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>

                        <div className="sm:col-span-5 relative">
                            <Filter className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                placeholder="Filter by category (e.g. Entrepreneurship, Faith, Career)..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>
                    </div>

                    {/* Quick Wing & Type Filter Tabs */}
                    <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {[
                            { id: "all", label: "All Resources", type: "", wing: "" },
                            { id: "publication", label: "Publications (TSPP)", type: "Publication", wing: "TSPP" },
                            { id: "article", label: "Articles & Dialogue (MIDJ)", type: "Article", wing: "MIDJ" },
                            { id: "downloadable", label: "Downloadable Toolkits", type: "Downloadable", wing: "" },
                            { id: "worksheet", label: "Worksheets & Planners", type: "Worksheet", wing: "" },
                        ].map((tab) => {
                            const isActive =
                                (!tab.type && !typeFilter && !wingFilter) ||
                                (Boolean(tab.type) && typeFilter.toLowerCase() === tab.type.toLowerCase()) ||
                                (Boolean(tab.wing) && wingFilter.toLowerCase() === tab.wing.toLowerCase());

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setTypeFilter(tab.type);
                                        setWingFilter(tab.wing);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer ${
                                        isActive
                                            ? "bg-[#5B9891] text-white shadow-xs"
                                            : "bg-white text-stone-700 border border-[#F7DFC7] hover:bg-[#FAF8F5] hover:border-[#5B9891]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Resources Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
                        <p className="text-xs font-semibold text-gray-500">
                            Loading resource library...
                        </p>
                    </div>
                ) : !Array.isArray(resources) || resources.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200/80 bg-white p-14 text-center space-y-3">
                        <Sparkles className="h-9 w-9 text-[#5B9891] mx-auto" />
                        <h3 className="text-base font-bold text-gray-900">
                            No Resources Published Yet
                        </h3>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Guides, worksheets, and toolkits uploaded by admins will appear here automatically.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(Array.isArray(resources) ? resources : []).map((item) => {
                            const isMemberOnly =
                                item.accessLevel === "Member" || item.accessLevel === "PaidMember";

                            return (
                                <div
                                    key={item._id}
                                    className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs hover:border-[#5B9891]/50 transition space-y-4"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#5B9891]/12 px-2.5 py-1 text-[11px] font-bold text-[#467A74]">
                                                <FileText className="h-3.5 w-3.5" />
                                                {item.category || item.fileType || "Guide"}
                                            </span>

                                            {isMemberOnly && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                    <Lock className="h-3 w-3" /> {item.accessLevel}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-base font-bold text-gray-900 line-clamp-2">
                                            {item.title}
                                        </h2>

                                        {item.description && (
                                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                        <span className="text-[11px] text-gray-400">
                                            {item.downloadCount ?? 0} downloads
                                        </span>

                                        <button
                                            type="button"
                                            disabled={downloadingId === item._id}
                                            onClick={() => handleDownload(item)}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            <span>
                                                {downloadingId === item._id ? "Preparing..." : "Download"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}