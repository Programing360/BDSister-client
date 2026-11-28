"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Lock,
  Truck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShoppingBag,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { CartDocument } from "@/types/cart";
import { checkoutOrderCreateSchema, CheckoutOrderCreateInput } from "@/lib/validations/checkout";
import { useCart } from "@/context/cart-context";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

const DEFAULT_FALLBACK_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23FAF8F5'><rect width='400' height='300' fill='%23FAF8F5'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239CA3AF' font-weight='600'>BDSisters Product</text></svg>";

const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const POPULAR_DISTRICTS: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Faridpur", "Manikganj", "Munshiganj", "Gopalganj", "Kishoreganj", "Madaripur", "Rajbari", "Shariatpur"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Brahmanbaria", "Noakhali", "Chandpur", "Lakshmipur", "Rangamati", "Khagrachhari", "Bandarban"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Sirajganj", "Naogaon", "Natore", "Chapai Nawabganj", "Joypurhat"],
  Khulna: ["Khulna", "Jashore", "Kushtia", "Satkhira", "Jhenaidah", "Bagerhat", "Chuadanga", "Meherpur", "Narail", "Magura"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Barguna", "Jhalokathi"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat", "Thakurgaon", "Panchagarh"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPaymentCancelled = searchParams.get("payment") === "cancelled";
  const { items: cartContextItems, subtotal: cartContextSubtotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutOrderCreateInput>({
    resolver: zodResolver(checkoutOrderCreateSchema) as any,
    defaultValues: {
      paymentProvider: "ZINIPAY",
      shippingAddress: {
        fullName: "",
        phone: "",
        email: "",
        division: "Dhaka",
        district: "Dhaka",
        city: "",
        streetAddress: "",
        postalCode: "",
        deliveryInstructions: "",
      },
      customerNotes: "",
    },
  });

  const selectedDivision = watch("shippingAddress.division");

  // Handle division change to reset district if not in division
  useEffect(() => {
    const districts = (selectedDivision && POPULAR_DISTRICTS[selectedDivision]) || [];
    if (districts.length > 0 && districts[0]) {
      setValue("shippingAddress.district", districts[0]);
    }
  }, [selectedDivision, setValue]);

  const subtotal = cartContextSubtotal || 0;
  // Shipping calculation: ৳60 Inside Dhaka, ৳120 Outside Dhaka
  const shippingFee = selectedDivision === "Dhaka" ? 60 : 120;
  const grandTotal = subtotal + shippingFee;

  const onSubmit = async (data: CheckoutOrderCreateInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        shippingAddress: {
          district: data.shippingAddress.district,
          state: data.shippingAddress.division,
          addressDetails: `${data.shippingAddress.streetAddress || ""}, ${data.shippingAddress.city || ""}, ${data.shippingAddress.division}`.trim(),
          phone: data.shippingAddress.phone,
        },
        orderItems: cartContextItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          isWholesale: !!item.isWholesale,
        })),
      };

      // Call backend createOrder endpoint directly or through Next.js proxy
      let paymentUrl: string | undefined = undefined;

      try {
        const orderRes = await apiClient.post<any>(
          API_ENDPOINTS.ecommerce.createOrder,
          orderPayload
        );
        const orderData = (orderRes as any)?.data || orderRes;
        paymentUrl =
          orderData?.paymentUrl ||
          orderData?.payment_url ||
          orderData?.GatewayPageURL ||
          (orderRes as any)?.paymentUrl ||
          (orderRes as any)?.payment_url ||
          (orderRes as any)?.GatewayPageURL;

        // If paymentUrl wasn't in createOrder response, fallback to initiating payment directly via zinipayInit
        const orderId =
          orderData?._id ||
          orderData?.id ||
          (orderRes as any)?._id ||
          (orderRes as any)?.id;

        if (!paymentUrl && orderId) {
          try {
            const payRes = await apiClient.post<any>(
              API_ENDPOINTS.payment.zinipayInit,
              {
                paymentType: "Order",
                referenceId: orderId,
                amount: grandTotal,
                customerName: data.shippingAddress.fullName,
                customerEmail: data.shippingAddress.email,
                customerPhone: data.shippingAddress.phone,
              }
            );
            const payData = (payRes as any)?.data || payRes;
            paymentUrl =
              payData?.paymentUrl ||
              payData?.payment_url ||
              payData?.GatewayPageURL ||
              (payRes as any)?.paymentUrl ||
              (payRes as any)?.payment_url ||
              (payRes as any)?.GatewayPageURL;
          } catch (initErr) {
            console.warn("ZiniPay payment initiation fallback failed:", initErr);
          }
        }
      } catch (backendErr: any) {
        console.warn("Primary backend createOrder error:", backendErr);
        // Fallback to Next.js checkout create-order route if needed
        try {
          const res = await fetch("/api/checkout/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success) {
            paymentUrl = json.data?.paymentUrl || json.data?.GatewayPageURL;
          } else {
            throw new Error(json.message || backendErr.message || "Failed to process order.");
          }
        } catch (fbErr: any) {
          throw new Error(backendErr?.message || fbErr?.message || "Failed to process order.");
        }
      }

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setErrorMessage("Order created, but payment gateway redirect was not returned. Please check My Orders.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Order submission error:", err);
      setErrorMessage(err.message || "Network error occurred during checkout. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!cartContextItems || cartContextItems.length === 0) {
    return (
      <div className="rounded-3xl border border-[#F7DFC7] bg-white p-12 text-center shadow-xs max-w-2xl mx-auto my-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FAF8F5] text-[#5B9891] border border-[#F7DFC7] mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#111E28] tracking-tight">Your cart is empty</h2>
        <p className="mt-2 text-sm text-stone-600 max-w-md mx-auto">
          Add items to your cart from our sister-led shops before proceeding to checkout.
        </p>
        <Link
          href="/shops"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5B9891] px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#467A74] transition-all"
        >
          Explore Shops <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/cart" className="flex items-center gap-1 font-medium text-[#5B46F6] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800">Checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {isPaymentCancelled && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Payment Cancelled</p>
            <p className="mt-0.5">
              Your payment process on ZiniPay was cancelled. Your items remain safely preserved in your cart. You can review your details and proceed to payment whenever you are ready.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">Checkout Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Delivery & Payment Details */}
          <div className="space-y-6 lg:col-span-7">
            {/* 1. Contact & Shipping Address Card */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg sm:p-8">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[#5B46F6]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Delivery Information</h2>
                  <p className="text-xs text-gray-500">Where should we deliver your order in Bangladesh?</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("shippingAddress.fullName")}
                    placeholder="e.g. Nusrat Jahan"
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                  {errors.shippingAddress?.fullName && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.fullName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Phone Number (Active Mobile) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("shippingAddress.phone")}
                    placeholder="017XXXXXXXX"
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                  {errors.shippingAddress?.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("shippingAddress.email")}
                    placeholder="nusrat@example.com"
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                  {errors.shippingAddress?.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.email.message}</p>
                  )}
                </div>

                {/* Division */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Administrative Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("shippingAddress.division")}
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div} Division
                      </option>
                    ))}
                  </select>
                  {errors.shippingAddress?.division && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.division.message}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("shippingAddress.district")}
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  >
                    {(POPULAR_DISTRICTS[selectedDivision] || [selectedDivision]).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                  {errors.shippingAddress?.district && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.district.message}</p>
                  )}
                </div>

                {/* City / Thana / Upazila */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Thana / Upazila / City Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("shippingAddress.city")}
                    placeholder="e.g. Dhanmondi / Uttara / Mirpur"
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                  {errors.shippingAddress?.city && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.city.message}</p>
                  )}
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Full Street Address / House & Road <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register("shippingAddress.streetAddress")}
                    placeholder="House 12, Road 4, Sector 7, Apartment 4B"
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                  {errors.shippingAddress?.streetAddress && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.streetAddress.message}</p>
                  )}
                </div>

                {/* Postal Code & Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("shippingAddress.postalCode")}
                    placeholder="1230"
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("shippingAddress.deliveryInstructions")}
                    placeholder="Call before arrival"
                    className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Gateway Card (ZiniPay) */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg sm:p-8">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[#5B46F6]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Payment Method</h2>
                  <p className="text-xs text-gray-500">Official, secure payment integration</p>
                </div>
              </div>

              {/* ZiniPay Selected Box */}
              <div className="mt-6 rounded-2xl border-2 border-[#5B46F6] bg-purple-50/40 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5B46F6] text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#111827]">ZiniPay Online Payment Gateway</p>
                      <p className="text-xs text-gray-600">
                        Official, instant automated payment provider for BDSisters.org
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-[#5B46F6]">
                    Verified Partner
                  </span>
                </div>

                {/* Payment channels supported by ZiniPay */}
                <div className="mt-4 border-t border-purple-100 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Supported payment methods on ZiniPay:
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {["bKash", "Nagad", "Rocket", "Upay", "Visa", "Mastercard", "Internet Banking"].map((method) => (
                      <span
                        key={method}
                        className="rounded-lg border border-purple-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/80 p-3 text-xs text-gray-600 border border-purple-200/60">
                  <Lock className="h-4 w-4 shrink-0 text-[#5B46F6]" />
                  <span>
                    When you click Pay, you will be securely redirected to ZiniPay to complete your payment. Once
                    confirmed, your order status is automatically verified.
                  </span>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Additional Notes for Seller (Optional)
                </label>
                <textarea
                  rows={2}
                  {...register("customerNotes")}
                  placeholder="Any specific requests or customization details..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Review */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xl sm:p-7">
              <h2 className="text-lg font-bold text-[#111827]">Order Summary</h2>
              <p className="text-xs text-gray-500">
                {cartContextItems.length} {cartContextItems.length === 1 ? "item" : "items"} in your order
              </p>

              {/* Mini Item List */}
              <div className="mt-4 max-h-[280px] divide-y divide-gray-100 overflow-y-auto pr-1">
                {cartContextItems.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <div key={item.productId} className="flex items-center gap-3 py-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200/80 shadow-sm">
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
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#111827]">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ৳{item.price.toLocaleString("en-BD")}
                        </p>
                        {item.brandName && (
                          <p className="text-[11px] text-[#5B9891] font-medium">By {item.brandName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">
                          ৳{lineTotal.toLocaleString("en-BD")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cost Calculations */}
              <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-gray-400" />
                    Delivery Charge ({selectedDivision === "Dhaka" ? "Inside Dhaka" : "Outside Dhaka"})
                  </span>
                  <span className="font-semibold text-gray-900">৳{shippingFee}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-[#111827]">Total Payable</span>
                    <span className="text-2xl font-black text-[#5B46F6]">
                      ৳{grandTotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-[11px] text-gray-400">Inclusive of VAT & platform fees</p>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 text-base font-bold text-white shadow-xl transition-all duration-200 hover:bg-[#4a36e2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connecting to ZiniPay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay ৳{grandTotal.toLocaleString("en-BD")} with ZiniPay</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero transaction surcharge for buyers</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
