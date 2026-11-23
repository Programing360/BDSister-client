"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Receipt,
    CreditCard,
    RefreshCw,
    CheckCircle2,
    Loader2,
    Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface InvoiceItem {
    _id: string;
    invoiceId?: string;
    transactionId?: string;
    paymentType?: string;
    amount: number;
    status: "Paid" | "Pending" | "Failed";
    createdAt: string;
}

export function MemberBillingView() {
    const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgrading, setIsUpgrading] = useState(false);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: InvoiceItem[] }>(
                API_ENDPOINTS.payment.invoices
            );
            const raw = res as unknown as { data?: InvoiceItem[] } | InvoiceItem[];
            setInvoices(Array.isArray(raw) ? raw : raw.data || []);
        } catch {
            setInvoices([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleUpgradeMembership = async () => {
        setIsUpgrading(true);
        try {
            const res = await apiClient.post<{
                paymentUrl?: string;
                data?: { paymentUrl?: string };
            }>(API_ENDPOINTS.payment.zinipayInit, {
                paymentType: "PaidMembership",
                amount: 500,
            });
            const raw = res as unknown as {
                paymentUrl?: string;
                data?: { paymentUrl?: string };
            };
            const redirectUrl = raw.paymentUrl || raw.data?.paymentUrl;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <div className="space-y-6 pb-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Billing, Membership & Invoices
                        </h1>
                        <SectionHelpTooltip
                            title="ZiniPay Receipts & Subscriptions"
                            explanation="View all your membership upgrades, business publishing fees, and event ticket receipts."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Manage your Paid Sisterhood membership and view ZiniPay payment records.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleUpgradeMembership}
                        disabled={isUpgrading}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#D98408] px-4 py-2 text-xs font-bold text-white hover:bg-[#b86f06] transition"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>{isUpgrading ? "Connecting..." : "Upgrade to Paid Member"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={fetchInvoices}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#5B9891]/30 bg-white px-3.5 py-2 text-xs font-bold text-[#5B9891]"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
                <div className="flex items-center gap-2 border-b border-gray-100 p-4">
                    <Receipt className="h-4 w-4 text-[#5B9891]" />
                    <h2 className="text-sm font-bold text-gray-900">Payment History</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 text-[#5B9891] animate-spin" />
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-400">
                        No ZiniPay payment invoices found yet.
                    </div>
                ) : (
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="py-3.5 px-4">Invoice / Txn ID</th>
                                <th className="py-3.5 px-4">Purpose</th>
                                <th className="py-3.5 px-4">Amount</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoices.map((inv) => (
                                <tr key={inv._id} className="hover:bg-[#F7DFC7]/20">
                                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                                        {inv.invoiceId || inv.transactionId || inv._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                                        <span className="inline-flex items-center gap-1.5">
                                            <CreditCard className="h-3.5 w-3.5 text-[#5B9891]" />
                                            {inv.paymentType || "Membership / Subscription"}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 font-black text-gray-900">৳{inv.amount}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${inv.status === "Paid"
                                                    ? "bg-[#5B9891]/15 text-[#467A74]"
                                                    : "bg-[#F7DFC7] text-[#D98408]"
                                                }`}
                                        >
                                            {inv.status === "Paid" && <CheckCircle2 className="h-3 w-3" />}
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right text-gray-500">
                                        {new Date(inv.createdAt).toLocaleDateString("en-BD")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}