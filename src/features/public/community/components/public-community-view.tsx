"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    MessageSquare,
    Search,
    Heart,
    Send,
    Lock,
    Sparkles,
    Loader2,
    AlertCircle,
    CheckCircle2,
    UserCircle,
    Filter,
    Flag,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ForumCategory {
    _id?: string;
    name: string;
    slug?: string;
    description?: string;
}

interface ForumComment {
    _id: string;
    authorId?: {
        _id: string;
        fullName: string;
        profilePicture?: string;
    };
    comment?: string;
    content?: string;
    createdAt: string;
}

interface ForumPost {
    _id: string;
    title: string;
    content: string;
    wingName?: string;
    category?: string;
    authorId?: {
        _id: string;
        fullName: string;
        profilePicture?: string;
    };
    likes?: string[];
    likesCount?: number;
    commentsCount?: number;
    isAnonymous?: boolean;
    createdAt: string;
}

export function PublicCommunityView() {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Expanded Thread Comments State
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [threadComments, setThreadComments] = useState<Record<string, ForumComment[]>>({});
    const [loadingCommentsFor, setLoadingCommentsFor] = useState<string | null>(null);
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
    const [submittingCommentFor, setSubmittingCommentFor] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    // Check if user is logged in to unlock full thread & interactions
    useEffect(() => {
        apiClient
            .get(API_ENDPOINTS.auth.me)
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false));
    }, []);

    const fetchForumData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.set("search", searchQuery.trim());
            if (selectedCategory) params.set("wingName", selectedCategory);

            const qs = params.toString();
            const postsUrl = qs
                ? `${API_ENDPOINTS.forum.posts}?${qs}`
                : API_ENDPOINTS.forum.posts;

            const [postsRes, catsRes] = await Promise.allSettled([
                apiClient.get<{ data?: ForumPost[] }>(postsUrl),
                apiClient.get<{ data?: Array<string | ForumCategory> }>(
                    API_ENDPOINTS.forum.categories
                ),
            ]);

            if (postsRes.status === "fulfilled") {
                const rawP = postsRes.value as unknown as
                    | { data?: ForumPost[] }
                    | ForumPost[];
                setPosts(Array.isArray(rawP) ? rawP : rawP.data || []);
            }

            if (catsRes.status === "fulfilled") {
                const rawC = catsRes.value as unknown as {
                    data?: Array<string | ForumCategory>;
                };
                const list = Array.isArray(rawC.data) ? rawC.data : [];
                setCategories(
                    list.map((c) => (typeof c === "string" ? { name: c } : c))
                );
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load community discussions."
            );
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchForumData();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchForumData]);

    const handleToggleThread = async (postId: string) => {
        if (!isAuthenticated) {
            setError("Please sign in as a verified sister to read full threads and reply.");
            return;
        }

        if (expandedPostId === postId) {
            setExpandedPostId(null);
            return;
        }

        setExpandedPostId(postId);
        setLoadingCommentsFor(postId);
        try {
            const res = await apiClient.get<{ data?: ForumComment[] }>(
                API_ENDPOINTS.forum.comments(postId)
            );
            const raw = res as unknown as { data?: ForumComment[] } | ForumComment[];
            setThreadComments((prev) => ({
                ...prev,
                [postId]: Array.isArray(raw) ? raw : raw.data || [],
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load comments.");
        } finally {
            setLoadingCommentsFor(null);
        }
    };

    const handleLikePost = async (postId: string) => {
        if (!isAuthenticated) {
            setError("Sign in to appreciate and support sister discussions.");
            return;
        }
        try {
            await apiClient.post(`/api/forum/posts/${postId}/like`);
            await fetchForumData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update like.");
        }
    };

    const handleAddComment = async (e: React.FormEvent, postId: string) => {
        e.preventDefault();
        const text = (commentInputs[postId] || "").trim();
        if (!text) return;

        setSubmittingCommentFor(postId);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.forum.comments(postId), {
                comment: text,
                content: text,
            });
            setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
            showToast("Reply posted to the sisterhood thread!");

            // Refresh comments for this post
            const res = await apiClient.get<{ data?: ForumComment[] }>(
                API_ENDPOINTS.forum.comments(postId)
            );
            const raw = res as unknown as { data?: ForumComment[] } | ForumComment[];
            setThreadComments((prev) => ({
                ...prev,
                [postId]: Array.isArray(raw) ? raw : raw.data || [],
            }));
            await fetchForumData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to post reply.");
        } finally {
            setSubmittingCommentFor(null);
        }
    };

    const handleReportPost = async (postId: string) => {
        if (!isAuthenticated) return;
        const reason = prompt("Please describe why this post needs moderator review:");
        if (!reason || !reason.trim()) return;
        try {
            await apiClient.post(`/api/forum/posts/${postId}/report`, {
                reason: reason.trim(),
            });
            showToast("Reported to BDSisters moderators for review.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit report.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {toast && (
                    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-[#5B9891]/40 bg-white px-4 py-3 text-xs font-bold text-[#467A74] shadow-lg">
                        <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                        <span>{toast}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#5B9891]/15 via-white to-[#F7DFC7]/60 p-8 shadow-xs">
                    <div className="max-w-2xl space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5B9891]/15 px-3 py-1 text-xs font-bold text-[#467A74]">
                            <MessageSquare className="h-3.5 w-3.5" /> Safe Women-Only Discussions
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Sisterhood Community Forum
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Ask questions, share experiences, and grow together across faith, family, career,
                            and entrepreneurship.
                        </p>
                    </div>

                    {isAuthenticated ? (
                        <Link
                            href="/member/community"
                            className="inline-flex items-center gap-2 self-start md:self-center rounded-2xl bg-[#5B9891] px-5 py-3 text-xs font-bold text-white hover:bg-[#467A74] transition"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>Start a Discussion</span>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 self-start md:self-center rounded-2xl bg-[#D98408] px-5 py-3 text-xs font-bold text-white hover:bg-[#b86f06] transition"
                        >
                            <Lock className="h-4 w-4" />
                            <span>Sign In to Join Threads</span>
                        </Link>
                    )}
                </div>

                {/* Search & Wing/Category Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs">
                    <div className="sm:col-span-7 relative">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search topics, questions, or advice..."
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                        />
                    </div>

                    <div className="sm:col-span-5 relative">
                        <Filter className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs font-bold text-gray-800 focus:border-[#5B9891] focus:outline-hidden"
                        >
                            <option value="">All Sisterhood Wings & Categories</option>
                            {categories.map((cat, idx) => (
                                <option key={cat._id || idx} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Forum Threads List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
                        <p className="text-xs font-semibold text-gray-500">
                            Loading community discussions...
                        </p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200/80 bg-white p-14 text-center space-y-3">
                        <MessageSquare className="h-9 w-9 text-[#5B9891] mx-auto" />
                        <h3 className="text-base font-bold text-gray-900">
                            No Discussions Found Yet
                        </h3>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Be the first sister to start a meaningful conversation in the community!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {posts.map((post) => {
                            const isExpanded = expandedPostId === post._id;
                            const comments = threadComments[post._id] || [];
                            const likeCount = post.likesCount ?? post.likes?.length ?? 0;
                            const commentCount = post.commentsCount ?? comments.length;
                            const authorLabel = post.isAnonymous
                                ? "Anonymous Sister"
                                : post.authorId?.fullName || "Verified Sister";

                            return (
                                <article
                                    key={post._id}
                                    className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4"
                                >
                                    {/* Author & Wing Badge */}
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 text-xs">
                                            <div className="h-9 w-9 rounded-full bg-[#5B9891]/15 flex items-center justify-center overflow-hidden">
                                                {!post.isAnonymous && post.authorId?.profilePicture ? (
                                                    <img
                                                        src={post.authorId.profilePicture}
                                                        alt={authorLabel}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <UserCircle className="h-5 w-5 text-[#5B9891]" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{authorLabel}</p>
                                                <p className="text-[11px] text-gray-400">
                                                    {new Date(post.createdAt).toLocaleDateString("en-BD")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {(post.wingName || post.category) && (
                                                <span className="rounded-full bg-[#F7DFC7] px-3 py-1 text-[11px] font-bold text-[#D98408]">
                                                    {post.wingName || post.category}
                                                </span>
                                            )}
                                            {isAuthenticated && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReportPost(post._id)}
                                                    title="Report post"
                                                    className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                                                >
                                                    <Flag className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Post Title & Content (Teaser for Guests, Full for Members) */}
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>
                                        {isAuthenticated ? (
                                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                {post.content}
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center justify-between rounded-xl border border-[#D98408]/25 bg-[#F7DFC7]/35 px-4 py-2.5 text-xs">
                                                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                                                        <Lock className="h-3.5 w-3.5 text-[#D98408]" />
                                                        Full discussion and sister replies are protected for members.
                                                    </span>
                                                    <Link
                                                        href="/login"
                                                        className="font-bold text-[#D98408] hover:underline shrink-0"
                                                    >
                                                        Sign In →
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Interaction Footer */}
                                    <div className="pt-3 border-t border-gray-100 flex items-center gap-4 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => handleLikePost(post._id)}
                                            className="inline-flex items-center gap-1.5 font-bold text-gray-600 hover:text-rose-600 transition"
                                        >
                                            <Heart className="h-4 w-4" />
                                            <span>{likeCount} Support</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleToggleThread(post._id)}
                                            className="inline-flex items-center gap-1.5 font-bold text-[#5B9891] hover:text-[#467A74] transition"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            <span>
                                                {isExpanded
                                                    ? "Hide Replies"
                                                    : `View Replies (${commentCount})`}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Expanded Comments Thread (Members Only) */}
                                    {isExpanded && isAuthenticated && (
                                        <div className="pt-3 border-t border-gray-100 space-y-4">
                                            {loadingCommentsFor === post._id ? (
                                                <div className="flex justify-center py-4">
                                                    <Loader2 className="h-5 w-5 text-[#5B9891] animate-spin" />
                                                </div>
                                            ) : comments.length === 0 ? (
                                                <p className="text-xs text-gray-400">
                                                    No replies yet. Share a supportive response below.
                                                </p>
                                            ) : (
                                                <div className="space-y-2.5">
                                                    {comments.map((c) => (
                                                        <div
                                                            key={c._id}
                                                            className="rounded-xl bg-[#FAF8F5] border border-gray-100 p-3 text-xs space-y-1"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-[#467A74]">
                                                                    {c.authorId?.fullName || "Sister Member"}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">
                                                                    {new Date(c.createdAt).toLocaleDateString("en-BD")}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 leading-relaxed">
                                                                {c.comment || c.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Reply Form */}
                                            <form
                                                onSubmit={(e) => handleAddComment(e, post._id)}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    type="text"
                                                    value={commentInputs[post._id] || ""}
                                                    onChange={(e) =>
                                                        setCommentInputs((prev) => ({
                                                            ...prev,
                                                            [post._id]: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Write a respectful, helpful reply..."
                                                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={submittingCommentFor === post._id}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                                                >
                                                    <Send className="h-3.5 w-3.5" />
                                                    <span>Reply</span>
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}