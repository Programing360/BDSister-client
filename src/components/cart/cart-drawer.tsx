"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Store,
  CreditCard,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#5B9891]/15 text-[#5B9891] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Your Sisterhood Cart</h2>
                <p className="text-[11px] text-gray-500 font-medium">
                  {totalItems} {totalItems === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close cart"
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Halal Guarantee Banner */}
          <div className="bg-[#5B9891]/10 px-6 py-2 flex items-center gap-2 border-b border-[#5B9891]/20">
            <ShieldCheck className="w-4 h-4 text-[#467A74] shrink-0" />
            <p className="text-[11px] font-semibold text-[#467A74]">
              Fair Price Guarantee: MRP is equal to or lower than other platforms.
            </p>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#F7DFC7] flex items-center justify-center text-[#D98408]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Discover exclusive discounted products and services directly from verified Bangladeshi sister entrepreneurs.
                  </p>
                </div>
                <Link
                  href="/shops"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5B9891] hover:bg-[#467A74] text-white text-xs font-bold transition shadow-xs"
                >
                  <Store className="w-4 h-4" />
                  <span>Browse Halal Shops</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.productId} className="pt-3.5 first:pt-0 flex gap-3.5 items-center">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-[#FAF8F5] border border-gray-100 overflow-hidden shrink-0 relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Store className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">
                        {item.title}
                      </h4>
                      {item.brandName && (
                        <p className="text-[11px] font-medium text-[#D98408] truncate mt-0.5">
                          {item.brandName}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-gray-900">
                          ৳{item.price}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ৳{item.mrp}
                          </span>
                        )}
                        {item.isWholesale && item.wholesalePrice && (
                          <span className="text-[10px] font-bold text-[#D98408] bg-[#F7DFC7] px-1.5 py-0.2 rounded">
                            Wholesale: ৳{item.wholesalePrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-[#FAF8F5] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200/60 text-gray-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200/60 text-gray-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-rose-600 transition p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 bg-[#FAF8F5] p-5 space-y-3.5 shadow-lg">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-sm font-extrabold text-gray-900">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Shipping & Delivery</span>
                  <span>Calculated at Checkout</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#5B9891] hover:bg-[#467A74] text-white text-xs font-bold shadow-sm transition active:scale-[0.99]"
                >
                  <CreditCard className="w-4 h-4 text-[#F7DFC7]" />
                  <span>Proceed to ZiniPay Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                  <Lock className="w-3 h-3 text-emerald-600" /> 100% Secure ZiniPay Gateway
                </span>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[10px] font-bold text-gray-400 hover:text-rose-600 transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
