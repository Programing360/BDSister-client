"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  ArrowLeft,
  Edit,
  BookOpen,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { ResourceCategory } from "../../types/resource";
import { DEMO_RESOURCES } from "../../data/mock-resources";
import { ResourceTable } from "../list/resource-table";

interface CategoryDetailViewProps {
  category: ResourceCategory;
}

export function CategoryDetailView({
  category: initialCategory,
}: CategoryDetailViewProps) {
  const [category, setCategory] = useState<ResourceCategory>(initialCategory);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const handleToggleStatus = () => {
    const nextStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setCategory((prev) => ({ ...prev, status: nextStatus }));
    showToast(
      `[DEMO] Category status updated to "${nextStatus}". Changes are simulated locally.`
    );
  };

  const categoryResources = DEMO_RESOURCES.filter(
    (res) => res.categoryId === category.id
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {simulationToast && (
        <div
          data-aos="fade-down"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-brand-navy/95 text-white rounded-xl shadow-[0_12px_36px_rgba(91,70,246,0.3)] border border-brand-primary/40 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-top-4"
        >
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0 animate-pulse" />
          <span>{simulationToast}</span>
          <button
            onClick={() => setSimulationToast(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            &times;
          </button>
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
          Back to Resource Categories
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              category.status === "ACTIVE"
                ? "border-amber-400 text-amber-800 bg-amber-50 hover:bg-amber-100"
                : "border-emerald-400 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            {category.status === "ACTIVE" ? "Set Inactive" : "Set Active"}
          </button>
          <Link
            href={`/admin/resources/categories/${category.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Category
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="50"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA — Not connected to live learning services.</span> Category properties and related content link state operate locally.
        </p>
      </div>

      {/* Two-Column Showcase (Cover on Left, Rich Information on Right) */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_12px_40px_rgb(91,70,246,0.08)]"
      >
        {/* Left Side: Cover Image with cover styling */}
        <div className="lg:col-span-5 space-y-4" data-aos="fade-right">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-brand-primary/15 shadow-[0_8px_24px_rgba(91,70,246,0.12)] group">
            {category.coverImageUrl ? (
              <Image
                src={category.coverImageUrl}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-surface text-brand-primary">
                <Layers className="w-12 h-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                  category.status === "ACTIVE"
                    ? "bg-emerald-600/90 text-white"
                    : "bg-slate-600/90 text-white"
                }`}
              >
                {category.status}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/90 text-white backdrop-blur-md">
                Order #{category.displayOrder}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
                Category Code
              </p>
              <p className="font-mono text-sm font-semibold">/{category.slug}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-surface/70 border border-brand-primary/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-navy">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
                Linked Resources
              </span>
              <span>{category.resourcesCount} learning items</span>
            </div>
            <p className="text-[11px] text-brand-muted">
              Includes articles, videos, templates, and courses tagged with this category.
            </p>
          </div>
        </div>

        {/* Right Side: Category Information & Metadata */}
        <div className="lg:col-span-7 space-y-6" data-aos="fade-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              Resource Category Detail
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-brand-navy tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm font-medium text-brand-muted leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-brand-surface/60 border border-brand-primary/10 text-xs">
            <div>
              <p className="text-brand-muted font-medium">Category ID</p>
              <p className="font-mono font-semibold text-brand-navy">{category.id}</p>
            </div>
            <div>
              <p className="text-brand-muted font-medium">URL Slug</p>
              <p className="font-mono font-semibold text-brand-navy">
                /{category.slug}
              </p>
            </div>
            <div>
              <p className="text-brand-muted font-medium">Created On</p>
              <p className="font-semibold text-brand-navy">
                {category.createdAt.slice(0, 10)}
              </p>
            </div>
            <div>
              <p className="text-brand-muted font-medium">Active Resources</p>
              <p className="font-semibold text-brand-navy">
                {category.resourcesCount} Items Catalogued
              </p>
            </div>
          </div>

          {/* Quick Category Action Links */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-brand-navy">
              Quick Administrative Tasks
            </h3>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/admin/resources/create"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-semibold transition"
              >
                + Add Resource in this Category
              </Link>
              <Link
                href={`/admin/resources/categories/${category.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-primary/10 text-brand-navy text-xs font-semibold border border-brand-primary/15 transition"
              >
                Modify Name & Cover Illustration
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resources in this Category Section */}
      <div data-aos="fade-up" data-aos-delay="150" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-navy">
              Resources in {category.name} ({categoryResources.length})
            </h3>
            <p className="text-xs text-brand-muted font-normal">
              Showing active materials published under this domain.
            </p>
          </div>
          <Link
            href="/admin/resources/create"
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            + Create Resource
          </Link>
        </div>

        {categoryResources.length > 0 ? (
          <ResourceTable
            resources={categoryResources}
            onTogglePublish={() =>
              showToast("[DEMO] Status updated locally.")
            }
            onToggleFeatured={() =>
              showToast("[DEMO] Feature status updated.")
            }
            onArchive={() =>
              showToast("[DEMO] Resource archived locally.")
            }
          />
        ) : (
          <div className="p-8 text-center bg-white/95 rounded-2xl border border-brand-primary/10">
            <BookOpen className="w-8 h-8 text-brand-muted mx-auto mb-2" />
            <p className="text-xs text-brand-muted font-medium">
              No resources currently assigned to this category in the demo dataset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
