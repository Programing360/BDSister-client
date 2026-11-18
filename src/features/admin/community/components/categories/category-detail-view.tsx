"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  ArrowLeft,
  Edit,
  Power,
  MessageSquare,
  Clock,
  Eye,
  CheckCircle,
  Calendar,
  Sparkles,
  Layers,
  Hash,
  ArrowUpRight,
} from "lucide-react";
import { CommunityCategory } from "../../types/community";
import { CategoryStatusBadge } from "../common/community-status-badge";
import { DEMO_DISCUSSIONS } from "../../data/mock-community";

interface CategoryDetailViewProps {
  category: CommunityCategory;
}

export function CategoryDetailView({ category: initialCategory }: CategoryDetailViewProps) {
  const [category, setCategory] = useState(initialCategory);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const relatedDiscussions = DEMO_DISCUSSIONS.filter(
    (d) => d.categoryId === category.id
  );

  const handleToggle = () => {
    const nextStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setCategory({ ...category, status: nextStatus });
    setToastMessage(`Category status toggled to ${nextStatus} (DEMO ONLY).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* 1. Top Navigation & Action Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-purple-100/80 shadow-lg shadow-purple-500/5"
        data-aos="fade-down"
      >
        <Link
          href="/admin/community/categories"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-purple-700 transition-colors group"
        >
          <span className="p-1.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 text-purple-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Back to Categories Directory
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggle}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              category.status === "ACTIVE"
                ? "border-amber-200 bg-amber-50/80 text-amber-800 hover:bg-amber-100"
                : "border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {category.status === "ACTIVE" ? "Deactivate Track" : "Activate Track"}
          </button>
          <Link
            href={`/admin/community/categories/${category.id}/edit`}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Category
          </Link>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-lg shadow-emerald-500/10 animate-fade-in"
          data-aos="zoom-in"
        >
          <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Hero Section: Left Image (Cover) + Right Details */}
      <div
        className="rounded-3xl border border-purple-100/90 bg-white overflow-hidden shadow-xl shadow-purple-500/10 grid grid-cols-1 lg:grid-cols-12 transition-all"
        data-aos="fade-up"
      >
        {/* LEFT COLUMN: Cover Image Presentation */}
        <div
          className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-50 overflow-hidden group"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          {category.coverImageUrl ? (
            <>
              <img
                src={category.coverImageUrl}
                alt={category.name}
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Refined gradient overlay for readability & aesthetic depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Top Floating Glass Badges */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                  <Hash className="w-3.5 h-3.5 text-purple-200" />
                  Priority #{category.displayOrder}
                </span>

                <div className="backdrop-blur-md bg-white/90 rounded-full px-3 py-1 shadow-md border border-white/40">
                  <CategoryStatusBadge status={category.status} />
                </div>
              </div>

              {/* Bottom Image Info */}
              <div className="absolute bottom-5 left-5 right-5 text-white z-10 space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider bg-black/40 backdrop-blur-md border border-white/20 text-purple-200 uppercase">
                  /{category.slug}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  {category.name}
                </h2>
              </div>
            </>
          ) : (
            /* Fallback Decorative Canvas when no image is uploaded */
            <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-purple-200/50 blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-pink-200/50 blur-2xl" />

              <div className="relative z-10 space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl shadow-purple-500/20 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
                  <FolderTree className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-purple-100 text-purple-800">
                  /{category.slug}
                </span>
                <div className="pt-2">
                  <CategoryStatusBadge status={category.status} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Category Details & Metrics */}
        <div
          className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="p-2.5 rounded-2xl bg-purple-100/70 text-purple-700 shadow-sm border border-purple-200/60">
                  <FolderTree className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                    Community Forum Track
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                    {category.name}
                  </h1>
                </div>
              </div>

              {!category.coverImageUrl && (
                <CategoryStatusBadge status={category.status} />
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pt-1">
              <span className="inline-flex items-center gap-1 font-mono text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                slug: /{category.slug}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Created {new Date(category.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Description Card */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Description & Purpose
            </h3>
            <div className="p-4 sm:p-5 rounded-2xl border border-purple-100/70 bg-gradient-to-br from-purple-50/40 via-white to-gray-50/40 shadow-sm">
              <p className="text-sm font-normal text-gray-700 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-white shadow-md shadow-purple-500/5 transition-transform hover:-translate-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                Discussions
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {category.discussionsCount.toLocaleString()}
              </p>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                Active threads
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white shadow-md shadow-indigo-500/5 transition-transform hover:-translate-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
                Total Posts
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {category.postsCount.toLocaleString()}
              </p>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                Community entries
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white shadow-md shadow-emerald-500/5 transition-transform hover:-translate-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Display Order
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                #{category.displayOrder}
              </p>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                Forum sequence
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/60 to-white shadow-md shadow-amber-500/5 transition-transform hover:-translate-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Last Updated
              </span>
              <p className="text-base font-bold text-gray-900 mt-2 truncate">
                {new Date(category.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                Audit synced
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Linked Discussions in this Category */}
      <div
        className="rounded-3xl border border-purple-100/90 bg-white p-6 sm:p-8 shadow-xl shadow-purple-500/5 space-y-5"
        data-aos="fade-up"
        data-aos-delay="250"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Discussions in this Category ({relatedDiscussions.length})
              </h3>
              <p className="text-xs text-gray-500">
                Community conversations belonging to &ldquo;{category.name}&rdquo;
              </p>
            </div>
          </div>

          <Link
            href="/admin/community/discussions"
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            Browse All Discussions
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {relatedDiscussions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-600">
              No discussions filed under this category yet.
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Discussions submitted by members will automatically associate here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {relatedDiscussions.map((d) => (
              <div
                key={d.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-purple-50/25 transition-colors"
              >
                <div className="space-y-1 flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-semibold text-gray-400">
                      {d.id}
                    </span>
                    {d.isPinned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                        Pinned
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-gray-500">
                      By <strong className="font-semibold text-gray-800">{d.author.name}</strong>
                    </span>
                  </div>
                  <Link
                    href={`/admin/community/discussions/${d.id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-purple-600 block line-clamp-1 transition-colors"
                  >
                    {d.title}
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {d.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 shrink-0 self-end sm:self-center">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    {d.postsCount} replies
                  </span>
                  <Link
                    href={`/admin/community/discussions/${d.id}`}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all"
                    title="Inspect Discussion"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
