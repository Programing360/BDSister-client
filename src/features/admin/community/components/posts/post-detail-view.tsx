"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  EyeOff,
  Trash2,
  Edit,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Paperclip,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { CommunityPost } from "../../types/community";
import { PostStatusBadge } from "../common/community-status-badge";
import { DEMO_COMMUNITY_COMMENTS } from "../../data/mock-community";

interface PostDetailViewProps {
  post: CommunityPost;
}

export function PostDetailView({ post: initialData }: PostDetailViewProps) {
  const [post, setPost] = useState(initialData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const relatedComments = DEMO_COMMUNITY_COMMENTS.filter(
    (c) => c.postId === post.id
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = () => {
    setPost({ ...post, status: "PUBLISHED" });
    showToast("Post approved and published (DEMO ONLY).");
  };

  const handleReject = () => {
    setPost({ ...post, status: "REJECTED" });
    showToast("Post rejected (DEMO ONLY).");
  };

  const handleToggleHide = () => {
    const next = post.status === "HIDDEN" ? "PUBLISHED" : "HIDDEN";
    setPost({ ...post, status: next });
    showToast(`Post is now ${next} (DEMO ONLY).`);
  };

  const handleRemove = () => {
    setPost({ ...post, status: "REMOVED" });
    showToast("Post removed from community (DEMO ONLY).");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/admin/community/posts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {post.status === "PENDING_REVIEW" && (
            <>
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve Post
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Post
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleToggleHide}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              post.status === "HIDDEN"
                ? "border-purple-300 bg-purple-50 text-purple-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            {post.status === "HIDDEN" ? "Unhide" : "Hide"}
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>

          <Link
            href={`/admin/community/posts/${post.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Post Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
                {post.id}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-100 text-purple-700">
                {post.categoryName}
              </span>
              <PostStatusBadge status={post.status} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {post.title || "Community Forum Post Entry"}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
              <span>Parent Discussion:</span>
              <Link
                href={`/admin/community/discussions/${post.discussionId}`}
                className="font-semibold text-purple-600 hover:underline flex items-center gap-1"
              >
                {post.discussionTitle}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Author Badge */}
          <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-gray-900">{post.author.name}</p>
                {post.author.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                )}
              </div>
              <p className="text-[11px] text-gray-500">@{post.author.username} • {post.author.memberRole}</p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>

          {/* Attachments */}
          {post.mediaAttachments && post.mediaAttachments.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-gray-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                Attachments ({post.mediaAttachments.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {post.mediaAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-gray-900 truncate">{att.name}</p>
                      <span className="text-[11px] text-gray-400">{att.sizeKB} KB • {att.type}</span>
                    </div>
                    <span className="text-xs text-purple-600 font-semibold shrink-0">
                      Verified Safe
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-gray-100 bg-purple-50/30">
            <span className="text-xs font-semibold text-gray-500">Reactions</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{post.reactionsCount}</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-blue-50/30">
            <span className="text-xs font-semibold text-gray-500">Comments</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{post.commentsCount}</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-emerald-50/30">
            <span className="text-xs font-semibold text-gray-500">Submitted</span>
            <p className="text-xs font-semibold text-gray-900 mt-2">
              {new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Admin Notes */}
        {post.adminNotes && (
          <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 text-xs">
            <span className="font-bold text-purple-900 block mb-1">
              Internal Administrator Notes:
            </span>
            <p className="text-purple-800">{post.adminNotes}</p>
          </div>
        )}

        {/* Linked Comments Preview */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            Comments on this Post ({relatedComments.length})
          </h3>

          {relatedComments.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-4 text-center">
              No replies to this specific post yet.
            </p>
          ) : (
            <div className="space-y-2">
              {relatedComments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{c.author.name}</span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
