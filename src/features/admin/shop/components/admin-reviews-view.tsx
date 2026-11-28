"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, RefreshCw, MessageSquare } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { BackendProduct } from "./admin-products-view";

interface ProductReviewItem {
    _id?: string;
    userId?: { fullName?: string };
    rating: number;
    comment: string;
    createdAt?: string;
}

export function AdminReviewsView() {
    const [products, setProducts] = useState<BackendProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [reviews, setReviews] = useState<ProductReviewItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<any>(API_ENDPOINTS.ecommerce.products);
            const raw = res as any;
            const list: BackendProduct[] = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                ? raw.data
                : Array.isArray(raw?.data?.products)
                ? raw.data.products
                : Array.isArray(raw?.products)
                ? raw.products
                : [];
            setProducts(list);
            const firstProduct = list[0];
            if (firstProduct && !selectedProductId) {
                setSelectedProductId(firstProduct._id);
            }
        } catch {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedProductId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (!selectedProductId) return;
        let active = true;

        async function loadReviews() {
            try {
                const res = await apiClient.get<{ data?: ProductReviewItem[] }>(
                    API_ENDPOINTS.ecommerce.productReviews(selectedProductId)
                );
                if (!active) return;
                const raw = res as unknown as { data?: ProductReviewItem[] } | ProductReviewItem[];
                setReviews(Array.isArray(raw) ? raw : raw.data || []);
            } catch {
                if (active) setReviews([]);
            }
        }

        loadReviews();
        return () => {
            active = false;
        };
    }, [selectedProductId]);

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Ratings & Reviews
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <Star className="h-3.5 w-3.5" />
                            Customer Feedback
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Inspect verified buyer reviews and ratings across sister products and brands.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchProducts}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Product Selector */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-xs font-bold text-gray-700 shrink-0">
                    Select Product / Service:
                </label>
                <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full max-w-md rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-semibold text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                >
                    {(!Array.isArray(products) || products.length === 0) && <option value="">No products available</option>}
                    {Array.isArray(products) && products.map((p) => (
                        <option key={p._id} value={p._id}>
                            {p.title || p.name} ({p.brandName || "Sister Brand"})
                        </option>
                    ))}
                </select>
            </div>

            {/* Reviews List */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <MessageSquare className="h-4 w-4 text-[#5B9891]" />
                    <h2 className="text-sm font-bold text-gray-900">
                        Submitted Reviews ({reviews.length})
                    </h2>
                </div>

                {reviews.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {reviews.map((rev, idx) => (
                            <div key={rev._id || idx} className="py-3.5 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-900">
                                        {rev.userId?.fullName || "Verified Buyer"}
                                    </span>
                                    <div className="flex items-center gap-1 text-[#D98408]">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-[#D98408] text-[#D98408]" : "text-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600">{rev.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="py-10 text-center text-xs text-gray-400">
                        No customer reviews submitted for this product yet.
                    </p>
                )}
            </div>
        </div>
    );
}