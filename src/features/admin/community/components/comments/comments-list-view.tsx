"use client";

import React, { useState } from "react";
import {
  MessagesSquare,
  Search,
  CheckCircle,
} from "lucide-react";
import { DEMO_COMMUNITY_COMMENTS } from "../../data/mock-community";
import { CommunityComment } from "../../types/community";
import { CommentTable } from "./comment-table";
import { CommentDetailDrawer } from "./comment-detail-drawer";

export function CommentsListView() {
  const [comments, setComments] = useState<CommunityComment[]>(DEMO_COMMUNITY_COMMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedComment, setSelectedComment] = useState<CommunityComment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast(`Comment ${id} approved (DEMO ONLY).`);
          return { ...c, status: "PUBLISHED" };
        }
        return c;
      })
    );
  };

  const handleReject = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast(`Comment ${id} rejected (DEMO ONLY).`);
          return { ...c, status: "REJECTED" };
        }
        return c;
      })
    );
  };

  const handleToggleHide = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === "HIDDEN" ? "PUBLISHED" : "HIDDEN";
          showToast(`Comment ${id} is now ${next} (DEMO ONLY).`);
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  const handleRemove = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast(`Comment ${id} removed (DEMO ONLY).`);
          return { ...c, status: "REMOVED" };
        }
        return c;
      })
    );
  };

  const filtered = comments.filter((c) => {
    const matchesSearch =
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.postTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <MessagesSquare className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-gray-900">
            Comments & Replies Management
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Review community replies, inspect flagged responses, and maintain healthy discussion conduct.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search comments by text, author, or thread..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
        >
          <option value="ALL">All Statuses ({comments.length})</option>
          <option value="PUBLISHED">Published</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="HIDDEN">Hidden</option>
          <option value="REJECTED">Rejected</option>
          <option value="REMOVED">Removed</option>
        </select>
      </div>

      {/* Comments Table */}
      <CommentTable
        comments={filtered}
        onInspect={(c) => setSelectedComment(c)}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleHide={handleToggleHide}
        onRemove={handleRemove}
      />

      {/* Drawer */}
      <CommentDetailDrawer
        comment={selectedComment}
        onClose={() => setSelectedComment(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleHide={handleToggleHide}
        onRemove={handleRemove}
      />
    </div>
  );
}
