"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ResourceItem } from "../../types/resource";
import { DEMO_RESOURCES } from "../../data/mock-resources";
import {
  ResourceTypeBadge,
  ResourceStatusBadge,
} from "../common/resource-status-badge";
import {
  Sparkles,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  Trash2,
  Plus,
  CheckCircle2,
  Search,
} from "lucide-react";

interface FeaturedResourcesViewProps {
  initialResources?: ResourceItem[];
}

export function FeaturedResourcesView({
  initialResources,
}: FeaturedResourcesViewProps) {
  const [resources, setResources] = useState<ResourceItem[]>(
    initialResources || DEMO_RESOURCES
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const featuredList = useMemo(
    () => resources.filter((r) => r.isFeatured),
    [resources]
  );

  const nonFeaturedList = useMemo(
    () => resources.filter((r) => !r.isFeatured && r.status === "PUBLISHED"),
    [resources]
  );

  const handleToggleFeature = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    );
    const item = resources.find((r) => r.id === id);
    setFeedbackMessage(
      item?.isFeatured
        ? `Removed "${item.title}" from featured spotlight. (Demo only)`
        : `Added "${item?.title}" to featured spotlight! (Demo only)`
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleMoveOrder = (index: number, direction: "up" | "down") => {
    const list = [...featuredList];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const currentItem = list[index];
    const targetItem = list[targetIdx];
    if (!currentItem || !targetItem) return;

    list[index] = targetItem;
    list[targetIdx] = currentItem;

    // Merge back into state preserving new order for featured
    const unfeatured = resources.filter((r) => !r.isFeatured);
    setResources([...list, ...unfeatured]);

    setFeedbackMessage(
      `Updated featured spotlight display hierarchy. (Demo only)`
    );
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link
              href="/admin/resources"
              className="hover:text-[#5B46F6] transition-colors"
            >
              Resources
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Featured Showcase</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Featured Resources & Spotlights
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Curate the top learning assets, articles, templates, and courses pinned to the member homepage.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-pink-50/20 p-3.5 text-xs text-indigo-950 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold text-amber-600">
            Showcase Hierarchy:
          </span>
          <span>DEMO DATA — Reorder items to adjust frontend display rank.</span>
        </div>
        <span className="text-slate-500 font-medium hidden sm:inline">
          {featuredList.length} Pinned Items
        </span>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <span className="font-medium">{feedbackMessage}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* 2-Column Grid: Left Featured Order, Right Available Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Pinned Resources with ordering controls */}
        <div className="lg:col-span-7 space-y-4" data-aos="fade-right">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Currently Pinned in Homepage Carousel
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ordered from #1 (First slide) downwards. Use arrows to reposition.
                </p>
              </div>
              <span className="rounded-full bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5">
                {featuredList.length} Featured
              </span>
            </div>

            <div className="space-y-2.5">
              {featuredList.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 p-3.5 flex items-center justify-between gap-3 transition shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shrink-0">
                      #{idx + 1}
                    </span>

                    <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                      <Image
                        src={item.coverImageUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <ResourceTypeBadge type={item.resourceType} />
                        <span className="text-[11px] text-slate-500 truncate">
                          {item.categoryName}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:text-[#5B46F6] disabled:opacity-30 disabled:pointer-events-none transition"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, "down")}
                      disabled={idx === featuredList.length - 1}
                      className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:text-[#5B46F6] disabled:opacity-30 disabled:pointer-events-none transition"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFeature(item.id)}
                      className="p-1 rounded border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      title="Unpin / Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Other Published Resources available to pin */}
        <div className="lg:col-span-5 space-y-4" data-aos="fade-left">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Available to Feature
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click "+ Pin" to spotlight any of these published resources.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {nonFeaturedList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  All published resources are currently featured.
                </div>
              ) : (
                nonFeaturedList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-white p-3 hover:bg-slate-50 transition flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <ResourceTypeBadge type={item.resourceType} />
                        <span className="text-[10px] text-slate-400">
                          {item.viewsCount.toLocaleString()} views
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {item.title}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFeature(item.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition shrink-0"
                    >
                      <Plus className="h-3 w-3" /> Pin
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
