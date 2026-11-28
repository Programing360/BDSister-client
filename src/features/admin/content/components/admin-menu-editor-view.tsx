"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Menu,
    RefreshCw,
    Save,
    CheckCircle2,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    Sparkles,
    Eye,
    Layers,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { BackendCmsPage } from "./admin-cms-pages-view";

export function AdminMenuEditorView() {
    const [pages, setPages] = useState<BackendCmsPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingAll, setIsSavingAll] = useState(false);
    const [savingPageId, setSavingPageId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const fetchPages = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: BackendCmsPage[] }>(
                API_ENDPOINTS.cms.adminPages
            );
            const raw = res as unknown as { data?: BackendCmsPage[] } | BackendCmsPage[];
            const list = Array.isArray(raw) ? raw : raw.data || [];
            // Sort by navOrder ascending
            setPages([...list].sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0)));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const handleSaveNavItem = async (page: BackendCmsPage) => {
        setSavingPageId(page._id);
        try {
            const showValue = Boolean(page.showInHeader ?? page.showInNav);
            await apiClient.patch(API_ENDPOINTS.cms.updatePage(page._id), {
                showInNav: showValue,
                showInHeader: showValue,
                navLabel: page.navLabel || page.title,
                navOrder: Number(page.navOrder) || 0,
            });
            setToast(`Navigation settings saved for "${page.navLabel || page.title}".`);
            setTimeout(() => setToast(null), 3000);
            await fetchPages();
        } finally {
            setSavingPageId(null);
        }
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= pages.length) return;

        const current = pages[index];
        const target = pages[targetIndex];
        if (!current || !target) return;

        const updated = [...pages];
        updated[index] = target;
        updated[targetIndex] = current;

        // Reassign clean 0, 1, 2... navOrders
        const reindexed = updated.map((p, idx) => ({
            ...p,
            navOrder: idx,
        }));
        setPages(reindexed);
    };

    const handleSaveAll = async () => {
        setIsSavingAll(true);
        try {
            await Promise.all(
                pages.map((p) => {
                    const showValue = Boolean(p.showInHeader ?? p.showInNav);
                    return apiClient.patch(API_ENDPOINTS.cms.updatePage(p._id), {
                        showInNav: showValue,
                        showInHeader: showValue,
                        navLabel: p.navLabel || p.title,
                        navOrder: Number(p.navOrder) || 0,
                    });
                })
            );
            setToast("All navigation items and positions saved successfully!");
            setTimeout(() => setToast(null), 3000);
            await fetchPages();
        } finally {
            setIsSavingAll(false);
        }
    };

    const formatDisplayPath = (slug: string) => {
        if (slug === "home" || slug === "") return "/";
        return `/${slug}`;
    };

    const headerCount = pages.filter((p) => p.showInHeader ?? p.showInNav).length;
    const moreCount = pages.filter((p) => !(p.showInHeader ?? p.showInNav)).length;

    return (
        <div className="space-y-6 pb-12">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28]">
                            Header Navigation & Positioning
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <Menu className="h-3.5 w-3.5" />
                            Live Sync with Public Navbar
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 max-w-2xl">
                        Control which pages appear directly in the public capsule navigation (show in header) versus inside the &quot;More&quot; dropdown. Reorder positions or rename labels in real time.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={fetchPages}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#FAF8F5] transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAll}
                        disabled={isSavingAll || isLoading || pages.length === 0}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#467A74] disabled:opacity-50 transition-colors"
                    >
                        <Save className="h-4 w-4" />
                        <span>{isSavingAll ? "Saving Order..." : "Save All Positions"}</span>
                    </button>
                </div>
            </div>

            {/* Overview counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Total Navigable Pages
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-[#111E28]">
                        {pages.length}
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-400">
                        Synchronized with CmsPage collection
                    </p>
                </div>

                <div className="rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/5 p-4 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B9891]">
                        Main Capsule Nav ({headerCount})
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-[#5B9891]">
                        {headerCount} Pages
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-500">
                        Visible on desktop top navigation bar
                    </p>
                </div>

                <div className="rounded-2xl border border-[#D98408]/30 bg-[#F7DFC7]/20 p-4 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#D98408]">
                        &quot;More&quot; Dropdown ({moreCount})
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-[#D98408]">
                        {moreCount} Pages
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-500">
                        Nested under the More hover menu
                    </p>
                </div>
            </div>

            {/* Pages Table */}
            <div className="rounded-2xl border border-stone-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-100">
                        <tr>
                            <th className="py-3.5 px-4 text-center w-16">Reorder</th>
                            <th className="py-3.5 px-4">Page Route</th>
                            <th className="py-3.5 px-4">Menu Label</th>
                            <th className="py-3.5 px-4 text-center">Nav Order</th>
                            <th className="py-3.5 px-4 text-center">Placement</th>
                            <th className="py-3.5 px-4 text-center">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {pages.map((page, index) => {
                            const isCapsule = Boolean(page.showInHeader ?? page.showInNav);
                            const path = formatDisplayPath(page.slug);
                            const isRowSaving = savingPageId === page._id;

                            return (
                                <tr key={page._id} className="hover:bg-[#F7DFC7]/20 transition-colors">
                                    {/* Reorder Buttons */}
                                    <td className="py-3 px-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleMove(index, "up")}
                                                disabled={index === 0}
                                                title="Move Up"
                                                className="p-1 rounded-md text-stone-400 hover:text-[#5B9891] hover:bg-white disabled:opacity-20 disabled:hover:bg-transparent"
                                            >
                                                <ArrowUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleMove(index, "down")}
                                                disabled={index === pages.length - 1}
                                                title="Move Down"
                                                className="p-1 rounded-md text-stone-400 hover:text-[#5B9891] hover:bg-white disabled:opacity-20 disabled:hover:bg-transparent"
                                            >
                                                <ArrowDown className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>

                                    {/* Slug Link */}
                                    <td className="py-3 px-4 font-mono font-medium text-[#5B9891]">
                                        <div className="flex items-center gap-1.5">
                                            <span>{path}</span>
                                            <Link
                                                href={path}
                                                target="_blank"
                                                title="Preview public route"
                                                className="text-stone-300 hover:text-[#5B9891]"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </td>

                                    {/* Menu Label Input */}
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
                                            className="w-full max-w-xs rounded-xl border border-stone-200 bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                        />
                                    </td>

                                    {/* Order Input */}
                                    <td className="py-3 px-4 text-center">
                                        <input
                                            type="number"
                                            min={0}
                                            value={page.navOrder ?? 0}
                                            onChange={(e) =>
                                                setPages((prev) =>
                                                    prev.map((p) =>
                                                        p._id === page._id
                                                          ? { ...p, navOrder: Number(e.target.value) }
                                                          : p
                                                    )
                                                )
                                            }
                                            className="w-16 rounded-xl border border-stone-200 bg-[#FAF8F5] px-2 py-1.5 text-center text-xs font-bold text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                        />
                                    </td>

                                    {/* Placement toggle & badge */}
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={isCapsule}
                                                onChange={(e) =>
                                                    setPages((prev) =>
                                                        prev.map((p) =>
                                                            p._id === page._id
                                                                ? {
                                                                      ...p,
                                                                      showInHeader: e.target.checked,
                                                                      showInNav: e.target.checked,
                                                                  }
                                                                : p
                                                        )
                                                    )
                                                }
                                                className="h-4 w-4 accent-[#5B9891] rounded cursor-pointer"
                                            />
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    isCapsule
                                                        ? "bg-[#5B9891]/15 text-[#5B9891] border border-[#5B9891]/30"
                                                        : "bg-stone-100 text-stone-600 border border-stone-200"
                                                }`}
                                            >
                                                {isCapsule ? "Capsule Nav" : "More Dropdown"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                page.isPublished
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}
                                        >
                                            {page.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>

                                    {/* Save Button */}
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleSaveNavItem(page)}
                                            disabled={isRowSaving}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#467A74] shadow-2xs transition-colors disabled:opacity-50"
                                        >
                                            <Save className="h-3 w-3" />
                                            <span>{isRowSaving ? "Saving..." : "Save"}</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
