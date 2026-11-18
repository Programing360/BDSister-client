"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { CommunityPost, PostStatus } from "../../types/community";

interface PostFormProps {
  initialData: CommunityPost;
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content);
  const [status, setStatus] = useState<PostStatus>(initialData.status);
  const [adminNotes, setAdminNotes] = useState(initialData.adminNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedMessage(
        `Post ${initialData.id} updated successfully (DEMO ONLY — local state).`
      );
      setTimeout(() => {
        router.push("/admin/community/posts");
      }, 1500);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/community/posts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
          Edit Community Post
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Edit Post ({initialData.id})
            </h1>
            <p className="text-xs text-gray-500">
              Authored by <span className="font-semibold text-gray-700">{initialData.author.name}</span> in &ldquo;{initialData.discussionTitle}&rdquo;
            </p>
          </div>
        </div>

        {submittedMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Post Headline / Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Price Breakdown for Artisan Saris"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Post Body <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={7}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Moderation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none bg-white transition-all"
              >
                <option value="PUBLISHED">Published</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="HIDDEN">Hidden</option>
                <option value="REJECTED">Rejected</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
                <option value="REMOVED">Removed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Internal Administrative Notes
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Moderator reason or revision log..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              Demo changes update local state only; changes will not persist to MongoDB.
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/community/posts"
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Update Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
