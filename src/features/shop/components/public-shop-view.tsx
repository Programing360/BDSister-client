"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  ShoppingCart,
  Star,
  ShieldCheck,
  CheckCircle2,
  BadgePercent,
  Search,
  SlidersHorizontal,
  Box,
  Truck,
  Heart,
  Eye,
  ArrowRight,
  Sparkles,
  Store,
  Layers,
  X,
  CreditCard,
  Lock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Comprehensive Catalog of Sisterhood Products & Services
interface ShopProduct {
  id: string;
  slug?: string;
  title: string;
  sellerSister: string;
  brandName: string;
  brandVerified: boolean;
  mrpPrice: number;
  specialDiscountPrice: number;
  category: "Physical Products" | "Sister Services";
  subCategory: string;
  isWholesaleEligible: boolean;
  wholesaleMinQuantity?: number;
  wholesaleUnitPrice?: number;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  inStock: boolean;
  stock?: number;
  description: string;
  features: string[];
  wingAffiliation?: string;
}

const DEFAULT_FALLBACK_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23FAF8F5'><rect width='400' height='300' fill='%23FAF8F5'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239CA3AF' font-weight='600'>BDSisters Product</text></svg>";

const MAIN_TABS = [
  { id: "all", label: "All" },
  { id: "physical products", label: "Physical Products" },
  { id: "sister services", label: "Sister Services" },
  { id: "wholesale ready", label: "Wholesale Ready" },
] as const;

export function PublicShopView({ shop }: { shop?: any } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [productsList, setProductsList] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [clickedButtonId, setClickedButtonId] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Sync initial tab and category filters from URL query parameters (e.g. from homepage links)
  useEffect(() => {
    if (!searchParams) return;
    const typeParam = searchParams.get("type");
    const tabParam = searchParams.get("tab");
    const wholesaleParam = searchParams.get("wholesale");
    const genreParam = searchParams.get("genre") || searchParams.get("category");

    if (wholesaleParam === "true" || tabParam === "wholesale ready") {
      setActiveTab("wholesale ready");
    } else if (typeParam) {
      const t = typeParam.toLowerCase();
      if (t.includes("physical") || t.includes("product")) {
        setActiveTab("physical products");
      } else if (t.includes("sister") || t.includes("service")) {
        setActiveTab("sister services");
      }
    } else if (tabParam) {
      setActiveTab(tabParam.toLowerCase());
    }

    if (genreParam) {
      setSelectedSubCategory(genreParam);
    }
  }, [searchParams]);

  // Dynamic genres derived from loaded products + standard presets
  const availableGenres = useMemo(() => {
    const presetGenres = [
      "Halal Skincare & Wellness",
      "Modest Clothing & Hijab",
      "Consulting & Mentorship",
      "Stationery & Publications",
      "Artisan & Handcrafted",
      "Modest Fashion & Apparel",
      "Organic Food",
    ];

    // Extract all unique non-empty subcategories from loaded products
    const productGenres = productsList
      .map((p) => p.subCategory?.trim())
      .filter((s): s is string => Boolean(s && s.toLowerCase() !== "all"));

    const seen = new Set<string>();
    const genres: string[] = ["All"];
    seen.add("all");

    // Add actual product genres first so user-created categories appear prominently
    for (const g of productGenres) {
      const lower = g.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        genres.push(g);
      }
    }

    // Add remaining presets
    for (const g of presetGenres) {
      const lower = g.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        genres.push(g);
      }
    }

    return genres;
  }, [productsList]);

  // Fetch real MongoDB products from API
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    apiClient
      .get<{ data?: any[] }>(API_ENDPOINTS.ecommerce.products)
      .then((res) => {
        if (!active) return;
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
          const mapped: ShopProduct[] = list.map((p: any) => ({
            id: p._id || p.id,
            slug: p.slug || p._id || p.id,
            title: p.title,
            sellerSister: p.sellerId?.fullName || p.brandName || "Sister Seller",
            brandName: p.brandName,
            brandVerified: true,
            mrpPrice: p.mrpPrice || p.salePrice || p.price || 0,
            specialDiscountPrice: p.salePrice || p.price || 0,
            category: p.category === "Service" ? "Sister Services" : "Physical Products",
            subCategory:
              p.subCategory ||
              (p.category === "Service" ? "Consulting & Mentorship" : "Halal Skincare & Wellness"),
            isWholesaleEligible: Boolean(p.isWholesaleEligible),
            wholesaleMinQuantity: 5,
            wholesaleUnitPrice: p.wholesalePrice,
            rating: p.productRating || 5.0,
            totalReviews: p.totalReviews || 0,
            imageUrl:
              p.images?.[0] || DEFAULT_FALLBACK_SVG,
            inStock: p.isAvailable !== false && (p.stock === undefined || p.stock > 0),
            stock: p.stock ?? 10,
            description: p.description || p.title,
            features: [
              "100% Halal Verified by BDSisters",
              "MRP Equal or Lower than Other Platforms",
              "Direct Sister Entrepreneur Support",
            ],
            wingAffiliation: "The Hut Halal Network",
          }));
          setProductsList(mapped);
        } else {
          setProductsList([]);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch products from API:", err);
        if (active) {
          setProductsList([]);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Filter and sort items with case-insensitive normalization
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // 1. Tab / Category Filter (normalized lowercase check)
      const tabNorm = (activeTab || "all").toLowerCase().trim();
      if (tabNorm !== "all") {
        if (tabNorm === "wholesale ready" || tabNorm === "wholesale") {
          if (!item.isWholesaleEligible) return false;
        } else if (tabNorm === "physical products" || tabNorm === "product" || tabNorm === "products") {
          const cat = (item.category || "").toLowerCase();
          if (!cat.includes("physical") && !cat.includes("product")) return false;
        } else if (tabNorm === "sister services" || tabNorm === "service" || tabNorm === "services") {
          const cat = (item.category || "").toLowerCase();
          if (!cat.includes("service")) return false;
        } else {
          if ((item.category || "").toLowerCase() !== tabNorm) return false;
        }
      }

      // 2. Subcategory / Genre Filter (normalized lowercase check)
      const genreNorm = (selectedSubCategory || "all").toLowerCase().trim();
      if (genreNorm !== "all") {
        const itemSub = (item.subCategory || "").toLowerCase().trim();
        if (itemSub !== genreNorm) return false;
      }

      // 3. Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchBrand = item.brandName.toLowerCase().includes(query);
        const matchSeller = item.sellerSister.toLowerCase().includes(query);
        const matchSub = (item.subCategory || "").toLowerCase().includes(query);
        if (!matchTitle && !matchBrand && !matchSeller && !matchSub) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.specialDiscountPrice - b.specialDiscountPrice;
      if (sortBy === "price-desc") return b.specialDiscountPrice - a.specialDiscountPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured
    });
  }, [productsList, activeTab, selectedSubCategory, searchQuery, sortBy]);

  // Handle arrow button click animation
  const handleButtonClick = (productId: string, product: ShopProduct) => {
    setClickedButtonId(productId);
    setSelectedProduct(product);
    setTimeout(() => {
      setClickedButtonId(null);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111E28]">
      {/* ========================================================= */}
      {/* 1. HERO & BREADCRUMB SECTION                               */}
      {/* ========================================================= */}
      <section className="bg-white border-b border-[#F7DFC7] pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 mb-6">
            <Link href="/" className="hover:text-[#5B9891] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-[#111E28]">Shop with Us</span>
          </nav>

          {/* Heading with Clean Brand Badge */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7DFC7] text-[#111E28] text-xs font-bold tracking-wide uppercase mb-3 border border-[#F2B55D]/40">
                <ShoppingBag className="w-3.5 h-3.5 text-[#5B9891]" />
                <span>Halal E-Commerce • The Hut Artisan Network</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111E28] tracking-tight">
                Shop with Us: Sisterhood Commerce
              </h1>
              <p className="mt-3 text-base sm:text-lg text-stone-700 leading-relaxed">
                Buy directly from verified Muslim sisters and trusted women-led brands. Every listing is protected
                by the <strong>BDSisters Fair-Price Rule</strong>, member discounts, and transparent wholesale channels.
              </p>
            </div>
          </div>

          {/* Guarantee Banners Bar (Loch Blue & Paper Heart accents) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F7DFC7]/60 border border-[#F7DFC7] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#5B9891] shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111E28]">BDSisters Fair Price Rule</h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  MRP listed must be equal or lower than any other online platform.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7DFC7]/60 border border-[#F7DFC7] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#D98408] shadow-2xs">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111E28]">ZiniPay Secured Instant Checkout</h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Halal escrow protection for peer-to-peer sister transactions.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7DFC7]/60 border border-[#F7DFC7] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#5B9891] shadow-2xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111E28]">The Hut Halal Network</h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Synergized directly with verified home-based maker sisters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FILTER & SEARCH CONTROLS                                */}
      {/* ========================================================= */}
      <section className="sticky top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#F7DFC7] py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Primary Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" role="tablist">
              {MAIN_TABS.map((tab) => {
                const count =
                  tab.id === "all"
                    ? productsList.length
                    : tab.id === "wholesale ready"
                      ? productsList.filter((i) => i.isWholesaleEligible).length
                      : tab.id === "physical products"
                        ? productsList.filter((i) => (i.category || "").toLowerCase().includes("physical") || (i.category || "").toLowerCase().includes("product")).length
                        : productsList.filter((i) => (i.category || "").toLowerCase().includes("service")).length;

                const isActive = activeTab.toLowerCase() === tab.id;

                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedSubCategory("all");
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${isActive
                      ? "bg-[#5B9891] text-white shadow-sm border border-[#5B9891]"
                      : "bg-white text-stone-700 hover:bg-[#F7DFC7]/50 border border-[#F7DFC7]"
                      }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort Selector */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, sisters..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-white border border-[#F7DFC7] focus:outline-none focus:ring-2 focus:ring-[#5B9891] placeholder:text-stone-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-full border border-[#F7DFC7] text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-[#111E28] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subcategory / Genre Filter Pills */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-stone-500 font-medium text-[11px] whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#5B9891]" /> Filter by genre:
            </span>
            {availableGenres.map((sub) => {
              const isSelected = selectedSubCategory.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub.toLowerCase())}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${isSelected
                    ? "bg-[#D98408] text-white shadow-2xs"
                    : "bg-[#F7DFC7]/40 text-stone-700 hover:bg-[#F7DFC7] border border-[#F7DFC7]/60"
                    }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PRODUCT CATALOG GRID (Cards with Rotating Arrow Button) */}
      {/* ========================================================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl border border-[#F7DFC7] overflow-hidden p-5 flex flex-col justify-between animate-pulse"
                >
                  <div className="h-52 bg-stone-200/70 rounded-2xl mb-4 w-full" />
                  <div className="h-4 bg-stone-200/70 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-stone-200/70 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-stone-200/70 rounded w-1/2 mb-4" />
                  <div className="pt-3 border-t border-[#F7DFC7]/60 flex justify-between items-center">
                    <div className="h-6 bg-stone-200/70 rounded w-20" />
                    <div className="h-6 bg-stone-200/70 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#F7DFC7] p-8 max-w-md mx-auto shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-[#F7DFC7] text-[#D98408] flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#111E28]">No listings found</h3>
              <p className="mt-2 text-xs text-stone-600">
                No items match your active filters. Try resetting the search or category filters.
              </p>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSelectedSubCategory("all");
                  setSearchQuery("");
                }}
                className="mt-5 px-5 py-2 rounded-full bg-[#5B9891] text-white font-bold text-xs hover:bg-[#5B9891]/90 shadow-2xs transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isClicked = clickedButtonId === product.id;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-3xl border border-[#F7DFC7] overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#5B9891]/40 transition-all duration-300"
                  >
                    {/* Top Image Banner */}
                    <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = DEFAULT_FALLBACK_SVG;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF8F5]/90 backdrop-blur-md text-[#111E28] border border-[#F7DFC7] shadow-2xs">
                          {product.subCategory}
                        </span>

                        {product.isWholesaleEligible && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D98408] text-white shadow-2xs flex items-center gap-1">
                            <Box className="w-3 h-3" />
                            Wholesale Ready
                          </span>
                        )}
                      </div>

                      {/* Quick View Button overlay on hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-4 py-2 rounded-full bg-white text-[#111E28] text-xs font-bold shadow-md hover:bg-[#F7DFC7] transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#5B9891]" />
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Seller & Verification */}
                        <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#111E28]">{product.brandName}</span>
                            {product.brandVerified && (
                              <span title="Verified Sister Brand">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B9891]" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[#D98408] font-bold text-[11px]">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{product.rating}</span>
                            <span className="text-stone-400 font-normal">({product.totalReviews})</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-base font-bold text-[#111E28] group-hover:text-[#5B9891] transition-colors line-clamp-2 leading-snug">
                          <Link href={`/shops/${product.slug || product.id}`}>
                            {product.title}
                          </Link>
                        </h3>

                        {/* Seller Sister & Affiliation */}
                        <p className="mt-1 text-[11px] text-stone-500">
                          By <span className="font-medium text-stone-700">{product.sellerSister}</span>
                          {product.wingAffiliation && (
                            <span className="text-[#5B9891] ml-1.5">({product.wingAffiliation})</span>
                          )}
                        </p>

                        {/* Pricing Block */}
                        <div className="mt-4 pt-3 border-t border-[#F7DFC7]/60 flex items-baseline justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-[#D98408]">
                                ৳{product.specialDiscountPrice}
                              </span>
                              <span className="text-xs text-stone-400 line-through">
                                ৳{product.mrpPrice}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#5B9891] font-semibold">
                              Sister Member Price (BDSisters Exclusive)
                            </span>
                          </div>

                          <div className="text-right">
                            {product.isWholesaleEligible && product.wholesaleUnitPrice ? (
                              <>
                                <span className="text-xs font-bold text-[#111E28]">
                                  ৳{product.wholesaleUnitPrice}/pc
                                </span>
                                <p className="text-[10px] text-stone-500">
                                  Min {product.wholesaleMinQuantity || 5} pcs
                                </p>
                              </>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-medium">
                                Not eligible for wholesale
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ========================================================= */}
                      {/* CARD FOOTER: Add to Cart + Order Details Button          */}
                      {/* ========================================================= */}
                      <div className="mt-5 pt-3 border-t border-[#F7DFC7]/60 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            addItem({
                              productId: product.id,
                              slug: product.slug,
                              title: product.title,
                              brandName: product.brandName,
                              price: product.specialDiscountPrice,
                              mrp: product.mrpPrice,
                              image: product.imageUrl,
                              category: product.category,
                              isWholesale: product.isWholesaleEligible,
                              wholesalePrice: product.wholesaleUnitPrice,
                              stock: product.stock,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#5B9891] hover:bg-[#467A74] text-white transition-all shadow-2xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <Link
                          href={`/shops/${product.slug || product.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F7DFC7] hover:bg-[#F2B55D] text-[#111E28] transition-all duration-200 border border-[#F2B55D]/40 group/btn shadow-2xs"
                        >
                          <span>Order Details</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#111E28] group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SISTER VENDOR REGISTRATION CALLOUT (Golden Hour/Paper)  */}
      {/* ========================================================= */}
      <section className="py-16 bg-white border-t border-[#F7DFC7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#F7DFC7]/50 via-white to-[#F7DFC7]/30 border border-[#F7DFC7] relative overflow-hidden shadow-2xs">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B9891]/15 text-[#5B9891] text-xs font-bold uppercase mb-4 border border-[#5B9891]/20">
                <Store className="w-3.5 h-3.5" />
                <span>Sell on BDSisters Halal Marketplace</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111E28] tracking-tight">
                Are you a Muslim Sister with a Halal Brand or Service?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed">
                Join 150+ verified sister entrepreneurs on the BDSisters platform. Enjoy zero hidden commission
                charges, an ethical sisterhood audience, and direct escrow integration with ZiniPay.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/who-we-are"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D98408] text-white font-bold text-xs hover:bg-[#D98408]/90 transition-all shadow-sm"
                >
                  <span>Apply for Vendor Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                  <ShieldCheck className="w-4 h-4 text-[#5B9891]" />
                  <span>NID & Female-Admin Verification Required</span>
                </div>
              </div>
            </div>

            {/* Subtle decorative background watermarks */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
              <ShoppingBag className="w-72 h-72 text-[#5B9891]" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. PRODUCT DETAILS & CHECKOUT MODAL                        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl max-w-2xl w-full border border-[#F7DFC7] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-[#F7DFC7] flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7DFC7] text-[#111E28] border border-[#F2B55D]/40">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Listing ID: {selectedProduct.id}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setCheckoutSuccess(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/2 h-56 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#5B9891] mb-1">
                        <span>{selectedProduct.brandName}</span>
                        {selectedProduct.brandVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111E28]">
                        {selectedProduct.title}
                      </h3>
                      <p className="mt-1 text-xs text-stone-500">
                        Owner: {selectedProduct.sellerSister}
                      </p>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#D98408]">
                          ৳{selectedProduct.specialDiscountPrice}
                        </span>
                        <span className="text-sm text-stone-400 line-through">
                          ৳{selectedProduct.mrpPrice}
                        </span>
                      </div>
                    </div>

                    {selectedProduct.isWholesaleEligible && (
                      <div className="mt-3 p-3 rounded-xl bg-[#F7DFC7]/60 border border-[#F7DFC7] text-xs">
                        <span className="font-bold text-[#111E28] block">Wholesale Supply Rate:</span>
                        <span className="text-[#D98408] font-bold">
                          ৳{selectedProduct.wholesaleUnitPrice}/unit
                        </span>{" "}
                        (Min order {selectedProduct.wholesaleMinQuantity} units)
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111E28] mb-2">
                    Description & Specifications
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5B9891] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ZiniPay Escrow Notice */}
                <div className="p-4 rounded-2xl bg-[#5B9891]/10 border border-[#5B9891]/20 flex items-start gap-3">
                  <Lock className="w-4 h-4 text-[#5B9891] mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-stone-700">
                    <p className="font-bold text-[#111E28]">100% Halal Escrow via ZiniPay</p>
                    <p className="mt-0.5 text-stone-600">
                      Payment is held securely and only disbursed to the sister seller after order confirmation
                      and mutual satisfaction.
                    </p>
                  </div>
                </div>

                {checkoutSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Demo order placed successfully! In production, this redirects to the secure ZiniPay gateway.</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-[#F7DFC7] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setCheckoutSuccess(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        productId: selectedProduct.id,
                        slug: selectedProduct.slug,
                        title: selectedProduct.title,
                        brandName: selectedProduct.brandName,
                        price: selectedProduct.specialDiscountPrice,
                        mrp: selectedProduct.mrpPrice,
                        image: selectedProduct.imageUrl,
                        category: selectedProduct.category,
                        isWholesale: selectedProduct.isWholesaleEligible,
                        wholesalePrice: selectedProduct.wholesaleUnitPrice,
                        stock: selectedProduct.stock,
                      });
                      setSelectedProduct(null);
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#5B9891] hover:bg-[#467A74] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addItem(
                        {
                          productId: selectedProduct.id,
                          slug: selectedProduct.slug,
                          title: selectedProduct.title,
                          brandName: selectedProduct.brandName,
                          price: selectedProduct.specialDiscountPrice,
                          mrp: selectedProduct.mrpPrice,
                          image: selectedProduct.imageUrl,
                          category: selectedProduct.category,
                          isWholesale: selectedProduct.isWholesaleEligible,
                          wholesalePrice: selectedProduct.wholesaleUnitPrice,
                          stock: selectedProduct.stock,
                        },
                        false
                      );
                      setSelectedProduct(null);
                      router.push("/checkout");
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#D98408] hover:bg-[#B86E04] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Checkout with ZiniPay</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PublicShopView;
