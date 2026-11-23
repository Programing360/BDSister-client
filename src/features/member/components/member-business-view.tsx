"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Building2,
    Plus,
    Trash2,
    Save,
    CreditCard,
    Globe,
    MousePointerClick,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface BrandEntry {
    _id?: string;
    brandName: string;
    roleInBusiness: string;
    customRole?: string;
    category: string;
    websiteUrl: string;
    isPublished?: boolean;
    affiliateClicks?: number;
}

interface MyBusinessProfile {
    _id?: string;
    businessSummary: string;
    subscriptionStatus: "Paid" | "Unpaid";
    brands: BrandEntry[];
}

interface LookupRole {
    _id: string;
    name: string;
}

const DEFAULT_ROLES = ["Founder", "Co-Founder", "CEO", "President", "Managing Director"];

export function MemberBusinessView() {
    const [business, setBusiness] = useState<MyBusinessProfile>({
        businessSummary: "",
        subscriptionStatus: "Unpaid",
        brands: [],
    });
    const [roleOptions, setRoleOptions] = useState<string[]>(DEFAULT_ROLES);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Add Brand Form State
    const [brandName, setBrandName] = useState("");
    const [selectedRole, setSelectedRole] = useState("Founder");
    const [customRoleInput, setCustomRoleInput] = useState("");
    const [category, setCategory] = useState("Modest Fashion & Apparel");
    const [websiteUrl, setWebsiteUrl] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    const loadBusinessAndRoles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [bizRes, lookupRes] = await Promise.allSettled([
                apiClient.get<{ data?: MyBusinessProfile }>(API_ENDPOINTS.business.my),
                apiClient.get<{ data?: { businessRoles?: LookupRole[] } }>(
                    API_ENDPOINTS.cms.lookups
                ),
            ]);

            if (bizRes.status === "fulfilled") {
                const raw = bizRes.value as unknown as { data?: MyBusinessProfile };
                if (raw.data) {
                    setBusiness({
                        _id: raw.data._id,
                        businessSummary: raw.data.businessSummary || "",
                        subscriptionStatus: raw.data.subscriptionStatus || "Unpaid",
                        brands: Array.isArray(raw.data.brands) ? raw.data.brands : [],
                    });
                }
            }

            if (lookupRes.status === "fulfilled") {
                const rawL = lookupRes.value as unknown as {
                    data?: { businessRoles?: LookupRole[] };
                };
                const dbRoles = rawL.data?.businessRoles?.map((r) => r.name) || [];
                const firstRole = dbRoles[0];
                if (firstRole) {
                    setRoleOptions(dbRoles);
                    setSelectedRole(firstRole);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load business profile.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBusinessAndRoles();
    }, [loadBusinessAndRoles]);

    const handleAddBrand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandName.trim()) return;

        const finalRole =
            selectedRole === "OTHER"
                ? customRoleInput.trim() || "Business Owner"
                : selectedRole;

        const newBrand: BrandEntry = {
            brandName: brandName.trim(),
            roleInBusiness: finalRole,
            category: category.trim() || "General",
            websiteUrl: websiteUrl.trim(),
            isPublished: business.subscriptionStatus === "Paid",
            affiliateClicks: 0,
        };

        setBusiness((prev) => ({
            ...prev,
            brands: [...prev.brands, newBrand],
        }));

        setBrandName("");
        setCustomRoleInput("");
        setWebsiteUrl("");
        showToast(`Brand "${newBrand.brandName}" added. Click Save Business Profile to persist.`);
    };

    // Synchronized with POST /api/business/create (createOrUpdateBusiness)
    const handleSaveBusiness = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const payload = {
                businessSummary: business.businessSummary,
                brands: business.brands.map((b) => ({
                    _id: b._id,
                    brandName: b.brandName,
                    roleInBusiness: b.roleInBusiness,
                    category: b.category,
                    websiteUrl: b.websiteUrl,
                })),
            };

            await apiClient.post(API_ENDPOINTS.business.create, payload);

            showToast("Business & Brands profile saved successfully!");
            await loadBusinessAndRoles();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save business profile.");
        } finally {
            setIsSaving(false);
        }
    };

    // Synchronized with DELETE /api/business/:id/brands/:brandId
    const handleRemoveBrand = async (brand: BrandEntry, index: number) => {
        if (business._id && brand._id) {
            try {
                await apiClient.delete(
                    API_ENDPOINTS.business.deleteBrand(business._id, brand._id)
                );
                showToast(`Brand "${brand.brandName}" deleted.`);
                await loadBusinessAndRoles();
                return;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to delete brand.");
                return;
            }
        }

        setBusiness((prev) => ({
            ...prev,
            brands: prev.brands.filter((_, i) => i !== index),
        }));
    };

    const handlePaySubscription = async () => {
        setIsPaying(true);
        setError(null);
        try {
            if (!business._id) {
                await handleSaveBusiness();
            }
            const res = await apiClient.post<{
                paymentUrl?: string;
                data?: { paymentUrl?: string };
            }>(API_ENDPOINTS.payment.zinipayInit, {
                paymentType: "BusinessSubscription",
                amount: 500,
            });
            const raw = res as unknown as {
                paymentUrl?: string;
                data?: { paymentUrl?: string };
            };
            const redirectUrl = raw.paymentUrl || raw.data?.paymentUrl;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                showToast("ZiniPay payment session initiated. Check Billing & Invoices.");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to initialize ZiniPay checkout."
            );
        } finally {
            setIsPaying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-[#5B9891]/20 bg-white space-y-3">
                <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
                <p className="text-xs font-semibold text-gray-600">
                    Loading your Enterprise & Brands workspace...
                </p>
            </div>
        );
    }

    const isPaid = business.subscriptionStatus === "Paid";

    return (
        <div className="space-y-6 pb-14">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            My Business & Sister Brands
                        </h1>
                        <span
                            className={`rounded-full border px-3 py-0.5 text-xs font-bold ${isPaid
                                    ? "bg-[#5B9891]/15 border-[#5B9891]/30 text-[#467A74]"
                                    : "bg-[#F2B55D]/25 border-[#D98408]/35 text-[#D98408]"
                                }`}
                        >
                            {isPaid ? "Active & Published" : "Unpaid (Draft Mode)"}
                        </span>
                        <SectionHelpTooltip
                            title="Multi-Brand Business Showcase"
                            explanation="Add one or multiple brands you own or lead, specify your executive role, and publish them to the BDSisters Business Directory."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Manage your brand portfolio, executive roles, website links, and annual publishing subscription.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {!isPaid && (
                        <button
                            type="button"
                            onClick={handlePaySubscription}
                            disabled={isPaying}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D98408] px-4 py-2 text-xs font-bold text-white hover:bg-[#b86f06] transition disabled:opacity-50"
                        >
                            <CreditCard className="h-4 w-4" />
                            <span>{isPaying ? "Connecting ZiniPay..." : "Pay ৳500 & Publish"}</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleSaveBusiness}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        <span>{isSaving ? "Saving..." : "Save Business Profile"}</span>
                    </button>
                </div>
            </div>

            {/* Subscription Info Banner if Unpaid */}
            {!isPaid && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#F2B55D]/60 bg-[#F7DFC7]/45 p-4">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-[#D98408] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-900">
                                Publish Your Brands in the BDSisters Directory
                            </p>
                            <p className="text-[11px] text-gray-600 mt-0.5">
                                You can add all your brands below for free. Complete the annual ৳500 publishing fee via ZiniPay to make all your brands visible to buyers and sisters.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handlePaySubscription}
                        disabled={isPaying}
                        className="rounded-xl bg-[#D98408] px-4 py-2 text-xs font-bold text-white hover:bg-[#b86f06] shrink-0"
                    >
                        Activate Now
                    </button>
                </div>
            )}

            {/* Business Summary */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-3">
                <label className="block text-xs font-bold text-gray-800">
                    Entrepreneurial Overview / Mission Statement
                </label>
                <textarea
                    rows={2}
                    value={business.businessSummary}
                    onChange={(e) =>
                        setBusiness({ ...business, businessSummary: e.target.value })
                    }
                    placeholder="Briefly describe your business vision, ethical standards, and products/services..."
                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                />
            </div>

            {/* Add Brand Form */}
            <form
                onSubmit={handleAddBrand}
                className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4"
            >
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Building2 className="h-4 w-4 text-[#5B9891]" />
                    <h2 className="text-sm font-bold text-gray-900">Add a Brand / Venture</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Brand Name *</label>
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="e.g. Noor Modest Wear"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Your Role *</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 font-semibold text-gray-900"
                        >
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                            <option value="OTHER">Other (Specify Role)</option>
                        </select>
                    </div>

                    {selectedRole === "OTHER" && (
                        <div>
                            <label className="block font-bold text-[#D98408] mb-1">
                                Custom Role Title *
                            </label>
                            <input
                                type="text"
                                value={customRoleInput}
                                onChange={(e) => setCustomRoleInput(e.target.value)}
                                placeholder="e.g. Creative Director"
                                className="w-full rounded-xl border border-[#D98408]/40 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Industry Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Organic Food, Tech, Design"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">Website / Store Link</label>
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://yourbrand.com"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 font-mono text-gray-900"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                >
                    <Plus className="h-4 w-4" /> Add Brand to Portfolio
                </button>
            </form>

            {/* Registered Brands Cards */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900">
                    My Registered Brands ({business.brands.length})
                </h3>

                {business.brands.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-10 text-center text-xs text-gray-400">
                        No brands added yet. Use the form above to add your first brand.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {business.brands.map((brand, idx) => (
                            <div
                                key={brand._id || idx}
                                className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{brand.brandName}</h4>
                                        <p className="text-xs text-[#D98408] font-bold mt-0.5">
                                            {brand.roleInBusiness} •{" "}
                                            <span className="text-gray-500 font-normal">{brand.category}</span>
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBrand(brand, idx)}
                                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                                    {brand.websiteUrl ? (
                                        <a
                                            href={brand.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 font-semibold text-[#5B9891] hover:underline"
                                        >
                                            <Globe className="h-3.5 w-3.5" /> Visit Link
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">No website link</span>
                                    )}

                                    <span className="inline-flex items-center gap-1 font-mono font-bold text-gray-700">
                                        <MousePointerClick className="h-3.5 w-3.5 text-[#D98408]" />
                                        {brand.affiliateClicks || 0} clicks
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}