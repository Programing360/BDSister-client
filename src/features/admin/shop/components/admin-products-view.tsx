"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    ShoppingBag,
    Search,
    RefreshCw,
    Trash2,
    Tag,
    AlertCircle,
    CheckCircle2,
    Package,
    Wrench,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface BackendProduct {
    _id: string;
    title?: string;
    name?: string;
    type?: "Product" | "Service";
    category?: string;
    mrp?: number;
    price: number;
    wholesalePrice?: number;
    isWholesaleEligible?: boolean;
    stock?: number;
    brandName?: string;
    sellerId?: { fullName?: string; email?: string };
    createdAt: string;
}

export function AdminProductsView() {
    const [products, setProducts] = useState<BackendProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | "Product" | "Service">("ALL");

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: BackendProduct[] }>(
                API_ENDPOINTS.ecommerce.products
            );
            const raw = res as unknown as { data?: BackendProduct[] } | BackendProduct[];
            const list = Array.isArray(raw) ? raw : raw.data || [];
            setProducts(list);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products and services.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteProduct = async (product: BackendProduct) => {
        const label = product.title || product.name || "this item";
        if (!confirm(`Are you sure you want to remove "${label}" from the marketplace?`)) {
            return;
        }

        setDeletingId(product._id);
        try {
            await apiClient.delete(API_ENDPOINTS.ecommerce.deleteProduct(product._id));
            setToastMessage(`"${label}" has been removed from marketplace.`);
            setTimeout(() => setToastMessage(null), 3500);
            await fetchProducts();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete product.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const itemType = p.type || "Product";
            if (typeFilter !== "ALL" && itemType !== typeFilter) return false;
            if (query.trim()) {
                const q = query.toLowerCase();
                const title = (p.title || p.name || "").toLowerCase();
                const brand = (p.brandName || "").toLowerCase();
                const cat = (p.category || "").toLowerCase();
                if (!title.includes(q) && !brand.includes(q) && !cat.includes(q)) return false;
            }
            return true;
        });
    }, [products, query, typeFilter]);

    return (
        <div className="space-y-6 pb-12">
            {toastMessage && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Products & Services
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            MRP & Wholesale Audit
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Moderate sisterhood goods and services, verify MRP discounts, and check wholesale eligibility.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchProducts}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] shadow-2xs hover:bg-[#5B9891] hover:text-white transition disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh Catalog</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by product title, brand, or category..."
                        className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden transition"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {(["ALL", "Product", "Service"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTypeFilter(t)}
                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${typeFilter === t
                                    ? "bg-[#5B9891] text-white shadow-2xs"
                                    : "border border-gray-200 bg-white text-gray-600 hover:bg-[#FAF8F5]"
                                }`}
                        >
                            {t === "ALL" ? "All Listings" : `${t}s`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="py-3.5 px-4">Item & Brand</th>
                                <th className="py-3.5 px-4 text-center">Type</th>
                                <th className="py-3.5 px-4">MRP & Discounted Price</th>
                                <th className="py-3.5 px-4 text-center">Wholesale</th>
                                <th className="py-3.5 px-4 text-center">Stock</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-xs text-gray-400 animate-pulse">
                                        Loading marketplace catalog...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-xs text-gray-500">
                                        No products or services found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((item) => {
                                    const title = item.title || item.name || "Untitled Listing";
                                    const itemType = item.type || "Product";
                                    const hasDiscount = item.mrp && item.mrp > item.price;

                                    return (
                                        <tr key={item._id} className="hover:bg-[#F7DFC7]/20 transition">
                                            <td className="py-3.5 px-4">
                                                <p className="font-bold text-gray-900">{title}</p>
                                                <p className="text-[11px] text-gray-500">
                                                    {item.brandName || item.sellerId?.fullName || "Sister Brand"}
                                                    {item.category ? ` • ${item.category}` : ""}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${itemType === "Service"
                                                            ? "bg-[#F7DFC7] text-[#D98408]"
                                                            : "bg-[#5B9891]/15 text-[#467A74]"
                                                        }`}
                                                >
                                                    {itemType === "Service" ? (
                                                        <Wrench className="h-3 w-3" />
                                                    ) : (
                                                        <Package className="h-3 w-3" />
                                                    )}
                                                    {itemType}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-gray-900">
                                                        ৳{item.price.toLocaleString()}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-[11px] text-gray-400 line-through">
                                                            MRP ৳{item.mrp?.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-center">
                                                {item.isWholesaleEligible && item.wholesalePrice ? (
                                                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#5B9891]/12 px-2 py-0.5 text-[11px] font-bold text-[#467A74]">
                                                        <Tag className="h-3 w-3" /> ৳{item.wholesalePrice}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-gray-400">Not eligible</span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-center font-mono text-gray-700">
                                                {itemType === "Service" ? "N/A" : item.stock ?? 0}
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    type="button"
                                                    disabled={deletingId === item._id}
                                                    onClick={() => handleDeleteProduct(item)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    <span>Remove</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}