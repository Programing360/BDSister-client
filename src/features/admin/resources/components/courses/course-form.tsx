"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowLeft,
  Save,
  Sparkles,
  Info,
  CheckCircle2,
  DollarSign,
  Clock,
  Layers,
} from "lucide-react";
import type { CourseItem, CourseLevel, CourseStatus } from "../../types/resource";
import { DEMO_RESOURCE_CATEGORIES } from "../../data/mock-resources";
import { CourseBuilder } from "./course-builder";

interface CourseFormProps {
  initialData?: CourseItem;
  isEdit?: boolean;
}

export function CourseForm({ initialData, isEdit = false }: CourseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<CourseItem>>(
    initialData || {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      coverImageUrl:
        "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
      categoryId: DEMO_RESOURCE_CATEGORIES[0]?.id || "rcat-01",
      categoryName: DEMO_RESOURCE_CATEGORIES[0]?.name || "Entrepreneurship & MSME",
      instructor: {
        name: "Tasneem Sultana",
        bio: "Senior E-Commerce Consultant & founder of ArtisanBD.",
        organization: "BDSisters Academy",
      },
      level: "ALL_LEVELS",
      duration: "4 Weeks (16 Hours)",
      priceBDT: 1500,
      status: "DRAFT",
      isFeatured: false,
      modulesCount: 0,
      lessonsCount: 0,
      enrolledLearnersCount: 0,
      completionRatePct: 0,
      modules: [],
      learningOutcomes: [
        "Learn key business operational systems",
        "Master cash flow planning",
      ],
      prerequisites: "Open to all BDSisters registered members.",
    }
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

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(
        `[DEMO] Course "${formData.title}" ${
          isEdit ? "updated" : "created"
        } successfully. Changes are simulated locally.`
      );
      setTimeout(() => {
        router.push("/admin/resources/courses");
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
          href="/admin/resources/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          {isEdit ? "Editing Course" : "New Course Program"}
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
          <span className="font-semibold">DEMO MODE:</span> Course curricula, lesson outlines, and instructor bio are managed in local state.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="100"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-8"
      >
        {/* Section 1: Course Info */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              1. Course Overview & Metadata
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Course title, level, pricing, and category classification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={handleTitleChange}
                placeholder="e.g. Mastering F-Commerce & E-Commerce Operations in Bangladesh"
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
                Course Level
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    level: e.target.value as CourseLevel,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="BEGINNER">Beginner Friendly</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="ALL_LEVELS">All Levels Welcome</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Estimated Duration
              </label>
              <input
                type="text"
                value={formData.duration || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, duration: e.target.value }))
                }
                placeholder="e.g. 4 Weeks (16 Hours)"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Course Enrollment Fee (BDT)
              </label>
              <input
                type="number"
                min={0}
                value={formData.priceBDT ?? 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priceBDT: Number(e.target.value),
                  }))
                }
                placeholder="0 for Free"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              <span className="text-[11px] text-brand-muted">
                {formData.priceBDT === 0 ? "Free access for members" : "Processed via ZiniPay"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Course Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as CourseStatus,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="PUBLISHED">Published</option>
                <option value="UNPUBLISHED">Unpublished</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Short Description
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
                placeholder="High-level syllabus summary for cards"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Full Description & Syllabus Narrative
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
                placeholder="What will learners gain? Who is this course best suited for?..."
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
          </div>
        </div>

        {/* Section 2: Instructor */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              2. Lead Instructor Profile
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Course facilitator credentials and institution attribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Instructor Name
              </label>
              <input
                type="text"
                value={formData.instructor?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instructor: {
                      name: e.target.value,
                      bio: prev.instructor?.bio || "",
                      organization: prev.instructor?.organization || "BDSisters",
                    },
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Organization / Academy
              </label>
              <input
                type="text"
                value={formData.instructor?.organization || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instructor: {
                      name: prev.instructor?.name || "",
                      bio: prev.instructor?.bio || "",
                      organization: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Instructor Biography
              </label>
              <textarea
                rows={2}
                value={formData.instructor?.bio || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instructor: {
                      name: prev.instructor?.name || "",
                      bio: e.target.value,
                      organization: prev.instructor?.organization || "",
                    },
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Course Builder */}
        <CourseBuilder
          initialModules={formData.modules || []}
          onChange={(modules) =>
            setFormData((prev) => ({
              ...prev,
              modules,
              modulesCount: modules.length,
              lessonsCount: modules.reduce((sum, m) => sum + m.lessons.length, 0),
            }))
          }
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-primary/10">
          <Link
            href="/admin/resources/courses"
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
              ? "Update Course Program"
              : "Save Course & Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
