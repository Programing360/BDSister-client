"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Boxes,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  Sparkles,
  Building2,
  Store,
  Tag,
} from "lucide-react";
import type { BusinessDocument } from "@/types/business";
import type { ShopDocument } from "@/types/shop";
import type { PublicCategory } from "@/types/category";
import { calculateDiscountPercent } from "@/features/product/utils/product-utils";

interface ProductCreateWizardProps {
  businesses: BusinessDocument[];
  shops: ShopDocument[];
  categories: PublicCategory[];
}

export function ProductCreateWizard({
  businesses,
  shops,
  categories,
}: ProductCreateWizardProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [businessId, setBusinessId] = useState(businesses[0]?.id || "");
  const [shopId, setShopId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]?.name || "Fashion & Saree");
  const [subcategory, setSubcategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Media
  const [images, setImages] = useState<Array<{ id: string; url: string; alt?: string; order: number; isPrimary: boolean }>>([
    {
      id: "img_default",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      order: 0,
      isPrimary: true,
    },
  ]);

  // Pricing
  const [regularPrice, setRegularPrice] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [costPrice, setCostPrice] = useState<number | "">("");

  // Inventory
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState<number | "">(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | "">(5);
  const [trackInventory, setTrackInventory] = useState(true);

  // Derived subcategories for chosen category
  const selectedCatDoc = categories.find((c) => c.name === category);
  const availableSubcategories = selectedCatDoc?.subcategories || [];

  // Filtered shops for the selected business
  const availableShops = shops.filter((s) => s.businessId === businessId);

  // Auto-generate a sensible SKU if empty
  const handleAutoSku = () => {
    const bizPrefix = businesses.find((b) => b.id === businessId)?.name.substring(0, 3).toUpperCase() || "BDS";
    const namePrefix = name ? name.substring(0, 3).toUpperCase() : "PRD";
    const random = Math.floor(1000 + Math.random() * 9000);
    setSku(`${bizPrefix}-${namePrefix}-${random}`);
  };

  // Upload handler via existing `/api/member/upload`
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

  // Pricing calculation
  const numRegular = typeof regularPrice === "number" ? regularPrice : 0;
  const numSale = typeof salePrice === "number" ? salePrice : 0;
  const discountPercent = calculateDiscountPercent(numRegular, numSale > 0 ? numSale : undefined);

  // Validation per step
  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!businessId) {
        setError("Please select a registered business.");
        return false;
      }
      if (name.trim().length < 3) {
        setError("Product name must be at least 3 characters.");
        return false;
      }
      if (shortDescription.trim().length < 10) {
        setError("Short description must be at least 10 characters.");
        return false;
      }
      if (description.trim().length < 20) {
        setError("Full description must be at least 20 characters.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (images.length === 0) {
        setError("Please upload at least one product image.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!numRegular || numRegular <= 0) {
        setError("Please enter a valid regular price greater than 0 BDT.");
        return false;
      }
      if (numSale > 0 && numSale > numRegular) {
        setError("Sale price cannot exceed the regular price.");
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (!sku.trim()) {
        setError("Please provide or generate an SKU for inventory tracking.");
        return false;
      }
      if (trackInventory && (typeof quantity !== "number" || quantity < 0)) {
        setError("Stock quantity must be a non-negative number.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (submitStatus: "DRAFT" | "PENDING_REVIEW") => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const primaryImg = images.find((i) => i.isPrimary)?.url || images[0]?.url;

    const payload = {
      businessId,
      shopId: shopId || undefined,
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
      status: submitStatus,
      visibility: "PUBLIC" as const,
    };

    try {
      const res = await fetch("/api/member/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to create product.");
      }

      router.push("/member/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Wizard Progress Bar */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: "Basic Info", icon: Package },
            { step: 2, label: "Imagery", icon: ImageIcon },
            { step: 3, label: "Pricing", icon: DollarSign },
            { step: 4, label: "Inventory", icon: Boxes },
            { step: 5, label: "Publish", icon: CheckCircle2 },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : isCurrent
                        ? "bg-[#5B46F6] text-white shadow-lg shadow-[#5B46F6]/30"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span
                    className={`mt-2 text-[10px] sm:text-xs font-bold ${
                      isCurrent ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < 4 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-all ${
                      isCompleted ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Step Forms */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Step 1 — Product Information</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Identify your enterprise, assign categories, and craft an appealing title and narrative.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Business Owner Enterprise *
                </label>
                <select
                  value={businessId}
                  onChange={(e) => {
                    setBusinessId(e.target.value);
                    setShopId("");
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Associated Shop (Optional)
                </label>
                <select
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                >
                  <option value="">Default Business Catalog</option>
                  {availableShops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Product Title / Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Nilambari Handwoven Muslin Jamdani"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
              <span className="text-[11px] text-gray-400">At least 3 characters.</span>
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
                Short Highlight / Summary *
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A brief 1-2 sentence highlight for catalog cards"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
              <span className="text-[11px] text-gray-400">10 to 300 characters.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Full Artisan Story & Description *
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material, handcrafting technique, dimensions, care instructions, and maker origin..."
                className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
              <span className="text-[11px] text-gray-400">At least 20 characters.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Search Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Jamdani, Muslin, Handloom, Heritage, Indigo"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Media & Gallery */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Step 2 — Product Imagery</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Upload authentic, high-resolution photographs of your handcrafted item. The primary image is shown on marketplace cards.
              </p>
            </div>

            {/* Upload Zone */}
            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#5B46F6] transition-colors bg-gray-50/50">
              <input
                type="file"
                id="product-image-upload"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <label
                htmlFor="product-image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B46F6]/10 text-[#5B46F6] mb-3">
                  {uploadingImage ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Upload className="h-6 w-6" />
                  )}
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {uploadingImage ? "Uploading to Media Cloud..." : "Click to Upload Product Photo"}
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  JPEG, PNG, or WebP up to 8MB.
                </span>
              </label>
            </div>

            {/* Gallery Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                Selected Product Photos ({images.length})
              </h3>
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
                          Make Primary
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
          </div>
        )}

        {/* STEP 3: Pricing */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Step 3 — Pricing & Value</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Set fair artisan prices in Bangladeshi Taka (BDT). Optional sale pricing automatically calculates discount savings for buyers.
              </p>
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
                    placeholder="e.g. 18500"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                </div>
                <span className="text-[11px] text-gray-400">The standard listed retail price.</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Promotional Sale Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 16500"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                </div>
                <span className="text-[11px] text-gray-400">Must be lower than regular price.</span>
              </div>
            </div>

            {/* Discount Preview Badge */}
            {discountPercent > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800">
                    Active Discount: {discountPercent}% OFF
                  </span>
                  <p className="text-[11px] text-emerald-700">
                    Buyers will see: ৳{numSale.toLocaleString()} (was ৳{numRegular.toLocaleString()})
                  </p>
                </div>
                <span className="rounded-xl bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow-xs">
                  Save ৳{(numRegular - numSale).toLocaleString()}
                </span>
              </div>
            )}

            {/* Private Cost Price */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Internal Cost Price (Private — Only visible to you)
              </label>
              <div className="relative max-w-sm">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 11000"
                  className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-xs sm:text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                />
              </div>
              <span className="text-[11px] text-gray-400">
                This field is strictly confidential and never displayed on public pages or APIs.
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Inventory */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Step 4 — Inventory & Stock Management</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Configure SKU tracking, available units, and low-stock alert thresholds.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-gray-50 p-4">
              <div>
                <span className="text-sm font-bold text-gray-900">Enable Stock Tracking</span>
                <p className="text-xs text-gray-500">
                  Automatically decrement inventory units upon order placement.
                </p>
              </div>
              <input
                type="checkbox"
                checked={trackInventory}
                onChange={(e) => setTrackInventory(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    SKU Code *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSku}
                    className="text-[11px] font-bold text-[#5B46F6] hover:underline"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="e.g. SHU-JAM-9821"
                  className="w-full font-mono rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min={0}
                  value={quantity}
                  disabled={!trackInventory}
                  onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 10"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 disabled:bg-gray-100 disabled:text-gray-400"
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
                  disabled={!trackInventory}
                  onChange={(e) => setLowStockThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 5"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Publish */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Step 5 — Review & Confirmation</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Verify all listing details before saving as draft or submitting for market publication.
              </p>
            </div>

            {/* Product Summary Preview Card */}
            <div className="rounded-3xl border border-gray-200/80 bg-gray-50/50 p-6 flex flex-col md:flex-row gap-6">
              <div className="relative h-44 w-full md:w-44 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <Image
                  src={images.find((i) => i.isPrimary)?.url || images[0]?.url || ""}
                  alt={name}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-[#5B46F6]">
                    {category}
                  </span>
                  {subcategory && (
                    <span className="rounded-full bg-gray-200/60 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                      {subcategory}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-gray-900">{name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{shortDescription}</p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">Price: </span>
                    <span className="font-bold text-gray-900">
                      ৳{numSale > 0 ? numSale.toLocaleString() : numRegular.toLocaleString()}
                    </span>
                    {numSale > 0 && (
                      <span className="ml-1 text-gray-400 line-through">
                        ৳{numRegular.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">SKU: </span>
                    <span className="font-mono font-bold text-gray-700">{sku}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-medium">Stock: </span>
                    <span className="font-bold text-emerald-700">
                      {trackInventory ? `${quantity} Units` : "Untracked"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Publishing Advice */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-900">
              <p className="font-semibold">Publication Notice:</p>
              <p className="mt-0.5 text-blue-700">
                Submitting for review queues your product for standard platform verification. Draft products remain completely private to your member account until submitted.
              </p>
            </div>
          </div>
        )}

        {/* 3. Wizard Footer Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <Link
              href="/member/products"
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </Link>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B46F6]/25 hover:bg-[#4d3ae2] transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit("DRAFT")}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                <span>Save as Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("PENDING_REVIEW")}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5B46F6]/25 hover:bg-[#4d3ae2]"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                <span>Submit for Review</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
