"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    ShieldCheck,
    CheckCircle2,
    Lock,
    Unlock,
    Mail,
    Phone,
    Globe,
    ExternalLink,
    Briefcase,
    Sparkles,
    Loader2,
    Share2,
    Building2,
    BookOpen,
    MousePointerClick,
    ArrowUpRight,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface PublishedBrand {
    _id?: string;
    brandId?: string;
    brandName: string;
    category?: string;
    businessSummary?: string;
    servicesOrProducts?: string[];
    websiteUrl?: string;
    affiliateClicks?: number;
    isPublished?: boolean;
}

interface MemberDetail {
    _id: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
    wings?: string[];
    role?: string;
    location?: {
        district?: string;
        state?: string;
        country?: string;
    };
    contactInfo?: {
        phone?: string;
        whatsapp?: string;
        emails?: string[];
        isPrivate?: boolean;
    };
    webProfiles?: Array<{
        label?: string;
        platform?: string;
        url: string;
        iconType?: string;
    }>;
    subjectsOfInterest?: Array<
        | string
        | {
              genre?: string;
              subject?: string;
          }
    >;
    softwareSkills?: Array<
        | string
        | {
              name?: string;
              level?: number;
          }
    >;
    vocationalSkills?: Array<
        | string
        | {
              genre?: string;
              skill?: string;
              level?: number;
          }
    >;
}

export default function MemberProfileDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const memberId = resolvedParams.id;

    const [member, setMember] = useState<MemberDetail | null>(null);
    const [businesses, setBusinesses] = useState<PublishedBrand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchMemberAndBrands() {
            setIsLoading(true);
            setError(null);
            try {
                const [memberRes, bizRes] = await Promise.allSettled([
                    apiClient.get<any>(API_ENDPOINTS.users.detail(memberId)),
                    apiClient.get<any>(`${API_ENDPOINTS.businesses.list}?userId=${memberId}`, {
                        cache: "no-store",
                    }),
                ]);

                if (memberRes.status === "fulfilled" && isMounted) {
                    const data = memberRes.value?.data || memberRes.value;
                    setMember(data);
                } else if (memberRes.status === "rejected" && isMounted) {
                    throw new Error("Could not load sister profile.");
                }

                if (bizRes.status === "fulfilled" && isMounted) {
                    const rawBiz = bizRes.value as any;
                    const list = Array.isArray(rawBiz)
                        ? rawBiz
                        : Array.isArray(rawBiz?.data)
                        ? rawBiz.data
                        : Array.isArray(rawBiz?.data?.businesses)
                        ? rawBiz.data.businesses
                        : Array.isArray(rawBiz?.businesses)
                        ? rawBiz.businesses
                        : [];

                    const extractedBrands: PublishedBrand[] = [];
                    list.forEach((b: any) => {
                        const isPaidOrApproved =
                            b.subscriptionStatus === "Paid" ||
                            b.status === "Approved" ||
                            b.isPublished === true;

                        const brands = Array.isArray(b.brands) ? b.brands : [];
                        brands.forEach((brand: any) => {
                            if (isPaidOrApproved || brand.isPublished) {
                                extractedBrands.push({
                                    _id: brand._id,
                                    brandId: brand.brandId,
                                    brandName: brand.brandName,
                                    category: brand.category,
                                    businessSummary: brand.businessSummary,
                                    servicesOrProducts: brand.servicesOrProducts,
                                    websiteUrl:
                                        brand.websiteUrl || brand.websiteLinks?.[0] || "",
                                    affiliateClicks: brand.affiliateClicks || 0,
                                    isPublished: brand.isPublished,
                                });
                            }
                        });
                    });
                    setBusinesses(extractedBrands);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Could not load sister profile."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (memberId) {
            fetchMemberAndBrands();
        }
        return () => {
            isMounted = false;
        };
    }, [memberId]);

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-[#5B9891] animate-spin" />
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] py-28 px-4">
                <div className="max-w-xl mx-auto rounded-3xl bg-white border border-[#F7DFC7] p-8 text-center space-y-4 shadow-sm">
                    <ShieldCheck className="w-12 h-12 text-[#D98408] mx-auto" />
                    <h1 className="font-serif text-2xl font-bold text-[#111E28]">
                        Sister Profile Not Found
                    </h1>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        {error ||
                            "The profile you are looking for may be private, undergoing verification, or does not exist."}
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/directory"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B9891] text-white text-xs font-bold hover:bg-[#477C76] transition shadow-xs"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Sisterhood Directory</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isContactPrivate = member.contactInfo?.isPrivate !== false;

    return (
        <div className="min-h-screen bg-[#FAF8F5] pb-24 pt-24 sm:pt-28">
            {/* Header / Breadcrumbs */}
            <div className="border-b border-[#F7DFC7] bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link
                        href="/directory"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#5B9891] transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Directory</span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#F7DFC7] text-xs font-semibold text-stone-700 hover:border-[#5B9891] transition"
                    >
                        <Share2 className="w-3.5 h-3.5 text-[#5B9891]" />
                        <span>{copied ? "Link Copied!" : "Share Profile"}</span>
                    </button>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                {/* Profile Hero Card */}
                <div className="rounded-3xl border border-[#F7DFC7] bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        {/* Square Portrait Photo */}
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#5B9891]/10 border-2 border-[#F7DFC7] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                            {member.profilePicture ? (
                                <img
                                    src={member.profilePicture}
                                    alt={member.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#5B9891]">
                                    {member.fullName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Core Details */}
                        <div className="space-y-3 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#5B9891]/15 text-[#5B9891] border border-[#5B9891]/30">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B9891]" />
                                    <span>Verified Sister Member</span>
                                </span>
                                {(member.location?.district || member.location?.country) && (
                                    <span className="inline-flex items-center gap-1 text-xs text-stone-600 bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#F7DFC7]">
                                        <MapPin className="w-3.5 h-3.5 text-[#D98408]" />
                                        <span>
                                            {[
                                                member.location?.district,
                                                member.location?.state,
                                                member.location?.country,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </span>
                                    </span>
                                )}
                            </div>

                            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111E28]">
                                {member.fullName}
                            </h1>

                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
                                {member.bio ||
                                    "Muslim sister actively participating in spiritual growth, vocational capacity, and halal commerce within the BDSisters ecosystem."}
                            </p>

                            {/* Wing tags */}
                            {member.wings && member.wings.length > 0 && (
                                <div className="pt-1 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                                    {member.wings.map((wing, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]"
                                        >
                                            {wing}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid of Attributes */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column (Skills, Interests, Brands) */}
                    <div className="md:col-span-7 space-y-6">
                        {/* Vocational Capabilities */}
                        <div className="rounded-3xl border border-[#F7DFC7] bg-white p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 border-b border-[#F7DFC7]/60 pb-3">
                                <Sparkles className="w-4 h-4 text-[#D98408]" />
                                <h2 className="font-serif text-base font-bold text-[#111E28]">
                                    Vocational Capabilities
                                </h2>
                            </div>

                            {member.vocationalSkills && member.vocationalSkills.length > 0 ? (
                                <div className="space-y-3.5">
                                    {member.vocationalSkills.map((v, idx) => {
                                        const skillName =
                                            typeof v === "string" ? v : v.skill || "Skill";
                                        const level =
                                            typeof v === "object" && v.level ? v.level : 4;
                                        const pct = Math.min(Math.max(level * 20, 20), 100);
                                        return (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-stone-700">
                                                    <span>{skillName}</span>
                                                    <span className="text-[#5B9891] font-mono">
                                                        {pct}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#F7DFC7] overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-[#5B9891]"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-stone-500 italic">
                                    No vocational capabilities listed yet.
                                </p>
                            )}
                        </div>

                        {/* Applications & Software */}
                        {member.softwareSkills && member.softwareSkills.length > 0 && (
                            <div className="rounded-3xl border border-[#F7DFC7] bg-white p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 border-b border-[#F7DFC7]/60 pb-3">
                                    <Briefcase className="w-4 h-4 text-[#5B9891]" />
                                    <h2 className="font-serif text-base font-bold text-[#111E28]">
                                        Applications &amp; Software
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {member.softwareSkills.map((s, idx) => {
                                        const name =
                                            typeof s === "string" ? s : s.name || "Tool";
                                        const level =
                                            typeof s === "object" && s.level ? s.level : null;
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#F7DFC7] text-xs font-bold text-stone-700"
                                            >
                                                <span>{name}</span>
                                                {level && (
                                                    <span className="text-[10px] text-[#5B9891] font-mono bg-white px-1.5 py-0.5 rounded-md border border-[#5B9891]/20">
                                                        L{level}
                                                    </span>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Subjects of Interest */}
                        {member.subjectsOfInterest && member.subjectsOfInterest.length > 0 && (
                            <div className="rounded-3xl border border-[#F7DFC7] bg-white p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 border-b border-[#F7DFC7]/60 pb-3">
                                    <BookOpen className="w-4 h-4 text-[#D98408]" />
                                    <h2 className="font-serif text-base font-bold text-[#111E28]">
                                        Subjects of Interest &amp; Study
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {member.subjectsOfInterest.map((sub, idx) => {
                                        const subjectName =
                                            typeof sub === "string" ? sub : sub.subject || "Subject";
                                        const genre =
                                            typeof sub === "object" && sub.genre && sub.genre !== "General"
                                                ? sub.genre
                                                : null;
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5B9891]/10 border border-[#5B9891]/25 text-xs font-semibold text-[#467A74]"
                                            >
                                                {genre && (
                                                    <span className="text-[10px] font-bold uppercase text-[#D98408]">
                                                        {genre}:
                                                    </span>
                                                )}
                                                <span>{subjectName}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Published Businesses & Brands */}
                        {businesses.length > 0 && (
                            <div className="rounded-3xl border border-[#F7DFC7] bg-white p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-[#F7DFC7]/60 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-[#D98408]" />
                                        <h2 className="font-serif text-base font-bold text-[#111E28]">
                                            Published Businesses &amp; Brands ({businesses.length})
                                        </h2>
                                    </div>
                                    <Link
                                        href="/businesses"
                                        className="text-xs font-bold text-[#5B9891] hover:underline"
                                    >
                                        Directory
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {businesses.map((brand, idx) => {
                                        const brandSlug =
                                            brand._id ||
                                            brand.brandId ||
                                            brand.brandName
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]/g, "-");
                                        return (
                                            <div
                                                key={brand._id || idx}
                                                className="rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-4 flex flex-col justify-between space-y-3 hover:border-[#5B9891]/40 transition"
                                            >
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <Link
                                                            href={`/brands/${brandSlug}`}
                                                            className="font-bold text-sm text-gray-900 hover:text-[#5B9891] transition line-clamp-1"
                                                        >
                                                            {brand.brandName}
                                                        </Link>
                                                        {brand.category && (
                                                            <span className="shrink-0 rounded-full bg-[#F7DFC7] px-2 py-0.5 text-[9px] font-bold text-[#D98408]">
                                                                {brand.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {brand.businessSummary && (
                                                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                                                            {brand.businessSummary}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                                                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-500">
                                                        <MousePointerClick className="h-3 w-3 text-[#D98408]" />
                                                        {brand.affiliateClicks || 0} visits
                                                    </span>

                                                    <Link
                                                        href={`/brands/${brandSlug}`}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-[#5B9891] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#467A74] transition"
                                                    >
                                                        <span>View Brand</span>
                                                        <ArrowUpRight className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Privacy-Protected Contact & Web Profiles) */}
                    <div className="md:col-span-5 space-y-6">
                        {/* Contact Card (Guarded) */}
                        <div className="rounded-3xl border border-[#F7DFC7] bg-white p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-[#F7DFC7]/60 pb-3">
                                <div className="flex items-center gap-2">
                                    {isContactPrivate ? (
                                        <Lock className="w-4 h-4 text-[#D98408]" />
                                    ) : (
                                        <Unlock className="w-4 h-4 text-[#5B9891]" />
                                    )}
                                    <h2 className="font-serif text-base font-bold text-[#111E28]">
                                        Contact Information
                                    </h2>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                    {isContactPrivate ? "Private" : "Public"}
                                </span>
                            </div>

                            {isContactPrivate ? (
                                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F7DFC7] space-y-2 text-xs text-stone-600">
                                    <p className="font-semibold text-stone-800">
                                        Protected by Field-Level Privacy
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-stone-500">
                                        This sister keeps her phone and direct email private per BDSisters safety guidelines. Verified members can request a connection through the member portal.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 text-xs">
                                    {member.contactInfo?.phone && (
                                        <div className="flex items-center gap-2 text-stone-700">
                                            <Phone className="w-4 h-4 text-[#5B9891]" />
                                            <span>{member.contactInfo.phone}</span>
                                        </div>
                                    )}
                                    {member.contactInfo?.emails && member.contactInfo.emails.length > 0 && (
                                        <div className="flex items-center gap-2 text-stone-700">
                                            <Mail className="w-4 h-4 text-[#5B9891]" />
                                            <span>{member.contactInfo.emails[0]}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Web Profiles & External Links */}
                        {member.webProfiles && member.webProfiles.length > 0 && (
                            <div className="rounded-3xl border border-[#F7DFC7] bg-white p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 border-b border-[#F7DFC7]/60 pb-3">
                                    <Globe className="w-4 h-4 text-[#5B9891]" />
                                    <h2 className="font-serif text-base font-bold text-[#111E28]">
                                        Online Profiles
                                    </h2>
                                </div>
                                <div className="space-y-2 text-xs">
                                    {member.webProfiles.map((p, idx) => (
                                        <a
                                            key={idx}
                                            href={p.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F7DFC7]/40 border border-[#F7DFC7] text-stone-800 transition"
                                        >
                                            <span className="font-semibold truncate max-w-[200px]">
                                                {p.label || p.url}
                                            </span>
                                            <ExternalLink className="w-3.5 h-3.5 text-[#5B9891] shrink-0" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* BDSisters Verified Guarantee */}
                        <div className="rounded-3xl border border-[#5B9891]/20 bg-[#5B9891]/5 p-5 text-xs space-y-2">
                            <div className="flex items-center gap-2 font-bold text-[#467A74]">
                                <ShieldCheck className="h-4 w-4 text-[#5B9891]" />
                                <span>Sisterhood Directory Standards</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-[11px]">
                                Every verified profile is vetted by BDSisters under Muhsina Organization, guaranteeing mutual safety, authenticity, and female empowerment.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
