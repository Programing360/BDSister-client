"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package,
  Edit,
  ExternalLink,
  ArrowLeft,
  Building2,
  Store,
  Boxes,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Tag,
  ShieldCheck,
  Trash2,
  Eye,
} from "lucide-react";
import type { ProductDocument } from "@/types/product";
import {
  getProductStatusBadge,
  getInventoryStatusBadge,
} from "@/features/product/utils/product-utils";

interface ProductDetailViewProps {
  product: ProductDocument;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState<string>(
    product.primaryImage ||
      product.images[0]?.url ||
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
  );
  const [archiving, setArchiving] = useState(false);

  const statusBadge = getProductStatusBadge(product.status);
  const inventoryBadge = getInventoryStatusBadge(product.inventory.status);

  const handleArchive = async () => {
    if (!window.confirm("Are you sure you want to archive this product listing?")) {
      return;
    }
    setArchiving(true);
    try {
      const res = await fetch(`/api/member/products/${product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/member/products");
        router.refresh();
      } else {
        alert("Failed to archive product.");
        setArchiving(false);
      }
    } catch {
      alert("Network error.");
      setArchiving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/member/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
              >
                {statusBadge.label}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="font-mono text-xs font-semibold text-gray-500">
                {product.inventory.sku}
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {product.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {product.status === "ACTIVE" && (
            <Link
              href={`/marketplace/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#5B46F6]" />
              <span>Public Storefront</span>
            </Link>
          )}

          <Link
            href={`/member/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B46F6] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B46F6]/25 hover:bg-[#4d3ae2]"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Product</span>
          </Link>

          {product.status !== "ARCHIVED" && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={archiving}
              className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-600 hover:bg-rose-100"
              title="Archive product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-sm">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(img.url)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img.url
                      ? "border-[#5B46F6] ring-2 ring-[#5B46F6]/20"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt="Thumbnail"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Ownership metadata card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Commercial Entity
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <Link
                  href={`/member/business/${product.businessId}`}
                  className="font-bold text-sm text-gray-900 hover:text-[#5B46F6] flex items-center gap-1"
                >
                  <span>{product.businessName}</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </Link>
                <span className="text-xs text-gray-500">{product.category}</span>
              </div>
            </div>

            {product.shopName && (
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-gray-900">{product.shopName}</span>
                  <span className="block text-[11px] text-gray-500">Dedicated Storefront</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Commercial Metrics, Inventory & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          {/* Financial & Inventory Overview Box */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-semibold text-gray-400">Listed Price</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900">
                    ৳{product.pricing.salePrice ? product.pricing.salePrice.toLocaleString() : product.pricing.regularPrice.toLocaleString()}
                  </span>
                  {product.pricing.discountPercent ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      -{product.pricing.discountPercent}%
                    </span>
                  ) : null}
                </div>
                {product.pricing.salePrice ? (
                  <span className="text-xs text-gray-400 line-through">
                    ৳{product.pricing.regularPrice.toLocaleString()}
                  </span>
                ) : null}
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400">Inventory Status</span>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${inventoryBadge.bg} ${inventoryBadge.color} ${inventoryBadge.border}`}
                  >
                    {inventoryBadge.label}
                  </span>
                </div>
                <span className="mt-1 block text-xs font-medium text-gray-600">
                  {product.inventory.trackInventory
                    ? `${product.inventory.quantity} units available`
                    : "Inventory untracked"}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400">Low Stock Alert</span>
                <p className="mt-2 text-sm font-bold text-gray-900">
                  {product.inventory.lowStockThreshold} units
                </p>
                <span className="text-[11px] text-gray-500">Notification trigger</span>
              </div>
            </div>

            {/* Confidential Internal Cost Warning */}
            {product.pricing.costPrice !== undefined && (
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Private Cost: <strong className="text-gray-900">৳{product.pricing.costPrice.toLocaleString()}</strong>
                </span>
                <span className="text-emerald-700 font-semibold">
                  Gross Margin: ৳{(product.pricing.regularPrice - product.pricing.costPrice).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Description & Details */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Product Narrative & Crafting Details
            </h3>

            <p className="text-sm font-medium text-gray-800 leading-relaxed bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
              {product.shortDescription}
            </p>

            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line pt-2">
              {product.description}
            </div>

            {/* Search Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Keywords & Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
