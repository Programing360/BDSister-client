"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu, RefreshCw, Save, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { BackendCmsPage } from "./admin-cms-pages-view";

export function AdminMenuEditorView() {
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
            const list = Array.isArray(raw) ? raw : raw.data || [];
            setPages(list.sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0)));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const handleSaveNavItem = async (page: BackendCmsPage) => {
        await apiClient.patch(API_ENDPOINTS.cms.updatePage(page._id), {
            showInNav: page.showInNav,
            navLabel: page.navLabel || page.title,
            navOrder: Number(page.navOrder) || 1,
        });
        setToast(`Navigation settings saved for "${page.navLabel || page.title}".`);
        setTimeout(() => setToast(null), 3000);
        await fetchPages();
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
                            Menu & Positioning
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <Menu className="h-3.5 w-3.5" />
                            Header Navigation
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Control which pages appear in the public header navigation and set their display order.
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

            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="py-3.5 px-4">Page Slug</th>
                            <th className="py-3.5 px-4">Menu Label</th>
                            <th className="py-3.5 px-4 text-center">Order</th>
                            <th className="py-3.5 px-4 text-center">Show in Header</th>
                            <th className="py-3.5 px-4 text-right">Save</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pages.map((page) => (
                            <tr key={page._id} className="hover:bg-[#F7DFC7]/20">
                                <td className="py-3 px-4 font-mono text-[#5B9891]">/{page.slug}</td>
                                <td className="py-3 px-4">
                                    <input
                                        type="text"
                                        value={page.navLabel || page.title}
                                        onChange={(e) =>
                                            setPages((prev) =>
                                                prev.map((p) =>
                                                    p._id === page._id ? { ...p, navLabel: e.target.value } : p
                                                )
                                            )
                                        }
                                        className="rounded-lg border border-gray-200 bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-semibold text-gray-900"
                                    />
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <input
                                        type="number"
                                        min={1}
                                        value={page.navOrder || 1}
                                        onChange={(e) =>
                                            setPages((prev) =>
                                                prev.map((p) =>
                                                    p._id === page._id
                                                        ? { ...p, navOrder: Number(e.target.value) }
                                                        : p
                                                )
                                            )
                                        }
                                        className="w-16 rounded-lg border border-gray-200 bg-[#FAF8F5] px-2 py-1.5 text-center text-xs font-bold"
                                    />
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(page.showInNav)}
                                        onChange={(e) =>
                                            setPages((prev) =>
                                                prev.map((p) =>
                                                    p._id === page._id ? { ...p, showInNav: e.target.checked } : p
                                                )
                                            )
                                        }
                                        className="h-4 w-4 accent-[#5B9891]"
                                    />
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => handleSaveNavItem(page)}
                                        className="inline-flex items-center gap-1 rounded-lg bg-[#5B9891] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#467A74]"
                                    >
                                        <Save className="h-3 w-3" /> Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}