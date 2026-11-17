"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { OrderDocument } from "@/types/order";

function SuccessContent() {
  const searchParams = useSearchParams();
  const invoiceIdParam = searchParams.get("invoice_id") || searchParams.get("invoiceId") || searchParams.get("id");
  const orderIdParam = searchParams.get("order_id") || searchParams.get("orderId");

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!invoiceIdParam && !orderIdParam) {
        setIsLoading(false);
        setError("Missing invoice or order identifier in return URL.");
        return;
      }

      try {
        const res = await fetch("/api/payments/zinipay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceId: invoiceIdParam,
            orderId: orderIdParam,
          }),
        });

        const json = await res.json();
        if (json.success && json.data?.order) {
          setOrder(json.data.order);
        } else {
          setError(json.message || "Payment verification could not be confirmed immediately.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError("Network error while verifying payment status. If your balance was deducted, please check your orders page.");
      } finally {
        setIsLoading(false);
      }
    }

    verifyPayment();
  }, [invoiceIdParam, orderIdParam]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#5B46F6]" />
        <h2 className="text-lg font-bold text-gray-900">Verifying Payment with ZiniPay...</h2>
        <p className="text-sm text-gray-500">Please do not refresh or close this window.</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-amber-200/80 bg-amber-50/60 p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Verification Pending or Notice</h2>
        <p className="mt-2 text-sm text-gray-700">{error}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/member/orders"
            className="rounded-xl bg-[#5B46F6] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#4a36e2]"
          >
            Check My Orders
          </Link>
          <Link
            href="/cart"
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl sm:p-10">
      {/* Top Banner */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/70">
          Payment Verified • ZiniPay Confirmed
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          Thank You! Your Order is Placed.
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          We have received your payment and notified the seller(s). A confirmation email has been sent.
        </p>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-slate-50/80 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase text-gray-500">Order Number</span>
              <p className="font-mono text-sm font-bold text-gray-900">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold uppercase text-gray-500">Total Paid</span>
              <p className="text-base font-black text-[#5B46F6]">
                ৳{order.totalAmount.toLocaleString("en-BD")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-gray-600">
            <div>
              <span className="font-semibold text-gray-800">Payment Gateway:</span> ZiniPay
            </div>
            <div>
              <span className="font-semibold text-gray-800">Payment Status:</span>{" "}
              <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Recipient:</span> {order.shippingAddress.fullName}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Phone:</span> {order.shippingAddress.phone}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-gray-800">Shipping Address:</span>{" "}
              {order.shippingAddress.streetAddress}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.district}, {order.shippingAddress.division}
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-gray-200/80 pt-3">
            <span className="text-xs font-bold uppercase text-gray-500">Items Ordered ({order.items.length})</span>
            <div className="mt-2 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium text-gray-800">
                    {item.productName} <span className="text-gray-500">× {item.quantity}</span>
                  </span>
                  <span className="font-bold text-gray-900">৳{item.lineTotal.toLocaleString("en-BD")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Next Steps CTA */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        {order ? (
          <Link
            href={`/member/orders/${order.id}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#4a36e2]"
          >
            <Package className="h-4 w-4" /> View Order Details
          </Link>
        ) : (
          <Link
            href="/member/orders"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#4a36e2]"
          >
            <Package className="h-4 w-4" /> Go to My Orders
          </Link>
        )}
        <Link
          href="/marketplace"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200/80 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ShoppingBag className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Transaction processed safely through ZiniPay Verified Payment Gateway</span>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
