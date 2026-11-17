"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Heart,
  MessageCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailActionsProps {
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount?: number;
  businessName: string;
  sellerSlug?: string;
}

export function ProductDetailActions({
  price,
  originalPrice,
  inStock,
  stockCount,
  businessName,
  sellerSlug,
}: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className="space-y-6">
      {/* Price & Quantity Block */}
      <div className="rounded-2xl border border-border/80 bg-surface/50 p-5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-text-primary tracking-tight">
                ৳{(price * quantity).toLocaleString("en-BD")}
              </span>
              {originalPrice && (
                <span className="text-base text-neutral line-through">
                  ৳{(originalPrice * quantity).toLocaleString("en-BD")}
                </span>
              )}
              {discountPercent && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
              <span>Unit Price: ৳{price.toLocaleString("en-BD")}</span>
              <span>•</span>
              <span className="font-semibold text-primary">All revenue goes to maker</span>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-text-secondary">Quantity:</span>
            <div className="flex items-center rounded-xl border border-border bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:opacity-30"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-text-primary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={increment}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stock status indicator */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                inStock ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            <span className="font-semibold text-text-primary">
              {inStock
                ? stockCount
                  ? `Only ${stockCount} pieces available in this batch`
                  : "Available for Immediate Dispatch"
                : "Currently Out of Stock"}
            </span>
          </div>
          <span className="text-text-secondary hidden sm:inline">
            Directly from {businessName}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1 justify-center gap-2.5 shadow-button hover:shadow-card-hover font-bold text-base py-3.5"
          onClick={() => setShowOrderModal(true)}
          disabled={!inStock}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{inStock ? "Order Direct from Maker" : "Item Sold Out"}</span>
        </Button>

        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 shrink-0 ${
            isWishlisted
              ? "border-rose-300 bg-rose-50 text-rose-500"
              : "border-border bg-white text-text-secondary hover:border-primary/40 hover:text-primary shadow-sm"
          }`}
          title={isWishlisted ? "Remove from saved items" : "Save for later"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-soft">
          <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-text-primary">Nationwide Courier</p>
            <p className="text-text-secondary">Delivered directly from the artisan's district in 3–5 days.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-soft">
          <RotateCcw className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-text-primary">Artisan Quality Guarantee</p>
            <p className="text-text-secondary">Full refund or exchange for any defect within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Sister Direct Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-floating">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  Order Direct from {businessName}
                </h3>
                <p className="text-xs text-text-secondary">
                  Fair Trade & Zero Intermediary Commission
                </p>
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              BDSisters.org provides direct marketplace access to verified Bangladeshi women entrepreneurs.
              100% of your payment of{" "}
              <strong className="text-text-primary font-bold">
                ৳{(price * quantity).toLocaleString("en-BD")}
              </strong>{" "}
              goes directly to the artisan team via bKash, Nagad, or Bank Transfer.
            </p>

            <div className="space-y-3 rounded-2xl bg-surface/80 p-4 border border-border mb-6 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Verified sister entrepreneur business entity</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct communication via verified phone or WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Secure payment proof upload in your member dashboard</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="flex-1">
                <Button variant="primary" className="w-full justify-center gap-2 font-bold py-3">
                  <span>Register Free Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full justify-center font-semibold py-3">
                  <span>Sign In</span>
                </Button>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setShowOrderModal(false)}
              className="mt-4 block w-full text-center text-xs text-neutral hover:text-text-primary transition-colors"
            >
              Close and continue browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
