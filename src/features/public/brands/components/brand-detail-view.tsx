"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  ExternalLink,
  MapPin,
  Star,
  CheckCircle2,
  Store,
  User,
  MessageCircle,
  Share2,
  MousePointerClick,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { decodeHtmlEntities } from "@/lib/utils/format";
import { useAuth } from "@/hooks/use-auth";

export interface PublicBrandData {
  _id?: string;
  brandId?: string;
  businessId?: string;
  brandName: string;
  roleInBusiness?: string;
  customRoleTitle?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  businessSummary?: string;
  servicesOrProducts?: string[];
  portfolioOrGallery?: string[];
  testimonialsAndReviews?: Array<{
    _id?: string;
    user?: string;
    comment: string;
    rating: number;
    createdAt?: string;
    buyerId?: {
      _id?: string;
      fullName?: string;
      profilePicture?: string;
    };
  }>;
  websiteLinks?: string[];
  websiteUrl?: string;
  isPublished?: boolean;
  affiliateClicks?: number;
  founder?: {
    _id?: string;
    fullName?: string;
    email?: string;
    profilePicture?: string;
    location?: {
      city?: string;
      district?: string;
      division?: string;
      country?: string;
    };
  };
  subscriptionStatus?: string;
  createdAt?: string;
}

interface ReviewItem {
  _id?: string;
  user?: string;
  comment: string;
  rating: number;
  createdAt?: string;
  buyerId?: {
    _id?: string;
    fullName?: string;
    profilePicture?: string;
  };
}

interface BrandDetailViewProps {
  initialBrand: PublicBrandData;
}

export function BrandDetailView({ initialBrand }: BrandDetailViewProps) {
  const { user } = useAuth();
  const [clicks, setClicks] = useState<number>(initialBrand.affiliateClicks || 0);
  const [isTracking, setIsTracking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(
    (initialBrand.testimonialsAndReviews as ReviewItem[]) || []
  );
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewHover, setReviewHover] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const brandId = initialBrand.brandId || initialBrand._id;
  const businessId = initialBrand.businessId;
  const rawUrl = initialBrand.websiteUrl || initialBrand.websiteLinks?.[0] || "";
  const hasValidWebsite = Boolean(rawUrl && rawUrl.trim().length > 0);
  const websiteUrl = rawUrl;

  const founderId = initialBrand.founder?._id;
  const currentUserId = user?.id || (user as { _id?: string })?._id;
  const isOwner = Boolean(currentUserId && founderId && currentUserId === founderId);
  const userRoleStr = (user?.role || "").toUpperCase();
  const isAdmin = userRoleStr === "ADMIN" || userRoleStr === "SUPERADMIN";
  const canPreview = isOwner || isAdmin;
  const isPublished = initialBrand.isPublished && initialBrand.subscriptionStatus === "Paid";

  const founderName =
    decodeHtmlEntities(initialBrand.founder?.fullName) || "Sister Entrepreneur";
  const founderRole =
    initialBrand.roleInBusiness === "Other" && initialBrand.customRoleTitle
      ? initialBrand.customRoleTitle
      : decodeHtmlEntities(initialBrand.roleInBusiness) ||
        initialBrand.customRoleTitle ||
        "Founder";
  const brandName = decodeHtmlEntities(initialBrand.brandName);
  const brandSummary =
    decodeHtmlEntities(initialBrand.businessSummary) ||
    "Dedicated ethical women-led brand on BDSisters.org under Muhsina Organization.";

  // Fetch reviews from live backend
  const fetchReviews = useCallback(async () => {
    if (!brandId) return;
    setIsLoadingReviews(true);
    try {
      const res = await apiClient.get<{
        success?: boolean;
        data?: { reviews?: ReviewItem[] } | ReviewItem[];
      }>(API_ENDPOINTS.reviews.byBrand(brandId));

      const raw = res as unknown as {
        success?: boolean;
        data?: { reviews?: ReviewItem[] } | ReviewItem[];
      };

      if (raw.data) {
        if (Array.isArray(raw.data)) {
          setReviews(raw.data);
        } else if (Array.isArray(raw.data.reviews)) {
          setReviews(raw.data.reviews);
        }
      }
    } catch {
      // Keep initial reviews if fetch fails
    } finally {
      setIsLoadingReviews(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleVisitWebsite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasValidWebsite) return;
    setIsTracking(true);

    // Increment local count immediately for snappy UX
    setClicks((prev) => prev + 1);

    // Asynchronously call backend click tracking endpoint
    if (brandId) {
      try {
        const payload = { url: websiteUrl };
        if (businessId) {
          await apiClient
            .post(API_ENDPOINTS.business.trackBrandClick(brandId, businessId), payload)
            .catch(() => {});
        } else {
          await apiClient
            .post(`/api/businesses/brands/${brandId}/click`, payload)
            .catch(() => {});
        }
      } catch {
        // Silently continue navigation
      }
    }

    setIsTracking(false);

    if (typeof window !== "undefined" && websiteUrl) {
      window.open(websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId) return;
    if (!reviewComment.trim()) {
      setReviewError("Please provide a short comment with your review.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const res = await apiClient.post<{
        success?: boolean;
        message?: string;
        data?: ReviewItem;
      }>(API_ENDPOINTS.reviews.create, {
        targetType: "Brand",
        targetId: brandId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      const raw = res as unknown as {
        success?: boolean;
        message?: string;
        data?: ReviewItem;
      };

      const reviewerDisplayName =
        (user as { fullName?: string })?.fullName || user?.name || "Sister Member";

      const newRev: ReviewItem = raw?.data || {
        user: reviewerDisplayName,
        comment: reviewComment.trim(),
        rating: reviewRating,
        createdAt: new Date().toISOString(),
        buyerId: {
          _id: currentUserId,
          fullName: reviewerDisplayName,
        },
      };

      setReviews((prev) => [newRev, ...prev]);
      setReviewComment("");
      setReviewRating(5);
      setReviewSuccess("Jazakallahu Khair! Your review has been submitted successfully.");
      setTimeout(() => setReviewSuccess(null), 5000);
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Guard: If not published and not owner/admin, display clean unpublished notice
  if (!isPublished && !canPreview) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5]/60 px-4 py-16 pt-28 sm:pt-32">
        <div className="max-w-md w-full rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D98408]/15 text-[#D98408]">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Brand Profile Unpublished</h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            This brand profile is currently unpublished or pending subscription confirmation. Once activated by the founder, it will be visible to the public.
          </p>
          <div className="pt-2">
            <Link
              href="/businesses"
              className="inline-flex items-center gap-2 rounded-xl bg-[#5B9891] px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#467A74] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Explore Active Brands</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const locationText = initialBrand.founder?.location
    ? [
        initialBrand.founder.location.district,
        initialBrand.founder.location.division,
        initialBrand.founder.location.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "Dhaka, Bangladesh";

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-[#FAF8F5]/60 pb-20 pt-24 sm:pt-28">
      {/* Breadcrumb Bar */}
      <div className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/" className="hover:text-[#5B9891] transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <Link href="/businesses" className="hover:text-[#5B9891] transition">
              Businesses &amp; Brands
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-bold text-gray-900 truncate max-w-xs">{brandName}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6">
        {/* Unpublished Preview Banner for Owner / Admin */}
        {!isPublished && canPreview && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Preview Mode: Unpublished Brand</span>
              <p className="mt-0.5 text-amber-800">
                This brand is currently unpublished or pending subscription confirmation. As the brand founder or administrator, you can view this page in preview mode. Public visitors cannot access it until activated.
              </p>
            </div>
          </div>
        )}

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#5B9891]/25 bg-gradient-to-br from-[#F7DFC7]/40 via-white to-[#5B9891]/10 p-6 sm:p-10 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Brand Monogram Icon */}
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5B9891] to-[#467A74] text-white text-2xl sm:text-3xl font-black shadow-md">
                {brandName.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                    {brandName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#5B9891]/15 border border-[#5B9891]/30 px-3 py-0.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#5B9891]" />
                    Verified Brand
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <span>
                    Founded by <strong>{founderName}</strong>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[#D98408] font-bold">{founderRole}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#5B9891]" />
                    {locationText}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <strong>{averageRating}</strong> ({reviews.length} reviews)
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-gray-600">
                    <MousePointerClick className="h-3.5 w-3.5 text-[#D98408]" />
                    {clicks.toLocaleString()} link visits
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
              >
                <Share2 className="h-3.5 w-3.5 text-gray-500" />
                <span>{copied ? "Link Copied!" : "Share Brand"}</span>
              </button>

              {hasValidWebsite && (
                <button
                  type="button"
                  onClick={handleVisitWebsite}
                  disabled={isTracking}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5B9891] to-[#467A74] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer disabled:opacity-50"
                >
                  <Globe className="h-4 w-4" />
                  <span>Visit Official Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Summary */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Store className="h-5 w-5 text-[#5B9891]" />
                About {brandName}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {brandSummary}
              </p>

              {/* Products & Services Tags */}
              {initialBrand.servicesOrProducts &&
                initialBrand.servicesOrProducts.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Core Offerings &amp; Catalog
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {initialBrand.servicesOrProducts.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#FAF8F5] border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-800"
                        >
                          <Sparkles className="h-3 w-3 text-[#D98408]" />
                          {decodeHtmlEntities(item)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Gallery / Portfolio */}
            {initialBrand.portfolioOrGallery &&
              initialBrand.portfolioOrGallery.length > 0 && (
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Artisan Showcase &amp; Gallery
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {initialBrand.portfolioOrGallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-200"
                      >
                        <Image
                          src={img}
                          alt={`${brandName} showcase ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Community Reviews & Interactive Review Form */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    Community Reviews ({reviews.length})
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Authentic feedback from verified sisters and community patrons.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#5B9891] rounded-full bg-[#5B9891]/10 px-3 py-1">
                  Verified Feedback
                </span>
              </div>

              {/* Write a Review Section */}
              <div className="border-t border-b border-gray-100 py-5">
                {!user ? (
                  <div className="rounded-2xl border border-gray-200/80 bg-[#FAF8F5] p-5 text-center space-y-2">
                    <p className="text-xs text-gray-600 font-medium">
                      Have you interacted with or purchased from {brandName}?
                    </p>
                    <Link
                      href={`/login?callbackUrl=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.pathname : ""
                      )}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#467A74] transition"
                    >
                      Log In to Leave a Review
                    </Link>
                  </div>
                ) : isOwner ? (
                  <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-4 text-xs text-gray-500 text-center">
                    As the founder of this brand, your reviews are disabled to ensure authentic community feedback.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        Write a Review
                      </span>
                      {/* Star Rating Picker */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setReviewHover(star)}
                            onMouseLeave={() => setReviewHover(null)}
                            className="p-1 focus:outline-hidden"
                            title={`${star} Star${star > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={`h-5 w-5 transition ${
                                (reviewHover !== null ? star <= reviewHover : star <= reviewRating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={`Share your experience with ${brandName}...`}
                      className="w-full rounded-2xl border border-gray-200 bg-[#FAF8F5] p-3.5 text-xs text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden"
                      required
                    />

                    {reviewError && (
                      <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{reviewError}</span>
                      </div>
                    )}

                    {reviewSuccess && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{reviewSuccess}</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingReview || !reviewComment.trim()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#467A74] transition disabled:opacity-50"
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Review</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              {isLoadingReviews ? (
                <div className="py-8 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#5B9891]" />
                  <span>Loading reviews...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No reviews submitted yet. Be the first to review {brandName}!
                </div>
              ) : (
                <div className="space-y-3.5">
                  {reviews.map((rev, idx) => {
                    const reviewerName =
                      rev.buyerId?.fullName || rev.user || "Sister Patron";
                    return (
                      <div
                        key={rev._id || idx}
                        className="rounded-2xl border border-gray-100 bg-[#FAF8F5] p-4 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{reviewerName}</span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column (1 col) */}
          <div className="space-y-6">
            {/* Founder Card */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Founder Leadership
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F7DFC7] text-[#D98408] font-bold">
                  {initialBrand.founder?.profilePicture ? (
                    <Image
                      src={initialBrand.founder.profilePicture}
                      alt={founderName}
                      width={48}
                      height={48}
                      className="rounded-2xl object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{founderName}</h4>
                  <p className="text-xs text-gray-500 font-medium">{founderRole}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Registered founder and authorized enterprise representative on BDSisters.org
                under Muhsina Organization.
              </p>

              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#5B9891]/30 bg-white py-2.5 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Inquire With Sister</span>
              </Link>
            </div>

            {/* Official Website & Traffic Tracking */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Official Web Presence
              </h3>

              {hasValidWebsite ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-gray-100 p-3 text-xs">
                    <span className="text-gray-500 font-medium truncate max-w-[160px]">
                      {websiteUrl.replace(/^https?:\/\//, "")}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#D98408]">
                      {clicks.toLocaleString()} clicks
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleVisitWebsite}
                    disabled={isTracking}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B9891] py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#467A74] transition cursor-pointer"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Visit Official Website</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="rounded-xl bg-[#FAF8F5] border border-gray-100 p-3 text-xs text-gray-400">
                  No external website registered.
                </div>
              )}
            </div>

            {/* Platform Guarantee Badge */}
            <div className="rounded-3xl border border-[#5B9891]/20 bg-[#5B9891]/5 p-5 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#467A74]">
                <ShieldCheck className="h-4 w-4 text-[#5B9891]" />
                <span>BDSisters Verified Standards</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                Every sister brand adheres to our ethical community charter, promoting fair
                trade, authentic craftsmanship, and mutual sisterhood empowerment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
