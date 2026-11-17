"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Loader2,
} from "lucide-react";
import type { CartDocument } from "@/types/cart";

interface CartViewProps {
  initialCart?: CartDocument;
}

export function CartView({ initialCart }: CartViewProps) {
  const router = useRouter();
  const [cart, setCart] = useState<CartDocument>(
    initialCart || {
      id: "guest",
      items: [],
      subtotal: 0,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
  const [isLoading, setIsLoading] = useState(!initialCart);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!initialCart) {
      fetch("/api/cart")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setCart(data.data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [initialCart]);

  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    setUpdatingId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCart(data.data);
      } else {
        alert(data.error?.message || "Failed to update quantity.");
      }
    } catch {
      alert("Network error updating cart.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdatingId(productId);
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCart(data.data);
      } else {
        alert(data.error?.message || "Failed to remove item.");
      }
    } catch {
      alert("Network error removing item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to empty your shopping cart?")) {
      return;
    }
    try {
      const res = await fetch("/api/cart?clearAll=true", {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCart(data.data);
      }
    } catch {
      alert("Network error clearing cart.");
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center shadow-sm max-w-2xl mx-auto my-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#5B46F6]/10 text-[#5B46F6] mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Explore handcrafted creations, fine Jamdani sarees, natural skincare, and heritage delicacies directly from Bangladeshi women artisans.
        </p>
        <div className="mt-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 hover:bg-[#4d3ae2] transition-all"
          >
            <span>Explore Artisan Marketplace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 my-4">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Shopping Cart ({cart.itemCount} items)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Review your artisan goods before continuing to secure checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs font-semibold text-gray-500 hover:text-rose-600 self-start sm:self-auto"
        >
          Clear Cart
        </button>
      </div>

      {/* 2. Grid Layout: Cart Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const isUpdating = updatingId === item.productId;

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-sm hover:border-gray-300 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center"
              >
                {/* Thumbnail */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Building2 className="h-3.5 w-3.5 text-[#5B46F6]" />
                    <span className="font-semibold truncate">{item.businessName}</span>
                  </div>

                  <Link
                    href={`/marketplace/${item.productSlug}`}
                    className="text-base font-bold text-gray-900 hover:text-[#5B46F6] transition-colors line-clamp-1"
                  >
                    {item.productName}
                  </Link>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-bold text-sm text-gray-900">
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.salePrice && item.regularPrice > item.salePrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{item.regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white disabled:opacity-40"
                      title="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto text-[#5B46F6]" />
                      ) : (
                        item.quantity
                      )}
                    </span>

                    <button
                      type="button"
                      disabled={isUpdating || (item.maxQuantity > 0 && item.quantity >= item.maxQuantity)}
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white disabled:opacity-40"
                      title="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-gray-900">
                      ৳{item.lineTotal.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
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
              href="/marketplace"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5B46F6] hover:underline"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-6 sticky top-28">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cart.itemCount} items)</span>
              <span className="font-bold text-gray-900">
                ৳{cart.subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-700">Calculated at Checkout</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between text-base">
              <span className="font-bold text-gray-900">Estimated Subtotal</span>
              <span className="font-black text-[#5B46F6]">
                ৳{cart.subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 hover:bg-[#4d3ae2] transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Ethical Commerce Trust Banner */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <ShieldCheck className="h-4 w-4 text-[#5B46F6]" />
              <span>Direct Artisan Marketplace</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              100% of product proceeds go directly to Bangladeshi female artisans. All payments are verified via ZiniPay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
