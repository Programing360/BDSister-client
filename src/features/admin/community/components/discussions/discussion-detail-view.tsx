"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ArrowLeft,
  Pin,
  Lock,
  Unlock,
  Archive,
  Trash2,
  Edit,
  Eye,
  ThumbsUp,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Discussion } from "../../types/community";
import { DiscussionStatusBadge } from "../common/community-status-badge";
import { DEMO_COMMUNITY_POSTS } from "../../data/mock-community";

interface DiscussionDetailViewProps {
  discussion: Discussion;
}

export function DiscussionDetailView({ discussion: initialData }: DiscussionDetailViewProps) {
  const [discussion, setDiscussion] = useState(initialData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const relatedPosts = DEMO_COMMUNITY_POSTS.filter(
    (p) => p.discussionId === discussion.id
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTogglePin = () => {
    const next = !discussion.isPinned;
    setDiscussion({ ...discussion, isPinned: next });
    showToast(`Discussion ${next ? "pinned to top" : "unpinned"} (DEMO ONLY).`);
  };

  const handleToggleLock = () => {
    const next = !discussion.isLocked;
    const nextStatus = next ? "LOCKED" : "PUBLISHED";
    setDiscussion({ ...discussion, isLocked: next, status: nextStatus });
    showToast(`Discussion ${next ? "locked" : "unlocked"} for comments (DEMO ONLY).`);
  };

  const handleArchive = () => {
    setDiscussion({ ...discussion, status: "ARCHIVED" });
    showToast("Discussion archived (DEMO ONLY).");
  };

  const handleRemove = () => {
    setDiscussion({ ...discussion, status: "REMOVED" });
    showToast("Discussion removed from public view (DEMO ONLY).");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/admin/community/discussions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discussions
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePin}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              discussion.isPinned
                ? "border-purple-300 bg-purple-50 text-purple-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            {discussion.isPinned ? "Unpin" : "Pin"}
          </button>
          <button
            type="button"
            onClick={handleToggleLock}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              discussion.isLocked
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {discussion.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {discussion.isLocked ? "Unlock" : "Lock"}
          </button>
          <button
            type="button"
            onClick={handleArchive}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            Archive
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
          <Link
            href={`/admin/community/discussions/${discussion.id}/edit`}
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

      {/* Main Discussion Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-100 text-purple-700">
                {discussion.categoryName}
              </span>
              <DiscussionStatusBadge status={discussion.status} />
              {discussion.isPinned && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 flex items-center gap-1">
                  <Pin className="w-3 h-3 fill-current" /> Pinned
                </span>
              )}
              {discussion.isLocked && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
              <span className="text-xs font-mono text-gray-400">ID: {discussion.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {discussion.title}
            </h1>
          </div>

          {/* Author Badge */}
          <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center gap-3 shrink-0">
            {discussion.author.avatarUrl ? (
              <img
                src={discussion.author.avatarUrl}
                alt={discussion.author.name}
                className="w-10 h-10 rounded-full object-cover border border-purple-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                {discussion.author.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-gray-900">{discussion.author.name}</p>
                {discussion.author.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                )}
              </div>
              <p className="text-[11px] text-gray-500">{discussion.author.memberRole}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {discussion.content}
          </p>

          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {discussion.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Metric counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-gray-100 bg-purple-50/30">
            <span className="text-xs font-semibold text-gray-500">Replies</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{discussion.postsCount}</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-blue-50/30">
            <span className="text-xs font-semibold text-gray-500">Total Views</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{discussion.viewsCount}</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-pink-50/30">
            <span className="text-xs font-semibold text-gray-500">Likes</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{discussion.likesCount}</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-emerald-50/30">
            <span className="text-xs font-semibold text-gray-500">Created Date</span>
            <p className="text-xs font-semibold text-gray-900 mt-2">
              {new Date(discussion.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Admin Notes */}
        {discussion.adminNotes && (
          <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 text-xs">
            <span className="font-bold text-purple-900 block mb-1">
              Internal Administrator Notes:
            </span>
            <p className="text-purple-800">{discussion.adminNotes}</p>
          </div>
        )}

        {/* Moderation History */}
        {discussion.moderationHistory && discussion.moderationHistory.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Audit & Moderation History
            </h3>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/30 overflow-hidden">
              {discussion.moderationHistory.map((m, idx) => (
                <div key={idx} className="p-3 text-xs flex items-start justify-between gap-4">
                  <div>
                    <span className="font-semibold text-gray-900">{m.action}</span>
                    <span className="text-gray-400 mx-1.5">•</span>
                    <span className="text-gray-600 font-medium">{m.actor}</span>
                    <p className="text-gray-500 mt-0.5">{m.note}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {new Date(m.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts in Thread */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Related Posts in this Thread ({relatedPosts.length})
            </h3>
            <Link
              href="/admin/community/posts"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              Browse All Posts
            </Link>
          </div>

          {relatedPosts.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-4 text-center">
              No individual posts linked to this thread in mock data.
            </p>
          ) : (
            <div className="space-y-3">
              {relatedPosts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-gray-100 bg-white hover:bg-purple-50/10 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      By {p.author.name}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2">{p.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
