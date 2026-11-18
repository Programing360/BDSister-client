"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  Clock,
  Eye,
  Star,
  Edit,
  ExternalLink,
  Power,
  Video,
} from "lucide-react";
import type { ResourceItem } from "../../types/resource";
import {
  ResourceStatusBadge,
  ResourceVisibilityBadge,
} from "../common/resource-status-badge";

interface VideoGridProps {
  videos: ResourceItem[];
  onTogglePublish: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export function VideoGrid({
  videos,
  onTogglePublish,
  onToggleFeatured,
}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <Video className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Video Masterclasses Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No video lessons match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {videos.map((vid, idx) => (
        <div
          key={vid.id}
          data-aos="fade-up"
          data-aos-delay={idx * 50}
          className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] hover:shadow-[0_12px_36px_rgb(91,70,246,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between group"
        >
          {/* Thumbnail with duration badge and play icon */}
          <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
            <Image
              src={vid.coverImageUrl}
              alt={vid.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Play Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-brand-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              </div>
            </div>

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <ResourceStatusBadge status={vid.status} />
              <ResourceVisibilityBadge visibility={vid.visibility} />
            </div>

            {/* Featured Star Button */}
            <button
              onClick={() => onToggleFeatured(vid.id)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 text-white hover:text-amber-400 backdrop-blur-md transition"
              title={vid.isFeatured ? "Unfeature" : "Mark as Featured"}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  vid.isFeatured ? "fill-amber-400 text-amber-400" : ""
                }`}
              />
            </button>

            {/* Bottom Meta */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
              <span className="font-semibold text-brand-primary uppercase text-[10px] tracking-wider truncate">
                {vid.categoryName}
              </span>
              <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-primary" />
                {vid.videoDuration || "20:00"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <Link
                href={`/admin/resources/${vid.id}`}
                className="font-semibold text-brand-navy hover:text-brand-primary text-base line-clamp-2 transition leading-snug"
              >
                {vid.title}
              </Link>
              <p className="text-xs text-brand-muted line-clamp-2 font-normal leading-relaxed">
                {vid.shortDescription}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-brand-primary/10">
              <div className="flex items-center justify-between text-xs text-brand-muted">
                <span className="font-medium text-brand-navy truncate">
                  By {vid.author.name}
                </span>
                <span className="flex items-center gap-1 font-semibold text-brand-primary shrink-0">
                  <Eye className="w-3 h-3" />
                  {vid.viewsCount.toLocaleString()} views
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => onTogglePublish(vid.id)}
                  className="font-semibold text-brand-muted hover:text-brand-primary flex items-center gap-1"
                >
                  <Power className="w-3 h-3" />
                  {vid.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </button>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/resources/${vid.id}/edit`}
                    className="font-semibold text-brand-muted hover:text-brand-primary"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/resources/${vid.id}`}
                    className="font-semibold text-brand-primary hover:underline flex items-center gap-0.5"
                  >
                    Inspect <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
