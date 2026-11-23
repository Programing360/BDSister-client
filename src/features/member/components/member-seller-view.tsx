"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Store,
    Plus,
    Trash2,
    RefreshCw,
    Tag,
    CheckCircle2,
    AlertCircle,
    Truck,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface SellerProductItem {
    _id: string;
    title: string;
    brandName?: string;
    category?: string;
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
    const [category, setCategory] = useState("Modest Fashion");
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
                const rawP = prodRes.value as unknown as
                    | { data?: SellerProductItem[] }
                    | SellerProductItem[];
                setProducts(Array.isArray(rawP) ? rawP : rawP.data || []);
            }

            if (ordersRes.status === "fulfilled") {
                const rawO = ordersRes.value as unknown as
                    | { data?: SellerOrderItem[] }
                    | SellerOrderItem[];
                setSellerOrders(Array.isArray(rawO) ? rawO : rawO.data || []);
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

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !salePrice || !selectedBrandKey) {
            setError("Please select one of your registered brands first.");
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
                description: description.trim() || title.trim(),
                category: category.trim(),
                mrpPrice: mrpPrice ? Number(mrpPrice) : Number(salePrice),
                salePrice: Number(salePrice),
                isWholesaleEligible,
                wholesalePrice:
                    isWholesaleEligible && wholesalePrice ? Number(wholesalePrice) : undefined,
                stock: Number(stock) || 1,
            });

            setTitle("");
            setDescription("");
            setMrpPrice("");
            setSalePrice("");
            setWholesalePrice("");
            showToast("Product published to BDSisters Marketplace!");
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
                    <h2 className="text-sm font-bold text-gray-900">Add New Product Listing</h2>
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

                    <div className="lg:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Organic Sundarbans Honey 500g"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
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
                    <span>{isAdding ? "Publishing..." : "Publish Product"}</span>
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
                                        <p className="font-bold text-gray-900">{item.title}</p>
                                        <p className="text-[11px] text-[#D98408]">{item.brandName}</p>
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