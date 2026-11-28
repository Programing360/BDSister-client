"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    MessageSquare,
    Plus,
    Heart,
    Flag,
    RefreshCw,
    Send,
    CheckCircle2,
    AlertCircle,
    Loader2,
    User,
    CornerDownRight,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface PostComment {
    _id?: string;
    content: string;
    authorId?: { fullName?: string };
    createdAt?: string;
}

interface ForumPost {
    _id: string;
    title: string;
    content: string;
    category?: string;
    authorId?: { fullName?: string; headline?: string };
    likes?: string[];
    likesCount?: number;
    comments?: PostComment[];
    commentsCount?: number;
    createdAt: string;
}

const FORUM_CATEGORIES = [
    "Faith & Personal Growth",
    "Family & Parenting",
    "Sisters in Business",
    "Health & Wellness",
    "Skills Exchange (Ask & Offer)",
];

export function MemberCommunityView() {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Create Post Form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(FORUM_CATEGORIES[0]);
    const [content, setContent] = useState("");

    // Comment Reply State per Post
    const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: ForumPost[] }>(
                API_ENDPOINTS.forum.posts
            );
            const raw = res as unknown as { data?: ForumPost[] } | ForumPost[];
            setPosts(Array.isArray(raw) ? raw : raw.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load forum discussions.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsPosting(true);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.forum.createPost, {
                title: title.trim(),
                category,
                content: content.trim(),
            });
            setTitle("");
            setContent("");
            setShowCreateForm(false);
            showToast("Your discussion topic has been published to the sisterhood!");
            await fetchPosts();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Only verified Paid Members can start new discussions."
            );
        } finally {
            setIsPosting(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent, postId: string) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setIsCommenting(true);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.forum.addComment(postId), {
                comment: commentText.trim(),
                content: commentText.trim(),
            });
            setCommentText("");
            showToast("Reply posted!");
            await fetchPosts();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Only Paid Members can post replies in the forum."
            );
        } finally {
            setIsCommenting(false);
        }
    };

    const handleLikePost = async (postId: string) => {
        try {
            await apiClient.post(API_ENDPOINTS.forum.like(postId));
            await fetchPosts();
        } catch {
            // Ignore silent toggle errors
        }
    };

    const handleReportPost = async (postId: string) => {
        if (!confirm("Report this post to female moderators for adab/policy review?")) return;
        try {
            await apiClient.post(API_ENDPOINTS.forum.report(postId), {
                reason: "Flagged by sister member for moderation review",
            });
            showToast("Thank you. Moderators have been notified.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit report.");
        }
    };

    const visiblePosts =
        selectedCategory === "ALL"
            ? posts
            : posts.filter((p) => p.category === selectedCategory);

    return (
        <div className="space-y-6 pb-14">
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Sisterhood Community Forums
                        </h1>
                        <SectionHelpTooltip
                            title="Safe Women-Only Dialogue"
                            explanation="Discuss faith, family, entrepreneurship, wellness, and skill exchange in a respectful, moderated environment."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Connect, ask questions, share barakah, and collaborate with verified sisters.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchPosts}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#5B9891]/30 bg-white px-3.5 py-2 text-xs font-bold text-[#5B9891]"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowCreateForm((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Start Discussion</span>
                    </button>
                </div>
            </div>

            {/* Create Post Form */}
            {showCreateForm && (
                <form
                    onSubmit={handleCreatePost}
                    className="rounded-2xl border border-[#5B9891]/30 bg-white p-6 shadow-2xs space-y-4 text-xs"
                >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h2 className="text-sm font-bold text-gray-900">New Sisterhood Discussion</h2>
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                            className="text-gray-400 hover:text-gray-700 font-bold"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block font-bold text-gray-700 mb-1">Topic Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What would you like to discuss or ask?"
                                className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-gray-900"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 font-semibold text-gray-900"
                            >
                                {FORUM_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Message / Details *</label>
                        <textarea
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts respectfully..."
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-gray-900"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPosting}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#D98408] px-5 py-2 text-xs font-bold text-white hover:bg-[#b86f06] transition"
                    >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isPosting ? "Publishing..." : "Publish Topic"}</span>
                    </button>
                </form>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setSelectedCategory("ALL")}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${selectedCategory === "ALL"
                            ? "bg-[#5B9891] text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-[#FAF8F5]"
                        }`}
                >
                    All Topics ({posts.length})
                </button>

                {FORUM_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${selectedCategory === cat
                                ? "bg-[#5B9891] text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-[#FAF8F5]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Discussions Feed */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin" />
                </div>
            ) : visiblePosts.length === 0 ? (
                <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center text-xs text-gray-400">
                    No discussions found in this category yet. Start the first conversation!
                </div>
            ) : (
                <div className="space-y-4">
                    {visiblePosts.map((post) => {
                        const likesTotal = post.likesCount ?? post.likes?.length ?? 0;
                        const commentsList = post.comments || [];
                        const repliesCount = post.commentsCount ?? commentsList.length;
                        const isExpanded = openCommentsPostId === post._id;

                        return (
                            <div
                                key={post._id}
                                className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-3"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5B9891]/15 text-[#467A74]">
                                            <User className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {post.authorId?.fullName || "Sister Member"}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                            {post.category || "General"}
                                        </span>
                                    </div>

                                    <span className="text-[11px] text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString("en-BD")}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-gray-900">{post.title}</h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-gray-600 whitespace-pre-line">
                                        {post.content}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleLikePost(post._id)}
                                            className="inline-flex items-center gap-1.5 font-bold text-gray-600 hover:text-rose-600 transition"
                                        >
                                            <Heart className="h-4 w-4 text-rose-500" />
                                            <span>{likesTotal} Appreciate</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenCommentsPostId(isExpanded ? null : post._id);
                                                setCommentText("");
                                            }}
                                            className="inline-flex items-center gap-1.5 font-bold text-[#467A74] hover:underline"
                                        >
                                            <MessageSquare className="h-4 w-4 text-[#5B9891]" />
                                            <span>{repliesCount} Replies</span>
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleReportPost(post._id)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-rose-600"
                                    >
                                        <Flag className="h-3.5 w-3.5" /> Report
                                    </button>
                                </div>

                                {/* Replies & Add Comment Section (POST /api/forum/posts/:id/comment) */}
                                {isExpanded && (
                                    <div className="mt-3 space-y-3 rounded-xl bg-[#FAF8F5] p-4 border border-gray-100">
                                        {commentsList.length > 0 && (
                                            <div className="space-y-2">
                                                {commentsList.map((c, idx) => (
                                                    <div
                                                        key={c._id || idx}
                                                        className="flex items-start gap-2 rounded-lg bg-white p-2.5 border border-gray-100 text-xs"
                                                    >
                                                        <CornerDownRight className="h-3.5 w-3.5 text-[#5B9891] shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="font-bold text-gray-900">
                                                                {c.authorId?.fullName || "Sister"}:{" "}
                                                            </span>
                                                            <span className="text-gray-700">{c.content}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <form
                                            onSubmit={(e) => handleAddComment(e, post._id)}
                                            className="flex gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Write a supportive reply..."
                                                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={isCommenting}
                                                className="inline-flex items-center gap-1 rounded-xl bg-[#5B9891] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#467A74]"
                                            >
                                                <Send className="h-3.5 w-3.5" />
                                                <span>{isCommenting ? "..." : "Reply"}</span>
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}