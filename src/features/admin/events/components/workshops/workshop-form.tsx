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
} from "lucide-react";
import type { WorkshopItem, EventStatus, EventFormat } from "../../types/event";

interface WorkshopFormProps {
  initialData?: WorkshopItem;
  isEdit?: boolean;
}

export function WorkshopForm({
  initialData,
  isEdit = false,
}: WorkshopFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<WorkshopItem>>(
    initialData || {
      title: "",
      slug: "",
      category: "Artisan Workshops",
      instructor: {
        name: "",
        bio: "",
        organization: "BDSisters Guild",
      },
      coverImageUrl:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop&q=80",
      format: "PHYSICAL",
      startDate: "2025-05-18",
      startTime: "10:00",
      duration: "3 Hours Hands-On",
      registrationCount: 0,
      capacity: 30,
      priceBDT: 500,
      status: "DRAFT",
      skillsLearned: ["Skill A", "Skill B"],
      prerequisites: "None. Open to all registered sister members.",
    }
  );

  const [skillsInput, setSkillsInput] = useState(
    formData.skillsLearned ? formData.skillsLearned.join(", ") : ""
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(
        `[DEMO] Workshop "${formData.title}" ${
          isEdit ? "updated" : "created"
        } successfully. Changes are simulated locally.`
      );
      setTimeout(() => {
        router.push("/admin/events/workshops");
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
          href="/admin/events/workshops"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workshops
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          {isEdit ? "Editing Workshop" : "New Workshop Draft"}
        </div>
      </div>

      {/* Notice Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO MODE:</span> Workshop curriculum, capacity, and materials are stored locally for demonstration.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="150"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-6"
      >
        <div className="border-b border-brand-primary/10 pb-3">
          <h2 className="text-lg font-semibold text-brand-navy">
            Workshop Information
          </h2>
          <p className="text-xs text-brand-muted font-normal">
            Define curriculum topic, lead artisan instructor, and schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Workshop Title *
            </label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={handleTitleChange}
              placeholder="e.g. Masterclass: Jamdani Motif Carving & Natural Dyeing"
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
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="e.g. Traditional Textiles, Tech, Business"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

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
                    organization: prev.instructor?.organization || "",
                  },
                }))
              }
              placeholder="e.g. Ustadha Rokeya Begum"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Instructor Organization
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
              placeholder="e.g. Bangladesh Heritage Weavers Guild"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Instructor Bio
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
              placeholder="Brief biography and credentials..."
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Session Date
            </label>
            <input
              type="date"
              value={formData.startDate || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Start Time & Duration
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={formData.startTime || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startTime: e.target.value }))
                }
                className="w-1/2 px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              <input
                type="text"
                value={formData.duration || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, duration: e.target.value }))
                }
                placeholder="e.g. 3 Hours"
                className="w-1/2 px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Format
            </label>
            <select
              value={formData.format}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  format: e.target.value as EventFormat,
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="PHYSICAL">Physical Studio</option>
              <option value="ONLINE">Online Interactive Class</option>
              <option value="HYBRID">Hybrid Format</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Seat Limit & Price (BDT)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                value={formData.capacity || 20}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: Number(e.target.value),
                  }))
                }
                placeholder="Capacity"
                className="w-1/2 px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
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
                placeholder="Price BDT (0 for Free)"
                className="w-1/2 px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Skills Learned (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Wood block carving, Pigment compounding, Stamping"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Prerequisites & Kit Requirements
            </label>
            <input
              type="text"
              value={formData.prerequisites || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prerequisites: e.target.value,
                }))
              }
              placeholder="e.g. Tools provided at workshop. Bring apron."
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

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-primary/10">
          <Link
            href="/admin/events/workshops"
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
              ? "Update Workshop"
              : "Create Workshop"}
          </button>
        </div>
      </form>
    </div>
  );
}
