"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, RefreshCw, FileText, Video, Download } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ResourceItem {
    _id: string;
    title: string;
    type?: "Article" | "Video" | "Downloadable" | "Curated";
    wing?: string;
    downloadsCount?: number;
    createdAt: string;
}

export function AdminResourcesView() {
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [activeTab, setActiveTab] = useState<string>("ALL");
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

    const filtered =
        activeTab === "ALL"
            ? resources
            : resources.filter((r) => (r.type || "Article") === activeTab);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Resource Library
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <BookOpen className="h-3.5 w-3.5" />
                            TSPP & Curated Content
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Articles, video content, downloadable guides, and curated publications by sisters.
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

            <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-2xs w-fit">
                {["ALL", "Article", "Video", "Downloadable", "Curated"].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${activeTab === tab
                                ? "bg-[#5B9891] text-white"
                                : "text-gray-600 hover:bg-[#FAF8F5]"
                            }`}
                    >
                        {tab === "ALL" ? "All Resources" : `${tab}s`}
                    </button>
                ))}
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="py-3.5 px-4">Resource Title</th>
                            <th className="py-3.5 px-4 text-center">Format</th>
                            <th className="py-3.5 px-4 text-center">Wing</th>
                            <th className="py-3.5 px-4 text-right">Downloads</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-gray-400 animate-pulse">
                                    Loading resource library...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-gray-400">
                                    No resources found in this category.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((item) => (
                                <tr key={item._id} className="hover:bg-[#F7DFC7]/20">
                                    <td className="py-3.5 px-4 font-bold text-gray-900">{item.title}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#5B9891]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#467A74]">
                                            {item.type === "Video" ? (
                                                <Video className="h-3 w-3" />
                                            ) : item.type === "Downloadable" ? (
                                                <Download className="h-3 w-3" />
                                            ) : (
                                                <FileText className="h-3 w-3" />
                                            )}
                                            {item.type || "Article"}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center text-gray-600">
                                        {item.wing || "BDSisters"}
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-700">
                                        {item.downloadsCount ?? 0}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}