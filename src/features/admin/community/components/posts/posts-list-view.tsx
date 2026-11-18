"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle,
} from "lucide-react";
import { DEMO_COMMUNITY_POSTS, DEMO_COMMUNITY_CATEGORIES } from "../../data/mock-community";
import { CommunityPost } from "../../types/community";
import { PostTable } from "./post-table";

export function PostsListView() {
  const [posts, setPosts] = useState<CommunityPost[]>(DEMO_COMMUNITY_POSTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          showToast(`Post ${id} approved and published (DEMO ONLY).`);
          return { ...p, status: "PUBLISHED" };
        }
        return p;
      })
    );
  };

  const handleReject = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          showToast(`Post ${id} rejected (DEMO ONLY).`);
          return { ...p, status: "REJECTED" };
        }
        return p;
      })
    );
  };

  const handleToggleHide = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = p.status === "HIDDEN" ? "PUBLISHED" : "HIDDEN";
          showToast(`Post ${id} is now ${next} (DEMO ONLY).`);
          return { ...p, status: next };
        }
        return p;
      })
    );
  };

  const filtered = posts.filter((p) => {
    const matchesSearch =
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.discussionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || p.categoryId === categoryFilter;
    const matchesStatus =
      statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900">
              Community Posts Moderation
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Audit individual posts, inspect attachments, approve submissions, and enforce content safety.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts by content, author, or thread..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Categories</option>
            {DEMO_COMMUNITY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Statuses ({posts.length})</option>
            <option value="PUBLISHED">Published</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="HIDDEN">Hidden</option>
            <option value="REJECTED">Rejected</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
            <option value="REMOVED">Removed</option>
          </select>
        </div>
      </div>

      {/* Post Table */}
      <PostTable
        posts={filtered}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleHide={handleToggleHide}
      />
    </div>
  );
}
