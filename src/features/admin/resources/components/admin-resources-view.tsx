"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    BookOpen,
    RefreshCw,
    FileText,
    Video,
    Download,
    Plus,
    X,
    CheckCircle2,
    Edit,
    Trash2,
    ExternalLink,
    Search,
    Upload,
    Paperclip,
    Layers,
    User,
    Tag,
    Clock,
    FileSpreadsheet,
    AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface ResourceItem {
    _id: string;
    title: string;
    slug?: string;
    description?: string;
    content?: string;
    type?: "Article" | "Video" | "Downloadable" | "Audio" | "Worksheet" | "Curated";
    format?: "Downloadable" | "Video" | "Article" | "Worksheet" | "Curated";
    wing?: string;
    category?: string;
    curatedBySister?: string;
    fileSizeOrDuration?: string;
    fileUrl?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    tags?: string[];
    downloadCount?: number;
    downloadsCount?: number;
    viewCount?: number;
    accessLevel?: "Public" | "Member" | "PaidMember" | "Admin";
    isPublished?: boolean;
    createdAt?: string;
}

const WING_OPTIONS = ["BDSisters", "TSPP", "CoP", "MIDJ", "The Hut Network"];
const FORMAT_OPTIONS = ["Downloadable", "Video", "Article", "Worksheet", "Curated"] as const;

export function AdminResourcesView() {
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [activeTab, setActiveTab] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setModalSuccess] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        format: "Downloadable" as typeof FORMAT_OPTIONS[number],
        wing: "BDSisters",
        category: "General",
        curatedBySister: "",
        fileSizeOrDuration: "",
        fileUrl: "",
        videoUrl: "",
        accessLevel: "Member" as "Public" | "Member" | "PaidMember" | "Admin",
        isPublished: true,
        tags: "",
    });

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
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

    // Open Create Modal
    const handleOpenCreate = () => {
        setModalError(null);
        setModalSuccess(null);
        setFormData({
            title: "",
            description: "",
            format: "Downloadable",
            wing: "BDSisters",
            category: "General",
            curatedBySister: "",
            fileSizeOrDuration: "",
            fileUrl: "",
            videoUrl: "",
            accessLevel: "Member",
            isPublished: true,
            tags: "",
        });
        setIsCreateModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (item: ResourceItem) => {
        setModalError(null);
        setModalSuccess(null);
        setEditingResource(item);
        const formatVal = (item.format || item.type || "Downloadable") as typeof FORMAT_OPTIONS[number];
        setFormData({
            title: item.title || "",
            description: item.description || "",
            format: FORMAT_OPTIONS.includes(formatVal) ? formatVal : "Downloadable",
            wing: item.wing || "BDSisters",
            category: item.category || "General",
            curatedBySister: item.curatedBySister || "",
            fileSizeOrDuration: item.fileSizeOrDuration || "",
            fileUrl: item.fileUrl || "",
            videoUrl: item.videoUrl || "",
            accessLevel: item.accessLevel || "Member",
            isPublished: item.isPublished !== undefined ? item.isPublished : true,
            tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
        });
    };

    // Handle File Upload via /api/upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setModalError(null);
        setModalSuccess(null);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            // Calculate human size
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
            const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
            const autoSizeOrDuration = `${sizeInMb} MB ${extension}`;

            const res = await apiClient.post<{ url?: string; fileUrl?: string }>(
                "/api/upload",
                uploadFormData
            );
            const raw = res as unknown as { url?: string; fileUrl?: string; data?: { url?: string } };
            const uploadedUrl = raw.url || raw.fileUrl || raw.data?.url;

            if (uploadedUrl) {
                setFormData((prev) => ({
                    ...prev,
                    fileUrl: uploadedUrl,
                    fileSizeOrDuration: prev.fileSizeOrDuration || autoSizeOrDuration,
                }));
                setModalSuccess("File uploaded and linked successfully!");
                showToast("File uploaded and linked successfully!");
            } else {
                throw new Error("No URL returned from upload server.");
            }
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to upload file.");
            setModalSuccess(null);
        } finally {
            setIsUploading(false);
        }
    };

    // Submit Create or Edit
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setModalError(null);
        try {
            const tagsArray = formData.tags
                ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [];

            const payload = {
                title: formData.title,
                description: formData.description,
                format: formData.format,
                type: formData.format,
                wing: formData.wing,
                category: formData.category,
                curatedBySister: formData.curatedBySister || undefined,
                fileSizeOrDuration: formData.fileSizeOrDuration || undefined,
                fileUrl: formData.fileUrl || undefined,
                videoUrl: formData.videoUrl || undefined,
                tags: tagsArray,
                accessLevel: formData.accessLevel,
                isPublished: formData.isPublished,
            };

            if (editingResource) {
                await apiClient.patch(API_ENDPOINTS.resources.update(editingResource._id), payload);
                showToast(`Resource "${formData.title}" updated successfully.`);
                setEditingResource(null);
            } else {
                await apiClient.post(API_ENDPOINTS.resources.create, payload);
                showToast(`Resource "${formData.title}" added to library.`);
                setIsCreateModalOpen(false);
            }
            await fetchResources();
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to save resource.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Resource
    const handleDeleteResource = async (item: ResourceItem) => {
        if (!confirm(`Are you sure you want to delete resource "${item.title}"?`)) {
            return;
        }
        try {
            await apiClient.delete(API_ENDPOINTS.resources.delete(item._id));
            showToast(`Resource "${item.title}" deleted.`);
            setResources((prev) => prev.filter((r) => r._id !== item._id));
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to delete resource.", "error");
        }
    };

    // Tabs definition (Fixed label: "Curated" instead of "Curateds")
    const FILTER_TABS = [
        { id: "ALL", label: "All Resources" },
        { id: "Downloadable", label: "Downloadables" },
        { id: "Video", label: "Videos" },
        { id: "Article", label: "Articles" },
        { id: "Worksheet", label: "Worksheets" },
        { id: "Curated", label: "Curated" },
    ];

    const filteredResources = useMemo(() => {
        return resources.filter((item) => {
            const itemType = item.format || item.type || "Article";
            if (activeTab !== "ALL" && itemType !== activeTab) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = item.title?.toLowerCase().includes(q);
                const matchDesc = item.description?.toLowerCase().includes(q);
                const matchSister = item.curatedBySister?.toLowerCase().includes(q);
                const matchWing = item.wing?.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchSister && !matchWing) {
                    return false;
                }
            }
            return true;
        });
    }, [resources, activeTab, searchQuery]);

    const formatBadge = (type?: string) => {
        switch (type) {
            case "Video":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                        <Video className="h-3 w-3" /> Video
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
                        <FileText className="h-3 w-3" /> {type || "Article"}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {toast && (
                <div
                    className={`flex items-center gap-2 rounded-2xl border p-3.5 text-xs font-bold animate-in fade-in ${
                        toast.type === "error"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : "border-[#5B9891]/30 bg-[#5B9891]/10 text-[#467A74]"
                    }`}
                >
                    {toast.type === "error" ? (
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4 text-[#5B9891] shrink-0" />
                    )}
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28]">
                            Resource Library & Learning Management
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <BookOpen className="h-3.5 w-3.5" />
                            TSPP, CoP & Sisterhood Resources
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 max-w-2xl">
                        Upload guides, habit journals, video masterclasses, worksheets, and publications across sister wings with access-level controls.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={fetchResources}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#FAF8F5] transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#467A74] transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Resource</span>
                    </button>
                </div>
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
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "bg-[#5B9891] text-white shadow-xs"
                                        : "bg-white text-stone-600 border border-stone-200 hover:bg-[#F7DFC7]/30"
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
                        placeholder="Search resources, curator, or wing..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-[#5B9891] focus:outline-none"
                    />
                </div>
            </div>

            {/* Resource Table */}
            <div className="rounded-2xl border border-stone-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-100">
                        <tr>
                            <th className="py-3.5 px-4">Resource Title</th>
                            <th className="py-3.5 px-4 text-center">Format</th>
                            <th className="py-3.5 px-4 text-center">Wing</th>
                            <th className="py-3.5 px-4">Curated By</th>
                            <th className="py-3.5 px-4 text-center">Downloads / Views</th>
                            <th className="py-3.5 px-4 text-center">Access Level</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-stone-400 animate-pulse">
                                    Loading resource library from MongoDB...
                                </td>
                            </tr>
                        ) : filteredResources.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-stone-400">
                                    No resources found matching your filter.
                                </td>
                            </tr>
                        ) : (
                            filteredResources.map((item) => {
                                const resourceUrl = item.fileUrl || item.videoUrl;

                                return (
                                    <tr key={item._id} className="hover:bg-[#F7DFC7]/20 transition-colors">
                                        {/* Title & Description */}
                                        <td className="py-3.5 px-4 max-w-sm">
                                            <div>
                                                <p className="font-bold text-[#111E28] line-clamp-1">
                                                    {item.title}
                                                </p>
                                                {item.description && (
                                                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                                                        {item.description}
                                                    </p>
                                                )}
                                                {item.fileSizeOrDuration && (
                                                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                                                        {item.fileSizeOrDuration}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Format Badge */}
                                        <td className="py-3.5 px-4 text-center">
                                            {formatBadge(item.format || item.type)}
                                        </td>

                                        {/* Wing */}
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="inline-flex items-center rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                                                {item.wing || "BDSisters"}
                                            </span>
                                        </td>

                                        {/* Curated By */}
                                        <td className="py-3.5 px-4 text-stone-700">
                                            {item.curatedBySister ? (
                                                <span className="font-semibold text-xs text-[#111E28]">
                                                    {item.curatedBySister}
                                                </span>
                                            ) : (
                                                <span className="text-stone-400 italic">BDSisters Curators</span>
                                            )}
                                        </td>

                                        {/* Downloads / Views */}
                                        <td className="py-3.5 px-4 text-center font-mono font-bold text-stone-700">
                                            {item.downloadsCount ?? item.downloadCount ?? item.viewCount ?? 0}
                                        </td>

                                        {/* Access Level */}
                                        <td className="py-3.5 px-4 text-center">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    item.accessLevel === "Public"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : item.accessLevel === "PaidMember"
                                                        ? "bg-[#D98408]/15 text-[#D98408] border border-[#D98408]/30"
                                                        : "bg-[#5B9891]/15 text-[#5B9891] border border-[#5B9891]/30"
                                                }`}
                                            >
                                                {item.accessLevel || "Member"}
                                            </span>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Open / Preview File */}
                                                {resourceUrl ? (
                                                    <a
                                                        href={resourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Open / Preview Resource Link"
                                                        className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-[#5B9891] hover:bg-[#FAF8F5] transition-colors"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        title="No URL attached"
                                                        className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-300 cursor-not-allowed"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </button>
                                                )}

                                                {/* Edit */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(item)}
                                                    title="Edit Resource"
                                                    className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-[#FAF8F5] hover:text-[#5B9891] transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteResource(item)}
                                                    title="Delete Resource"
                                                    className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal: Add or Edit Resource */}
            {(isCreateModalOpen || editingResource) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#5B9891]/30 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-xl bg-[#5B9891]/15 text-[#5B9891]">
                                    <BookOpen className="w-5 h-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-base text-[#111E28]">
                                        {editingResource ? "Edit Resource" : "Add New Resource to Library"}
                                    </h3>
                                    <p className="text-[11px] text-stone-500">
                                        Upload downloadable documents, videos, and worksheets for sister development.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setEditingResource(null);
                                }}
                                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            {modalError && (
                                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{modalError}</span>
                                </div>
                            )}
                            {modalSuccess && (
                                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 animate-in fade-in">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <span>{modalSuccess}</span>
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Resource Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., The Holistic Islamic Development Framework: Habit Compass"
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            {/* Format & Sister Wing */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Resource Format *
                                    </label>
                                    <select
                                        value={formData.format}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                format: e.target.value as typeof FORMAT_OPTIONS[number],
                                            })
                                        }
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    >
                                        {FORMAT_OPTIONS.map((fmt) => (
                                            <option key={fmt} value={fmt}>
                                                {fmt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Sister Wing
                                    </label>
                                    <select
                                        value={formData.wing}
                                        onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    >
                                        {WING_OPTIONS.map((w) => (
                                            <option key={w} value={w}>
                                                {w}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Curated By Sister & Size/Duration */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Curated By Sister / Author
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.curatedBySister}
                                        onChange={(e) =>
                                            setFormData({ ...formData, curatedBySister: e.target.value })
                                        }
                                        placeholder="e.g., Sister Ayesha Siddiqua (CoP)"
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        File Size or Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fileSizeOrDuration}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fileSizeOrDuration: e.target.value })
                                        }
                                        placeholder="e.g., 4.2 MB PDF or 42 mins"
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* File Upload & File URL */}
                            <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF8F5] space-y-3">
                                <label className="block text-xs font-bold text-[#111E28]">
                                    Resource File (Upload or External URL)
                                </label>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white border border-stone-200 px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#FAF8F5] shadow-2xs transition-colors shrink-0">
                                        <Upload className={`w-3.5 h-3.5 ${isUploading ? "animate-bounce" : ""}`} />
                                        <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                            className="hidden"
                                        />
                                    </label>

                                    <div className="relative w-full">
                                        <Paperclip className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                        <input
                                            type="url"
                                            value={formData.fileUrl}
                                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                            placeholder="https://... PDF / document URL"
                                            className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {formData.format === "Video" && (
                                    <div>
                                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                                            Video Stream / Embed URL (YouTube / Vimeo / Drive)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-[#111E28] focus:border-[#5B9891] focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Access Level & Tags */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Access Level
                                    </label>
                                    <select
                                        value={formData.accessLevel}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                accessLevel: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    >
                                        <option value="Public">Public (Anyone)</option>
                                        <option value="Member">Member (Registered Sisters - Free)</option>
                                        <option value="PaidMember">PaidMember (Premium / Subscribed)</option>
                                        <option value="Admin">Admin Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Tags (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="Spiritual, Productivity, PDF, Parenting"
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Description & Overview *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief outline explaining the purpose and how sisters can implement this resource..."
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setEditingResource(null);
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5B9891] text-white hover:bg-[#467A74] shadow-xs disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : editingResource
                                        ? "Update Resource"
                                        : "Add to Library"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
