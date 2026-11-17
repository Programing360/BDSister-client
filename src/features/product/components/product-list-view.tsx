"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  ExternalLink,
  Store,
} from "lucide-react";
import type { ProductDocument, ProductStatsSummary } from "@/types/product";
import type { BusinessDocument } from "@/types/business";
import {
  getProductStatusBadge,
  getInventoryStatusBadge,
} from "@/features/product/utils/product-utils";

interface ProductListViewProps {
  initialProducts: ProductDocument[];
  businesses: BusinessDocument[];
  stats: ProductStatsSummary;
}

export function ProductListView({
  initialProducts,
  businesses,
  stats,
}: ProductListViewProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDocument[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Filtering
  const filteredProducts = products.filter((p) => {
    if (selectedBusiness !== "all" && p.businessId !== selectedBusiness) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (selectedStatus !== "all" && p.status !== selectedStatus) return false;
    if (selectedStockStatus !== "all" && p.inventory.status !== selectedStockStatus) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.inventory.sku.toLowerCase().includes(q);
      const matchBiz = p.businessName.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBiz) return false;
    }
    return true;
  });

  // Sorting
  filteredProducts.sort((a, b) => {
    if (sortBy === "price_asc") return a.pricing.regularPrice - b.pricing.regularPrice;
    if (sortBy === "price_desc") return b.pricing.regularPrice - a.pricing.regularPrice;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleArchive = async (id: string) => {
    if (!window.confirm("Are you sure you want to archive this product? It will no longer be visible to buyers.")) {
      return;
    }
    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/member/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "ARCHIVED" } : p)));
        router.refresh();
      } else {
        alert("Failed to archive product. Please try again.");
      }
    } catch {
      alert("Network error while archiving product.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const hasNoBusinesses = businesses.length === 0;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Product Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create, organize, and monitor artisan creations, stock levels, and commercial listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/member/products/inventory"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#5B46F6]" />
            <span>Manage Inventory</span>
          </Link>

          <Link
            href={hasNoBusinesses ? "/member/business/create" : "/member/products/create"}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5B46F6]/25 hover:bg-[#4d3ae2] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 2. Statistical Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Total</span>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">{stats.total}</p>
          <span className="text-[11px] text-gray-500">Registered items</span>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Published</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-800">{stats.published}</p>
          <span className="text-[11px] text-emerald-600">Active in market</span>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Drafts</span>
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-gray-800">{stats.draft}</p>
          <span className="text-[11px] text-gray-500">Unpublished</span>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-sm">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold">In Review</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-800">{stats.pendingReview}</p>
          <span className="text-[11px] text-amber-600">Pending approval</span>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold">Low Stock</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{stats.lowStock}</p>
          <span className="text-[11px] text-gray-500">Below threshold</span>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 shadow-sm">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-semibold">Out of Stock</span>
            <XCircle className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-800">{stats.outOfStock}</p>
          <span className="text-[11px] text-rose-600">0 items left</span>
        </div>
      </div>

      {/* 3. If User has NO Business: Guide Prompt */}
      {hasNoBusinesses && (
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Register Your Business Before Adding Products
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-xl">
                  Every product on BDSisters belongs to a registered female-led enterprise or artisan studio. Complete your 5-minute business registration to unlock marketplace selling.
                </p>
              </div>
            </div>
            <Link
              href="/member/business/create"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 transition-all"
            >
              <span>Register Business</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 4. Filter & Search Toolbar */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU, or tags..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#5B46F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 transition-all"
            />
          </div>

          {/* Business Filter */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter by Business"
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-700 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
            >
              <option value="all">All Businesses</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              aria-label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-700 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-700 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Secondary status pill filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mr-1">
            Status:
          </span>
          {["all", "ACTIVE", "DRAFT", "PENDING_REVIEW", "ARCHIVED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                selectedStatus === st
                  ? "bg-[#5B46F6] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "all" ? "All Statuses" : st.replace("_", " ")}
            </button>
          ))}

          <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] ml-3 mr-1">
            Stock:
          </span>
          {["all", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].map((sk) => (
            <button
              key={sk}
              type="button"
              onClick={() => setSelectedStockStatus(sk)}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                selectedStockStatus === sk
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {sk === "all" ? "All Levels" : sk.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Products Table / Card Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5B46F6]/10 text-[#5B46F6]">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">No Products Found</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            {search || selectedCategory !== "all" || selectedStatus !== "all"
              ? "No products match the selected filters. Try clearing your search parameters."
              : "You haven't created any products yet. Showcase your handcrafted goods to start selling."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(search || selectedCategory !== "all" || selectedStatus !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedBusiness("all");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSelectedStockStatus("all");
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reset Filters
              </button>
            )}
            <Link
              href={hasNoBusinesses ? "/member/business/create" : "/member/products/create"}
              className="rounded-xl bg-[#5B46F6] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#4d3ae2]"
            >
              {hasNoBusinesses ? "Register Business First" : "Create First Product"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-4 pl-6 pr-3">Product</th>
                  <th className="px-3 py-4">SKU / Business</th>
                  <th className="px-3 py-4">Price (BDT)</th>
                  <th className="px-3 py-4">Stock</th>
                  <th className="px-3 py-4">Status</th>
                  <th className="py-4 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredProducts.map((product) => {
                  const statusBadge = getProductStatusBadge(product.status);
                  const inventoryBadge = getInventoryStatusBadge(product.inventory.status);

                  return (
                    <tr
                      key={product.id}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                            <Image
                              src={product.primaryImage}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <Link
                              href={`/member/products/${product.id}`}
                              className="font-bold text-gray-900 hover:text-[#5B46F6] transition-colors line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-gray-500">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Business */}
                      <td className="px-3 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] font-semibold text-gray-700">
                            {product.inventory.sku}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate max-w-[140px]">
                            {product.businessName}
                          </span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-3 py-3.5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 font-bold text-gray-900">
                            <span>৳{product.pricing.salePrice ? product.pricing.salePrice.toLocaleString() : product.pricing.regularPrice.toLocaleString()}</span>
                            {product.pricing.discountPercent ? (
                              <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-bold text-emerald-800">
                                -{product.pricing.discountPercent}%
                              </span>
                            ) : null}
                          </div>
                          {product.pricing.salePrice ? (
                            <span className="text-[11px] text-gray-400 line-through">
                              ৳{product.pricing.regularPrice.toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Inventory Count & Badge */}
                      <td className="px-3 py-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${inventoryBadge.bg} ${inventoryBadge.color} ${inventoryBadge.border}`}
                          >
                            {product.inventory.trackInventory
                              ? `${product.inventory.quantity} units`
                              : "Untracked"}
                          </span>
                        </div>
                      </td>

                      {/* Publication Status Badge */}
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/member/products/${product.id}`}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            title="View Product"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/member/products/${product.id}/edit`}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#5B46F6] transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {product.status !== "ARCHIVED" && (
                            <button
                              type="button"
                              onClick={() => handleArchive(product.id)}
                              disabled={isDeletingId === product.id}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Archive Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
