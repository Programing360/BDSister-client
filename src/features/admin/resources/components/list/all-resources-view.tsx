"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
} from "lucide-react";
import type { ResourceItem, ResourceType, ResourceStatus, ResourceVisibility } from "../../types/resource";
import { DEMO_RESOURCES, DEMO_RESOURCE_CATEGORIES } from "../../data/mock-resources";
import { ResourceTable } from "./resource-table";

export function AllResourcesView() {
  const [resources, setResources] = useState<ResourceItem[]>(DEMO_RESOURCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "ALL" || res.resourceType === typeFilter;
      const matchesCategory =
        categoryFilter === "ALL" || res.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "ALL" || res.status === statusFilter;
      const matchesVisibility =
        visibilityFilter === "ALL" || res.visibility === visibilityFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesStatus &&
        matchesVisibility
      );
    });
  }, [
    resources,
    searchQuery,
    typeFilter,
    categoryFilter,
    statusFilter,
    visibilityFilter,
  ]);

  const handleTogglePublish = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus: ResourceStatus =
            r.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          showToast(
            `[DEMO] Resource "${r.title}" status changed to ${nextStatus}. Changes are local.`
          );
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleToggleFeatured = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextFeatured = !r.isFeatured;
          showToast(
            `[DEMO] Resource "${r.title}" ${
              nextFeatured ? "marked as FEATURED" : "removed from featured"
            }.`
          );
          return { ...r, isFeatured: nextFeatured };
        }
        return r;
      })
    );
  };

  const handleArchive = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          showToast(`[DEMO] Resource "${r.title}" archived.`);
          return { ...r, status: "ARCHIVED" as ResourceStatus };
        }
        return r;
      })
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("ALL");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
    setVisibilityFilter("ALL");
    showToast("[DEMO] All filters have been reset.");
  };

  return (
    <div className="space-y-6">
      {/* Simulation Feedback Toast */}
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

      {/* Header and Quick Actions */}
      <div
        data-aos="fade-up"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge Repository
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            All Learning Resources
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Manage guides, editorial articles, video lessons, PDFs, and downloadable business templates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/resources/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            <Layers className="w-4 h-4 text-brand-primary" />
            Categories
          </Link>
          <Link
            href="/admin/resources/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Plus className="w-4 h-4" />
            Create Resource
          </Link>
        </div>
      </div>

      {/* Demo Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="50"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA — Not connected to live learning services.</span> Resource records and toggle actions simulate locally.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, ID, author, summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter resource type"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Formats</option>
              <option value="GUIDE">Guides</option>
              <option value="ARTICLE">Articles</option>
              <option value="VIDEO">Videos</option>
              <option value="TEMPLATE">Templates</option>
              <option value="PDF">PDFs / Docs</option>
              <option value="TUTORIAL">Tutorials</option>
              <option value="COURSE">Courses</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter category"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Categories</option>
              {DEMO_RESOURCE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Reset Action */}
          <div>
            <button
              onClick={handleResetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-muted hover:text-brand-navy bg-brand-surface hover:bg-brand-primary/10 rounded-xl border border-brand-primary/15 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredResources.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{resources.length}</span> resources
          </div>
          <div className="text-[11px] font-medium text-brand-primary">
            Click star icon to toggle home feed feature status
          </div>
        </div>
      </div>

      {/* Resource Table */}
      <div data-aos="fade-up" data-aos-delay="150">
        <ResourceTable
          resources={filteredResources}
          onTogglePublish={handleTogglePublish}
          onToggleFeatured={handleToggleFeatured}
          onArchive={handleArchive}
        />
      </div>
    </div>
  );
}
