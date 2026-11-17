"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  Trash2,
  ArrowLeft,
  DollarSign,
  Boxes,
  Eye,
} from "lucide-react";
import type { ProductDocument } from "@/types/product";
import type { PublicCategory } from "@/types/category";
import { calculateDiscountPercent } from "@/features/product/utils/product-utils";

interface ProductEditFormProps {
  product: ProductDocument;
  categories: PublicCategory[];
}

export function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [subcategory, setSubcategory] = useState(product.subcategory || "");
  const [shortDescription, setShortDescription] = useState(product.shortDescription);
  const [description, setDescription] = useState(product.description);
  const [tagsInput, setTagsInput] = useState(product.tags?.join(", ") || "");

  // Media
  const [images, setImages] = useState(product.images || []);

  // Pricing
  const [regularPrice, setRegularPrice] = useState<number | "">(product.pricing.regularPrice);
  const [salePrice, setSalePrice] = useState<number | "">(product.pricing.salePrice || "");
  const [costPrice, setCostPrice] = useState<number | "">(product.pricing.costPrice || "");

  // Inventory
  const [sku, setSku] = useState(product.inventory.sku);
  const [quantity, setQuantity] = useState<number | "">(product.inventory.quantity);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | "">(product.inventory.lowStockThreshold);
  const [trackInventory, setTrackInventory] = useState(product.inventory.trackInventory);

  // Status
  const [status, setStatus] = useState(product.status);
  const [visibility, setVisibility] = useState(product.visibility);

  const selectedCatDoc = categories.find((c) => c.name === category);
  const availableSubcategories = selectedCatDoc?.subcategories || [];

  const numRegular = typeof regularPrice === "number" ? regularPrice : 0;
  const numSale = typeof salePrice === "number" ? salePrice : 0;
  const discountPercent = calculateDiscountPercent(numRegular, numSale > 0 ? numSale : undefined);

  // File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "product");

      const res = await fetch("/api/member/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload image.");
      }

      const newImg = {
        id: `img_${Date.now()}`,
        url: data.data.url,
        order: images.length,
        isPrimary: images.length === 0,
      };

      setImages((prev) => [...prev, newImg]);
    } catch (err: any) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      if (filtered.length > 0 && !filtered.some((i) => i.isPrimary) && filtered[0]) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const setPrimaryImage = (id: string) => {
    setImages((prev) =>
      prev.map((i) => ({
        ...i,
        isPrimary: i.id === id,
      }))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (name.trim().length < 3) {
      setError("Product name must be at least 3 characters.");
      return;
    }
    if (shortDescription.trim().length < 10) {
      setError("Short description must be at least 10 characters.");
      return;
    }
    if (description.trim().length < 20) {
      setError("Full description must be at least 20 characters.");
      return;
    }
    if (!numRegular || numRegular <= 0) {
      setError("Regular price must be greater than 0 BDT.");
      return;
    }
    if (numSale > 0 && numSale > numRegular) {
      setError("Sale price cannot exceed the regular price.");
      return;
    }
    if (!sku.trim()) {
      setError("SKU code is required.");
      return;
    }
    if (images.length === 0) {
      setError("At least one product image is required.");
      return;
    }

    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const primaryImg = images.find((i) => i.isPrimary)?.url || images[0]?.url;

    const payload = {
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory || undefined,
      tags,
      pricing: {
        regularPrice: numRegular,
        salePrice: numSale > 0 ? numSale : undefined,
        costPrice: typeof costPrice === "number" ? costPrice : undefined,
        currency: "BDT" as const,
      },
      images,
      primaryImage: primaryImg,
      inventory: {
        sku: sku.trim().toUpperCase(),
        quantity: typeof quantity === "number" ? quantity : 0,
        lowStockThreshold: typeof lowStockThreshold === "number" ? lowStockThreshold : 5,
        trackInventory,
      },
      status,
      visibility,
    };

    try {
      const res = await fetch(`/api/member/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update product.");
      }

      setSuccess("Product listing updated successfully!");
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to save product updates.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Header with back link and quick view */}
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
              Edit Product: {product.name}
            </h1>
            <p className="text-xs text-gray-500">
              Business: {product.businessName} • SKU: {product.inventory.sku}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/member/products/${product.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Information Section */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B46F6]/10 text-[#5B46F6]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Basic Information</h2>
              <p className="text-xs text-gray-500">Product title, categories, and descriptions</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory("");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              >
                <option value="">Select Subcategory (Optional)</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Short Description / Summary *
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Full Description *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
            />
          </div>
        </div>

        {/* Media & Gallery */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Product Photos</h2>
              <p className="text-xs text-gray-500">Upload or reorder gallery photos</p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="edit-photo-upload"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={uploadingImage}
              className="hidden"
            />
            <label
              htmlFor="edit-photo-upload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-xs"
            >
              {uploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              ) : (
                <Upload className="h-4 w-4 text-[#5B46F6]" />
              )}
              <span>{uploadingImage ? "Uploading..." : "Add New Image"}</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative rounded-2xl overflow-hidden border-2 bg-gray-100 group aspect-square shadow-sm ${
                  img.isPrimary ? "border-[#5B46F6] ring-2 ring-[#5B46F6]/20" : "border-gray-200"
                }`}
              >
                <Image
                  src={img.url}
                  alt="Product preview"
                  fill
                  sizes="200px"
                  className="object-cover"
                />

                {img.isPrimary && (
                  <span className="absolute top-2 left-2 rounded-md bg-[#5B46F6] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    Primary
                  </span>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(img.id)}
                      className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-gray-800 shadow hover:bg-gray-100"
                    >
                      Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="rounded-lg bg-rose-600 p-1.5 text-white shadow hover:bg-rose-700"
                    title="Remove photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Pricing & Commercials</h2>
              <p className="text-xs text-gray-500">Regular and promotional sale prices in BDT</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Regular Price (BDT) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Sale Price (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                />
              </div>
            </div>
          </div>

          {discountPercent > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">
                Discount: {discountPercent}% OFF (Saves ৳{(numRegular - numSale).toLocaleString()})
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Internal Cost Price (Private)
            </label>
            <div className="relative max-w-sm">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                ৳
              </span>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
            </div>
          </div>
        </div>

        {/* Inventory & Status */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Inventory & Publication Status</h2>
              <p className="text-xs text-gray-500">Stock quantities and marketplace visibility</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                SKU *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full font-mono rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Quantity *
              </label>
              <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min={0}
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Lifecycle Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              >
                <option value="DRAFT">Draft (Private)</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="ACTIVE">Active (Published)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Public Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private (Unlisted)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/member/products"
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5B46F6]/25 hover:bg-[#4d3ae2] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Save className="h-4 w-4" />}
            <span>{saving ? "Saving Changes..." : "Save Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
