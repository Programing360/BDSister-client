"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { BusinessCategoryItem } from "../types/admin-business.ts";
import { INITIAL_BUSINESS_CATEGORIES } from "../constants/business-categories.ts";
import {
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  ArrowLeft,
  Building2,
  Sparkles,
} from "lucide-react";

export function BusinessCategoriesView() {
  const [categories, setCategories] = useState<BusinessCategoryItem[]>(INITIAL_BUSINESS_CATEGORIES);
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<BusinessCategoryItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatNameBn, setNewCatNameBn] = useState("");
  const [newCatDescription, setNewCatDescription] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredCategories = categories.filter((cat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q) ||
      (cat.nameBn && cat.nameBn.includes(q))
    );
  });

  const handleToggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    setToastMessage("Category visibility toggled.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newSlug = newCatName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newCategory: BusinessCategoryItem = {
      id: `cat_${Date.now()}`,
      name: newCatName,
      nameBn: newCatNameBn || undefined,
      slug: newSlug,
      description: newCatDescription,
      icon: "Sparkles",
      businessCount: 0,
      isActive: true,
      sortOrder: categories.length + 1,
    };

    setCategories([...categories, newCategory]);
    setIsCreateOpen(false);
    setNewCatName("");
    setNewCatNameBn("");
    setNewCatDescription("");
    setToastMessage(`Category "${newCategory.name}" created successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteCategory = (cat: BusinessCategoryItem) => {
    if (cat.businessCount > 0) {
      setToastMessage(`Cannot delete category with ${cat.businessCount} active businesses. Please reassign them first.`);
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setToastMessage("Category deleted.");
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Businesses</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Business Categories Taxonomy</h1>
          <p className="text-xs text-gray-500">
            Manage product and craft taxonomy categories for Bangladeshi women artisans and enterprises.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#5B46F6] hover:bg-[#4f3ad8] rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-3 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or Bengali title..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 font-medium">
                <th className="py-3 px-4 font-semibold">Order</th>
                <th className="py-3 px-4 font-semibold">Category Name</th>
                <th className="py-3 px-4 font-semibold">Bengali Title</th>
                <th className="py-3 px-4 font-semibold">Slug Identifier</th>
                <th className="py-3 px-4 font-semibold">Businesses</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{cat.sortOrder || idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{cat.name}</div>
                    <div className="text-[11px] text-gray-400 line-clamp-1">{cat.description}</div>
                  </td>
                  <td className="py-3 px-4 font-serif text-gray-700">{cat.nameBn || "—"}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">{cat.slug}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      {cat.businessCount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(cat.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        cat.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        title="Delete category"
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Add Business Category</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Leather Crafts & Accessories"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Category Name (Bangla)</label>
                <input
                  type="text"
                  value={newCatNameBn}
                  onChange={(e) => setNewCatNameBn(e.target.value)}
                  placeholder="e.g. চামড়াজাত পণ্য ও এক্সেসরিজ"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  placeholder="Short description of products included..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#5B46F6] hover:bg-[#4f3ad8] text-white font-medium rounded-lg shadow-xs"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
