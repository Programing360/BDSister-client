"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
  Calendar,
  Save,
  Megaphone,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { DEMO_BANNERS } from "../../data/mock-cms";
import { BannerStatusBadge } from "../common/cms-status-badge";
import type { CMSBanner, BannerType, BannerStatus } from "../../types/cms";

export function BannersListView() {
  const [banners, setBanners] = useState<CMSBanner[]>(DEMO_BANNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<BannerType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<BannerStatus | "ALL">("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form toggle for creating banner
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    bannerType: "PROMOTIONAL" as BannerType,
    status: "ACTIVE" as BannerStatus,
    ctaLabel: "",
    ctaUrl: "",
    imageUrl: "",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    displayLocation: "MARKETPLACE" as CMSBanner["displayLocation"],
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredBanners = banners.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || b.bannerType === typeFilter;
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const nextStatus: BannerStatus = b.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
        return { ...b, status: nextStatus };
      })
    );
    triggerToast("Banner status updated (Demo UI)");
  };

  const handleDelete = (id: string, title: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    triggerToast(`Removed banner "${title}"`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    const newBanner: CMSBanner = {
      id: `banner-${Date.now()}`,
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      description: formData.description,
      bannerType: formData.bannerType,
      status: formData.status,
      ctaLabel: formData.ctaLabel || undefined,
      ctaUrl: formData.ctaUrl || undefined,
      imageUrl: formData.imageUrl || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      displayLocation: formData.displayLocation,
      clicksCount: 0,
      impressionsCount: 0,
    };
    setBanners([newBanner, ...banners]);
    setIsCreating(false);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      bannerType: "PROMOTIONAL",
      status: "ACTIVE",
      ctaLabel: "",
      ctaUrl: "",
      imageUrl: "",
      startDate: "2026-03-01",
      endDate: "2026-04-30",
      displayLocation: "MARKETPLACE",
    });
    triggerToast(`Created banner "${newBanner.title}"`);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to CMS Overview
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Promotions & Campaigns
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Banners & Announcement Bars
            </h1>
            <p className="text-sm text-slate-300">
              Manage sitewide marketing hero banners, announcement strips, campaign takeovers, and targeted alerts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Close Form" : "Create New Banner"}
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Create Form (Conditional) */}
      {isCreating && (
        <form onSubmit={handleCreate} className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Configure New Campaign Banner</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Eid Artisan Expo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Campaign Tagline</label>
              <input
                type="text"
                placeholder="e.g. Celebrate Heritage & Craftsmanship"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Body Description</label>
            <textarea
              rows={2}
              required
              placeholder="Supporting campaign details or discount terms..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Type</label>
              <select
                value={formData.bannerType}
                onChange={(e) => setFormData({ ...formData, bannerType: e.target.value as BannerType })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="PROMOTIONAL">Promotional Card</option>
                <option value="HERO_BANNER">Hero Banner</option>
                <option value="ANNOUNCEMENT_BAR">Announcement Bar</option>
                <option value="EVENT_BANNER">Event Banner</option>
                <option value="CAMPAIGN">Campaign Takeover</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Location</label>
              <select
                value={formData.displayLocation}
                onChange={(e) => setFormData({ ...formData, displayLocation: e.target.value as any })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="MARKETPLACE">Marketplace</option>
                <option value="HOMEPAGE_TOP">Homepage Top</option>
                <option value="HOMEPAGE_HERO">Homepage Hero</option>
                <option value="ALL_PAGES_HEADER">All Pages Header</option>
                <option value="EVENTS">Events Page</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CTA Button Text</label>
              <input
                type="text"
                placeholder="e.g. Register Now"
                value={formData.ctaLabel}
                onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Link URL</label>
              <input
                type="text"
                placeholder="e.g. /events/expo"
                value={formData.ctaUrl}
                onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Background Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
            >
              <Save className="h-3.5 w-3.5" />
              Save Banner
            </button>
          </div>
        </form>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="rounded-xl bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          >
            <option value="ALL">All Formats</option>
            <option value="PROMOTIONAL">Promotional Card</option>
            <option value="HERO_BANNER">Hero Banner</option>
            <option value="ANNOUNCEMENT_BAR">Announcement Bar</option>
            <option value="EVENT_BANNER">Event Banner</option>
            <option value="CAMPAIGN">Campaign</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DRAFT">Draft</option>
            <option value="EXPIRED">Expired</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredBanners.length} of {banners.length} banners
        </span>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all"
          >
            <div>
              {/* Type and Status Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {banner.bannerType.replace("_", " ")}
                </span>
                <BannerStatusBadge status={banner.status} />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {banner.subtitle}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {banner.description}
              </p>

              {/* Background preview image if present */}
              {banner.imageUrl && (
                <div className="relative mt-4 h-32 w-full overflow-hidden rounded-xl shadow-inner">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {banner.ctaLabel && (
                    <div className="absolute bottom-3 right-3 rounded-lg bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                      {banner.ctaLabel} →
                    </div>
                  )}
                </div>
              )}

              {/* Impressions / Clicks Counter */}
              <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{banner.impressionsCount.toLocaleString()} impressions</span>
                </div>
                <div className="flex items-center gap-1">
                  <MousePointerClick className="h-3 w-3" />
                  <span>{banner.clicksCount.toLocaleString()} clicks</span>
                </div>
              </div>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {banner.startDate} to {banner.endDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(banner.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    banner.status === "ACTIVE"
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {banner.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(banner.id, banner.title)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Banner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
