"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Database, Plus, Trash2, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

type DatabaseTab =
    | "subjects"
    | "software"
    | "vocationalSkills"
    | "socialIcons"
    | "businessRoles";

interface LookupItem {
    _id: string;
    type: DatabaseTab;
    genreOrCategory: string;
    name: string;
}

const EMPTY_DB: Record<DatabaseTab, LookupItem[]> = {
    subjects: [],
    software: [],
    vocationalSkills: [],
    socialIcons: [],
    businessRoles: [],
};

const TABS: Array<{ id: DatabaseTab; label: string; categoryPlaceholder: string; namePlaceholder: string }> = [
    {
        id: "subjects",
        label: "Subjects of Interest",
        categoryPlaceholder: "Genre (e.g. Islamic Studies, STEM)",
        namePlaceholder: "Subject Name",
    },
    {
        id: "software",
        label: "Applications & Software",
        categoryPlaceholder: "Category (e.g. Design, Accounting)",
        namePlaceholder: "Software / App Name",
    },
    {
        id: "vocationalSkills",
        label: "Vocational Skills",
        categoryPlaceholder: "Skill Genre (e.g. Craft, Culinary)",
        namePlaceholder: "Skill Name",
    },
    {
        id: "socialIcons",
        label: "Social & New Media Icons",
        categoryPlaceholder: "Platform Type (e.g. Social, Video)",
        namePlaceholder: "Platform Name (e.g. Telegram)",
    },
    {
        id: "businessRoles",
        label: "Business Roles",
        categoryPlaceholder: "Tier (e.g. Executive, Operations)",
        namePlaceholder: "Role Title (e.g. Co-Founder)",
    },
];

export function AdminDatabasesView() {
    const [activeTab, setActiveTab] = useState<DatabaseTab>("subjects");
    const [dbState, setDbState] = useState<Record<DatabaseTab, LookupItem[]>>(EMPTY_DB);
    const [categoryInput, setCategoryInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const currentTabConfig = TABS.find((t) => t.id === activeTab)!;
    const currentList = dbState[activeTab] || [];

    const fetchLookups = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: Record<DatabaseTab, LookupItem[]> }>(
                API_ENDPOINTS.cms.lookups
            );
            const raw = res as unknown as { data?: Record<DatabaseTab, LookupItem[]> };
            if (raw.data) {
                setDbState({ ...EMPTY_DB, ...raw.data });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load database lists.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLookups();
    }, [fetchLookups]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameInput.trim()) return;

        setIsSaving(true);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.admin.createLookup, {
                type: activeTab,
                genreOrCategory: categoryInput.trim() || "General",
                name: nameInput.trim(),
            });

            setToast(`Added "${nameInput.trim()}" to ${currentTabConfig.label}.`);
            setTimeout(() => setToast(null), 3000);
            setCategoryInput("");
            setNameInput("");
            await fetchLookups();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add entry.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiClient.delete(API_ENDPOINTS.admin.deleteLookup(id));
            await fetchLookups();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete entry.");
        }
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

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Master Profile Databases
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <Database className="h-3.5 w-3.5" />
                            Live Lookups
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Manage standardized genres, subjects, software, vocational skills, social platforms, and business roles.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchLookups}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* 5 Tabs */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-2xs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${activeTab === tab.id
                            ? "bg-[#5B9891] text-white shadow-2xs"
                            : "text-gray-600 hover:bg-[#FAF8F5]"
                            }`}
                    >
                        {tab.label} ({(dbState[tab.id] || []).length})
                    </button>
                ))}
            </div>

            {/* Add Entry Form */}
            <form
                onSubmit={handleAdd}
                className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs"
            >
                <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder={currentTabConfig.categoryPlaceholder}
                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                />
                <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={currentTabConfig.namePlaceholder}
                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                    required
                />
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5B9891] px-5 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" /> {isSaving ? "Adding..." : "Add Entry"}
                </button>
            </form>

            {/* Entries Table */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="py-3.5 px-4">Genre / Category</th>
                            <th className="py-3.5 px-4">Option Value</th>
                            <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="py-10 text-center text-xs text-gray-400 animate-pulse">
                                    Loading database entries...
                                </td>
                            </tr>
                        ) : currentList.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-10 text-center text-xs text-gray-400">
                                    No entries added in this database yet. Use the form above to add options.
                                </td>
                            </tr>
                        ) : (
                            currentList.map((item) => (
                                <tr key={item._id} className="hover:bg-[#F7DFC7]/20 transition">
                                    <td className="py-3 px-4">
                                        <span className="rounded-full bg-[#F7DFC7]/70 px-2.5 py-0.5 text-[11px] font-bold text-[#D98408]">
                                            {item.genreOrCategory}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-gray-900">{item.name}</td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item._id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete
                                        </button>
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