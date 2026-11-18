"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Search,
  CheckCircle2,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  Check,
  Filter,
} from "lucide-react";
import { DEMO_MEDIA_ASSETS } from "../../data/mock-cms";
import type { MediaAsset } from "../../types/cms";

export function MediaLibraryView() {
  const [assets, setAssets] = useState<MediaAsset[]>(DEMO_MEDIA_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.altText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || asset.mediaType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    triggerToast("Image CDN URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, name: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (selectedAsset?.id === id) setSelectedAsset(null);
    triggerToast(`Deleted asset "${name}" (Demo UI)`);
  };

  const handleSimulateUpload = () => {
    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      fileName: `artisan-showcase-${Math.floor(Math.random() * 1000)}.jpg`,
      url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=1200&auto=format&fit=crop&q=80",
      dimensions: "1920 x 1080",
      fileSizeBytes: 420000,
      fileSizeFormatted: "420 KB",
      mediaType: "IMAGE",
      altText: "New Bangladeshi handcrafted exhibit showcase",
      uploadDate: new Date().toISOString().split("T")[0] || "2026-03-01",
      usageCount: 0,
      status: "ACTIVE",
    };
    setAssets([newAsset, ...assets]);
    triggerToast(`Simulated upload of "${newAsset.fileName}" complete.`);
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
                CDN Asset Storage
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Media & Asset Library
            </h1>
            <p className="text-sm text-slate-300">
              High-resolution imagery, promotional covers, logos, and product photographs optimized for public delivery.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateUpload}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Upload className="h-4 w-4" />
              Upload New Asset
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search filename or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          >
            <option value="all">All Media Types</option>
            <option value="IMAGE">Images & Photos</option>
            <option value="DOCUMENT">Documents (PDF)</option>
            <option value="VIDEO_PREVIEW">Video Previews</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredAssets.length} assets
        </span>
      </div>

      {/* Media Gallery Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all"
          >
            {/* Thumbnail Preview */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <Image
                src={asset.url}
                alt={asset.altText}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 rounded-md bg-slate-900/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {asset.fileSizeFormatted}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {asset.mediaType}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {asset.dimensions || "—"}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                {asset.fileName}
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                {asset.altText}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                <span>{asset.usageCount} pages linked</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(asset.url, asset.id);
                  }}
                  className="p-1 hover:text-indigo-600 transition-colors"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Asset Modal / Drawer */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative aspect-video w-full bg-slate-900">
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.altText}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedAsset.fileName}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedAsset.dimensions} • {selectedAsset.fileSizeFormatted} • {selectedAsset.mediaType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAsset(null)}
                  className="rounded-lg bg-slate-100 p-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={selectedAsset.altText}
                  onChange={(e) =>
                    setSelectedAsset({ ...selectedAsset, altText: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CDN Asset URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 font-mono text-xs text-slate-700 focus:outline-none shadow-sm"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                    className="rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => handleDelete(selectedAsset.id, selectedAsset.fileName)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Asset
                </button>
                <button
                  onClick={() => {
                    setAssets((prev) =>
                      prev.map((a) => (a.id === selectedAsset.id ? selectedAsset : a))
                    );
                    setSelectedAsset(null);
                    triggerToast("Asset metadata updated!");
                  }}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
