"use client";

import React, { useState } from "react";
import { forumService } from "@/lib/services/forum-service";
import type { ForumCategory, ForumPost } from "@/types/forum";
import { Button } from "@/components/ui/button";
import { X, Send, Sparkles, Tag, AlertCircle } from "lucide-react";

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ForumCategory[];
  onTopicCreated: (post: ForumPost) => void;
}

export function CreateTopicModal({
  isOpen,
  onClose,
  categories,
  onTopicCreated,
}: CreateTopicModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.name || "Business & Startup");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please provide both a topic title and detailed discussion content.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      const post = await forumService.createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
      });

      onTopicCreated(post);
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to create discussion topic.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Start a New Discussion</h2>
              <p className="text-xs text-text-secondary">
                Share a question, insight, or opportunity with the sisterhood.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-danger/10 p-3.5 text-xs text-danger font-medium border border-danger/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              Topic Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Recommended packaging suppliers in Old Dhaka for organic skincare?"
              className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Category Circle <span className="text-danger">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Tags (comma separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Packaging, Dhaka, Suppliers"
                  className="w-full rounded-2xl border border-border bg-surface/50 pl-10 pr-4 py-2.5 text-sm text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              Discussion Content <span className="text-danger">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide background context, questions, or specific details to help fellow sisters offer constructive guidance..."
              className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-3 text-sm text-text-primary focus:border-primary focus:bg-white focus:outline-hidden resize-none"
              required
            />
          </div>

          <div className="rounded-2xl bg-surface/60 p-3.5 border border-border/80 text-[11px] text-text-secondary">
            <strong className="text-text-primary">Sisterhood Safe Space Notice:</strong> All posts are reviewed by community moderators. Please keep conversations confidential, respectful, and free of commercial link spam.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="rounded-2xl gap-2 shadow-button"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Publishing..." : "Post Discussion"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
