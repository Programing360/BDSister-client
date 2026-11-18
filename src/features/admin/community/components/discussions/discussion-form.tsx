"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Pin,
  Lock,
} from "lucide-react";
import { Discussion, DiscussionStatus } from "../../types/community";
import { DEMO_COMMUNITY_CATEGORIES } from "../../data/mock-community";

interface DiscussionFormProps {
  initialData?: Discussion;
  isEdit?: boolean;
}

export function DiscussionForm({ initialData, isEdit = false }: DiscussionFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || DEMO_COMMUNITY_CATEGORIES[0]?.id || ""
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [status, setStatus] = useState<DiscussionStatus>(
    initialData?.status || "PUBLISHED"
  );
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);
  const [isLocked, setIsLocked] = useState(initialData?.isLocked || false);
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join(", ") : "Community, Networking"
  );
  const [adminNotes, setAdminNotes] = useState(initialData?.adminNotes || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedMessage(
        isEdit
          ? `Discussion "${title}" updated successfully (DEMO ONLY — local state).`
          : `New Discussion created successfully (DEMO ONLY — local state).`
      );
      setTimeout(() => {
        router.push("/admin/community/discussions");
      }, 1500);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/community/discussions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discussions
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
          {isEdit ? "Edit Discussion" : "Author Official Discussion"}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? `Edit: ${initialData?.title}` : "Create New Community Discussion"}
            </h1>
            <p className="text-xs text-gray-500">
              Publish official announcements, administrative guidelines, or seeded forum discussions.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Discussion Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Official DNCC Trade License Guide for 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none bg-white transition-all"
              >
                {DEMO_COMMUNITY_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Short Summary (Optional)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary appearing in notification digests..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={7}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the initial discussion post, formatting details, or sisterhood guidelines..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DiscussionStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none bg-white transition-all"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="LOCKED">Locked</option>
                <option value="ARCHIVED">Archived</option>
                <option value="REMOVED">Removed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Legal, DNCC, Boutique"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col justify-end space-y-2 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <Pin className="w-3.5 h-3.5 text-purple-600" />
                Pin to Category Header
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Lock Discussion (No New Replies)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Internal Admin Notes (Private)
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Approved during lead moderator sync for legal accuracy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              Demo changes update local state only; changes will not persist to MongoDB.
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/community/discussions"
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
                {isSubmitting ? "Saving..." : isEdit ? "Update Discussion" : "Publish Discussion"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
