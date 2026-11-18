"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  Save,
  Sparkles,
  Info,
  CheckCircle2,
  FileText,
  Video,
  Download,
  Star,
} from "lucide-react";
import type {
  ResourceItem,
  ResourceType,
  ResourceStatus,
  ResourceVisibility,
} from "../../types/resource";
import { DEMO_RESOURCE_CATEGORIES } from "../../data/mock-resources";

interface ResourceFormProps {
  initialData?: ResourceItem;
  isEdit?: boolean;
}

export function ResourceForm({
  initialData,
  isEdit = false,
}: ResourceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ResourceItem>>(
    initialData || {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      resourceType: "ARTICLE",
      categoryId: DEMO_RESOURCE_CATEGORIES[0]?.id || "rcat-01",
      categoryName: DEMO_RESOURCE_CATEGORIES[0]?.name || "Entrepreneurship & MSME",
      author: {
        name: "BDSisters Editorial Team",
        role: "Knowledge Curator",
        email: "editorial@bdsisters.org",
      },
      coverImageUrl:
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80",
      tags: ["Business", "Guide"],
      language: "Bangla & English",
      estimatedTime: "10 mins read",
      viewsCount: 0,
      downloadsCount: 0,
      status: "DRAFT",
      visibility: "PUBLIC",
      isFeatured: false,
      publicationDate: new Date().toISOString().slice(0, 10),
      articleBody: "",
      readingTimeMinutes: 10,
    }
  );

  const [tagsInput, setTagsInput] = useState(
    formData.tags ? formData.tags.join(", ") : ""
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug ? prev.slug : slug,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    const cat = DEMO_RESOURCE_CATEGORIES.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      categoryName: cat?.name || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(
        `[DEMO] Resource "${formData.title}" ${
          isEdit ? "updated" : "created"
        } successfully. Changes are simulated locally.`
      );
      setTimeout(() => {
        router.push("/admin/resources/all");
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

      {/* Top Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/resources/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          {isEdit ? "Editing Resource" : "Authoring New Resource"}
        </div>
      </div>

      {/* Notice Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="50"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO MODE:</span> Content saving and media indexing are client-side simulations.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="100"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-8"
      >
        {/* Section 1: Overview & Metadata */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              1. Title, Taxonomy & Classification
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Basic discovery tags, category, and resource format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Resource Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={handleTitleChange}
                placeholder="e.g. Complete Guide to Registering an MSME Trade License in Dhaka"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Resource Type / Format *
              </label>
              <select
                value={formData.resourceType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    resourceType: e.target.value as ResourceType,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="ARTICLE">Article / Editorial</option>
                <option value="VIDEO">Video Masterclass</option>
                <option value="GUIDE">Practical Guide</option>
                <option value="TEMPLATE">Spreadsheet / Document Template</option>
                <option value="PDF">PDF Handbook</option>
                <option value="TUTORIAL">Step-by-Step Tutorial</option>
                <option value="COURSE">Structured Course</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                {DEMO_RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Language
              </label>
              <input
                type="text"
                value={formData.language || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, language: e.target.value }))
                }
                placeholder="e.g. Bangla & English"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Short Summary (1-2 sentences)
              </label>
              <input
                type="text"
                value={formData.shortDescription || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="Concise overview snippet for search cards"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Full Description / Learning Objectives
              </label>
              <textarea
                rows={3}
                value={formData.fullDescription || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullDescription: e.target.value,
                  }))
                }
                placeholder="Comprehensive background context, target audience, and key takeaways..."
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 2: Format-Specific Fields */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              2. Content & Media Attributes ({formData.resourceType})
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Configure fields specific to this content format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* If Article */}
            {formData.resourceType === "ARTICLE" && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Article Full Body
                  </label>
                  <textarea
                    rows={6}
                    value={formData.articleBody || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        articleBody: e.target.value,
                      }))
                    }
                    placeholder="Write or paste editorial markdown text here..."
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 font-mono text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Estimated Reading Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.readingTimeMinutes || 10}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        readingTimeMinutes: Number(e.target.value),
                        estimatedTime: `${e.target.value} mins read`,
                      }))
                    }
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </>
            )}

            {/* If Video */}
            {formData.resourceType === "VIDEO" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Video Duration (e.g. 25:30)
                  </label>
                  <input
                    type="text"
                    value={formData.videoDuration || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        videoDuration: e.target.value,
                        estimatedTime: `${e.target.value} watch`,
                      }))
                    }
                    placeholder="e.g. 32:45"
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Video Stream / Embed URL (Placeholder)
                  </label>
                  <input
                    type="text"
                    value={formData.videoPlaceholderUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        videoPlaceholderUrl: e.target.value,
                      }))
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </>
            )}

            {/* If PDF or Template */}
            {(formData.resourceType === "PDF" ||
              formData.resourceType === "TEMPLATE" ||
              formData.resourceType === "DOCUMENT") && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Attached Asset File Name
                  </label>
                  <input
                    type="text"
                    value={formData.fileName || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fileName: e.target.value,
                      }))
                    }
                    placeholder="e.g. Cashflow_Template_v2.xlsx"
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    File Type
                  </label>
                  <input
                    type="text"
                    value={formData.fileType || "PDF"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fileType: e.target.value,
                      }))
                    }
                    placeholder="PDF, XLSX, DOCX"
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Trade License, Dhaka, MSME, VAT"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
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
          </div>
        </div>

        {/* Section 3: Publishing Controls */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              3. Author Attribution & Publishing Controls
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Visibility permissions, status lifecycle, and feature flags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Author / Contributor Name
              </label>
              <input
                type="text"
                value={formData.author?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    author: {
                      name: e.target.value,
                      role: prev.author?.role || "Contributor",
                      email: prev.author?.email || "contributor@bdsisters.org",
                    },
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Status Lifecycle
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as ResourceStatus,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="PUBLISHED">Published Live</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Visibility Scope
              </label>
              <select
                value={formData.visibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visibility: e.target.value as ResourceVisibility,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="PUBLIC">Public (All Visitors)</option>
                <option value="MEMBERS_ONLY">Members Only</option>
                <option value="PREMIUM">Premium Tier</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-navy">
              <input
                type="checkbox"
                checked={formData.isFeatured ?? false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/30"
              />
              Feature this resource on the discovery carousel
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-primary/10">
          <Link
            href="/admin/resources/all"
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
              ? "Update Resource"
              : "Create Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}
