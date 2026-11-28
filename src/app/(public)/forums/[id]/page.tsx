"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    MessageSquare,
    ShieldCheck,
    CheckCircle2,
    Lock,
    ArrowLeft,
    ArrowRight,
    MessageCircle,
    ThumbsUp,
    Share2,
    Bookmark,
    ChevronRight,
    Send,
    AlertCircle,
    Clock,
    UserCheck,
    Loader2,
    Flag,
    Sparkles,
    Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ForumCommentItem {
    id?: string;
    _id?: string;
    authorSister: string;
    avatar?: string;
    isVerified?: boolean;
    postedAt: string;
    content: string;
    likes?: number;
}

interface ForumDetailItem {
    id: string;
    _id?: string;
    title: string;
    content: string;
    category: string;
    wingName?: string;
    authorSister: string;
    authorAvatar?: string;
    isVerifiedMember: boolean;
    postedAt: string;
    replyCount: number;
    likesCount: number;
    views?: number;
    viewCount?: number;
    isLiked?: boolean;
    isTeaser?: boolean;
    ctaMessage?: string;
    comments: ForumCommentItem[];
    tags?: string[];
}

export default function ForumPostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const postId = (params?.id as string) || "";

    const [post, setPost] = useState<ForumDetailItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Comment submission state
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [commentSuccess, setCommentSuccess] = useState<string | null>(null);

    // Like / Report state
    const [likesCount, setLikesCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
    const [reportedSuccess, setReportedSuccess] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && postId) {
            const saved = localStorage.getItem(`forum_bookmark_${postId}`);
            if (saved === "true") setIsBookmarked(true);
        }
    }, [postId]);

    const handleToggleBookmark = () => {
        const nextState = !isBookmarked;
        setIsBookmarked(nextState);
        if (typeof window !== "undefined" && postId) {
            localStorage.setItem(`forum_bookmark_${postId}`, String(nextState));
        }
    };

    const fetchPostDetail = useCallback(async () => {
        if (!postId) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<any>(API_ENDPOINTS.forum.postDetail(postId));
            const raw = res as any;
            const p = raw?.data || raw?.post || raw;

            if (p && (p._id || p.id || p.content)) {
                const id = p._id || p.id || postId;
                const authorSister =
                    p.authorId?.fullName || p.author?.name || "Sister Member";
                const isVerifiedMember =
                    p.authorId?.role !== "Guest" && p.authorId?.role !== undefined;
                const dateStr = p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "Recently";

                const commentsList: ForumCommentItem[] = Array.isArray(p.comments)
                    ? p.comments.map((c: any, idx: number) => ({
                        id: c._id || `c-${idx}`,
                        authorSister: c.commenterId?.fullName || c.authorSister || "Sister Member",
                        avatar: c.commenterId?.profilePicture,
                        isVerified: true,
                        postedAt: c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                            : "Recently",
                        content: c.comment || c.content || "",
                        likes: 1,
                    }))
                    : [];

                const mapped: ForumDetailItem = {
                    id,
                    _id: p._id || id,
                    title: p.title || (p.content ? p.content.split("\n")[0].slice(0, 80) : "Discussion Thread"),
                    content: p.content || "",
                    category: p.category || p.wingName || "General",
                    wingName: p.wingName,
                    authorSister,
                    authorAvatar: p.authorId?.profilePicture,
                    isVerifiedMember,
                    postedAt: dateStr,
                    replyCount: p.commentCount ?? commentsList.length,
                    likesCount: p.likesCount ?? 0,
                    views: p.views ?? p.viewCount ?? 0,
                    viewCount: p.viewCount ?? p.views ?? 0,
                    isLiked: p.isLiked ?? false,
                    isTeaser: p.isTeaser,
                    ctaMessage: p.ctaMessage,
                    comments: commentsList,
                    tags: p.tags || ["#Sisterhood", "#SafeDiscussion"],
                };

                setPost(mapped);
                setLikesCount(mapped.likesCount);
                setHasLiked(Boolean(mapped.isLiked));
            } else {
                throw new Error("Discussion post not found.");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load discussion.");
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPostDetail();
    }, [fetchPostDetail]);

    // Handle Comment Submission
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        if (!isAuthenticated) {
            router.push(`/login?redirect=/forums/${postId}`);
            return;
        }

        setIsSubmittingComment(true);
        setCommentError(null);
        setCommentSuccess(null);

        try {
            const targetId = post?._id || postId;
            await apiClient.post(API_ENDPOINTS.forum.addComment(targetId), {
                comment: commentText.trim(),
                content: commentText.trim(),
            });

            const newComment: ForumCommentItem = {
                id: `c-local-${Date.now()}`,
                authorSister: (user as any)?.fullName || user?.name || "You (Verified Sister)",
                avatar: ((user as any)?.profilePicture || user?.image) ?? undefined,
                isVerified: true,
                postedAt: "Just now",
                content: commentText.trim(),
                likes: 1,
            };

            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        comments: [...prev.comments, newComment],
                        replyCount: prev.replyCount + 1,
                    }
                    : null
            );

            setCommentText("");
            setCommentSuccess("Jazakillahu Khairan! Your reply has been shared.");
            setTimeout(() => setCommentSuccess(null), 4000);
        } catch (err: unknown) {
            setCommentError(
                err instanceof Error ? err.message : "Failed to submit comment."
            );
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Handle Like
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/forums/${postId}`);
            return;
        }
        try {
            const targetId = post?._id || postId;
            await apiClient.post(API_ENDPOINTS.forum.like(targetId), {});
            setHasLiked((prev) => !prev);
            setLikesCount((prev) => (hasLiked ? Math.max(0, prev - 1) : prev + 1));
        } catch {
            // Ignore non-fatal like error
        }
    };

    // Handle Report
    const handleReport = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/forums/${postId}`);
            return;
        }
        setIsReporting(true);
        try {
            const targetId = post?._id || postId;
            await apiClient.post(API_ENDPOINTS.forum.report(targetId), {
                reason: "Reported by community member for moderator review.",
            });
            setReportedSuccess(true);
        } catch {
            // non-fatal
        } finally {
            setIsReporting(false);
        }
    };

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    // Section 11 Guest Tiered Access:
    // If user is unauthenticated or post explicitly flagged as teaser
    const isGuest = !isAuthenticated || Boolean(post?.isTeaser);
    const teaserContent = post?.content
        ? post.content.length > 200
            ? `${post.content.slice(0, 200)}...`
            : post.content
        : "";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#5B9891]" />
                <p className="text-sm font-semibold text-stone-600">
                    Loading discussion thread...
                </p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] py-16 px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#F7DFC7] p-8 text-center space-y-4 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#111E28]">
                        Discussion Not Found
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600">
                        {error || "This discussion thread may have been moved or removed by community moderators."}
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/forums"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B9891] text-white font-bold text-xs hover:bg-[#4a807a] transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Forums</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#111E28] pb-24">
            {/* Header & Breadcrumb */}
            <div className="bg-white border-b border-[#F7DFC7] pt-6 pb-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
                        <Link href="/" className="hover:text-[#5B9891] transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        <Link href="/forums" className="hover:text-[#5B9891] transition-colors">
                            Forums
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-semibold text-[#111E28] line-clamp-1 max-w-xs">
                            {post.category}
                        </span>
                    </nav>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7DFC7] text-[#111E28] border border-[#F2B55D]/40">
                            {post.category}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.postedAt}</span>
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#D98408]" />
                            <span>{(post.views ?? post.viewCount ?? 0)} views</span>
                        </span>
                    </div>

                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111E28] leading-tight">
                        {post.title}
                    </h1>

                    {/* Author Meta */}
                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#5B9891]/15 text-[#5B9891] border border-[#5B9891]/30 flex items-center justify-center font-bold text-sm overflow-hidden">
                                {post.authorAvatar ? (
                                    <img
                                        src={post.authorAvatar}
                                        alt={post.authorSister}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    post.authorSister.charAt(0)
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#111E28]">
                                        {post.authorSister}
                                    </span>
                                    {post.isVerifiedMember && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5B9891]" />
                                    )}
                                </div>
                                <span className="text-[11px] text-stone-500">
                                    Verified Sisterhood Member
                                </span>
                            </div>
                        </div>

                        {/* Action buttons (Bookmark / Share / Report) */}
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                            <button
                                type="button"
                                onClick={handleToggleBookmark}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition shadow-2xs ${isBookmarked
                                    ? "bg-[#5B9891] text-white border-[#5B9891]"
                                    : "bg-[#FAF8F5] border-[#F7DFC7] text-stone-700 hover:bg-stone-100"
                                    }`}
                            >
                                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-white text-white" : "text-stone-600"}`} />
                                <span>{isBookmarked ? "Subscribed" : "Subscribe / Bookmark"}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#F7DFC7] text-stone-700 hover:bg-stone-100 transition"
                            >
                                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                                <span>{copiedLink ? "Copied!" : "Share"}</span>
                            </button>

                            {isAuthenticated && (
                                <button
                                    type="button"
                                    onClick={handleReport}
                                    disabled={reportedSuccess || isReporting}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#F7DFC7] text-stone-500 hover:text-rose-600 transition"
                                >
                                    <Flag className="w-3.5 h-3.5" />
                                    <span>{reportedSuccess ? "Reported" : "Report"}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thread Body & Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
                {/* Main Post Card */}
                <div className="bg-white rounded-3xl border border-[#F7DFC7] p-6 sm:p-8 shadow-xs relative overflow-hidden">
                    {/* Content */}
                    <div className="relative">
                        <p className="text-sm sm:text-base text-stone-800 leading-relaxed whitespace-pre-line">
                            {isGuest ? teaserContent : post.content}
                        </p>

                        {/* Section 11 Guest Locked Teaser Mask */}
                        {isGuest && (
                            <div className="mt-4 pt-6 border-t border-[#F7DFC7]/60">
                                <div className="rounded-2xl border-2 border-[#D98408]/30 bg-gradient-to-b from-[#F7DFC7]/20 to-[#FAF8F5] p-6 sm:p-8 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-[#D98408]/15 text-[#D98408] border border-[#D98408]/30 flex items-center justify-center mx-auto">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111E28]">
                                            Sisterhood Sanctuary: Protected Discussion
                                        </h3>
                                        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                                            This discussion thread and replies are protected within our verified Muslim sisterhood sanctuary to preserve privacy and spiritual adab.
                                        </p>
                                    </div>

                                    {/* Section 11 Required CTA Button */}
                                    <div className="pt-2">
                                        <Link
                                            href={`/register?redirect=/forums/${post.id}`}
                                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#D98408] hover:bg-[#b86f06] text-white font-bold text-sm shadow-md transition-all hover:scale-102"
                                        >
                                            <span>Be a member to read the post. It&apos;s Free</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <p className="text-xs text-stone-500">
                                        Already a member?{" "}
                                        <Link
                                            href={`/login?redirect=/forums/${post.id}`}
                                            className="font-bold text-[#5B9891] hover:underline"
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Post Footer: Tags & Like Button (Member view) */}
                    {!isGuest && (
                        <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                                {post.tags?.map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs font-semibold text-stone-600 bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#F7DFC7]"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleToggleLike}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition shadow-2xs ${hasLiked
                                    ? "bg-[#5B9891] text-white"
                                    : "bg-[#FAF8F5] border border-[#F7DFC7] text-stone-700 hover:bg-[#F7DFC7]/60"
                                    }`}
                            >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{likesCount} Likes</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Comments / Replies Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F7DFC7] pb-3">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-[#5B9891]" />
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111E28]">
                                Discussion Replies ({post.comments.length})
                            </h3>
                        </div>
                        <span className="text-xs text-stone-500">
                            Adheres to Islamic Adab & Sisterhood Privacy
                        </span>
                    </div>

                    {/* Member Reply Box */}
                    {!isGuest ? (
                        <form
                            onSubmit={handleAddComment}
                            className="bg-white rounded-3xl border border-[#F7DFC7] p-5 sm:p-6 space-y-3 shadow-2xs"
                        >
                            <label className="block text-xs font-bold text-[#111E28]">
                                Share an Insightful Reflection / Reply
                            </label>
                            <textarea
                                rows={3}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your verified reflection adhering to sisterhood adab..."
                                className="w-full p-3 rounded-2xl bg-[#FAF8F5] border border-[#F7DFC7] text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5B9891]"
                            />

                            {commentError && (
                                <p className="text-xs font-semibold text-rose-600">
                                    {commentError}
                                </p>
                            )}
                            {commentSuccess && (
                                <p className="text-xs font-semibold text-emerald-600">
                                    {commentSuccess}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[11px] text-stone-400">
                                    Posted as {(user as any)?.fullName || user?.name || "Verified Sister"}
                                </span>
                                <button
                                    type="submit"
                                    disabled={!commentText.trim() || isSubmittingComment}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#5B9891] hover:bg-[#4a807a] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
                                >
                                    {isSubmittingComment ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" />
                                    )}
                                    <span>Post Reply</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-[#F7DFC7] p-6 text-center text-xs text-stone-600 space-y-2">
                            <Lock className="w-5 h-5 text-[#D98408] mx-auto" />
                            <p className="font-semibold text-[#111E28]">
                                Join the Conversation
                            </p>
                            <p>
                                Verified members can reply, share advice, and barter skills directly in this thread.
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    {!isGuest && post.comments.length > 0 ? (
                        <div className="space-y-3">
                            {post.comments.map((comment) => (
                                <div
                                    key={comment.id || comment._id}
                                    className="bg-white rounded-2xl border border-[#F7DFC7]/80 p-5 space-y-2 hover:border-[#5B9891]/40 transition"
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 font-bold text-[#111E28]">
                                            <div className="w-7 h-7 rounded-full bg-[#5B9891]/15 text-[#5B9891] flex items-center justify-center text-xs font-bold overflow-hidden">
                                                {comment.avatar ? (
                                                    <img
                                                        src={comment.avatar}
                                                        alt={comment.authorSister}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    comment.authorSister.charAt(0)
                                                )}
                                            </div>
                                            <span>{comment.authorSister}</span>
                                            {comment.isVerified && (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B9891]" />
                                            )}
                                        </div>
                                        <span className="text-[11px] text-stone-400">
                                            {comment.postedAt}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-9 whitespace-pre-line">
                                        {comment.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : !isGuest ? (
                        <div className="text-center py-8 text-xs text-stone-500 bg-white rounded-2xl border border-[#F7DFC7]">
                            No replies yet. Be the first sister to share guidance!
                        </div>
                    ) : null}
                </div>

                {/* Back to Forums Footer Link */}
                <div className="pt-4 text-center">
                    <Link
                        href="/forums"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#5B9891] hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Forum Circles</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
