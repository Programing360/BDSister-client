"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Heart,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailActionsProps {
  productId?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount?: number;
  businessName: string;
  sellerSlug?: string;
}

export function ProductDetailActions({
  productId,
  price,
  originalPrice,
  inStock,
  stockCount,
  businessName,
  sellerSlug,
}: ProductDetailActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleAddToCart = async (directCheckout = false) => {
    if (!productId) {
      router.push("/cart");
      return;
    }

    if (directCheckout) {
      setIsBuyingNow(true);
    } else {
      setIsAddingToCart(true);
    }
    setErrorMessage(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (directCheckout) {
          router.push("/checkout");
        } else {
          setAddedSuccess(true);
          setTimeout(() => setAddedSuccess(false), 4000);
        }
      } else {
        setErrorMessage(json.message || "Failed to add product to cart.");
      }
    } catch (err) {
      setErrorMessage("Network error while updating cart.");
    } finally {
      setIsAddingToCart(false);
      setIsBuyingNow(false);
    }
  };

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

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {addedSuccess && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-semibold text-emerald-800 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Added {quantity} × item to your shopping cart!</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="rounded-xl bg-white px-3 py-1.5 font-bold text-emerald-800 border border-emerald-200/80 shadow-xs hover:bg-emerald-100"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              className="rounded-xl bg-[#5B46F6] px-3.5 py-1.5 font-bold text-white shadow-xs hover:bg-[#4a36e2]"
            >
              Checkout Now
            </Link>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1 justify-center gap-2.5 shadow-button hover:shadow-card-hover font-bold text-base py-3.5 bg-[#5B46F6] text-white hover:bg-[#4a36e2]"
          onClick={() => handleAddToCart(false)}
          disabled={!inStock || isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Adding to Cart...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>{inStock ? "Add to Cart" : "Item Sold Out"}</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="justify-center gap-2 font-bold text-sm py-3.5 border-purple-200 bg-purple-50/70 text-[#5B46F6] hover:bg-purple-100"
          onClick={() => handleAddToCart(true)}
          disabled={!inStock || isBuyingNow}
        >
          {isBuyingNow ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Proceeding...</span>
            </>
          ) : (
            <>
              <span>Instant Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
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
    </div>
  );
}
