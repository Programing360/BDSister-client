"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  ArrowLeft,
  Save,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { ResourceCategory } from "../../types/resource";

interface CategoryFormProps {
  initialData?: ResourceCategory;
  isEdit?: boolean;
}

export function CategoryForm({
  initialData,
  isEdit = false,
}: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ResourceCategory>>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      icon: "Briefcase",
      coverImageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      status: "ACTIVE",
      displayOrder: 1,
      resourcesCount: 0,
    }
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug ? prev.slug : slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(
        `[DEMO] Category "${formData.name}" ${
          isEdit ? "updated" : "created"
        } successfully. Changes are simulated locally.`
      );
      setTimeout(() => {
        router.push("/admin/resources/categories");
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          data-aos="fade-down"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-brand-navy/95 text-white rounded-xl shadow-[0_12px_36px_rgba(91,70,246,0.3)] border border-brand-primary/40 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/resources/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          {isEdit ? "Edit Category" : "New Resource Category"}
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="50"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO MODE:</span> Category creation and updates are isolated client-side demonstrations.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="100"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-6"
      >
        <div className="border-b border-brand-primary/10 pb-3">
          <h2 className="text-lg font-semibold text-brand-navy">
            Category Properties
          </h2>
          <p className="text-xs text-brand-muted font-normal">
            Configure learning taxonomy domain, slug, and cover banner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={handleNameChange}
              placeholder="e.g. Entrepreneurship & MSME"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Slug Identifier
            </label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="category-slug"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              min={1}
              value={formData.displayOrder ?? 1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayOrder: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="What types of educational resources and courses belong in this category?"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Cover Image URL
            </label>
            <input
              type="text"
              value={formData.coverImageUrl || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  coverImageUrl: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as "ACTIVE" | "INACTIVE",
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ACTIVE">Active (Visible)</option>
              <option value="INACTIVE">Inactive (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-primary/10">
          <Link
            href="/admin/resources/categories"
            className="px-5 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
