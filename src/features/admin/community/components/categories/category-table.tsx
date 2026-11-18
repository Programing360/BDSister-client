"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Sparkles,
  Laptop,
  GraduationCap,
  MapPin,
  CreditCard,
  Folder,
  Eye,
  Edit,
  Power,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { CommunityCategory } from "../../types/community";
import { CategoryStatusBadge } from "../common/community-status-badge";

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  Sparkles,
  Laptop,
  GraduationCap,
  MapPin,
  CreditCard,
};

interface CategoryTableProps {
  categories: CommunityCategory[];
  onToggleStatus: (categoryId: string) => void;
  onMoveOrder: (categoryId: string, direction: "UP" | "DOWN") => void;
}

export function CategoryTable({
  categories,
  onToggleStatus,
  onMoveOrder,
}: CategoryTableProps) {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-xl shadow-purple-500/5">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-gray-50/75 border-b border-gray-100 uppercase tracking-wider text-gray-500 font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-16">Order</th>
              <th className="py-3.5 px-4 min-w-[240px]">Category</th>
              <th className="py-3.5 px-4 min-w-[200px]">Description</th>
              <th className="py-3.5 px-4 text-center">Discussions</th>
              <th className="py-3.5 px-4 text-center">Posts</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {categories.map((cat, idx) => {
              const IconComp = iconMap[cat.icon] || Folder;
              return (
                <tr
                  key={cat.id}
                  className="hover:bg-purple-50/20 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-500 w-5 text-center">
                        {cat.displayOrder}
                      </span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => onMoveOrder(cat.id, "UP")}
                          disabled={idx === 0}
                          title="Move Up"
                          className="p-0.5 text-gray-400 hover:text-purple-600 disabled:opacity-30 disabled:hover:text-gray-400"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveOrder(cat.id, "DOWN")}
                          disabled={idx === categories.length - 1}
                          title="Move Down"
                          className="p-0.5 text-gray-400 hover:text-purple-600 disabled:opacity-30 disabled:hover:text-gray-400"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <Link
                          href={`/admin/community/categories/${cat.id}`}
                          className="font-bold text-gray-900 hover:text-purple-600 transition-colors block text-sm"
                        >
                          {cat.name}
                        </Link>
                        <span className="text-[11px] font-mono text-gray-400">
                          /{cat.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">
                      {cat.description}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-gray-900">
                    {cat.discussionsCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-gray-900">
                    {cat.postsCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <CategoryStatusBadge status={cat.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/community/categories/${cat.id}`}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all"
                        title="View Category Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/community/categories/${cat.id}/edit`}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(cat.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          cat.status === "ACTIVE"
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                        title={
                          cat.status === "ACTIVE"
                            ? "Deactivate (Demo)"
                            : "Activate (Demo)"
                        }
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Fallback */}
      <div className="md:hidden space-y-3">
        {categories.map((cat) => {
          const IconComp = iconMap[cat.icon] || Folder;
          return (
            <div
              key={cat.id}
              className="p-4 rounded-xl border border-gray-100 bg-white shadow-md space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <Link
                      href={`/admin/community/categories/${cat.id}`}
                      className="font-bold text-sm text-gray-900"
                    >
                      {cat.name}
                    </Link>
                    <p className="text-[11px] font-mono text-gray-400">
                      Order: #{cat.displayOrder} • /{cat.slug}
                    </p>
                  </div>
                </div>
                <CategoryStatusBadge status={cat.status} />
              </div>

              <p className="text-xs text-gray-600 line-clamp-2">
                {cat.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>
                  <strong>{cat.discussionsCount}</strong> Discussions
                </span>
                <span>
                  <strong>{cat.postsCount}</strong> Posts
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Link
                  href={`/admin/community/categories/${cat.id}`}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700"
                >
                  View
                </Link>
                <Link
                  href={`/admin/community/categories/${cat.id}/edit`}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-200"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onToggleStatus(cat.id)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600"
                >
                  Toggle
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
