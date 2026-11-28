"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
    Building2,
    Search,
    ExternalLink,
    Store,
    Sparkles,
    Loader2,
    AlertCircle,
    UserCheck,
    Tag,
    MousePointerClick,
    ArrowUpRight,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface BrandEntry {
    _id?: string;
    brandId?: string;
    brandName: string;
    logo?: string;
    category?: string;
    businessSummary?: string;
    servicesOrProducts?: string[];
    websiteLinks?: Array<{ label?: string; url: string }> | string[];
    websiteUrl?: string;
    roleInBusiness?: string;
    customRoleTitle?: string;
    isPublished?: boolean;
    affiliateClicks?: number;
}

export interface PublicBusinessProfile {
    _id: string;
    userId?: {
        _id: string;
        fullName: string;
        profilePicture?: string;
        location?: { district?: string; country?: string };
    };
    businessSummary?: string;
    brands: BrandEntry[];
    subscriptionStatus?: string;
}

interface PublicBusinessesViewProps {
    initialBusinesses?: PublicBusinessProfile[];
}

export function PublicBusinessesView({ initialBusinesses = [] }: PublicBusinessesViewProps) {
    const [businesses, setBusinesses] = useState<PublicBusinessProfile[]>(initialBusinesses);
    const [isLoading, setIsLoading] = useState(initialBusinesses.length === 0);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const isFirstRender = useRef(true);

    const fetchBusinesses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchTerm.trim()) params.set("search", searchTerm.trim());
            if (categoryFilter.trim()) params.set("category", categoryFilter.trim());

            const qs = params.toString();
            const url = qs
                ? `${API_ENDPOINTS.businesses.list}?${qs}`
                : API_ENDPOINTS.businesses.list;

            const res = await apiClient.get<any>(url, {
                cache: "no-store",
            });
            const raw = res as any;
            const list: PublicBusinessProfile[] = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                ? raw.data
                : Array.isArray(raw?.data?.businesses)
                ? raw.data.businesses
                : Array.isArray(raw?.businesses)
                ? raw.businesses
                : [];
            setBusinesses(list);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load Business Directory."
            );
            // Fall back to initial businesses if client fetch fails
            if (initialBusinesses.length > 0) {
                setBusinesses(initialBusinesses);
            }
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, categoryFilter, initialBusinesses]);

    useEffect(() => {
        // Skip re-fetching on mount if initial businesses are already loaded and no filters set
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (initialBusinesses.length > 0 && !searchTerm && !categoryFilter) {
                return;
            }
        }

        const timer = setTimeout(() => {
            fetchBusinesses();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchBusinesses, searchTerm, categoryFilter, initialBusinesses.length]);

    const handleAffiliateVisit = (businessId: string, url: string, brandId?: string) => {
        // Asynchronously report click tracking to backend
        if (brandId) {
            apiClient
                .post(API_ENDPOINTS.business.trackBrandClick(brandId, businessId), { url })
                .catch(() => {});
        } else {
            apiClient
                .post(API_ENDPOINTS.business.affiliateClick(businessId), { url })
                .catch(() => {});
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="rounded-3xl border border-[#D98408]/25 bg-gradient-to-r from-[#5B9891]/15 via-white to-[#F7DFC7]/60 p-8 shadow-xs">
                    <div className="max-w-3xl space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7DFC7] px-3 py-1 text-xs font-bold text-[#D98408]">
                            <Building2 className="h-3.5 w-3.5" /> Sister-Owned Enterprises
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Businesses &amp; Brands Directory
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Support ethical, women-led businesses and ventures founded or managed by verified
                            BDSisters members across Bangladesh.
                        </p>
                    </div>

                    {/* Search & Category Filter */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-7 relative">
                            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search brand name, product, or service..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>

                        <div className="sm:col-span-5 relative">
                            <Tag className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                placeholder="Filter by sector (e.g. Modest Fashion, Organic, Design)..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Brands Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
                        <p className="text-xs font-semibold text-gray-500">
                            Loading approved sister-led brands...
                        </p>
                    </div>
                ) : !Array.isArray(businesses) || businesses.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200/80 bg-white p-14 text-center space-y-3">
                        <Sparkles className="h-9 w-9 text-[#5B9891] mx-auto" />
                        <h3 className="text-base font-bold text-gray-900">
                            No Approved Businesses Found Yet
                        </h3>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Approved business profiles and brands will appear here automatically once reviewed by
                            the BDSisters team.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.flatMap((biz) => {
                            const brandList: BrandEntry[] =
                                Array.isArray(biz.brands) && biz.brands.length > 0
                                    ? biz.brands
                                    : (biz as any).name
                                    ? [
                                          {
                                              brandName: (biz as any).name,
                                              logo: (biz as any).logo,
                                              category: (biz as any).category,
                                              businessSummary:
                                                  (biz as any).shortDescription ||
                                                  (biz as any).fullDescription,
                                              websiteLinks: (biz as any).contact?.website
                                                  ? [{ url: (biz as any).contact.website }]
                                                  : [],
                                              roleInBusiness: "Founder",
                                          },
                                      ]
                                    : [];

                            return brandList.map((brand, bIdx) => {
                                const rawLink: any = brand.websiteLinks?.[0];
                                const primaryLink =
                                    typeof rawLink === "string"
                                        ? rawLink
                                        : rawLink?.url || brand.websiteUrl || (brand as any).websiteUrl || "";
                                const brandSlug =
                                    brand._id ||
                                    brand.brandId ||
                                    (brand as any).slug ||
                                    brand.brandName.toLowerCase().replace(/[^a-z0-9]/g, "-");
                                const founderRole =
                                    brand.roleInBusiness === "Other" && brand.customRoleTitle
                                        ? brand.customRoleTitle
                                        : brand.roleInBusiness || "Founder";
                                const clickCount = brand.affiliateClicks || 0;

                                return (
                                    <div
                                        key={`${biz._id || "biz"}-${brand._id || bIdx}`}
                                        className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs hover:border-[#D98408]/45 transition space-y-4"
                                    >
                                        <div className="space-y-4">
                                            {/* Brand Logo & Title */}
                                            <div className="flex items-start gap-4">
                                                <Link
                                                    href={`/brands/${brandSlug}`}
                                                    className="h-16 w-16 shrink-0 rounded-2xl border border-[#D98408]/25 bg-[#FAF8F5] overflow-hidden flex items-center justify-center hover:opacity-90 transition"
                                                >
                                                    {brand.logo ? (
                                                        <img
                                                            src={brand.logo}
                                                            alt={brand.brandName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#5B9891] to-[#467A74] text-white font-bold text-lg">
                                                            {brand.brandName.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                </Link>

                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/brands/${brandSlug}`}
                                                        className="hover:text-[#5B9891] transition"
                                                    >
                                                        <h2 className="text-base font-bold text-gray-900 line-clamp-1 hover:text-[#5B9891] transition">
                                                            {brand.brandName}
                                                        </h2>
                                                    </Link>
                                                    {brand.category && (
                                                        <span className="mt-1 inline-block rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                            {brand.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Business Summary */}
                                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                                {brand.businessSummary ||
                                                    biz.businessSummary ||
                                                    "Verified sister-owned enterprise on BDSisters.org."}
                                            </p>

                                            {/* Products / Services Tags */}
                                            {brand.servicesOrProducts && brand.servicesOrProducts.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {brand.servicesOrProducts.slice(0, 4).map((srv, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="rounded-lg bg-[#5B9891]/12 px-2.5 py-1 text-[11px] font-semibold text-[#467A74]"
                                                        >
                                                            {srv}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer: Founder Link, Link Visits & Actions */}
                                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                                            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                                                {biz.userId?._id ? (
                                                    <Link
                                                        href={`/directory/${biz.userId._id}`}
                                                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-700 hover:text-[#5B9891] truncate"
                                                    >
                                                        <UserCheck className="h-3.5 w-3.5 text-[#5B9891] shrink-0" />
                                                        <span className="truncate">
                                                            {biz.userId.fullName}
                                                            <span className="text-[#D98408] font-normal">
                                                                {" "}
                                                                • {founderRole}
                                                            </span>
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-[11px] text-gray-400">
                                                        Verified Sister Brand
                                                    </span>
                                                )}

                                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-500">
                                                    <MousePointerClick className="h-3 w-3 text-[#D98408]" />
                                                    {clickCount} visit{clickCount === 1 ? "" : "s"}
                                                </span>
                                            </div>

                                            {/* Action Buttons: View Profile & External Website Visit */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Link
                                                    href={`/brands/${brandSlug}`}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-[#5B9891]/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition shadow-2xs"
                                                >
                                                    <span>Profile</span>
                                                    <ArrowUpRight className="h-3 w-3" />
                                                </Link>

                                                {primaryLink && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAffiliateVisit(
                                                                biz._id,
                                                                primaryLink,
                                                                brand._id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-xl bg-[#5B9891] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#467A74] transition shadow-2xs cursor-pointer"
                                                    >
                                                        <span>Visit</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
