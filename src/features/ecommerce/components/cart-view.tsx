"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Store,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

const DEFAULT_FALLBACK_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23FAF8F5'><rect width='400' height='300' fill='%23FAF8F5'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239CA3AF' font-weight='600'>BDSisters Product</text></svg>";

export function CartView() {
  const router = useRouter();
  const { items, totalItems, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    setUpdatingId(productId);
    updateQuantity(productId, newQty);
    setTimeout(() => setUpdatingId(null), 150);
  };

  const handleRemoveItem = (productId: string) => {
    setUpdatingId(productId);
    removeItem(productId);
    setTimeout(() => setUpdatingId(null), 150);
  };

  const handleClearCart = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to empty your shopping cart?")) {
      clearCart();
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="rounded-3xl border border-[#F7DFC7] bg-white p-12 text-center shadow-xs max-w-2xl mx-auto my-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FAF8F5] text-[#5B9891] border border-[#F7DFC7] mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#111E28] tracking-tight">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-stone-600 max-w-md mx-auto">
          Explore handcrafted creations, modest fashion, natural skincare, and consulting services directly from verified Bangladeshi sister entrepreneurs.
        </p>
        <div className="mt-8">
          <Link
            href="/shops"
            className="inline-flex items-center gap-2 rounded-full bg-[#5B9891] px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#467A74] transition-all"
          >
            <span>Explore Sisterhood Shops</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 my-4">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F7DFC7]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111E28] tracking-tight">
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-600">
            Review your sisterhood products before continuing to secure ZiniPay escrow checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs font-semibold text-stone-500 hover:text-rose-600 self-start sm:self-auto transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* 2. Grid Layout: Cart Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={item.productId}
                className="rounded-3xl border border-[#F7DFC7] bg-white p-5 sm:p-6 shadow-xs hover:border-[#5B9891]/40 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center"
              >
                {/* Thumbnail */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#F7DFC7] bg-stone-100">
                  <img
                    src={item.image || DEFAULT_FALLBACK_SVG}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = DEFAULT_FALLBACK_SVG;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {item.brandName && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-1">
                      <Building2 className="h-3.5 w-3.5 text-[#5B9891]" />
                      <span className="font-semibold truncate">{item.brandName}</span>
                    </div>
                  )}

                  <Link
                    href={`/shops/${item.slug || item.productId}`}
                    className="font-serif text-base font-bold text-[#111E28] hover:text-[#5B9891] transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-bold text-sm text-[#D98408]">
                      ৳{item.price.toLocaleString("en-BD")}
                    </span>
                    {item.mrp && item.mrp > item.price && (
                      <span className="text-xs text-stone-400 line-through">
                        ৳{item.mrp.toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center rounded-xl border border-stone-200 bg-[#FAF8F5] p-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-600 hover:bg-white transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="w-8 text-center text-xs font-bold text-[#111E28]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-600 hover:bg-white transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-[#111E28]">
                      ৳{lineTotal.toLocaleString("en-BD")}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/shops"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5B9891] hover:underline"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 rounded-3xl border border-[#F7DFC7] bg-white p-6 shadow-xs space-y-6 sticky top-28">
          <h2 className="font-serif text-base font-bold text-[#111E28] uppercase tracking-wider">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
              <span className="font-bold text-[#111E28]">
                ৳{subtotal.toLocaleString("en-BD")}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-stone-700">Calculated at Checkout</span>
            </div>

            <div className="border-t border-[#F7DFC7] pt-3 flex justify-between text-base">
              <span className="font-bold text-[#111E28]">Estimated Subtotal</span>
              <span className="font-black text-[#D98408]">
                ৳{subtotal.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#D98408] py-3.5 px-6 text-sm font-bold text-white shadow-xs hover:bg-[#B86E04] transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Ethical Commerce Trust Banner */}
          <div className="rounded-2xl border border-[#5B9891]/20 bg-[#5B9891]/10 p-4 space-y-2 text-xs text-stone-700">
            <div className="flex items-center gap-2 font-bold text-[#111E28]">
              <ShieldCheck className="h-4 w-4 text-[#5B9891]" />
              <span>Direct Sisterhood Marketplace</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600">
              100% of product proceeds go directly to verified sister entrepreneurs. All transactions are held in escrow via ZiniPay until successful delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
