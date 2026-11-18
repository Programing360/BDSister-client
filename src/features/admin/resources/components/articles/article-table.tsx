"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Clock,
  Eye,
  Edit,
  ExternalLink,
  Power,
  Archive,
} from "lucide-react";
import type { ResourceItem } from "../../types/resource";
import {
  ResourceStatusBadge,
  ResourceVisibilityBadge,
} from "../common/resource-status-badge";

interface ArticleTableProps {
  articles: ResourceItem[];
  onTogglePublish: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ArticleTable({
  articles,
  onTogglePublish,
  onArchive,
}: ArticleTableProps) {
  if (articles.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <FileText className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Articles Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No editorial articles match your filter selection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Article</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Reading Time</th>
              <th className="py-3.5 px-4">Views</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {articles.map((art) => (
              <tr
                key={art.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Title & Cover */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                      <Image
                        src={art.coverImageUrl}
                        alt={art.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/admin/resources/${art.id}`}
                        className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                      >
                        {art.title}
                      </Link>
                      <p className="text-[11px] text-brand-muted line-clamp-1 max-w-xs font-normal">
                        {art.shortDescription}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Author */}
                <td className="py-3.5 px-4 font-semibold text-brand-navy">
                  {art.author.name}
                  <span className="block text-[10px] text-brand-muted font-normal">
                    {art.author.role}
                  </span>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 font-medium text-brand-navy">
                  {art.categoryName}
                </td>

                {/* Reading Time */}
                <td className="py-3.5 px-4 text-brand-navy">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-primary" />
                    {art.readingTimeMinutes || 10} mins
                  </span>
                </td>

                {/* Views */}
                <td className="py-3.5 px-4 font-semibold text-brand-navy">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3 h-3 text-brand-primary" />
                    {art.viewsCount.toLocaleString()}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <ResourceStatusBadge status={art.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onTogglePublish(art.id)}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title={art.status === "PUBLISHED" ? "Unpublish to Draft" : "Publish"}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/admin/resources/${art.id}/edit`}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Edit Article"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/resources/${art.id}`}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="View Article Details"
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

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-brand-primary/10 p-4 space-y-3">
        {articles.map((art) => (
          <div key={art.id} className="pt-3 first:pt-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/admin/resources/${art.id}`}
                className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
              >
                {art.title}
              </Link>
              <ResourceStatusBadge status={art.status} />
            </div>
            <p className="text-[11px] text-brand-muted">
              By {art.author.name} • {art.readingTimeMinutes || 10} mins read
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="text-brand-primary font-medium">
                {art.viewsCount.toLocaleString()} views
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/resources/${art.id}/edit`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/resources/${art.id}`}
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
