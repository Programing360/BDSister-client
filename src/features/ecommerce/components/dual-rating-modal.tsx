"use client";

import React, { useState } from "react";
import {
  Star,
  X,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HeartHandshake,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { OrderItemSnapshot } from "@/types/order";

interface DualRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  items: OrderItemSnapshot[];
  onSuccess?: () => void;
}

const RATING_DESCRIPTIONS = {
  product: ["", "Poor Quality", "Fair / Usable", "Good Standard", "Very Good Craft", "Exceptional / Masterpiece"],
  seller: ["", "Disappointing Service", "Below Expectation", "Polite & Standard", "Fast & Very Courteous", "Outstanding Sisterhood Care"],
};

export function DualRatingModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  items,
  onSuccess,
}: DualRatingModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    items[0]?.productId || ""
  );
  const [productRating, setProductRating] = useState<number>(5);
  const [hoverProductRating, setHoverProductRating] = useState<number>(0);

  const [sellerRating, setSellerRating] = useState<number>(5);
  const [hoverSellerRating, setHoverSellerRating] = useState<number>(0);

  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const targetProductId = selectedProductId || items[0]?.productId;
    const payload = {
      orderId,
      productId: targetProductId,
      productRating,
      brandRating: sellerRating,
      sellerRating,
      comment: reviewComment.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      if (targetProductId) {
        await apiClient.post(API_ENDPOINTS.ecommerce.reviews(targetProductId), {
          productRating,
          brandRating: sellerRating,
          comment: reviewComment.trim(),
        });
      } else {
        await apiClient.post(API_ENDPOINTS.ecommerce.orderReviews(orderId), payload);
      }

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50/70 via-white to-purple-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5B46F6] flex items-center justify-center shadow-xs">
              <Star className="w-5 h-5 fill-[#5B46F6]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Sisterhood Dual Rating</h3>
              <p className="text-xs text-gray-500">Order #{orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-gray-900">Thank You, Sister!</h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Your dual feedback on product craft and maker service has been recorded. Your ratings empower ethical women-led businesses across Bangladesh!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Product selection if multiple items */}
            {items.length > 1 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Item to Review
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#5B46F6] outline-none"
                >
                  {items.map((item) => (
                    <option key={item.productId} value={item.productId}>
                      {item.productName} ({item.businessName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* RATING 1: Product Quality */}
            <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <Package className="w-4 h-4 text-[#5B46F6]" />
                  <span>1. Product Craft & Quality Rating</span>
                </div>
                <span className="text-xs font-semibold text-[#5B46F6]">
                  {RATING_DESCRIPTIONS.product[hoverProductRating || productRating]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverProductRating || productRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setProductRating(star)}
                      onMouseEnter={() => setHoverProductRating(star)}
                      onMouseLeave={() => setHoverProductRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RATING 2: Seller & Delivery Experience */}
            <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>2. Seller Service & Fulfillment Rating</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700">
                  {RATING_DESCRIPTIONS.seller[hoverSellerRating || sellerRating]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverSellerRating || sellerRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSellerRating(star)}
                      onMouseEnter={() => setHoverSellerRating(star)}
                      onMouseLeave={() => setHoverSellerRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Feedback Text */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Written Feedback & Experience (Optional)
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on the packaging, craft details, or communication with the sister maker..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20 outline-none text-xs leading-relaxed transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-xs font-bold shadow-md shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Dual Review...</span>
                  </>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Submit Dual Rating</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
