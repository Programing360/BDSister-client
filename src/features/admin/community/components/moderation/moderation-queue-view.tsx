"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { DEMO_MODERATION_QUEUE } from "../../data/mock-community";
import { ModerationQueueItem } from "../../types/community";
import { ModerationQueueTable } from "./moderation-queue-table";
import { ModerationReviewModal } from "./moderation-review-modal";

export function ModerationQueueView() {
  const [items, setItems] = useState<ModerationQueueItem[]>(DEMO_MODERATION_QUEUE);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<ModerationQueueItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDecision = (
    id: string,
    action: "APPROVED" | "REJECTED" | "NEEDS_CHANGES",
    note: string
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = action;
          showToast(`Content ${id} marked as ${action} (DEMO ONLY — simulated moderation).`);
          return {
            ...item,
            reviewStatus: nextStatus,
            internalNotes: note,
            history: [
              {
                action: `MOD_DECISION_${action}`,
                actor: "Admin (You)",
                timestamp: new Date().toISOString(),
                note,
              },
              ...item.history,
            ],
          };
        }
        return item;
      })
    );
  };

  const handleQuickApprove = (id: string) => {
    handleDecision(id, "APPROVED", "Quick approved by admin from queue toolbar.");
  };

  const handleQuickReject = (id: string) => {
    handleDecision(id, "REJECTED", "Quick rejected by admin from queue toolbar.");
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.contentPreview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || item.contentType === typeFilter;
    const matchesPriority =
      priorityFilter === "ALL" || item.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "ALL" || item.reviewStatus === statusFilter;
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-amber-500/5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-gray-900">
            Content Moderation Queue
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Review reported or heuristic-flagged discussions, posts, and comments before they index publicly.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p>
          <strong className="font-semibold">DEMO MODERATION ACTION ENGINE</strong> — Decisions executed in this queue mutate local UI state only. Decisions do not alter live database entries or member account reputations.
        </p>
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
            placeholder="Search queue by keyword, author or reason..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="DISCUSSION">Discussions</option>
            <option value="POST">Posts</option>
            <option value="COMMENT">Comments</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent ⚡</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Queue Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="NEEDS_CHANGES">Needs Changes</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Moderation Queue Table */}
      <ModerationQueueTable
        items={filtered}
        onReview={(item) => setSelectedItem(item)}
        onQuickApprove={handleQuickApprove}
        onQuickReject={handleQuickReject}
      />

      {/* Modal */}
      <ModerationReviewModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDecision={handleDecision}
      />
    </div>
  );
}
