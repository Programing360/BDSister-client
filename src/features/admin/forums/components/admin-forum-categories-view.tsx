"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    MessageSquare,
    RefreshCw,
    FolderOpen,
    Plus,
    Pencil,
    Trash2,
    CheckCircle2,
    AlertCircle,
    X,
    Sparkles,
    Hash,
    Layers,
    BookOpen,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface ForumCategory {
    _id?: string;
    id?: string;
    name: string;
    slug?: string;
    description?: string;
    wingName?: string;
    order?: number;
    postCount?: number;
    topicCount?: number;
    isActive?: boolean;
}

const WING_OPTIONS = [
    { label: "Faith & Personal Growth (FaithAndGrowth)", value: "FaithAndGrowth" },
    { label: "Family & Parenting (FamilyAndParenting)", value: "FamilyAndParenting" },
    { label: "Sisters in Business (SistersInBusiness)", value: "SistersInBusiness" },
    { label: "Health & Wellness (HealthAndWellness)", value: "HealthAndWellness" },
    { label: "Skills Exchange (SkillsExchange)", value: "SkillsExchange" },
    { label: "Project Tasks (ProjectTasks)", value: "ProjectTasks" },
    { label: "General Community (General)", value: "General" },
];

export function AdminForumCategoriesView() {
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Modal state for Create / Edit
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);

    // Form inputs
    const [formName, setFormName] = useState("");
    const [formSlug, setFormSlug] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formOrder, setFormOrder] = useState<number>(1);
    const [formWingName, setFormWingName] = useState("General");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: ForumCategory[] }>(
                API_ENDPOINTS.forum.categories
            );
            const raw = res as unknown as { data?: ForumCategory[] } | ForumCategory[];
            const list = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                    ? raw.data
                    : [];
            setCategories(list.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load categories.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Open Modal for Create
    const handleOpenCreateModal = () => {
        setEditingCategory(null);
        setFormName("");
        setFormSlug("");
        setFormDescription("");
        setFormOrder((categories.length || 0) + 1);
        setFormWingName("General");
        setError(null);
        setModalOpen(true);
    };

    // Open Modal for Edit
    const handleOpenEditModal = (cat: ForumCategory) => {
        setEditingCategory(cat);
        setFormName(cat.name);
        setFormSlug(cat.slug || cat.id || "");
        setFormDescription(cat.description || "");
        setFormOrder(cat.order ?? 1);
        setFormWingName(cat.wingName || "General");
        setError(null);
        setModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) {
            setError("Category name is required.");
            return;
        }

        const generatedSlug = (
            formSlug.trim() ||
            formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
        ).toLowerCase();

        setIsSaving(true);
        setError(null);

        try {
            if (editingCategory) {
                // PATCH update
                const targetId = editingCategory._id || editingCategory.id || editingCategory.slug;
                await apiClient.patch(API_ENDPOINTS.forum.updateCategory(targetId as string), {
                    name: formName.trim(),
                    slug: generatedSlug,
                    description: formDescription.trim(),
                    order: Number(formOrder) || 0,
                    wingName: formWingName,
                });
                showToast(`Category "${formName.trim()}" updated successfully.`);
            } else {
                // POST create
                await apiClient.post(API_ENDPOINTS.forum.createCategory, {
                    name: formName.trim(),
                    slug: generatedSlug,
                    description: formDescription.trim(),
                    order: Number(formOrder) || 0,
                    wingName: formWingName,
                });
                showToast(`New category "${formName.trim()}" created successfully.`);
            }

            setModalOpen(false);
            await fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save category.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (cat: ForumCategory) => {
        const targetId = cat._id || cat.id || cat.slug;
        if (!targetId) return;

        if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

        setIsLoading(true);
        setError(null);
        try {
            await apiClient.delete(API_ENDPOINTS.forum.deleteCategory(targetId));
            showToast(`Category "${cat.name}" deleted.`);
            await fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete category.");
            setIsLoading(false);
        }
    };

    const totalTopics = useMemo(() => {
        return categories.reduce((sum, c) => sum + (c.postCount ?? c.topicCount ?? 0), 0);
    }, [categories]);

    return (
        <div className="space-y-6 pb-16">
            {/* Toast Banner */}
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Brand Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28] sm:text-3xl">
                            Forum Categories & Spaces
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Community Discussion Boards
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 max-w-2xl">
                        Create, customize, and moderate public &amp; sisterhood discussion categories. Changes reflect immediately on `/forums`.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#D98408] px-4 py-2 text-xs font-bold text-white hover:bg-[#b86f06] transition shadow-xs"
                    >
                        <Plus className="h-4 w-4" /> New Category
                    </button>
                    <button
                        type="button"
                        onClick={fetchCategories}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#5B9891]/30 bg-white px-3.5 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B9891]/15 text-[#5B9891]">
                        <FolderOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Total Categories
                        </p>
                        <p className="text-xl font-bold text-[#111E28]">{categories.length}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D98408]/15 text-[#D98408]">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Live Posts &amp; Topics
                        </p>
                        <p className="text-xl font-bold text-[#111E28]">{totalTopics}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7DFC7] text-[#D98408]">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Seeded Default Spaces
                        </p>
                        <p className="text-xl font-bold text-[#111E28]">7 Core Wings</p>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            {isLoading && categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center text-xs text-gray-500 rounded-2xl border border-gray-200 bg-white">
                    <RefreshCw className="h-6 w-6 animate-spin text-[#5B9891] mb-2" />
                    <span>Loading discussion categories...</span>
                </div>
            ) : categories.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-500 rounded-2xl border border-gray-200 bg-white">
                    No forum categories found. Click &quot;New Category&quot; to create one.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat, idx) => {
                        const topicCount = cat.postCount ?? cat.topicCount ?? 0;
                        return (
                            <div
                                key={cat._id || cat.id || idx}
                                className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-4 flex flex-col justify-between transition hover:border-[#5B9891]/40 hover:shadow-xs"
                            >
                                <div className="space-y-3">
                                    {/* Top Card Row: Icon, Order, and Live Topic Count Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B9891]/12 text-[#5B9891]">
                                                <FolderOpen className="h-4 w-4" />
                                            </div>
                                            <span className="rounded-md bg-[#F7DFC7] px-2 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                #{cat.order || idx + 1}
                                            </span>
                                        </div>

                                        {/* Live Topic Count Badge */}
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#5B9891]/15 border border-[#5B9891]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#467A74]">
                                            <MessageSquare className="h-3 w-3" />
                                            {topicCount} {topicCount === 1 ? "Topic" : "Topics"}
                                        </span>
                                    </div>

                                    {/* Category Info */}
                                    <div>
                                        <h3 className="text-base font-bold text-[#111E28] leading-tight">
                                            {cat.name}
                                        </h3>
                                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                                            /{cat.slug || cat.id}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                                            {cat.description || "Moderated community discussion space."}
                                        </p>
                                    </div>

                                    {/* Wing Tag if assigned */}
                                    {cat.wingName && (
                                        <div className="pt-1">
                                            <span className="inline-flex items-center gap-1 rounded bg-[#FAF8F5] border border-gray-200 px-2 py-0.5 text-[10px] font-mono text-gray-600">
                                                <Layers className="h-3 w-3 text-[#5B9891]" />
                                                wing: {cat.wingName}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons Row */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEditModal(cat)}
                                        className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-[#5B9891] hover:text-[#5B9891] transition"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        <span>Edit</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(cat)}
                                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CREATE / EDIT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D98408]/15 text-[#D98408]">
                                    <FolderOpen className="h-4 w-4" />
                                </div>
                                <h3 className="text-base font-bold text-[#111E28]">
                                    {editingCategory ? "Edit Forum Category" : "Create New Forum Category"}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormName(val);
                                            // Auto-generate slug if not editing or slug was auto-generated
                                            if (!editingCategory) {
                                                setFormSlug(
                                                    val
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9]+/g, "-")
                                                        .replace(/^-|-$/g, "")
                                                );
                                            }
                                        }}
                                        placeholder="e.g. Sisters in Tech"
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Slug (URL identifier)
                                    </label>
                                    <input
                                        type="text"
                                        value={formSlug}
                                        onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                                        placeholder="e.g. sisters-in-tech"
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Description / Purpose
                                </label>
                                <textarea
                                    rows={3}
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="Explain the purpose, guidelines, and target discussion topics for this space..."
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-gray-800 leading-relaxed focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Assigned Wing / Ecosystem
                                    </label>
                                    <select
                                        value={formWingName}
                                        onChange={(e) => setFormWingName(e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-xs text-gray-800 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    >
                                        {WING_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formOrder}
                                        onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-gray-800 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition flex items-center gap-1.5"
                                >
                                    {isSaving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                                    <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
