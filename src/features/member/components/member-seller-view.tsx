"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Store,
    Plus,
    Trash2,
    RefreshCw,
    Tag,
    CheckCircle2,
    AlertCircle,
    Truck,
    UploadCloud,
    Loader2,
    X,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";
import { uploadSignedToCloudinary } from "@/lib/cloudinary/cloudinary";

interface SellerProductItem {
    _id: string;
    title: string;
    brandName?: string;
    category?: string;
    subCategory?: string;
    images?: string[];
    mrpPrice?: number;
    salePrice: number;
    wholesalePrice?: number;
    isWholesaleEligible?: boolean;
    stock?: number;
}

interface SellerOrderItem {
    _id: string;
    buyerId?: { fullName?: string; email?: string };
    orderItems: Array<{ title?: string; quantity: number; price: number }>;
    totalAmount: number;
    sellerEarnings?: number;
    paymentStatus: string;
    orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    createdAt: string;
}

interface BusinessBrandOption {
    businessId: string;
    brandName: string;
}

export function MemberSellerView() {
    const [products, setProducts] = useState<SellerProductItem[]>([]);
    const [sellerOrders, setSellerOrders] = useState<SellerOrderItem[]>([]);
    const [brandOptions, setBrandOptions] = useState<BusinessBrandOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Add Product Form State (Synchronized with createProductSchema)
    const [selectedBrandKey, setSelectedBrandKey] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [listingType, setListingType] = useState<"Product" | "Service">("Product");
    const [subCategory, setSubCategory] = useState("Modest Fashion & Apparel");
    const [imageUrl, setImageUrl] = useState("");
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mrpPrice, setMrpPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [isWholesaleEligible, setIsWholesaleEligible] = useState(false);
    const [wholesalePrice, setWholesalePrice] = useState("");
    const [stock, setStock] = useState("10");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchSellerData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [prodRes, ordersRes, bizRes] = await Promise.allSettled([
                apiClient.get<{ data?: SellerProductItem[] }>(API_ENDPOINTS.ecommerce.products),
                apiClient.get<{ data?: SellerOrderItem[] }>(API_ENDPOINTS.ecommerce.sellerOrders),
                apiClient.get<{ data?: { _id: string; brands?: Array<{ brandName: string }> } }>(
                    API_ENDPOINTS.business.my
                ),
            ]);

            if (prodRes.status === "fulfilled") {
                const rawP = prodRes.value as any;
                const list = Array.isArray(rawP)
                    ? rawP
                    : Array.isArray(rawP?.data)
                    ? rawP.data
                    : Array.isArray(rawP?.data?.products)
                    ? rawP.data.products
                    : Array.isArray(rawP?.products)
                    ? rawP.products
                    : [];
                setProducts(list);
            }

            if (ordersRes.status === "fulfilled") {
                const rawO = ordersRes.value as any;
                const list = Array.isArray(rawO)
                    ? rawO
                    : Array.isArray(rawO?.data)
                    ? rawO.data
                    : Array.isArray(rawO?.data?.orders)
                    ? rawO.data.orders
                    : Array.isArray(rawO?.orders)
                    ? rawO.orders
                    : [];
                setSellerOrders(list);
            }

            if (bizRes.status === "fulfilled") {
                const rawB = bizRes.value as unknown as {
                    data?: { _id: string; brands?: Array<{ brandName: string }> };
                };
                if (rawB.data?._id && Array.isArray(rawB.data.brands)) {
                    const opts = rawB.data.brands.map((b) => ({
                        businessId: rawB.data!._id,
                        brandName: b.brandName,
                    }));
                    setBrandOptions(opts);
                    if (opts[0] && !selectedBrandKey) {
                        setSelectedBrandKey(`${opts[0].businessId}::${opts[0].brandName}`);
                    }
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [selectedBrandKey]);

    useEffect(() => {
        fetchSellerData();
    }, [fetchSellerData]);

    const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageUploadError("Please upload an image file (JPEG, PNG, WebP, or GIF).");
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            setImageUploadError("Image size must be less than 8MB.");
            return;
        }

        setImageUploadError(null);
        setIsUploadingImage(true);

        try {
            const uploadedUrl = await uploadSignedToCloudinary(file);
            setImageUrl(uploadedUrl);
            showToast("Cover image uploaded to Cloudinary successfully!");
        } catch (err: unknown) {
            setImageUploadError(err instanceof Error ? err.message : "Failed to upload image.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        setImageUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBrandKey) {
            setError("Please select one of your registered brands first.");
            return;
        }

        if (!title.trim()) {
            setError("Product title is required.");
            return;
        }

        if (!description.trim()) {
            setError("Product description / story is required. Please provide specifications or details.");
            return;
        }

        if (!salePrice || Number(salePrice) <= 0) {
            setError("Please enter a valid discounted sale price.");
            return;
        }

        if (mrpPrice && Number(salePrice) > Number(mrpPrice)) {
            setError("Discounted sale price must be equal to or less than the MRP price.");
            return;
        }

        if (isUploadingImage) {
            setError("Please wait for the cover image to finish uploading.");
            return;
        }

        const [businessId, brandName] = selectedBrandKey.split("::");
        setIsAdding(true);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.ecommerce.createProduct, {
                businessId,
                brandName,
                title: title.trim(),
                description: description.trim(),
                category: listingType,
                subCategory: subCategory.trim() || undefined,
                images: imageUrl.trim() ? [imageUrl.trim()] : [],
                mrpPrice: mrpPrice ? Number(mrpPrice) : Number(salePrice),
                salePrice: Number(salePrice),
                isWholesaleEligible,
                wholesalePrice:
                    isWholesaleEligible && wholesalePrice ? Number(wholesalePrice) : undefined,
                stock: Number(stock) || 1,
            });

            setTitle("");
            setDescription("");
            setImageUrl("");
            setImageUploadError(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setMrpPrice("");
            setSalePrice("");
            setWholesalePrice("");
            setIsWholesaleEligible(false);
            showToast("Product listing published successfully to BDSisters Marketplace!");
            await fetchSellerData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add product.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleStatusChange = async (
        orderId: string,
        newStatus: SellerOrderItem["orderStatus"]
    ) => {
        try {
            await apiClient.patch(API_ENDPOINTS.ecommerce.updateOrderStatus(orderId), {
                orderStatus: newStatus,
            });
            showToast(`Order status updated to ${newStatus}! Buyer notified automatically.`);
            await fetchSellerData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update order status.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this listing from the marketplace?")) return;
        try {
            await apiClient.delete(API_ENDPOINTS.ecommerce.deleteProduct(id));
            await fetchSellerData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete listing.");
        }
    };

    return (
        <div className="space-y-6 pb-14">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Seller Center & Order Fulfillment
                        </h1>
                        <SectionHelpTooltip
                            title="Seller Storefront & Live Dispatch"
                            explanation="Add products under your registered brands and update customer order statuses to trigger live delivery notifications."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Manage product listings, MRP discounts, wholesale pricing, and incoming customer orders.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchSellerData}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Customer Orders to Fulfill (Live Status Update -> Notifies Buyer) */}
            <div className="rounded-2xl border border-[#D98408]/30 bg-white p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Truck className="h-4 w-4 text-[#D98408]" />
                    <h2 className="text-sm font-bold text-gray-900">
                        Customer Orders to Fulfill ({sellerOrders.length})
                    </h2>
                </div>

                {sellerOrders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4">No customer orders received yet.</p>
                ) : (
                    <div className="space-y-3">
                        {sellerOrders.map((ord) => (
                            <div
                                key={ord._id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#FAF8F5] border border-gray-200/80 p-4 text-xs"
                            >
                                <div>
                                    <p className="font-bold text-gray-900">
                                        Order #{ord._id.slice(-8).toUpperCase()} •{" "}
                                        <span className="text-[#467A74]">
                                            {ord.buyerId?.fullName || "Sister Buyer"}
                                        </span>
                                    </p>
                                    <p className="text-[11px] text-gray-600 mt-0.5">
                                        {ord.orderItems.map((i) => `${i.title} (×${i.quantity})`).join(", ")} —{" "}
                                        <strong>Net Earnings: ৳{ord.sellerEarnings ?? ord.totalAmount}</strong>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-gray-500">Live Status:</span>
                                    <select
                                        value={ord.orderStatus}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                ord._id,
                                                e.target.value as SellerOrderItem["orderStatus"]
                                            )
                                        }
                                        className="rounded-xl border border-[#5B9891]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#467A74]"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Product Form */}
            <form
                onSubmit={handleAddProduct}
                className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4 text-xs"
            >
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Store className="h-4 w-4 text-[#5B9891]" />
                    <h2 className="text-sm font-bold text-gray-900">Add New Marketplace Listing</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Select Brand *</label>
                        <select
                            value={selectedBrandKey}
                            onChange={(e) => setSelectedBrandKey(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 font-bold text-gray-900"
                            required
                        >
                            {brandOptions.length === 0 ? (
                                <option value="">Create a brand in My Business first</option>
                            ) : (
                                brandOptions.map((b) => (
                                    <option
                                        key={`${b.businessId}::${b.brandName}`}
                                        value={`${b.businessId}::${b.brandName}`}
                                    >
                                        {b.brandName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Listing Type *</label>
                        <select
                            value={listingType}
                            onChange={(e) => setListingType(e.target.value as "Product" | "Service")}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 font-bold text-gray-900"
                            required
                        >
                            <option value="Product">Physical Product</option>
                            <option value="Service">Professional Service</option>
                        </select>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Premium Silk Abaya or Graphic Design Package"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                            required
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">Niche Category</label>
                        <input
                            type="text"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            placeholder="e.g. Modest Fashion & Apparel"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                        />
                    </div>

                    {/* Direct File Upload Widget connected to Cloudinary */}
                    <div className="sm:col-span-2 lg:col-span-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block font-bold text-gray-700 text-xs">
                                Product Cover Image
                            </label>
                            {imageUrl && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="h-3 w-3" /> Uploaded to Cloudinary
                                </span>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleImageFileSelect}
                            className="hidden"
                        />

                        {imageUploadError && (
                            <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                <span>{imageUploadError}</span>
                            </div>
                        )}

                        {imageUrl ? (
                            <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-[#FAF8F5]">
                                <img
                                    src={imageUrl}
                                    alt="Product Preview"
                                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-gray-200 shrink-0 shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate">
                                        Cover Image Ready
                                    </p>
                                    <p className="text-[11px] text-gray-500 truncate mt-0.5 font-mono">
                                        {imageUrl}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploadingImage}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-300 bg-white text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <RefreshCw className="h-3 w-3" /> Replace
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            disabled={isUploadingImage}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-[11px] font-bold text-rose-600 hover:bg-rose-100 transition"
                                        >
                                            <Trash2 className="h-3 w-3" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : isUploadingImage ? (
                            <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#5B9891]/60 bg-[#FAF8F5]/50 text-center">
                                <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin mb-2" />
                                <p className="text-xs font-bold text-[#467A74]">Uploading to Cloudinary...</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">Optimizing & securing high-resolution image</p>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#5B9891] bg-[#FAF8F5] hover:bg-white cursor-pointer transition text-center group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#5B9891]/10 flex items-center justify-center text-[#5B9891] group-hover:scale-110 transition mb-2">
                                    <UploadCloud className="h-5 w-5" />
                                </div>
                                <p className="text-xs font-bold text-gray-800">
                                    Click to upload cover image <span className="text-gray-400 font-normal">or choose file</span>
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    PNG, JPG, WebP, or GIF up to 8MB
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4">
                        <label className="block font-bold text-gray-700 mb-1">Description / Story *</label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide details about fabric, materials, specifications, or deliverables..."
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900 text-xs resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">MRP Price (৳) *</label>
                        <input
                            type="number"
                            min={1}
                            value={mrpPrice}
                            onChange={(e) => setMrpPrice(e.target.value)}
                            placeholder="e.g. 1200"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-[#467A74] mb-1">
                            Discounted Sale Price (৳) *
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                            placeholder="e.g. 950"
                            className="w-full rounded-xl border border-[#5B9891]/40 bg-[#FAF8F5] px-3 py-2 font-bold text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Stock</label>
                        <input
                            type="number"
                            min={0}
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                        />
                    </div>

                    <div className="flex flex-col justify-end">
                        <label className="inline-flex items-center gap-2 rounded-xl border border-[#F7DFC7] bg-[#FAF8F5] px-3 py-2 font-bold text-[#D98408] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isWholesaleEligible}
                                onChange={(e) => setIsWholesaleEligible(e.target.checked)}
                                className="h-4 w-4 accent-[#D98408]"
                            />
                            <span>Eligible for Wholesale</span>
                        </label>
                    </div>

                    {isWholesaleEligible && (
                        <div>
                            <label className="block font-bold text-[#D98408] mb-1">
                                Wholesale Price (৳) *
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={wholesalePrice}
                                onChange={(e) => setWholesalePrice(e.target.value)}
                                className="w-full rounded-xl border border-[#D98408]/40 bg-[#FAF8F5] px-3 py-2 font-bold text-gray-900"
                                required
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isAdding || brandOptions.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-5 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    <span>{isAdding ? "Publishing..." : "Publish Listing"}</span>
                </button>
            </form>

            {/* Active Listings Table */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="py-3.5 px-4">Product & Brand</th>
                            <th className="py-3.5 px-4">Sale / MRP</th>
                            <th className="py-3.5 px-4 text-center">Wholesale</th>
                            <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-gray-400">
                                    No products listed yet.
                                </td>
                            </tr>
                        ) : (
                            products.map((item) => (
                                <tr key={item._id} className="hover:bg-[#F7DFC7]/20">
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                            {item.images?.[0] ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    className="h-10 w-10 rounded-lg object-cover border border-gray-100 shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-[#FAF8F5] border border-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                                                    <Store className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">{item.title}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                                                    <span className="text-[#D98408] font-medium">{item.brandName}</span>
                                                    {(item.subCategory || item.category) && (
                                                        <span className="text-gray-400">• {item.subCategory || item.category}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="font-black text-gray-900">৳{item.salePrice}</span>
                                        {item.mrpPrice && item.mrpPrice > item.salePrice && (
                                            <span className="ml-2 text-[11px] text-gray-400 line-through">
                                                ৳{item.mrpPrice}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        {item.isWholesaleEligible && item.wholesalePrice ? (
                                            <span className="inline-flex items-center gap-1 rounded bg-[#F7DFC7] px-2 py-0.5 text-[11px] font-bold text-[#D98408]">
                                                <Tag className="h-3 w-3" /> ৳{item.wholesalePrice}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-gray-400">
                                                Not eligible for wholesale
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item._id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700"
                                        >
                                            <Trash2 className="h-3 w-3" /> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}