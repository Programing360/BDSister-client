"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  Building2,
  Box,
  Truck,
  RotateCcw,
  Lock,
  Award,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle,
  Loader2,
  Sparkles,
  Share2,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface ProductDetailData {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  brandName: string;
  brandId?: string;
  sellerId?: {
    _id?: string;
    fullName?: string;
    profilePicture?: string;
    location?: { district?: string; state?: string };
  };
  businessId?:
    | {
        _id?: string;
        brands?: Array<{ _id?: string; brandName: string; isPublished?: boolean }>;
      }
    | string;
  category: "Product" | "Service";
  subCategory?: string;
  mrpPrice: number;
  salePrice: number;
  price?: number;
  wholesalePrice?: number;
  isWholesaleEligible: boolean;
  stock?: number;
  images: string[];
  productRating?: number;
  totalReviews?: number;
  isAvailable?: boolean;
}

interface ReviewItem {
  _id: string;
  reviewerName?: string;
  buyerId?: { fullName?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export function ProductDetailView({ product }: { product: ProductDetailData }) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const { user } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        ];

  const currentImage = images[selectedImageIndex] || images[0];

  const activePrice = product.salePrice || product.price || 0;
  const originalMrp = product.mrpPrice || activePrice;
  const discountAmount = originalMrp > activePrice ? originalMrp - activePrice : 0;
  const discountPercent =
    originalMrp > activePrice ? Math.round((discountAmount / originalMrp) * 100) : 0;

  const inStock = product.isAvailable !== false && (product.stock === undefined || product.stock > 0);
  const availableStock = product.stock ?? 10;

  // Fetch reviews for this product
  const fetchProductReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    try {
      // Try byProduct endpoint, fallback to productReviews endpoint
      const res = await apiClient.get<{
        success?: boolean;
        data?: { reviews?: ReviewItem[] } | ReviewItem[];
        reviews?: ReviewItem[];
      }>(API_ENDPOINTS.reviews.byProduct(product._id));

      const raw = res as unknown as {
        data?: { reviews?: ReviewItem[] } | ReviewItem[];
        reviews?: ReviewItem[];
      };

      if (raw?.reviews && Array.isArray(raw.reviews)) {
        setReviews(raw.reviews);
      } else if (raw?.data) {
        if (Array.isArray(raw.data)) {
          setReviews(raw.data);
        } else if (Array.isArray(raw.data.reviews)) {
          setReviews(raw.data.reviews);
        }
      }
    } catch {
      // Non-fatal if reviews fail
    } finally {
      setIsLoadingReviews(false);
    }
  }, [product._id]);

  useEffect(() => {
    fetchProductReviews();
  }, [fetchProductReviews]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setReviewError("Please write a few words about your experience with this item.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const resolvedBrandId =
        product.brandId ||
        (typeof product.businessId === "object" && product.businessId !== null
          ? (product.businessId as { _id?: string; brands?: Array<{ _id?: string }> }).brands?.[0]?._id ||
            (product.businessId as { _id?: string })._id
          : typeof product.businessId === "string"
          ? product.businessId
          : undefined);

      await apiClient.post(API_ENDPOINTS.reviews.create, {
        targetType: "Product",
        targetId: product._id,
        productId: product._id,
        brandId: resolvedBrandId,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      setCommentInput("");
      setReviewSuccess("Jazakallahu Khairan! Your verified review has been submitted.");
      fetchProductReviews();
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      brandName: product.brandName,
      price: activePrice,
      mrp: originalMrp,
      image: currentImage,
      quantity,
      stock: availableStock,
      category: product.category,
      isWholesale: product.isWholesaleEligible,
      wholesalePrice: product.wholesalePrice,
    });
  };

  const handleBuyNow = () => {
    addItem(
      {
        productId: product._id,
        slug: product.slug,
        title: product.title,
        brandName: product.brandName,
        price: activePrice,
        mrp: originalMrp,
        image: currentImage,
        quantity,
        stock: availableStock,
        category: product.category,
        isWholesale: product.isWholesaleEligible,
        wholesalePrice: product.wholesalePrice,
      },
      false
    );
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Bar */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto py-2 scrollbar-none"
        >
          <Link href="/" className="hover:text-[#5B9891] transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link href="/shops" className="hover:text-[#5B9891] transition-colors shrink-0">
            Shops
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link
            href={`/brands/${product.brandId || product.brandName}`}
            className="hover:text-[#5B9891] transition-colors shrink-0 font-medium text-stone-700"
          >
            {product.brandName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="font-bold text-[#111E28] truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#F7DFC7] shadow-xs p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Cloudinary Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-gray-100 shadow-inner group">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-[#D98408] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                    {discountPercent}% OFF
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-[#5B9891] shadow-xs transition"
                  title="Share listing link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? "border-[#5B9891] ring-2 ring-[#5B9891]/20 scale-102"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Standard Guarantee Card */}
              <div className="rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-4.5 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-[#467A74]">
                  <Award className="w-5 h-5 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    BDSisters Fair-Price Guarantee
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  MRP is equal to or lower than other platforms. We enforce strict fair-pricing standards to
                  ensure sisters shop transparently while craftswomen earn living-wage dignity.
                </p>
              </div>
            </div>

            {/* Right Column: Product Info & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Badge Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF8F5] text-[#111E28] border border-[#F7DFC7]">
                    {product.category === "Service" ? "Sister Service" : "Physical Product"}
                  </span>

                  {product.subCategory && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F7DFC7]/60 text-[#D98408] border border-[#F2B55D]/40">
                      {product.subCategory}
                    </span>
                  )}

                  {inStock ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({availableStock} available)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111E28] tracking-tight leading-tight">
                  {product.title}
                </h1>

                {/* Brand & Seller Line */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#F7DFC7]/80 py-3 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#5B9891]" />
                    <span>Brand:</span>
                    <Link
                      href={`/brands/${product.brandId || product.brandName}`}
                      className="font-bold text-[#111E28] hover:text-[#5B9891] underline decoration-[#5B9891]/40 underline-offset-4 transition"
                    >
                      {product.brandName}
                    </Link>
                    <span title="Verified Sister Brand">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5B9891]" />
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-[#D98408]">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{(product.productRating || 5).toFixed(1)}</span>
                    <span className="text-stone-400 font-normal">
                      ({reviews.length || product.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="rounded-2xl border border-[#F7DFC7] bg-[#FAF8F5] p-5 space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-[#D98408]">
                      ৳{activePrice.toLocaleString()}
                    </span>
                    {originalMrp > activePrice && (
                      <span className="text-base text-stone-400 line-through">
                        ৳{originalMrp.toLocaleString()}
                      </span>
                    )}
                    {discountAmount > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Save ৳{discountAmount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#467A74] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#5B9891]" />
                    <span>MRP is equal to or lower than other platforms</span>
                  </div>

                  {/* Wholesale Row */}
                  <div className="pt-2 border-t border-[#F7DFC7] flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                      <Box className="w-4 h-4 text-[#D98408]" />
                      Wholesale Channel:
                    </span>
                    {product.isWholesaleEligible && product.wholesalePrice ? (
                      <span className="font-bold text-[#D98408] bg-[#F7DFC7] px-2.5 py-1 rounded-lg">
                        ৳{product.wholesalePrice}/unit (Min 5 units)
                      </span>
                    ) : (
                      <span className="text-stone-400 font-medium">Not eligible for wholesale</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Product Story & Description
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-[#FAF8F5] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                      disabled={quantity <= 1 || !inStock}
                      className="p-2 hover:bg-gray-200 text-stone-600 transition disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(q + 1, availableStock))}
                      disabled={quantity >= availableStock || !inStock}
                      className="p-2 hover:bg-gray-200 text-stone-600 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#5B9891] hover:bg-[#467A74] text-white text-xs font-bold shadow-xs transition active:scale-[0.99] disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#D98408] hover:bg-[#B86E04] text-white text-xs font-bold shadow-xs transition active:scale-[0.99] disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Instant Checkout (ZiniPay)</span>
                  </button>
                </div>

                {/* Delivery Guarantee Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-stone-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#5B9891] shrink-0" />
                    <span>Nationwide delivery via verified courier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Secure ZiniPay Halal escrow protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl border border-[#F7DFC7] shadow-xs p-6 lg:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F7DFC7] pb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#111E28]">
                Verified Sisterhood Reviews
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic buyer feedback from sisters across Bangladesh
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#F7DFC7] px-3.5 py-1.5 rounded-xl">
              <Star className="w-4 h-4 text-[#D98408] fill-current" />
              <span className="text-sm font-extrabold text-[#111E28]">
                {(product.productRating || 5).toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-stone-400">({reviews.length} reviews)</span>
            </div>
          </div>

          {/* Submit Review Form */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#5B9891]" />
              Leave a Verified Customer Review
            </h3>

            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Rating *</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= ratingInput
                              ? "text-[#D98408] fill-current"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-stone-700">{ratingInput} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Share your thoughts about product quality, craftsmanship, and delivery experience..."
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5B9891] resize-none"
                    required
                  />
                </div>

                {reviewError && (
                  <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{reviewError}</span>
                  </div>
                )}

                {reviewSuccess && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{reviewSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#5B9891] hover:bg-[#467A74] text-white text-xs font-bold transition shadow-2xs disabled:opacity-50"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-xs text-stone-600">
                  Please sign in to your BDSisters account to submit a verified product review.
                </p>
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-lg bg-[#5B9891] text-white text-xs font-bold hover:bg-[#467A74] transition shrink-0"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4 pt-2">
            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-8 text-stone-400 gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#5B9891]" />
                <span>Loading reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border border-dashed border-gray-200 text-stone-500 text-xs space-y-1">
                <p className="font-bold text-stone-700">No customer reviews yet</p>
                <p>Be the first sister to review this item after ordering!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((rev) => (
                  <div key={rev._id} className="py-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">
                          {rev.reviewerName || rev.buyerId?.fullName || "Sister Buyer"}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[#D98408]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "text-[#D98408] fill-current" : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
