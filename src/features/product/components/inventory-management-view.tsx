"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Edit,
  ArrowLeft,
  Loader2,
  Package,
  Layers,
  Save,
} from "lucide-react";
import type { ProductDocument } from "@/types/product";
import { getInventoryStatusBadge } from "@/features/product/utils/product-utils";

interface InventoryManagementViewProps {
  initialProducts: ProductDocument[];
}

export function InventoryManagementView({ initialProducts }: InventoryManagementViewProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDocument[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [adjustingId, setAdjustingId] = useState<string | null>(null);

  // Quick direct input editing
  const [customEditingId, setCustomEditingId] = useState<string | null>(null);
  const [customQty, setCustomQty] = useState<number>(0);

  // Metrics
  const totalSkus = products.length;
  const inStockCount = products.filter((p) => p.inventory.status === "IN_STOCK").length;
  const lowStockCount = products.filter((p) => p.inventory.status === "LOW_STOCK").length;
  const outOfStockCount = products.filter((p) => p.inventory.status === "OUT_OF_STOCK").length;

  const filtered = products.filter((p) => {
    if (stockFilter !== "all" && p.inventory.status !== stockFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.inventory.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  const handleAdjustStock = async (productId: string, adjustment: number, mode: "SET" | "INCREMENT") => {
    setAdjustingId(productId);
    try {
      const res = await fetch(`/api/member/products/${productId}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustment, mode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.data : p))
        );
        setCustomEditingId(null);
      } else {
        alert(data.error?.message || "Failed to adjust stock.");
      }
    } catch {
      alert("Network error updating inventory.");
    } finally {
      setAdjustingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header */}
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
              Stock & Inventory Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Real-time available units, SKU catalog, and fast stock adjustments.
            </p>
          </div>
        </div>

        <Link
          href="/member/products/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B46F6]/25 hover:bg-[#4d3ae2]"
        >
          <Plus className="h-4 w-4" />
          <span>New Product SKU</span>
        </Link>
      </div>

      {/* 2. Inventory Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500">Total SKUs</span>
          <p className="mt-2 text-2xl font-black text-gray-900">{totalSkus}</p>
          <span className="text-[11px] text-gray-400">Tracked catalog items</span>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700">In Stock</span>
          <p className="mt-2 text-2xl font-black text-emerald-800">{inStockCount}</p>
          <span className="text-[11px] text-emerald-600">Sufficient units</span>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-amber-700">Low Stock</span>
          <p className="mt-2 text-2xl font-black text-amber-800">{lowStockCount}</p>
          <span className="text-[11px] text-amber-600">Action recommended</span>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-700">Out of Stock</span>
          <p className="mt-2 text-2xl font-black text-rose-800">{outOfStockCount}</p>
          <span className="text-[11px] text-rose-600">0 Available</span>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by SKU or product name..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: "all", label: "All Items" },
            { id: "IN_STOCK", label: "In Stock" },
            { id: "LOW_STOCK", label: "Low Stock" },
            { id: "OUT_OF_STOCK", label: "Out of Stock" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStockFilter(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                stockFilter === tab.id
                  ? "bg-[#5B46F6] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Table */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Boxes className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">No Inventory Found</h3>
          <p className="mt-1 text-xs text-gray-500">
            No products match your current search or stock filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-4 pl-6 pr-3">Product / SKU</th>
                  <th className="px-3 py-4">Status</th>
                  <th className="px-3 py-4">Stock Level</th>
                  <th className="px-3 py-4">Low Alert Threshold</th>
                  <th className="py-4 pl-3 pr-6 text-right">Quick Stock Adjustments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((product) => {
                  const badge = getInventoryStatusBadge(product.inventory.status);
                  const isAdjusting = adjustingId === product.id;
                  const isCustomEditing = customEditingId === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Product Thumbnail & SKU */}
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
                          <div>
                            <Link
                              href={`/member/products/${product.id}`}
                              className="font-bold text-gray-900 hover:text-[#5B46F6] line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="font-mono text-[11px] font-semibold text-gray-500">
                              SKU: {product.inventory.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.color} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Stock Quantity */}
                      <td className="px-3 py-3.5">
                        {isCustomEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              value={customQty}
                              onChange={(e) => setCustomQty(Number(e.target.value))}
                              className="w-16 rounded-lg border border-[#5B46F6] px-2 py-1 text-xs font-bold text-gray-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustStock(product.id, customQty, "SET")}
                              disabled={isAdjusting}
                              className="rounded-lg bg-[#5B46F6] p-1 text-white hover:bg-[#4d3ae2]"
                              title="Save stock"
                            >
                              <Save className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCustomEditingId(null)}
                              className="text-[10px] text-gray-400 hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900">
                              {product.inventory.quantity}
                            </span>
                            <span className="text-gray-400 text-[11px]">units</span>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomEditingId(product.id);
                                setCustomQty(product.inventory.quantity);
                              }}
                              className="text-gray-400 hover:text-[#5B46F6]"
                              title="Set exact stock"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Threshold */}
                      <td className="px-3 py-3.5 text-gray-600 font-semibold">
                        {product.inventory.lowStockThreshold} units
                      </td>

                      {/* Adjustments */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAdjusting ? (
                            <Loader2 className="h-4 w-4 animate-spin text-[#5B46F6]" />
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={product.inventory.quantity <= 0}
                                onClick={() => handleAdjustStock(product.id, -1, "INCREMENT")}
                                className="rounded-lg border border-gray-200 bg-white p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                title="Decrease by 1"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAdjustStock(product.id, 1, "INCREMENT")}
                                className="rounded-lg border border-gray-200 bg-white p-1 text-gray-600 hover:bg-gray-100"
                                title="Add 1 unit"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAdjustStock(product.id, 5, "INCREMENT")}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-100"
                                title="Add 5 units"
                              >
                                +5
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAdjustStock(product.id, 10, "INCREMENT")}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-100"
                                title="Add 10 units"
                              >
                                +10
                              </button>
                            </>
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
