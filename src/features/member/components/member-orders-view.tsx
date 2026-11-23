"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    ShoppingBag,
    RefreshCw,
    Star,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Package,
    MapPin,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface BackendOrderItem {
    productId?: { _id?: string; title?: string; brandName?: string } | string;
    brandName?: string;
    title?: string;
    quantity: number;
    price: number;
    isWholesale?: boolean;
}

interface BackendOrder {
    _id: string;
    orderItems: BackendOrderItem[];
    totalAmount: number;
    shippingAddress?: {
        district: string;
        state: string;
        addressDetails: string;
        phone: string;
    };
    paymentStatus: "Pending" | "Paid" | "Failed" | "Cancelled";
    orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    transactionId?: string;
    createdAt: string;
}

const TRACKING_STEPS = ["Pending", "Processing", "Shipped", "Delivered"] as const;

export function MemberOrdersView() {
    const [orders, setOrders] = useState<BackendOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Dual-Rating Review Form State
    const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
    const [productRating, setProductRating] = useState<number>(5);
    const [brandRating, setBrandRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: BackendOrder[] }>(
                API_ENDPOINTS.ecommerce.myOrders
            );
            const raw = res as unknown as { data?: BackendOrder[] } | BackendOrder[];
            setOrders(Array.isArray(raw) ? raw : raw.data || []);
        } catch (err) {
            if (!silent) {
                setError(err instanceof Error ? err.message : "Failed to load your orders.");
            }
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        // Live background polling every 20 seconds for real-time delivery status updates
        const timer = setInterval(() => fetchOrders(true), 20000);
        return () => clearInterval(timer);
    }, [fetchOrders]);

    const handleSubmitReview = async (e: React.FormEvent, order: BackendOrder) => {
        e.preventDefault();
        const firstItem = order.orderItems?.[0];
        const productId =
            typeof firstItem?.productId === "string"
                ? firstItem.productId
                : firstItem?.productId?._id;

        if (!productId) {
            setReviewingOrderId(null);
            return;
        }

        setIsSubmittingReview(true);
        setError(null);
        try {
            await apiClient.post(API_ENDPOINTS.ecommerce.reviews(productId), {
                productRating,
                brandRating,
                comment: comment.trim(),
            });
            setReviewingOrderId(null);
            setComment("");
            setToast("Thank you! Your Product & Brand ratings have been published.");
            setTimeout(() => setToast(null), 4000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Only verified paid orders can submit product & brand reviews."
            );
        } finally {
            setIsSubmittingReview(false);
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
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            My Orders & Live Tracking
                        </h1>
                        <SectionHelpTooltip
                            title="Live Order & Dual-Rating System"
                            explanation="Track live delivery progress from Pending to Delivered, and rate both the Product and the Sister's Brand separately."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Real-time delivery status updates and verified buyer reviews.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchOrders(false)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Sync Now</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin" />
                </div>
            ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center space-y-2">
                    <ShoppingBag className="h-8 w-8 text-gray-300 mx-auto" />
                    <p className="text-xs font-semibold text-gray-500">
                        You haven&apos;t placed any orders in the Sisterhood Marketplace yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => {
                        const stepIdx = TRACKING_STEPS.indexOf(
                            order.orderStatus as (typeof TRACKING_STEPS)[number]
                        );
                        const canReview =
                            order.orderStatus === "Delivered" || order.paymentStatus === "Paid";

                        return (
                            <div
                                key={order._id}
                                className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4"
                            >
                                {/* Top Order Header */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                    <div className="flex items-center gap-2 text-xs">
                                        <Package className="h-4 w-4 text-[#5B9891]" />
                                        <span className="font-mono font-bold text-gray-900">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString("en-BD")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xs font-black text-gray-900">
                                            ৳{order.totalAmount}
                                        </span>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${order.paymentStatus === "Paid"
                                                    ? "bg-[#5B9891]/15 text-[#467A74]"
                                                    : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            Payment: {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Live 4-Step Delivery Progress Tracker */}
                                {order.orderStatus === "Cancelled" ? (
                                    <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2 text-xs font-bold text-rose-700">
                                        Order Cancelled
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-[#5B9891]/20 bg-[#FAF8F5] p-4 space-y-2.5">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="inline-flex items-center gap-1.5 font-bold text-[#467A74]">
                                                <span className="h-2 w-2 rounded-full bg-[#5B9891] animate-ping" />
                                                Live Delivery Progress: {order.orderStatus}
                                            </span>
                                            {order.transactionId && (
                                                <span className="font-mono text-gray-500">
                                                    Txn: {order.transactionId}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                            {TRACKING_STEPS.map((step, idx) => {
                                                const active = idx <= stepIdx;
                                                return (
                                                    <div key={step} className="space-y-1">
                                                        <div
                                                            className={`h-1.5 rounded-full transition-all ${active ? "bg-[#5B9891]" : "bg-gray-200"
                                                                }`}
                                                        />
                                                        <p
                                                            className={`text-[10px] font-bold text-center ${active ? "text-[#467A74]" : "text-gray-400"
                                                                }`}
                                                        >
                                                            {step}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Ordered Items List */}
                                <div className="space-y-1.5 text-xs">
                                    {(order.orderItems || []).map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-gray-700">
                                            <span>
                                                <strong>{item.title || "Item"}</strong>
                                                {item.brandName && (
                                                    <span className="text-gray-400"> ({item.brandName})</span>
                                                )}{" "}
                                                × {item.quantity}
                                            </span>
                                            <span className="font-semibold">৳{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping Address Summary */}
                                {order.shippingAddress && (
                                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                        <MapPin className="h-3.5 w-3.5 text-[#D98408]" />
                                        <span>
                                            Delivering to: {order.shippingAddress.addressDetails},{" "}
                                            {order.shippingAddress.district}, {order.shippingAddress.state} (
                                            {order.shippingAddress.phone})
                                        </span>
                                    </p>
                                )}

                                {/* Dual-Rating Review (Product Rating + Brand Rating) */}
                                {canReview && (
                                    <div className="pt-2 border-t border-gray-100">
                                        {reviewingOrderId === order._id ? (
                                            <form
                                                onSubmit={(e) => handleSubmitReview(e, order)}
                                                className="space-y-3 rounded-xl bg-[#FAF8F5] p-4 text-xs border border-[#F7DFC7]"
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-700">Product Rating:</span>
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setProductRating(s)}
                                                                className={
                                                                    productRating >= s ? "text-[#D98408]" : "text-gray-300"
                                                                }
                                                            >
                                                                <Star className="h-4 w-4 fill-current" />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-700">Brand Rating:</span>
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setBrandRating(s)}
                                                                className={
                                                                    brandRating >= s ? "text-[#5B9891]" : "text-gray-300"
                                                                }
                                                            >
                                                                <Star className="h-4 w-4 fill-current" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <input
                                                    type="text"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Share your feedback about the product quality and brand service..."
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                                                    required
                                                />

                                                <div className="flex gap-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmittingReview}
                                                        className="rounded-xl bg-[#5B9891] px-4 py-1.5 font-bold text-white"
                                                    >
                                                        {isSubmittingReview ? "Submitting..." : "Submit Dual Review"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setReviewingOrderId(null)}
                                                        className="rounded-xl bg-white border border-gray-200 px-3 py-1.5 font-bold text-gray-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setReviewingOrderId(order._id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F7DFC7] px-3.5 py-1.5 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/45"
                                            >
                                                <Star className="h-3.5 w-3.5" /> Rate Product & Brand
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}