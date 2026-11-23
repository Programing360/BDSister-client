"use client";

import React, { useEffect, useState } from "react";
import { forumService } from "@/lib/services/forum-service";
import type { ForumPost, ForumComment } from "@/types/forum";
import { Button } from "@/components/ui/button";
import {
  X,
  Heart,
  MessageSquare,
  ShieldCheck,
  Send,
  Flag,
  Calendar,
  Share2,
} from "lucide-react";

interface ThreadDetailModalProps {
  post: ForumPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeToggle: (postId: string) => void;
  onReport: (post: ForumPost) => void;
}

export function ThreadDetailModal({
  post,
  isOpen,
  onClose,
  onLikeToggle,
  onReport,
}: ThreadDetailModalProps) {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setLoading(true);
      forumService
        .getComments(post.id)
        .then((data) => setComments(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const comment = await forumService.addComment(post.id, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-border overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-surface/50">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {post.category}
            </span>
            {post.isPinned && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">
                Pinned Topic
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReport(post)}
              className="flex items-center gap-1 rounded-xl p-2 text-xs font-medium text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
              title="Report topic"
            >
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Report</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Post Header */}
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary leading-tight">
              {post.title}
            </h1>

            {/* Author bar */}
            <div className="flex items-center justify-between border-y border-border/70 py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-surface border border-border shrink-0">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-sm text-primary bg-primary/10">
                      {post.author.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                    <span>{post.author.name}</span>
                    {post.author.isVerified && (
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span>{post.author.role || "Sisterhood Member"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Like CTA button */}
              <button
                onClick={() => onLikeToggle(post.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border transition-colors ${
                  post.isLiked
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-surface border-border text-text-secondary hover:text-rose-600 hover:bg-rose-50"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
                />
                <span>{post.likesCount}</span>
              </button>
            </div>
          </div>

          {/* Full Content */}
          <div className="prose prose-sm sm:prose max-w-none text-text-primary leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl bg-surface px-3 py-1 text-xs font-medium text-text-secondary border border-border/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-border pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Discussion Replies ({comments.length})</span>
              </h3>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-text-secondary">
                Loading discussion replies...
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-text-secondary">
                No replies yet. Be the first sister to offer guidance or answer!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-2xl border border-border/80 bg-surface/40 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary">
                          {comment.author.name}
                        </span>
                        {comment.author.isVerified && (
                          <ShieldCheck className="h-3 w-3 text-primary" />
                        )}
                        <span className="text-[11px] text-text-secondary">
                          ({comment.author.role || "Sister"})
                        </span>
                      </div>
                      <span className="text-[11px] text-text-secondary">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comment input footer */}
        <div className="border-t border-border/80 p-4 bg-surface/50">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share supportive advice or answer this sister..."
              className="flex-1 rounded-2xl border border-border bg-white px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:border-primary focus:outline-hidden"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting || !newComment.trim()}
              className="rounded-2xl gap-1.5 px-4 shadow-button"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? "Posting..." : "Reply"}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
