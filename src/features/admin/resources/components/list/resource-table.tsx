"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Edit,
  ExternalLink,
  Eye,
  Download,
  Star,
  Archive,
  CheckCircle2,
  Power,
  RotateCcw,
} from "lucide-react";
import type { ResourceItem, ResourceStatus } from "../../types/resource";
import {
  ResourceTypeBadge,
  ResourceStatusBadge,
  ResourceVisibilityBadge,
} from "../common/resource-status-badge";

interface ResourceTableProps {
  resources: ResourceItem[];
  onTogglePublish: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ResourceTable({
  resources,
  onTogglePublish,
  onToggleFeatured,
  onArchive,
}: ResourceTableProps) {
  if (resources.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <BookOpen className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Resources Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No learning resources match your current search and filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[1050px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Resource</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">Stats</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Visibility</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {resources.map((res) => (
              <tr
                key={res.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Title & Thumbnail */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                      <Image
                        src={res.coverImageUrl}
                        alt={res.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                      {res.isFeatured && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full bg-amber-400 text-brand-navy shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/resources/${res.id}`}
                        className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                      >
                        {res.title}
                      </Link>
                      <p className="text-[11px] text-brand-muted line-clamp-1 max-w-xs font-normal">
                        {res.shortDescription}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3.5 px-4">
                  <ResourceTypeBadge type={res.resourceType} />
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 font-medium text-brand-navy">
                  {res.categoryName}
                </td>

                {/* Author */}
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-brand-navy">
                    {res.author.name}
                  </p>
                  <p className="text-[10px] text-brand-muted">{res.author.role}</p>
                </td>

                {/* Stats */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5 text-[11px]">
                    <span className="flex items-center gap-1 text-brand-navy font-semibold">
                      <Eye className="w-3 h-3 text-brand-primary" />
                      {res.viewsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-purple-600 font-medium">
                      <Download className="w-2.5 h-2.5" />
                      {res.downloadsCount.toLocaleString()}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <ResourceStatusBadge status={res.status} />
                </td>

                {/* Visibility */}
                <td className="py-3.5 px-4">
                  <ResourceVisibilityBadge visibility={res.visibility} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onToggleFeatured(res.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        res.isFeatured
                          ? "border-amber-300 text-amber-500 bg-amber-50 hover:bg-amber-100"
                          : "border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10"
                      }`}
                      title={res.isFeatured ? "Unfeature" : "Mark as Featured"}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onTogglePublish(res.id)}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title={res.status === "PUBLISHED" ? "Unpublish to Draft" : "Publish Live"}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/admin/resources/${res.id}/edit`}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Edit Resource"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/resources/${res.id}`}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Inspect Resource"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden divide-y divide-brand-primary/10 p-4 space-y-4">
        {resources.map((res) => (
          <div key={res.id} className="pt-4 first:pt-0 space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                <Image
                  src={res.coverImageUrl}
                  alt={res.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/resources/${res.id}`}
                  className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                >
                  {res.title}
                </Link>
                <div className="flex items-center gap-1.5 mt-1">
                  <ResourceTypeBadge type={res.resourceType} />
                  <ResourceStatusBadge status={res.status} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="text-brand-muted">By {res.author.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFeatured(res.id)}
                  className="text-xs font-semibold text-brand-muted hover:text-amber-500"
                >
                  {res.isFeatured ? "★ Featured" : "☆ Feature"}
                </button>
                <Link
                  href={`/admin/resources/${res.id}/edit`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/resources/${res.id}`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
