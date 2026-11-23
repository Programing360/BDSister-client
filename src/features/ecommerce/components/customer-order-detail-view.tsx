"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Loader2,
  ExternalLink,
  Star,
} from "lucide-react";
import { OrderDocument } from "@/types/order";
import {
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getItemFulfillmentBadge,
} from "../utils/ecommerce-utils";
import { DualRatingModal } from "./dual-rating-modal";

interface Props {
  orderId: string;
}

export function CustomerOrderDetailView({ orderId }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Dual review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/member/orders/${orderId}`);
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setOrder(json.data);
        } else {
          setError(json.message || "Failed to load order details.");
        }
      } catch (err: any) {
        console.error("Order detail load error:", err);
        setError("Network error while loading order details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation.");
      return;
    }

    setIsCancelling(true);
    setCancelError(null);

    try {
      const res = await fetch(`/api/member/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setShowCancelModal(false);
        // Refresh local order state
        setOrder(json.data);
      } else {
        setCancelError(json.message || "Failed to request cancellation.");
      }
    } catch (err: any) {
      setCancelError("Network error while submitting cancellation request.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-10 text-center shadow-lg">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
        <h2 className="mt-4 text-lg font-bold text-gray-900">Order Not Found</h2>
        <p className="mt-1 text-sm text-gray-500">{error || "The requested order could not be retrieved."}</p>
        <Link
          href="/member/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-5 py-2.5 text-xs font-bold text-white shadow"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </Link>
      </div>
    );
  }

  const statusBadge = getOrderStatusBadge(order.orderStatus);
  const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
  const isCancellable =
    ["PENDING_PAYMENT", "CONFIRMED", "PROCESSING"].includes(order.orderStatus) &&
    order.orderStatus !== "CANCELLATION_REQUESTED" &&
    order.orderStatus !== "CANCELLED";

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/member/orders"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                Order <span className="font-mono text-[#5B46F6]">{order.orderNumber}</span>
              </h1>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" /> Placed on {orderDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
          >
            {statusBadge.label}
          </span>
          <span
            className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold ${paymentBadge.bg} ${paymentBadge.color} ${paymentBadge.border}`}
          >
            {paymentBadge.label}
          </span>
          {isCancellable && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
            >
              Request Cancellation
            </button>
          )}
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/80 px-3.5 py-1.5 text-xs font-bold text-[#5B46F6] transition hover:bg-purple-100/80 shadow-xs"
          >
            <Star className="h-3.5 w-3.5 fill-[#5B46F6]" />
            <span>{reviewSubmitted ? "Review Submitted" : "Rate Order & Seller"}</span>
          </button>
        </div>
      </div>

      {/* Grid: Order Items & Delivery/Payment Specs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Items details */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
            <h2 className="text-base font-bold text-gray-900">Purchased Items ({order.items.length})</h2>
            <div className="mt-4 divide-y divide-gray-100">
              {order.items.map((item, idx) => {
                const fulfillmentBadge = getItemFulfillmentBadge(item.fulfillmentStatus);
                return (
                  <div key={idx} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200/80 shadow-sm">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            Item
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString("en-BD")}
                        </p>
                        <p className="text-xs text-[#5B46F6] font-medium">Sold by {item.businessName}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
                      <span className="text-sm font-bold text-gray-900">
                        ৳{item.lineTotal.toLocaleString("en-BD")}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-bold ${fulfillmentBadge.bg} ${fulfillmentBadge.color} ${fulfillmentBadge.border}`}
                      >
                        {fulfillmentBadge.label}
                      </span>
                      {item.trackingNumber && (
                        <div className="text-[11px] text-gray-500">
                          <span>{item.carrier || "Courier"}: </span>
                          <span className="font-mono font-bold text-gray-700">{item.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">৳{order.subtotal.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900">৳{order.shippingCharge.toLocaleString("en-BD")}</span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total Paid</span>
                  <span className="text-xl font-black text-[#5B46F6]">
                    ৳{order.totalAmount.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Shipping & Payment Cards */}
        <div className="space-y-6 lg:col-span-4">
          {/* Shipping Address */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="h-4 w-4 text-[#5B46F6]" />
              <h3 className="text-sm font-bold text-gray-900">Shipping Address</h3>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-gray-600">
              <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.email}</p>
              <p className="pt-2 text-gray-800">
                {order.shippingAddress.streetAddress}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.district}, {order.shippingAddress.division}
              </p>
              {order.shippingAddress.postalCode && (
                <p>Postal Code: {order.shippingAddress.postalCode}</p>
              )}
              {order.shippingAddress.deliveryInstructions && (
                <p className="italic text-gray-500 pt-1">
                  Note: &quot;{order.shippingAddress.deliveryInstructions}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Payment Snapshot */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="h-4 w-4 text-[#5B46F6]" />
              <h3 className="text-sm font-bold text-gray-900">Payment Information</h3>
            </div>
            <div className="mt-3 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Provider:</span>
                <span className="font-bold text-purple-700">ZiniPay Hosted Gateway</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-bold ${paymentBadge.color}`}>{order.paymentStatus}</span>
              </div>
              {order.zinipayInvoiceId && (
                <div className="flex justify-between">
                  <span>ZiniPay Invoice:</span>
                  <span className="font-mono text-gray-900">{order.zinipayInvoiceId}</span>
                </div>
              )}
              {order.zinipayTransactionId && (
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-gray-900">{order.zinipayTransactionId}</span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
              )}
              {order.paidAt && (
                <div className="flex justify-between">
                  <span>Paid At:</span>
                  <span className="text-gray-900">
                    {new Date(order.paidAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Request Order Cancellation</h3>
            <p className="mt-1 text-xs text-gray-500">
              Please specify the reason why you would like to cancel order {order.orderNumber}.
            </p>

            {cancelError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {cancelError}
              </div>
            )}

            <form onSubmit={handleCancelSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">Reason for Cancellation</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Ordered incorrect item size, changed delivery address..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200/80 p-3 text-xs outline-none focus:border-[#5B46F6] focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 disabled:opacity-60"
                >
                  {isCancelling ? "Submitting..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dual Rating Modal */}
      <DualRatingModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={order.id}
        orderNumber={order.orderNumber}
        items={order.items}
        onSuccess={() => setReviewSubmitted(true)}
      />
    </div>
  );
}
