"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    ShieldAlert,
    Trash2,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    ShieldCheck,
    MessageSquare,
    Search,
    ExternalLink,
    X,
    User,
    Calendar,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ForumAuthor {
    _id?: string;
    fullName?: string;
    email?: string;
    profilePicture?: string;
    role?: string;
}

interface ForumCommentItem {
    _id?: string;
    commenterId?: ForumAuthor;
    comment: string;
    createdAt: string;
}

interface ForumReportItem {
    reporterId?: string | { fullName?: string; email?: string };
    reason: string;
    createdAt: string;
}

interface ForumPostItem {
    _id: string;
    title?: string;
    content: string;
    wingName?: string;
    category?: string;
    authorId?: ForumAuthor;
    comments?: ForumCommentItem[];
    commentCount?: number;
    likesCount?: number;
    reportCount?: number;
    reportsCount?: number;
    reports?: ForumReportItem[];
    isReported?: boolean;
    isHidden?: boolean;
    isLocked?: boolean;
    isDeleted?: boolean;
    createdAt: string;
}

type ModerationFilter = "all" | "reported" | "hidden";

export function AdminForumModerationView() {
    const [posts, setPosts] = useState<ForumPostItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ModerationFilter>("all");
    const [toast, setToast] = useState<string | null>(null);

    // Modal state for full thread preview & action
    const [previewPost, setPreviewPost] = useState<ForumPostItem | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            // Pass includeHidden=true and limit=100 so all posts load into admin panel
            const url = `${API_ENDPOINTS.forum.posts}?includeHidden=true&limit=100`;
            const res = await apiClient.get<{ data?: ForumPostItem[] }>(url);
            const raw = res as unknown as { data?: ForumPostItem[] } | ForumPostItem[];
            const list = Array.isArray(raw) ? raw : raw.data || [];
            setPosts(list);
        } catch {
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Handle Moderation actions
    const handleToggleHide = async (post: ForumPostItem) => {
        setActionLoadingId(post._id);
        const nextHiddenState = !post.isHidden;
        try {
            await apiClient.patch(API_ENDPOINTS.forum.moderatePost(post._id), {
                isHidden: nextHiddenState,
            });
            showToast(
                nextHiddenState
                    ? `Thread "${post.title || "Post"}" is now hidden from members.`
                    : `Thread "${post.title || "Post"}" is now visible to members.`
            );
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === post._id ? { ...p, isHidden: nextHiddenState } : p
                )
            );
            if (previewPost && previewPost._id === post._id) {
                setPreviewPost({ ...previewPost, isHidden: nextHiddenState });
            }
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update visibility.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleToggleLock = async (post: ForumPostItem) => {
        setActionLoadingId(post._id);
        const nextLockState = !post.isLocked;
        try {
            await apiClient.patch(API_ENDPOINTS.forum.moderatePost(post._id), {
                isLocked: nextLockState,
            });
            showToast(
                nextLockState
                    ? `Comments locked for thread "${post.title || "Post"}".`
                    : `Comments unlocked for thread "${post.title || "Post"}".`
            );
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === post._id ? { ...p, isLocked: nextLockState } : p
                )
            );
            if (previewPost && previewPost._id === post._id) {
                setPreviewPost({ ...previewPost, isLocked: nextLockState });
            }
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update comment lock.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleClearFlags = async (post: ForumPostItem) => {
        setActionLoadingId(post._id);
        try {
            await apiClient.patch(API_ENDPOINTS.forum.moderatePost(post._id), {
                clearReports: true,
            });
            showToast(`Flags cleared and thread approved for "${post.title || "Post"}".`);
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === post._id
                        ? {
                              ...p,
                              reportCount: 0,
                              reportsCount: 0,
                              isReported: false,
                              reports: [],
                          }
                        : p
                )
            );
            if (previewPost && previewPost._id === post._id) {
                setPreviewPost({
                    ...previewPost,
                    reportCount: 0,
                    reportsCount: 0,
                    isReported: false,
                    reports: [],
                });
            }
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to clear flags.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeletePost = async (post: ForumPostItem) => {
        if (!confirm(`Are you sure you want to permanently remove thread "${post.title || "Post"}"? This action cannot be undone.`)) {
            return;
        }
        setActionLoadingId(post._id);
        try {
            await apiClient.delete(API_ENDPOINTS.forum.deletePost(post._id));
            showToast("Forum post permanently removed.");
            setPosts((prev) => prev.filter((p) => p._id !== post._id));
            if (previewPost && previewPost._id === post._id) {
                setPreviewPost(null);
            }
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to delete post.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filtered list
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            // Pill filter
            if (activeFilter === "reported") {
                const count = post.reportCount ?? post.reportsCount ?? 0;
                if (!post.isReported && count === 0) return false;
            } else if (activeFilter === "hidden") {
                if (!post.isHidden) return false;
            }

            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const titleMatch = post.title?.toLowerCase().includes(q);
                const contentMatch = post.content?.toLowerCase().includes(q);
                const authorMatch = post.authorId?.fullName?.toLowerCase().includes(q);
                const categoryMatch = (post.category || post.wingName)?.toLowerCase().includes(q);
                if (!titleMatch && !contentMatch && !authorMatch && !categoryMatch) {
                    return false;
                }
            }
            return true;
        });
    }, [posts, activeFilter, searchQuery]);

    const totalCount = posts.length;
    const reportedCount = posts.filter(
        (p) => (p.reportCount ?? p.reportsCount ?? 0) > 0 || p.isReported
    ).length;
    const hiddenCount = posts.filter((p) => p.isHidden).length;

    return (
        <div className="space-y-6 pb-12">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74] animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {/* Header Banner with BDSisters Brand Palette */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28]">
                            Forum Threads & Moderation
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Community Safety & Adab
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 max-w-2xl">
                        Review all active community discussions, inspect reported threads, toggle visibility, lock comments, or clear false-positive flags.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchPosts}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#FAF8F5] transition-colors"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh Threads</span>
                </button>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                        type="button"
                        onClick={() => setActiveFilter("all")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                            activeFilter === "all"
                                ? "bg-[#5B9891] text-white shadow-xs"
                                : "bg-white text-stone-600 border border-stone-200 hover:bg-[#F7DFC7]/30"
                        }`}
                    >
                        All Threads ({totalCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter("reported")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeFilter === "reported"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50"
                        }`}
                    >
                        <AlertTriangle className="h-3 w-3" />
                        <span>Flagged / Reported ({reportedCount})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter("hidden")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeFilter === "hidden"
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50"
                        }`}
                    >
                        <EyeOff className="h-3 w-3" />
                        <span>Hidden ({hiddenCount})</span>
                    </button>
                </div>

                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="search"
                        placeholder="Search title, content, or sister..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-[#5B9891] focus:outline-none"
                    />
                </div>
            </div>

            {/* Moderation Table */}
            <div className="rounded-2xl border border-stone-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-100">
                        <tr>
                            <th className="py-3.5 px-4">Discussion Topic</th>
                            <th className="py-3.5 px-4">Author</th>
                            <th className="py-3.5 px-4 text-center">Category</th>
                            <th className="py-3.5 px-4 text-center">Flags</th>
                            <th className="py-3.5 px-4 text-center">Status</th>
                            <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-stone-400 animate-pulse">
                                    Loading forum threads from MongoDB...
                                </td>
                            </tr>
                        ) : filteredPosts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-stone-400">
                                    No forum posts found matching your filter.
                                </td>
                            </tr>
                        ) : (
                            filteredPosts.map((post) => {
                                const reportCount = post.reportCount ?? post.reportsCount ?? 0;
                                const isActionBusy = actionLoadingId === post._id;

                                return (
                                    <tr key={post._id} className="hover:bg-[#F7DFC7]/20 transition-colors">
                                        {/* Discussion Topic */}
                                        <td className="py-3.5 px-4 max-w-sm">
                                            <div className="flex items-start gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[#111E28] hover:text-[#5B9891] line-clamp-1 cursor-pointer" onClick={() => setPreviewPost(post)}>
                                                        {post.title || "Community Discussion"}
                                                    </p>
                                                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                                                        {post.content}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-1">
                                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{post.commentCount ?? post.comments?.length ?? 0} comments</span>
                                                        <span>•</span>
                                                        <span>{post.likesCount ?? 0} likes</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Author */}
                                        <td className="py-3.5 px-4 text-stone-700">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-[#5B9891]/15 text-[#5B9891] flex items-center justify-center font-bold text-[10px]">
                                                    {post.authorId?.fullName
                                                        ? post.authorId.fullName.charAt(0).toUpperCase()
                                                        : "S"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#111E28] text-xs">
                                                        {post.authorId?.fullName || "Sister Member"}
                                                    </p>
                                                    {post.authorId?.email && (
                                                        <p className="text-[10px] text-stone-400">
                                                            {post.authorId.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/60 border border-[#D98408]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                {post.category || post.wingName || "General"}
                                            </span>
                                        </td>

                                        {/* Flags */}
                                        <td className="py-3.5 px-4 text-center">
                                            {post.isReported || reportCount > 0 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewPost(post)}
                                                    className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                                                >
                                                    <AlertTriangle className="h-3 w-3" />
                                                    <span>{reportCount} {reportCount === 1 ? "Report" : "Reports"}</span>
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-[#5B9891] font-semibold">
                                                    <ShieldCheck className="h-3.5 w-3.5 text-[#5B9891]" /> Clean
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                {post.isHidden ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                        Hidden
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        Live
                                                    </span>
                                                )}

                                                {post.isLocked && (
                                                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                                                        <Lock className="w-2.5 h-2.5" /> Locked
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Moderation Actions */}
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Preview */}
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewPost(post)}
                                                    title="Preview Thread & Comments"
                                                    className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-[#FAF8F5] hover:text-[#5B9891] transition-colors"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>

                                                {/* Hide / Unhide Toggle */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleHide(post)}
                                                    disabled={isActionBusy}
                                                    title={post.isHidden ? "Make Visible (Unhide)" : "Hide Thread"}
                                                    className={`p-1.5 rounded-lg border transition-colors ${
                                                        post.isHidden
                                                            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                            : "border-stone-200 bg-white text-stone-600 hover:bg-amber-50 hover:text-amber-700"
                                                    }`}
                                                >
                                                    {post.isHidden ? (
                                                        <EyeOff className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5" />
                                                    )}
                                                </button>

                                                {/* Lock / Unlock Comments */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleLock(post)}
                                                    disabled={isActionBusy}
                                                    title={post.isLocked ? "Unlock Comments" : "Lock Comments"}
                                                    className={`p-1.5 rounded-lg border transition-colors ${
                                                        post.isLocked
                                                            ? "border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200"
                                                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                                                    }`}
                                                >
                                                    {post.isLocked ? (
                                                        <Lock className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Unlock className="h-3.5 w-3.5" />
                                                    )}
                                                </button>

                                                {/* Clear Flags */}
                                                {(post.isReported || reportCount > 0) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleClearFlags(post)}
                                                        disabled={isActionBusy}
                                                        title="Clear Flags / Approve Thread"
                                                        className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <ShieldCheck className="h-3.5 w-3.5" />
                                                    </button>
                                                )}

                                                {/* Delete Permanently */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePost(post)}
                                                    disabled={isActionBusy}
                                                    title="Permanently Delete Post"
                                                    className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
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

            {/* Preview & Moderate Thread Modal */}
            {previewPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#5B9891]/30 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-xl bg-[#5B9891]/15 text-[#5B9891]">
                                    <MessageSquare className="w-5 h-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-base text-[#111E28]">
                                        Preview & Moderate Thread
                                    </h3>
                                    <p className="text-[11px] text-stone-500">
                                        ID: {previewPost._id}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewPost(null)}
                                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thread Metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-100">
                            <div className="flex items-center gap-1.5 text-stone-700">
                                <User className="w-3.5 h-3.5 text-[#5B9891]" />
                                <span className="font-bold">{previewPost.authorId?.fullName || "Sister Member"}</span>
                                {previewPost.authorId?.email && (
                                    <span className="text-stone-400">({previewPost.authorId.email})</span>
                                )}
                            </div>
                            <span className="text-stone-300">•</span>
                            <div className="flex items-center gap-1.5 text-stone-600">
                                <Tag className="w-3.5 h-3.5 text-[#D98408]" />
                                <span>{previewPost.category || previewPost.wingName || "General"}</span>
                            </div>
                            <span className="text-stone-300">•</span>
                            <div className="flex items-center gap-1.5 text-stone-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(previewPost.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Title & Body Content */}
                        <div className="space-y-2">
                            <h4 className="text-lg font-bold text-[#111E28]">
                                {previewPost.title || "Community Discussion Topic"}
                            </h4>
                            <div className="rounded-2xl border border-stone-200/80 bg-white p-4 text-xs text-stone-800 whitespace-pre-line leading-relaxed shadow-2xs">
                                {previewPost.content}
                            </div>
                        </div>

                        {/* Reports Section if Flagged */}
                        {(previewPost.isReported || (previewPost.reportCount ?? previewPost.reportsCount ?? 0) > 0) && (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                                        <span>
                                            Reported {previewPost.reportCount ?? previewPost.reportsCount ?? 1} Time(s)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleClearFlags(previewPost)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                                    >
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Clear Flags & Approve</span>
                                    </button>
                                </div>
                                {previewPost.reports && previewPost.reports.length > 0 && (
                                    <ul className="text-xs text-rose-900 list-disc list-inside space-y-1 pt-1">
                                        {previewPost.reports.map((r, i) => (
                                            <li key={i}>
                                                <span className="font-semibold">&quot;{r.reason}&quot;</span>
                                                <span className="text-stone-400 text-[10px] ml-1.5">
                                                    ({new Date(r.createdAt).toLocaleDateString()})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Thread Comments */}
                        <div className="space-y-2 pt-1">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Comments ({previewPost.comments?.length || previewPost.commentCount || 0})
                            </h5>
                            {previewPost.comments && previewPost.comments.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {previewPost.comments.map((c, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                                                <span>{c.commenterId?.fullName || "Sister"}</span>
                                                <span className="text-[10px] text-stone-400 font-normal">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-stone-600 leading-normal">{c.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-stone-400 italic">No comments posted yet.</p>
                            )}
                        </div>

                        {/* Modal Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleToggleHide(previewPost)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                        previewPost.isHidden
                                            ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                            : "border-stone-200 bg-white text-stone-700 hover:bg-amber-50"
                                    }`}
                                >
                                    {previewPost.isHidden ? "Unhide Thread" : "Hide Thread"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleToggleLock(previewPost)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                        previewPost.isLocked
                                            ? "border-stone-300 bg-stone-100 text-stone-800"
                                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                                    }`}
                                >
                                    {previewPost.isLocked ? "Unlock Comments" : "Lock Comments"}
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDeletePost(previewPost)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                                >
                                    Delete Permanently
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPreviewPost(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5B9891] text-white hover:bg-[#467A74] transition-colors"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
