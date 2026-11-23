"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    ClipboardList,
    CreditCard,
    RefreshCw,
    AlertCircle,
    Truck,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface BackendOrder {
    _id: string;
    orderNumber?: string;
    buyerId?: { fullName?: string; email?: string };
    totalAmount: number;
    platformCommission?: number;
    orderStatus: string;
    paymentStatus: string;
    shippingAddress?: { district?: string; address?: string };
    createdAt: string;
}

interface BackendPayment {
    _id: string;
    userId?: { fullName?: string; email?: string };
    paymentType?: string;
    amount: number;
    status: string;
    transactionId?: string;
    createdAt: string;
}

export function AdminOrdersView() {
    const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
    const [orders, setOrders] = useState<BackendOrder[]>([]);
    const [payments, setPayments] = useState<BackendPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [ordersRes, paymentsRes] = await Promise.allSettled([
                apiClient.get<{ data?: BackendOrder[] }>(API_ENDPOINTS.ecommerce.orders),
                apiClient.get<{ data?: BackendPayment[] }>(API_ENDPOINTS.admin.payments),
            ]);

            if (ordersRes.status === "fulfilled") {
                const raw = ordersRes.value as unknown as { data?: BackendOrder[] } | BackendOrder[];
                setOrders(Array.isArray(raw) ? raw : raw.data || []);
            }

            if (paymentsRes.status === "fulfilled") {
                const rawPay = paymentsRes.value as unknown as { data?: BackendPayment[] } | BackendPayment[];
                setPayments(Array.isArray(rawPay) ? rawPay : rawPay.data || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders and payments.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-6 pb-12">
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
                            Orders & Payments
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <Truck className="h-3.5 w-3.5" />
                            Shipping & ZiniPay
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Track customer orders, delivery statuses, and verified ZiniPay transactions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchData}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] shadow-2xs hover:bg-[#5B9891] hover:text-white transition disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh Records</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-2xs w-fit">
                <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${activeTab === "orders"
                            ? "bg-[#5B9891] text-white shadow-2xs"
                            : "text-gray-600 hover:bg-[#FAF8F5]"
                        }`}
                >
                    <ClipboardList className="h-4 w-4" />
                    <span>Marketplace Orders ({orders.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("payments")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${activeTab === "payments"
                            ? "bg-[#5B9891] text-white shadow-2xs"
                            : "text-gray-600 hover:bg-[#FAF8F5]"
                        }`}
                >
                    <CreditCard className="h-4 w-4" />
                    <span>Gateway Payments ({payments.length})</span>
                </button>
            </div>

            {/* Orders Tab */}
            {activeTab === "orders" ? (
                <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="py-3.5 px-4">Order ID</th>
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Amount & Commission</th>
                                    <th className="py-3.5 px-4 text-center">Shipping Status</th>
                                    <th className="py-3.5 px-4 text-center">Payment</th>
                                    <th className="py-3.5 px-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-gray-400 animate-pulse">
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-gray-500">
                                            No marketplace orders recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-[#F7DFC7]/20 transition">
                                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                                                {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <p className="font-bold text-gray-900">
                                                    {order.buyerId?.fullName || "Sister Customer"}
                                                </p>
                                                <p className="text-[11px] text-gray-500">
                                                    {order.shippingAddress?.district || order.buyerId?.email || ""}
                                                </p>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <p className="font-black text-gray-900">
                                                    ৳{order.totalAmount.toLocaleString()}
                                                </p>
                                                {typeof order.platformCommission === "number" && (
                                                    <p className="text-[10px] text-[#5B9891] font-semibold">
                                                        Commission: ৳{order.platformCommission.toLocaleString()}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className="rounded-full bg-[#FAF8F5] border border-gray-200 px-2.5 py-0.5 text-[11px] font-bold text-gray-700">
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${order.paymentStatus === "Paid"
                                                            ? "bg-[#5B9891]/15 text-[#467A74]"
                                                            : "bg-[#F2B55D]/25 text-[#D98408]"
                                                        }`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-[11px] text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Payments Tab */
                <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="py-3.5 px-4">Transaction ID</th>
                                    <th className="py-3.5 px-4">Payer</th>
                                    <th className="py-3.5 px-4">Purpose</th>
                                    <th className="py-3.5 px-4">Amount</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-gray-400 animate-pulse">
                                            Loading payments...
                                        </td>
                                    </tr>
                                ) : payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-gray-500">
                                            No payment records found.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((pay) => (
                                        <tr key={pay._id} className="hover:bg-[#F7DFC7]/20 transition">
                                            <td className="py-3.5 px-4 font-mono text-gray-700">
                                                {pay.transactionId || pay._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <p className="font-bold text-gray-900">
                                                    {pay.userId?.fullName || "Member"}
                                                </p>
                                                <p className="text-[11px] text-gray-500">{pay.userId?.email || ""}</p>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-700">
                                                {pay.paymentType || "Marketplace / Subscription"}
                                            </td>
                                            <td className="py-3.5 px-4 font-black text-gray-900">
                                                ৳{pay.amount.toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${pay.status === "Success"
                                                            ? "bg-[#5B9891]/15 text-[#467A74]"
                                                            : "bg-[#F2B55D]/25 text-[#D98408]"
                                                        }`}
                                                >
                                                    {pay.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-[11px] text-gray-500">
                                                {new Date(pay.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}