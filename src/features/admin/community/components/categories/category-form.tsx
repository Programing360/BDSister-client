"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderTree,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Sparkles,
  Laptop,
  GraduationCap,
  MapPin,
  CreditCard,
  Heart,
  BookOpen,
} from "lucide-react";
import { CommunityCategory, CommunityCategoryStatus } from "../../types/community";
import { DEMO_COMMUNITY_CATEGORIES } from "../../data/mock-community";

const availableIcons = [
  { name: "Briefcase", icon: Briefcase, label: "Business / Entrepreneurship" },
  { name: "Sparkles", icon: Sparkles, label: "Handicrafts / Art" },
  { name: "Laptop", icon: Laptop, label: "Tech / AI / Freelance" },
  { name: "GraduationCap", icon: GraduationCap, label: "Education / Mentorship" },
  { name: "MapPin", icon: MapPin, label: "Regional / Meetups" },
  { name: "CreditCard", icon: CreditCard, label: "Finance / Banking" },
  { name: "Heart", icon: Heart, label: "Health / Sisterhood" },
  { name: "BookOpen", icon: BookOpen, label: "Learning / Resources" },
];

interface CategoryFormProps {
  initialData?: CommunityCategory;
  isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "Briefcase");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [parentId, setParentId] = useState(initialData?.parentId || "");
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.displayOrder || 1);
  const [status, setStatus] = useState<CommunityCategoryStatus>(initialData?.status || "ACTIVE");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-")
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedMessage(
        isEdit
          ? `Category "${name}" updated successfully (DEMO ONLY — local simulation).`
          : `Category "${name}" created successfully (DEMO ONLY — local simulation).`
      );
      setTimeout(() => {
        router.push("/admin/community/categories");
      }, 1500);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/community/categories"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
          {isEdit ? "Editing Mode" : "New Creation Mode"}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? `Edit Category: ${initialData?.name}` : "Create Discussion Category"}
            </h1>
            <p className="text-xs text-gray-500">
              Define taxonomy, icons, display order, and moderation defaults for community discussions.
            </p>
          </div>
        </div>

        {submittedMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Women Entrepreneurs BD"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. women-entrepreneurs-bd"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State what topics belong here, target sisters, and posting guidelines..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Icon
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableIcons.map((ic) => {
                const IconComp = ic.icon;
                const isSelected = icon === ic.name;
                return (
                  <button
                    type="button"
                    key={ic.name}
                    onClick={() => setIcon(ic.name)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? "border-purple-500 bg-purple-50/80 text-purple-900 ring-2 ring-purple-200"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? "text-purple-700" : "text-gray-400"}`} />
                    <span className="truncate">{ic.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Image & Parent Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
              {coverImageUrl && (
                <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={coverImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Parent Category (Optional)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none bg-white transition-all"
                >
                  <option value="">None (Top-Level Category)</option>
                  {DEMO_COMMUNITY_CATEGORIES.filter((c) => c.id !== initialData?.id).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CommunityCategoryStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none bg-white transition-all"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notice & Submit Bar */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              Demo changes update local state only; changes will not persist to MongoDB.
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/community/categories"
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
                {isSubmitting ? "Saving..." : isEdit ? "Update Category" : "Publish Category"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
