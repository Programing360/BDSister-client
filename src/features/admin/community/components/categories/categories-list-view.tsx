"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Search,
  CheckCircle,
  Filter,
} from "lucide-react";
import { DEMO_COMMUNITY_CATEGORIES } from "../../data/mock-community";
import { CommunityCategory, CommunityCategoryStatus } from "../../types/community";
import { CategoryTable } from "./category-table";

export function CategoriesListView() {
  const [categories, setCategories] = useState<CommunityCategory[]>(DEMO_COMMUNITY_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) {
          const newStatus: CommunityCategoryStatus =
            cat.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          setToastMessage(
            `Category "${cat.name}" is now ${newStatus} (DEMO ONLY — local state).`
          );
          setTimeout(() => setToastMessage(null), 3500);
          return { ...cat, status: newStatus };
        }
        return cat;
      })
    );
  };

  const handleMoveOrder = (id: string, direction: "UP" | "DOWN") => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      if (direction === "UP" && idx === 0) return prev;
      if (direction === "DOWN" && idx === prev.length - 1) return prev;

      const targetIdx = direction === "UP" ? idx - 1 : idx + 1;
      const copy = [...prev];
      const temp = copy[idx];
      const target = copy[targetIdx];
      if (!temp || !target) return prev;
      copy[idx] = target;
      copy[targetIdx] = temp;

      // Update displayOrder numbers
      const renumbered = copy.map((cat, i) => ({
        ...cat,
        displayOrder: i + 1,
      }));

      setToastMessage(
        `Category order updated (DEMO ONLY — simulated drag/reorder).`
      );
      setTimeout(() => setToastMessage(null), 3000);
      return renumbered;
    });
  };

  const filtered = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <FolderTree className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900">
              Discussion Categories
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Organize forum taxonomy, reorder interest topics, and manage category lifecycles.
          </p>
        </div>

        <Link
          href="/admin/community/categories/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </Link>
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
            placeholder="Search categories by name, slug or description..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Statuses ({categories.length})</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <CategoryTable
        categories={filtered}
        onToggleStatus={handleToggleStatus}
        onMoveOrder={handleMoveOrder}
      />
    </div>
  );
}
