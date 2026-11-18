"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Video,
  Plus,
  Search,
  Sparkles,
  Info,
  BookOpen,
} from "lucide-react";
import type { ResourceItem, ResourceStatus } from "../../types/resource";
import { DEMO_RESOURCES, DEMO_RESOURCE_CATEGORIES } from "../../data/mock-resources";
import { VideoGrid } from "./video-grid";

export function VideosListView() {
  const [videos, setVideos] = useState<ResourceItem[]>(
    DEMO_RESOURCES.filter((r) => r.resourceType === "VIDEO")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((vid) => {
      const matchesSearch =
        vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "ALL" || vid.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "ALL" || vid.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [videos, searchQuery, categoryFilter, statusFilter]);

  const handleTogglePublish = (id: string) => {
    setVideos((prev) =>
      prev.map((vid) => {
        if (vid.id === id) {
          const nextStatus: ResourceStatus =
            vid.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          showToast(
            `[DEMO] Video "${vid.title}" status changed to ${nextStatus}. Changes are local.`
          );
          return { ...vid, status: nextStatus };
        }
        return vid;
      })
    );
  };

  const handleToggleFeatured = (id: string) => {
    setVideos((prev) =>
      prev.map((vid) => {
        if (vid.id === id) {
          const nextFeatured = !vid.isFeatured;
          showToast(
            `[DEMO] Video "${vid.title}" ${
              nextFeatured ? "marked as FEATURED" : "removed from featured"
            }.`
          );
          return { ...vid, isFeatured: nextFeatured };
        }
        return vid;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
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

      {/* Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            Visual Video Masterclasses
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Video Library Management
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Curate recorded workshops, technical demos, artisan tutorials, and expert webinars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/resources/all"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-brand-primary" />
            All Resources
          </Link>
          <Link
            href="/admin/resources/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Plus className="w-4 h-4" />
            Add Video
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
          <span className="font-semibold">DEMO DATA — Not connected to live learning services.</span> Video metadata, views, and embed references operate locally without external CDN calls.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search video title, contributor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter video category"
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

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter video status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_REVIEW">Pending Review</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredVideos.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{videos.length}</span> videos
          </div>
          <div className="text-[11px] font-medium text-brand-primary">
            Embed playback placeholders compatible with YouTube, Vimeo, and Loom
          </div>
        </div>
      </div>

      {/* Grid */}
      <div data-aos="fade-up" data-aos-delay="150">
        <VideoGrid
          videos={filteredVideos}
          onTogglePublish={handleTogglePublish}
          onToggleFeatured={handleToggleFeatured}
        />
      </div>
    </div>
  );
}
