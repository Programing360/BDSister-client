"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Trash2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ForumPostItem {
    _id: string;
    title: string;
    content?: string;
    category?: string;
    authorId?: { fullName?: string; email?: string };
    reportsCount?: number;
    isReported?: boolean;
    createdAt: string;
}

export function AdminForumModerationView() {
    const [posts, setPosts] = useState<ForumPostItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: ForumPostItem[] }>(
                API_ENDPOINTS.forum.posts
            );
            const raw = res as unknown as { data?: ForumPostItem[] } | ForumPostItem[];
            setPosts(Array.isArray(raw) ? raw : raw.data || []);
        } catch {
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDeletePost = async (post: ForumPostItem) => {
        if (!confirm(`Remove discussion topic "${post.title}"?`)) return;
        try {
            await apiClient.delete(API_ENDPOINTS.forum.deletePost(post._id));
            setToast("Forum post removed for moderation.");
            setTimeout(() => setToast(null), 3500);
            await fetchPosts();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete post.");
        }
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
                            Forum Moderation
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Safe Space Control
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Review active discussion threads, reported topics, and maintain sisterhood adab.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchPosts}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh Threads</span>
                </button>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="py-3.5 px-4">Discussion Topic</th>
                            <th className="py-3.5 px-4">Author</th>
                            <th className="py-3.5 px-4 text-center">Flags</th>
                            <th className="py-3.5 px-4 text-right">Moderation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-gray-400 animate-pulse">
                                    Loading discussions...
                                </td>
                            </tr>
                        ) : posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-gray-400">
                                    No forum posts found.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post._id} className="hover:bg-[#F7DFC7]/20">
                                    <td className="py-3.5 px-4">
                                        <p className="font-bold text-gray-900">{post.title}</p>
                                        <p className="text-[11px] text-gray-500">{post.category || "General"}</p>
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-600">
                                        {post.authorId?.fullName || "Sister Member"}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        {post.isReported || (post.reportsCount && post.reportsCount > 0) ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                                                <AlertTriangle className="h-3 w-3" /> Reported
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-[#5B9891] font-semibold">Clean</span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePost(post)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                                        >
                                            <Trash2 className="h-3 w-3" /> Remove
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