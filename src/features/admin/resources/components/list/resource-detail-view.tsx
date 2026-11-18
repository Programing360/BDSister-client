"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ArrowLeft,
  Edit,
  Eye,
  Download,
  Star,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Share2,
  FileText,
  Video,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Globe,
  Tag,
} from "lucide-react";
import type { ResourceItem, ResourceStatus } from "../../types/resource";
import {
  ResourceTypeBadge,
  ResourceStatusBadge,
  ResourceVisibilityBadge,
} from "../common/resource-status-badge";

interface ResourceDetailViewProps {
  resource: ResourceItem;
}

export function ResourceDetailView({
  resource: initialResource,
}: ResourceDetailViewProps) {
  const [resource, setResource] = useState<ResourceItem>(initialResource);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const handleTogglePublish = () => {
    const nextStatus: ResourceStatus =
      resource.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setResource((prev) => ({ ...prev, status: nextStatus }));
    showToast(
      `[DEMO] Resource status changed to "${nextStatus}". Changes are simulated locally.`
    );
  };

  const handleToggleFeatured = () => {
    const nextFeatured = !resource.isFeatured;
    setResource((prev) => ({ ...prev, isFeatured: nextFeatured }));
    showToast(
      `[DEMO] Resource ${
        nextFeatured ? "marked as FEATURED" : "removed from featured showcase"
      }.`
    );
  };

  const handleSimulateDownload = () => {
    showToast(
      `[DEMO] Asset download simulated for "${resource.fileName || resource.title}".`
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

      {/* Top Navigation */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/resources/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resource Library
        </Link>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleFeatured}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              resource.isFeatured
                ? "border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100"
                : "border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${resource.isFeatured ? "fill-current" : ""}`} />
            {resource.isFeatured ? "Featured" : "Mark Featured"}
          </button>
          <button
            onClick={handleTogglePublish}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              resource.status === "PUBLISHED"
                ? "border-amber-400 text-amber-800 bg-amber-50 hover:bg-amber-100"
                : "border-emerald-400 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            {resource.status === "PUBLISHED" ? "Unpublish to Draft" : "Publish Resource"}
          </button>
          <Link
            href={`/admin/resources/${resource.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Resource
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
          <span className="font-semibold">DEMO DATA — Not connected to live learning services.</span> Resource consumption statistics and publish toggles operate on local mock data.
        </p>
      </div>

      {/* Two Column Showcase (Left: Cover & Metrics, Right: Details & Content) */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_12px_40px_rgb(91,70,246,0.08)]"
      >
        {/* Left Column: Cover Image & Key Metrics */}
        <div className="lg:col-span-5 space-y-4" data-aos="fade-right">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-brand-primary/15 shadow-[0_8px_24px_rgba(91,70,246,0.12)] group">
            <Image
              src={resource.coverImageUrl}
              alt={resource.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <ResourceTypeBadge type={resource.resourceType} />
              <ResourceStatusBadge status={resource.status} />
              <ResourceVisibilityBadge visibility={resource.visibility} />
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
                {resource.categoryName}
              </span>
              <p className="text-sm font-semibold truncate">{resource.estimatedTime}</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="p-4 rounded-xl bg-brand-surface/70 border border-brand-primary/10 grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-white border border-brand-primary/10">
              <p className="text-xs font-semibold text-brand-muted">Total Views</p>
              <p className="text-xl font-bold text-brand-navy flex items-center justify-center gap-1.5 mt-0.5">
                <Eye className="w-4 h-4 text-brand-primary" />
                {resource.viewsCount.toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-brand-primary/10">
              <p className="text-xs font-semibold text-brand-muted">Downloads</p>
              <p className="text-xl font-bold text-brand-navy flex items-center justify-center gap-1.5 mt-0.5">
                <Download className="w-4 h-4 text-purple-600" />
                {resource.downloadsCount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Asset Download / View Attachment Placeholder */}
          {(resource.fileName || resource.videoPlaceholderUrl) && (
            <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20 space-y-2">
              <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
                Attached Media Asset
              </span>
              {resource.fileName && (
                <div className="flex items-center justify-between text-xs font-medium text-brand-navy">
                  <span className="truncate max-w-[200px]">{resource.fileName}</span>
                  <button
                    onClick={handleSimulateDownload}
                    className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
              )}
              {resource.videoPlaceholderUrl && (
                <p className="text-xs text-brand-muted font-mono truncate">
                  Stream: {resource.videoPlaceholderUrl}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Title, Metadata, Description & Author */}
        <div className="lg:col-span-7 space-y-6" data-aos="fade-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-brand-muted font-mono">
              <span>ID: {resource.id}</span>
              <span>•</span>
              <span>Slug: /{resource.slug}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-brand-navy tracking-tight leading-snug">
              {resource.title}
            </h1>
            <p className="text-sm font-medium text-brand-muted leading-relaxed">
              {resource.shortDescription}
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-brand-surface/60 border border-brand-primary/10 text-xs">
            <div>
              <p className="text-brand-muted font-medium">Published Date</p>
              <p className="font-semibold text-brand-navy">{resource.publicationDate}</p>
            </div>
            <div>
              <p className="text-brand-muted font-medium">Language</p>
              <p className="font-semibold text-brand-navy">{resource.language}</p>
            </div>
            <div>
              <p className="text-brand-muted font-medium">Estimated Engagement</p>
              <p className="font-semibold text-brand-navy">{resource.estimatedTime}</p>
            </div>
            <div>
              <p className="text-brand-muted font-medium">Visibility Scope</p>
              <p className="font-semibold text-brand-navy">{resource.visibility}</p>
            </div>
          </div>

          {/* Full Description & Body Snippet */}
          <div className="space-y-2 text-sm text-brand-navy/90">
            <h3 className="font-semibold text-brand-navy text-base">Resource Overview</h3>
            <p className="leading-relaxed whitespace-pre-line font-normal text-brand-navy/80">
              {resource.fullDescription}
            </p>
            {resource.articleBody && (
              <div className="mt-4 p-4 rounded-xl bg-brand-surface/50 border border-brand-primary/10 font-normal text-xs leading-relaxed text-brand-navy/80">
                <span className="font-semibold text-brand-navy block mb-1">
                  Article Excerpt:
                </span>
                {resource.articleBody}
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-brand-navy flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-primary" />
                Indexed Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/15"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-brand-primary/15 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold text-base shrink-0">
              {resource.author.name.charAt(0)}
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold">
                Contributor Attribution
              </span>
              <h4 className="text-sm font-semibold text-brand-navy">
                {resource.author.name}
              </h4>
              <p className="text-xs text-brand-muted">
                {resource.author.role} • {resource.author.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
