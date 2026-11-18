"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Edit,
  ExternalLink,
  BookOpen,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { ResourceCategory } from "../../types/resource";

interface CategoryTableProps {
  categories: ResourceCategory[];
  onToggleStatus: (categoryId: string) => void;
}

export function CategoryTable({
  categories,
  onToggleStatus,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <Layers className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Categories Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No resource categories match your search parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[750px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Resources Count</th>
              <th className="py-3.5 px-4">Display Order</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Name & Icon/Cover */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                      {cat.coverImageUrl ? (
                        <Image
                          src={cat.coverImageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-primary font-semibold">
                          <Layers className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/resources/categories/${cat.id}`}
                        className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                      >
                        {cat.name}
                      </Link>
                      <p className="text-[11px] text-brand-muted line-clamp-1 max-w-xs font-normal">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-brand-muted">
                  /{cat.slug}
                </td>

                {/* Resources Count */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                    <BookOpen className="w-3 h-3" />
                    {cat.resourcesCount} resources
                  </span>
                </td>

                {/* Display Order */}
                <td className="py-3.5 px-4 font-semibold text-brand-navy">
                  #{cat.displayOrder}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      cat.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-700 border border-slate-500/20"
                    }`}
                  >
                    {cat.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onToggleStatus(cat.id)}
                      title={`Toggle category status (${cat.status})`}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                    >
                      {cat.status === "ACTIVE" ? (
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <Link
                      href={`/admin/resources/categories/${cat.id}/edit`}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/resources/categories/${cat.id}`}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Inspect Category"
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
      <div className="md:hidden divide-y divide-brand-primary/10 p-4 space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="pt-4 first:pt-0 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface shrink-0">
                {cat.coverImageUrl && (
                  <Image
                    src={cat.coverImageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/resources/categories/${cat.id}`}
                  className="font-semibold text-brand-navy hover:text-brand-primary text-sm truncate block"
                >
                  {cat.name}
                </Link>
                <p className="text-[11px] text-brand-muted truncate">
                  {cat.description}
                </p>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                  cat.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {cat.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="font-semibold text-brand-navy">
                {cat.resourcesCount} resources
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus(cat.id)}
                  className="text-xs font-semibold text-brand-muted hover:text-brand-primary"
                >
                  Toggle
                </button>
                <Link
                  href={`/admin/resources/categories/${cat.id}/edit`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/resources/categories/${cat.id}`}
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
