"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Users,
    Building2,
    ShoppingBag,
    Calendar,
    MessageSquare,
    ArrowRight,
    Sparkles,
    MapPin,
    Store,
    Tag,
    Clock,
    CheckCircle2,
    HeartHandshake,
    BookOpen,
    Compass,
    Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface CmsBlock {
    _id: string;
    sectionKey?: string;
    blockType?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    ctaText?: string;
    ctaLink?: string;
    order?: number;
    isPublished?: boolean;
}

interface HomeMember {
    _id: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
    location?: { district?: string; country?: string };
}

interface HomeBusiness {
    _id: string;
    businessSummary?: string;
    brands: Array<{
        brandName: string;
        logo?: string;
        category?: string;
        businessSummary?: string;
    }>;
}

interface HomeProduct {
    _id: string;
    title: string;
    brandName?: string;
    mrpPrice?: number;
    salePrice: number;
    wholesalePrice?: number;
    isWholesaleEligible?: boolean;
    images?: string[];
}

interface HomeEvent {
    _id: string;
    title: string;
    eventType?: string;
    date: string;
    time?: string;
    location?: string;
    isFree?: boolean;
    ticketPrice?: number;
}

interface HomePost {
    _id: string;
    title: string;
    content: string;
    wingName?: string;
    createdAt: string;
}

const SISTERHOOD_WINGS = [
    {
        title: "Faith & Tarbiyah",
        desc: "Quranic reflection, Islamic personal development, and spiritual sisterhood circles.",
    },
    {
        title: "Education & Career",
        desc: "Academic mentorship, remote work readiness, and skill-building workshops.",
    },
    {
        title: "Ethical Entrepreneurship",
        desc: "Halal business support, brand directories, and sister-to-sister marketplace.",
    },
    {
        title: "Homemaking & Parenting",
        desc: "Intentional family life, homeschooling resources, and practical household wisdom.",
    },
    {
        title: "Health & Wellbeing",
        desc: "Holistic physical, mental, and emotional wellness tailored for Muslim women.",
    },
    {
        title: "Social Impact & Dawah",
        desc: "Community service initiatives, charity drives, and positive social contribution.",
    },
];

export function PublicHomeView() {
    const [cmsBlocks, setCmsBlocks] = useState<CmsBlock[]>([]);
    const [members, setMembers] = useState<HomeMember[]>([]);
    const [businesses, setBusinesses] = useState<HomeBusiness[]>([]);
    const [products, setProducts] = useState<HomeProduct[]>([]);
    const [events, setEvents] = useState<HomeEvent[]>([]);
    const [posts, setPosts] = useState<HomePost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadHomeData() {
            setIsLoading(true);
            const [cmsRes, usersRes, bizRes, prodRes, evRes, forumRes] =
                await Promise.allSettled([
                    apiClient.get<{ data?: CmsBlock[] }>(API_ENDPOINTS.cms.blocks),
                    apiClient.get<{ data?: HomeMember[] }>(
                        `${API_ENDPOINTS.users.directory}?limit=4`
                    ),
                    apiClient.get<{ data?: HomeBusiness[] }>(
                        `${API_ENDPOINTS.business.list}?limit=3`
                    ),
                    apiClient.get<{ data?: HomeProduct[] }>(
                        `${API_ENDPOINTS.ecommerce.products}?limit=4`
                    ),
                    apiClient.get<{ data?: HomeEvent[] }>(
                        `${API_ENDPOINTS.events.list}?limit=3`
                    ),
                    apiClient.get<{ data?: HomePost[] }>(
                        `${API_ENDPOINTS.forum.posts}?limit=3`
                    ),
                ]);

            if (!active) return;

            if (cmsRes.status === "fulfilled") {
                const resVal = cmsRes.value as any;
                const list = Array.isArray(resVal)
                    ? resVal
                    : Array.isArray(resVal?.data)
                    ? resVal.data
                    : Array.isArray(resVal?.data?.blocks)
                    ? resVal.data.blocks
                    : [];
                setCmsBlocks(list);
            }

            if (usersRes.status === "fulfilled") {
                const resVal = usersRes.value as any;
                const list = Array.isArray(resVal)
                    ? resVal
                    : Array.isArray(resVal?.data)
                    ? resVal.data
                    : [];
                setMembers(list.slice(0, 4));
            }

            if (bizRes.status === "fulfilled") {
                const resVal = bizRes.value as any;
                const list = Array.isArray(resVal)
                    ? resVal
                    : Array.isArray(resVal?.data)
                    ? resVal.data
                    : [];
                setBusinesses(list.slice(0, 3));
            }

            if (prodRes.status === "fulfilled") {
                const resVal = prodRes.value as any;
                const list = Array.isArray(resVal)
                    ? resVal
                    : Array.isArray(resVal?.data)
                    ? resVal.data
                    : [];
                setProducts(list.slice(0, 4));
            }

            if (evRes.status === "fulfilled") {
                const resVal = evRes.value as any;
                const list = Array.isArray(resVal)
                    ? resVal
                    : Array.isArray(resVal?.data)
                    ? resVal.data
                    : [];
                setEvents(list.slice(0, 3));
            }

            if (forumRes.status === "fulfilled") {
                const resVal = forumRes.value as any;
                const list = Array.isArray(resVal)
                    ? resVal
                    : Array.isArray(resVal?.data)
                    ? resVal.data
                    : [];
                setPosts(list.slice(0, 3));
            }

            setIsLoading(false);
        }

        loadHomeData();
        return () => {
            active = false;
        };
    }, []);

    const safeBlocks = Array.isArray(cmsBlocks) ? cmsBlocks : [];

    const heroBlock = safeBlocks.find(
        (b) =>
            b?.sectionKey?.toLowerCase() === "hero" ||
            b?.blockType?.toLowerCase() === "hero"
    );

    const dynamicInfoBlocks = safeBlocks.filter(
        (b) =>
            b?.sectionKey?.toLowerCase() !== "hero" &&
            b?.blockType?.toLowerCase() !== "hero"
    );

    return (
        <div className="bg-[#FAF8F5] text-gray-900">
            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden border-b border-[#5B9891]/15 bg-gradient-to-br from-[#F7DFC7]/65 via-white to-[#5B9891]/15 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#5B9891]/30 bg-white/90 px-4 py-1.5 text-xs font-bold text-[#467A74] shadow-2xs">
                            <ShieldCheck className="h-4 w-4 text-[#5B9891]" />
                            <span>100% Identity-Verified Women-Only Sanctuary</span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[52px] leading-[1.15]">
                            {heroBlock?.title || (
                                <>
                                    Empowering{" "}
                                    <span className="text-[#5B9891]">Bangladeshi Muslim Women</span>{" "}
                                    Through Faith, Skill & Sisterhood
                                </>
                            )}
                        </h1>

                        <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                            {heroBlock?.content ||
                                heroBlock?.subtitle ||
                                "A safe, verified digital ecosystem where sisters connect across disciplines, showcase ethical businesses, shop with exclusive discounts, and grow spiritually and professionally."}
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5 pt-2">
                            <Link
                                href={heroBlock?.ctaLink || "/register"}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#D98408] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#b86f06] transition"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>{heroBlock?.ctaText || "Join Sisterhood Free"}</span>
                            </Link>

                            <Link
                                href="/directory"
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#5B9891]/40 bg-white px-6 py-3.5 text-sm font-bold text-[#467A74] hover:bg-[#5B9891]/10 transition"
                            >
                                <Users className="h-4 w-4" />
                                <span>Explore Directory</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Highlight Card */}
                    <div className="lg:col-span-5">
                        <div className="rounded-3xl border border-[#5B9891]/25 bg-white p-7 shadow-sm space-y-5">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#D98408]">
                                        Our Covenant of Trust
                                    </p>
                                    <h2 className="text-lg font-extrabold text-gray-900 mt-0.5">
                                        Safe, Private & Purpose-Driven
                                    </h2>
                                </div>
                                <HeartHandshake className="h-8 w-8 text-[#5B9891]" />
                            </div>

                            <ul className="space-y-3 text-xs text-gray-700">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-[#5B9891] shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Manual NID/Passport Verification:</strong> Every sister is
                                        verified before joining to protect privacy and adab.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-[#5B9891] shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Granular Privacy Controls:</strong> Choose exactly what appears on
                                        your public profile; contact info stays private by default.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-[#5B9891] shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Sister-to-Sister Commerce:</strong> Discover women-owned brands,
                                        MRP discounts, and wholesale opportunities.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-[#5B9891] shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Holistic Self-Discovery:</strong> Track your 80/20 goals and
                                        Islamic Personal Development Wheel privately.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. WHO WE ARE, CMS BLOCKS & SIX WINGS */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7DFC7] px-3 py-1 text-xs font-bold text-[#D98408]">
                        <Compass className="h-3.5 w-3.5" /> Who We Are & Our Wings
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Holistic Growth Across Every Sphere of Life
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Guided by Islamic values, BDSisters nurtures spiritual strength, intellectual
                        curiosity, and sustainable economic independence.
                    </p>
                </div>

                {/* Dynamic CMS Blocks (if published by Admin) */}
                {dynamicInfoBlocks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {dynamicInfoBlocks.map((block) => (
                            <div
                                key={block._id}
                                className="rounded-2xl border border-[#5B9891]/25 bg-white p-6 shadow-2xs space-y-2"
                            >
                                {block.title && (
                                    <h3 className="text-base font-bold text-gray-900">{block.title}</h3>
                                )}
                                {block.subtitle && (
                                    <p className="text-xs font-semibold text-[#D98408]">{block.subtitle}</p>
                                )}
                                {block.content && (
                                    <p className="text-xs text-gray-600 leading-relaxed">{block.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Six Sisterhood Wings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SISTERHOOD_WINGS.map((wing, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs hover:border-[#5B9891]/50 transition space-y-2"
                        >
                            <div className="h-8 w-8 rounded-xl bg-[#5B9891]/12 text-[#467A74] font-black text-xs flex items-center justify-center">
                                0{idx + 1}
                            </div>
                            <h3 className="text-base font-bold text-gray-900">{wing.title}</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">{wing.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin" />
                </div>
            ) : (
                <>
                    {/* 3. FEATURED APPROVED SISTERS (Live from GET /api/users) */}
                    {members.length > 0 && (
                        <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-gray-200/60 bg-white">
                            <div className="max-w-7xl mx-auto space-y-8">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#5B9891]">
                                            Verified Community
                                        </span>
                                        <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                                            Meet Our Sisters
                                        </h2>
                                    </div>
                                    <Link
                                        href="/directory"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D98408] hover:underline"
                                    >
                                        <span>Browse Full Directory</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {members.map((m) => (
                                        <Link
                                            key={m._id}
                                            href={`/directory/${m._id}`}
                                            className="rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-5 hover:border-[#5B9891] transition space-y-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-14 w-14 shrink-0 rounded-2xl bg-white border border-[#5B9891]/25 overflow-hidden flex items-center justify-center">
                                                    {m.profilePicture ? (
                                                        <img
                                                            src={m.profilePicture}
                                                            alt={m.fullName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-black text-[#5B9891]">
                                                            {m.fullName?.charAt(0).toUpperCase() || "S"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-bold text-gray-900 truncate">
                                                        {m.fullName}
                                                    </h3>
                                                    {m.location?.district && (
                                                        <p className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                                                            <MapPin className="h-3 w-3 text-[#D98408]" />
                                                            <span className="truncate">{m.location.district}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {m.bio && (
                                                <p className="text-xs text-gray-600 line-clamp-2">{m.bio}</p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 4. SISTER-OWNED BRANDS & MARKETPLACE HIGHLIGHTS */}
                    {(businesses.length > 0 || products.length > 0) && (
                        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
                            {businesses.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#D98408]">
                                                Women-Led Enterprises
                                            </span>
                                            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                                                Featured Sister Brands
                                            </h2>
                                        </div>
                                        <Link
                                            href="/businesses"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B9891] hover:underline"
                                        >
                                            <span>Explore All Businesses</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {businesses.map((biz) => {
                                            const primaryBrand = biz.brands?.[0];
                                            if (!primaryBrand) return null;

                                            return (
                                                <div
                                                    key={biz._id}
                                                    className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 rounded-xl bg-[#FAF8F5] border border-[#D98408]/25 flex items-center justify-center overflow-hidden">
                                                            {primaryBrand.logo ? (
                                                                <img
                                                                    src={primaryBrand.logo}
                                                                    alt={primaryBrand.brandName}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Store className="h-6 w-6 text-[#D98408]" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-bold text-gray-900">
                                                                {primaryBrand.brandName}
                                                            </h3>
                                                            {primaryBrand.category && (
                                                                <span className="text-[11px] font-semibold text-[#D98408]">
                                                                    {primaryBrand.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 line-clamp-2">
                                                        {primaryBrand.businessSummary ||
                                                            biz.businessSummary ||
                                                            "Verified sister-owned brand on BDSisters."}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {products.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#5B9891]">
                                                Sisterhood Marketplace
                                            </span>
                                            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                                                Latest Products & Wholesale Deals
                                            </h2>
                                        </div>
                                        <Link
                                            href="/shop"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D98408] hover:underline"
                                        >
                                            <span>Visit Shop</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                        {products.map((prod) => (
                                            <Link
                                                key={prod._id}
                                                href="/shop"
                                                className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-2xs hover:border-[#5B9891] transition"
                                            >
                                                <div className="h-40 bg-[#FAF8F5] flex items-center justify-center overflow-hidden">
                                                    {prod.images?.[0] ? (
                                                        <img
                                                            src={prod.images[0]}
                                                            alt={prod.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ShoppingBag className="h-8 w-8 text-[#5B9891]/40" />
                                                    )}
                                                </div>
                                                <div className="p-4 space-y-1.5">
                                                    <p className="text-[11px] font-bold text-[#D98408] truncate">
                                                        {prod.brandName || "Sister Brand"}
                                                    </p>
                                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                                        {prod.title}
                                                    </h3>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-sm font-black text-gray-900">
                                                            ৳{prod.salePrice}
                                                        </span>
                                                        {prod.isWholesaleEligible && (
                                                            <span className="inline-flex items-center gap-1 rounded bg-[#F7DFC7] px-2 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                                <Tag className="h-2.5 w-2.5" /> Wholesale
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* 5. UPCOMING EVENTS & COMMUNITY DISCUSSIONS */}
                    {(events.length > 0 || posts.length > 0) && (
                        <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-gray-200/60 bg-white">
                            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Upcoming Events */}
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-[#5B9891]" />
                                            <span>Upcoming Workshops</span>
                                        </h2>
                                        <Link
                                            href="/events"
                                            className="text-xs font-bold text-[#5B9891] hover:underline"
                                        >
                                            All Events →
                                        </Link>
                                    </div>

                                    {events.length === 0 ? (
                                        <p className="text-xs text-gray-400">
                                            New sisterhood sessions will be announced soon.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {events.map((ev) => (
                                                <Link
                                                    key={ev._id}
                                                    href="/events"
                                                    className="block rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-4 hover:border-[#5B9891] transition space-y-1.5"
                                                >
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold text-[#467A74]">
                                                            {ev.eventType || "Workshop"}
                                                        </span>
                                                        <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                            {ev.isFree || !ev.ticketPrice
                                                                ? "Free RSVP"
                                                                : `৳${ev.ticketPrice}`}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-gray-900">
                                                        {ev.title}
                                                    </h3>
                                                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                                        <Clock className="h-3 w-3 text-[#D98408]" />
                                                        <span>
                                                            {new Date(ev.date).toLocaleDateString("en-BD")}
                                                            {ev.time ? ` • ${ev.time}` : ""}
                                                        </span>
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Recent Community Threads */}
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5 text-[#D98408]" />
                                            <span>Community Conversations</span>
                                        </h2>
                                        <Link
                                            href="/community"
                                            className="text-xs font-bold text-[#D98408] hover:underline"
                                        >
                                            Join Forum →
                                        </Link>
                                    </div>

                                    {posts.length === 0 ? (
                                        <p className="text-xs text-gray-400">
                                            Sign in to start the first discussion with sisters.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {posts.map((post) => (
                                                <Link
                                                    key={post._id}
                                                    href="/community"
                                                    className="block rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-4 hover:border-[#D98408] transition space-y-1.5"
                                                >
                                                    {post.wingName && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B9891]">
                                                            {post.wingName}
                                                        </span>
                                                    )}
                                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 line-clamp-2">
                                                        {post.content}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* 6. BOTTOM CTA BANNER */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="rounded-3xl border border-[#5B9891]/25 bg-gradient-to-r from-[#5B9891] to-[#467A74] p-8 sm:p-12 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
                    <div className="max-w-2xl space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold">
                            Ready to Join a Trusted Sisterhood?
                        </h2>
                        <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                            Create your personal profile for free, join moderated discussions, access
                            learning toolkits, or list your business in our directory.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <Link
                            href="/register"
                            className="rounded-2xl bg-[#D98408] px-6 py-3 text-xs font-bold text-white hover:bg-[#b86f06] transition"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            href="/resources"
                            className="inline-flex items-center gap-1.5 rounded-2xl bg-white/15 px-5 py-3 text-xs font-bold text-white hover:bg-white/25 transition"
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Explore Resources</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}