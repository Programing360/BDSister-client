"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShoppingBag,
    Star,
    ShieldCheck,
    CheckCircle2,
    BadgePercent,
    Layers,
    ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURED_PRODUCTS, SECTION_EXPLAINERS } from "@/data/mockData";

import { ProductItem } from "@/types";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ScrollReveal } from "@/components/common/MotionComponents";
import { SectionHoverInfo } from "@/components/common/SectionHoverInfo";

type FilterCategory = "All" | "Products" | "Services" | "Wholesale";

const TAB_CONFIG: { id: FilterCategory; label: string; href: string }[] = [
    { id: "All", label: "All Listings", href: "/shops" },
    { id: "Products", label: "Physical Products", href: "/shops?type=Physical+Products" },
    { id: "Services", label: "Sister Services", href: "/shops?type=Sister+Services" },
    { id: "Wholesale", label: "Wholesale Ready", href: "/shops?wholesale=true" },
];

export function ShopShowcase() {
    const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
    const [products, setProducts] = useState<ProductItem[]>(FEATURED_PRODUCTS);
    const [shopExplainer, setShopExplainer] = useState(SECTION_EXPLAINERS.shop);

    useEffect(() => {
        async function fetchLiveProducts() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.ecommerce.products);
                const raw = res as any;
                const list = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.data)
                        ? raw.data
                        : Array.isArray(raw?.data?.products)
                            ? raw.data.products
                            : Array.isArray(raw?.products)
                                ? raw.products
                                : [];
                if (list.length > 0) {
                    const formatted: ProductItem[] = list.slice(0, 8).map((item: any, idx: number) => {
                        const isService =
                            item.category === "Service" ||
                            item.category === "Sister Services" ||
                            item.type === "Service";
                        const mrp = Number(item.mrpPrice ?? item.salePrice ?? item.price ?? 0);
                        const sale = Number(item.salePrice ?? item.price ?? 0);
                        const reviews = Number(item.reviewCount ?? item.totalReviews ?? item.reviewsCount ?? 0);
                        const rating = Number(item.productRating ?? item.rating ?? 0);

                        return {
                            id: item._id || item.id || `prod-${idx}`,
                            slug: item.slug || item._id || item.id,
                            title: item.title,
                            sellerSister:
                                (item.sellerId && typeof item.sellerId === "object" && item.sellerId.fullName) ||
                                item.brandName ||
                                "Sister Seller",
                            brandName: item.brandName || "Halal Brand",
                            brandVerified: true,
                            mrpPrice: mrp > 0 ? mrp : sale,
                            specialDiscountPrice: sale,
                            isWholesaleEligible: Boolean(item.isWholesaleEligible),
                            wholesaleMinQuantity: item.wholesaleMinQuantity || 5,
                            wholesaleUnitPrice:
                                item.wholesalePrice ||
                                (item.isWholesaleEligible ? Math.round((sale || 1000) * 0.8) : undefined),
                            rating,
                            totalReviews: reviews,
                            category: isService ? "Services" : "Products",
                            imageUrl:
                                (Array.isArray(item.images) && item.images[0]) ||
                                item.image ||
                                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
                            inStock: item.isAvailable !== false && (item.stock === undefined || item.stock > 0),
                        };
                    });
                    setProducts(formatted);
                }
            } catch {
                // Fall back gracefully to FEATURED_PRODUCTS
            }
        }

        async function fetchShopExplainer() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.cms.blocks);
                const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                const explainerBlock = list.find(
                    (b: any) => b.sectionKey === "sectionExplainers" && (b.title === "shop" || b.title === "ecommerce")
                );
                if (explainerBlock) {
                    setShopExplainer({
                        title: explainerBlock.subtitle || "Halal E-Commerce & Business Directory",
                        description: explainerBlock.content || "",
                        howItWorks: explainerBlock.metadata?.howItWorks || SECTION_EXPLAINERS.shop.howItWorks,
                    });
                }
            } catch {
                // Keep default explainer
            }
        }

        fetchLiveProducts();
        fetchShopExplainer();
    }, []);

    const filteredProducts = products.filter((item) => {
        if (activeCategory === "All") return true;
        if (activeCategory === "Wholesale") return item.isWholesaleEligible;
        return item.category === activeCategory;
    });

    const currentExploreHref =
        activeCategory === "Products"
            ? "/shops?type=Physical+Products"
            : activeCategory === "Services"
                ? "/shops?type=Sister+Services"
                : activeCategory === "Wholesale"
                    ? "/shops?wholesale=true"
                    : "/shops";

    const currentExploreLabel =
        activeCategory === "Products"
            ? "Explore All Physical Products in Directory"
            : activeCategory === "Services"
                ? "Explore All Sister Services in Directory"
                : activeCategory === "Wholesale"
                    ? "Explore All Wholesale Deals in Directory"
                    : "Explore All Products & Services in Directory";

    return (
        <section
            id="shop"
            aria-labelledby="shop-heading"
            className="py-16 bg-white border-b border-[#F7DFC7] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal direction="up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F7DFC7]/60">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 rounded-lg bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]">
                                    <ShoppingBag className="w-4 h-4 text-[#5B9891]" />
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#111E28]">
                                    Halal E-Commerce Marketplace
                                </span>
                            </div>
                            <h2
                                id="shop-heading"
                                className="font-serif text-2xl sm:text-3xl font-bold text-[#111E28] tracking-tight"
                            >
                                Shop with Us: Sisterhood Commerce
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-stone-700 max-w-2xl">
                                Buy directly from verified Muslim sisters and trusted brands. Protected with our
                                strict fair-pricing policies, member discounts, and wholesale channels.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <SectionHoverInfo
                                explainer={shopExplainer}
                                sectionName="Shop with Us"
                            />
                        </div>
                    </div>
                </ScrollReveal>

                {/* MRP & Sisterhood Pricing Policy Bar in Warm Sand */}
                <ScrollReveal direction="up" delay={0.1}>
                    <div className="mb-8 p-4 rounded-2xl bg-[#F7DFC7] border border-[#F7DFC7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#111E28] shadow-xs">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#5B9891] flex-shrink-0" />
                            <span>
                                <strong>BDSisters Fair Price Rule:</strong> The MRP listed here must be equal or lower than other online platforms.
                            </span>
                        </div>
                        <div className="flex items-center gap-2 font-bold bg-white/70 px-3 py-1 rounded-full border border-[#F7DFC7]">
                            <BadgePercent className="w-4 h-4 text-[#5B9891]" />
                            <span>ZiniPay Secured Instant Checkout</span>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Category Filters & Directory Quick Links */}
                <ScrollReveal direction="up" delay={0.15}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex flex-wrap items-center gap-2" role="tablist">
                            {TAB_CONFIG.map((tab) => {
                                const isActive = activeCategory === tab.id;
                                return (
                                    <div
                                        key={tab.id}
                                        className={`inline-flex items-center rounded-full border transition-all ${isActive
                                            ? "bg-[#5B9891] text-white border-[#5B9891] shadow-xs"
                                            : "bg-[#FAF8F5] text-[#111E28] border-[#F7DFC7] hover:bg-[#F7DFC7]/60"
                                            }`}
                                    >
                                        <button
                                            role="tab"
                                            type="button"
                                            aria-selected={isActive}
                                            onClick={() => setActiveCategory(tab.id)}
                                            className="px-4 py-2 text-xs font-bold focus:outline-hidden"
                                        >
                                            {tab.label}
                                        </button>
                                        <Link
                                            href={tab.href}
                                            title={`Open ${tab.label} in directory`}
                                            className={`pr-3 pl-0.5 py-2 text-[11px] font-bold transition-opacity ${isActive
                                                ? "text-white/80 hover:text-white"
                                                : "text-stone-400 hover:text-[#5B9891]"
                                                }`}
                                        >
                                            ↗
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-stone-600 font-semibold">
                            <span>Shop by:</span>
                            <Link href="/businesses" className="underline hover:text-[#5B9891]">
                                Brand Profiles
                            </Link>
                            <span>•</span>
                            <Link href="/sisters" className="underline hover:text-[#5B9891]">
                                Sisters&apos; Profiles
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Products Grid with Smooth Reorder & Layout Animation */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[420px]"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => {
                            const discountPercent =
                                product.mrpPrice > product.specialDiscountPrice
                                    ? Math.round(
                                        ((product.mrpPrice - product.specialDiscountPrice) /
                                            product.mrpPrice) *
                                        100
                                    )
                                    : 0;

                            const productLink = `/shops/${product.slug || product.id}`;

                            return (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.92, y: 16 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: -16 }}
                                    transition={{
                                        duration: 0.35,
                                        ease: [0.21, 0.47, 0.32, 0.98],
                                    }}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                    className="group h-full rounded-2xl border border-[#F7DFC7] bg-white hover:shadow-xl hover:border-[#5B9891] transition-colors flex flex-col justify-between overflow-hidden"
                                >
                                    <div>
                                        {/* Product Image Box */}
                                        <Link
                                            href={productLink}
                                            className="block relative h-48 w-full bg-[#FAF8F5] overflow-hidden"
                                        >
                                            <img
                                                src={product.imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src =
                                                        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80";
                                                }}
                                            />

                                            {/* Category & Discount Badges */}
                                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#5B9891] text-white backdrop-blur-xs border border-[#D98408]/40">
                                                    {product.category}
                                                </span>
                                                {discountPercent > 0 && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5B9891] text-white shadow-xs">
                                                        Save {discountPercent}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Wholesale Availability Badge */}
                                            <div className="absolute bottom-2 right-2">
                                                {product.isWholesaleEligible ? (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7DFC7] text-[#111E28] border border-[#D98408] shadow-xs flex items-center gap-1">
                                                        <Layers className="w-3 h-3 text-[#D98408]" /> Wholesale Ready
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#5B9891]/90 text-white backdrop-blur-xs border border-white/20">
                                                        Retail Only
                                                    </span>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Content Info */}
                                        <div className="p-4 space-y-2">
                                            {/* Brand and Sister Seller */}
                                            <div className="flex items-center justify-between text-[11px] text-stone-600">
                                                <span className="font-bold text-[#111E28] flex items-center gap-1 line-clamp-1">
                                                    {product.brandName}
                                                    {product.brandVerified && (
                                                        <CheckCircle2 className="w-3 h-3 text-[#5B9891] inline flex-shrink-0" />
                                                    )}
                                                </span>
                                                <span className="font-medium flex-shrink-0">By {product.sellerSister}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm font-bold text-[#111E28] line-clamp-2 group-hover:text-[#5B9891] transition-colors leading-snug">
                                                <Link href={productLink} className="hover:underline">
                                                    {product.title}
                                                </Link>
                                            </h3>

                                            {/* Ratings */}
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <div className="flex items-center text-[#F2B55D]">
                                                    <Star
                                                        className={`w-3.5 h-3.5 ${product.totalReviews > 0
                                                            ? "fill-[#F2B55D]"
                                                            : "text-stone-300"
                                                            }`}
                                                    />
                                                </div>
                                                <span className="font-bold text-stone-800">
                                                    {product.rating > 0 ? product.rating.toFixed(1) : "New"}
                                                </span>
                                                <span className="text-[11px] text-stone-500">
                                                    ({product.totalReviews}{" "}
                                                    {product.totalReviews === 1 ? "review" : "reviews"})
                                                </span>
                                            </div>

                                            {/* Price Block */}
                                            <div className="pt-2 border-t border-[#F7DFC7]/50 flex items-baseline gap-2">
                                                <span className="text-base font-extrabold text-[#111E28] font-serif">
                                                    ৳{product.specialDiscountPrice.toLocaleString()}
                                                </span>
                                                {product.mrpPrice > product.specialDiscountPrice && (
                                                    <span className="text-xs text-stone-400 line-through">
                                                        MRP ৳{product.mrpPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Wholesale Price Info if Eligible */}
                                            {product.isWholesaleEligible && product.wholesaleUnitPrice && (
                                                <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#F7DFC7] text-[11px] text-[#111E28]">
                                                    Wholesale: <strong>৳{product.wholesaleUnitPrice}</strong> / pc (Min{" "}
                                                    {product.wholesaleMinQuantity} pcs)
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Bottom CTA */}
                                    <div className="p-4 pt-0">
                                        <Link
                                            href={productLink}
                                            className="w-full py-2.5 px-3 rounded-xl bg-[#5B9891] hover:bg-[#477C76] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs border border-[#5B9891] group-hover:shadow-md"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5 text-[#D98408]" />
                                            <span>View & Purchase</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* View All Marketplace CTA */}
                <ScrollReveal direction="up" delay={0.2}>
                    <div className="mt-10 text-center">
                        <Link
                            href={currentExploreHref}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#D98408] hover:bg-[#B86E04] text-white text-xs font-bold transition-all shadow-md border border-[#F2B55D] group/all"
                        >
                            <span>{currentExploreLabel}</span>
                            <ArrowRight className="w-4 h-4 text-white transition-transform duration-200 group-hover/all:translate-x-1" />
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
