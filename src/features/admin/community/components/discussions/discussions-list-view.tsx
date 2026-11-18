"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";
import { DEMO_DISCUSSIONS, DEMO_COMMUNITY_CATEGORIES } from "../../data/mock-community";
import { Discussion } from "../../types/community";
import { DiscussionTable } from "./discussion-table";

export function DiscussionsListView() {
  const [discussions, setDiscussions] = useState<Discussion[]>(DEMO_DISCUSSIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTogglePin = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = !d.isPinned;
          showToast(`Discussion "${d.title}" ${next ? "pinned" : "unpinned"} (DEMO ONLY).`);
          return { ...d, isPinned: next };
        }
        return d;
      })
    );
  };

  const handleToggleLock = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = !d.isLocked;
          const nextStatus = next ? "LOCKED" : "PUBLISHED";
          showToast(`Discussion "${d.title}" ${next ? "locked" : "unlocked"} (DEMO ONLY).`);
          return { ...d, isLocked: next, status: nextStatus };
        }
        return d;
      })
    );
  };

  const handleArchive = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          showToast(`Discussion "${d.title}" archived (DEMO ONLY).`);
          return { ...d, status: "ARCHIVED" };
        }
        return d;
      })
    );
  };

  const filtered = discussions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || d.categoryId === categoryFilter;
    const matchesStatus =
      statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900">
              Community Discussions
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Browse, moderate, pin, lock, or archive community discussion threads.
          </p>
        </div>

        <Link
          href="/admin/community/discussions/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Discussion
        </Link>
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
            placeholder="Search discussions by title, author, or content..."
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
            <option value="ALL">All Statuses ({discussions.length})</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="LOCKED">Locked</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
            <option value="REMOVED">Removed</option>
          </select>
        </div>
      </div>

      {/* Discussion Table */}
      <DiscussionTable
        discussions={filtered}
        onTogglePin={handleTogglePin}
        onToggleLock={handleToggleLock}
        onArchive={handleArchive}
      />
    </div>
  );
}
