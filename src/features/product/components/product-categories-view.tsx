"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Plus,
  Layers,
  CheckCircle2,
  Tag,
  ShieldCheck,
} from "lucide-react";
import type { PublicCategory } from "@/types/category";

interface ProductCategoriesViewProps {
  categories: PublicCategory[];
}

export function ProductCategoriesView({ categories }: ProductCategoriesViewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/member/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Platform Product Categories
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Official BDSisters.org taxonomy, supported artisan niches, and subcategory mappings.
            </p>
          </div>
        </div>

        <Link
          href="/member/products/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B46F6]/25 hover:bg-[#4d3ae2]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Seller Taxonomy Guidance Notice */}
      <div className="rounded-3xl border border-[#5B46F6]/20 bg-gradient-to-r from-[#5B46F6]/5 to-purple-50/50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Curated Artisan Classification Standard
            </h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              Global marketplace categories are curated and moderated by platform administrators to ensure high search relevancy for conscious consumers. When creating products, assign the closest category and specify relevant subcategories and tags.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7366F7]">
                  {cat.slug}
                </span>
                <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-[#5B46F6]">
                {cat.productCount ? `${cat.productCount} items` : "Active"}
              </span>
            </div>

            {cat.description && (
              <p className="text-xs text-gray-600 leading-relaxed">
                {cat.description}
              </p>
            )}

            {/* Subcategories */}
            {cat.subcategories && cat.subcategories.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Supported Subcategories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
