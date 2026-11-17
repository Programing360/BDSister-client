"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  User,
  Phone,
  Mail,
  Send,
} from "lucide-react";
import { OrderDocument, ItemFulfillmentStatus } from "@/types/order";
import {
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getItemFulfillmentBadge,
} from "../utils/ecommerce-utils";

interface Props {
  orderId: string;
}

export function SellerOrderDetailView({ orderId }: Props) {
  const [order, setOrder] = useState<OrderDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit fulfillment state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [status, setStatus] = useState<ItemFulfillmentStatus>("PROCESSING");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchOrder() {
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
        console.error("Failed to load seller order:", err);
        setError("Network error while loading order.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleOpenUpdate = (item: any) => {
    setSelectedItemId(item.id || item.itemId);
    setStatus(item.fulfillmentStatus);
    setCarrier(item.carrier || "Steadfast Courier");
    setTrackingNumber(item.trackingNumber || "");
    setUpdateMsg(null);
  };

  const handleUpdateFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;

    setIsUpdating(true);
    setUpdateMsg(null);

    try {
      const res = await fetch(`/api/member/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItemId,
          fulfillmentStatus: status,
          carrier: carrier.trim() || null,
          trackingNumber: trackingNumber.trim() || null,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setOrder(json.data);
        setSelectedItemId(null);
        setUpdateMsg({ type: "success", text: "Item fulfillment status updated successfully!" });
      } else {
        setUpdateMsg({ type: "error", text: json.message || "Failed to update item fulfillment." });
      }
    } catch (err) {
      setUpdateMsg({ type: "error", text: "Network error while updating fulfillment." });
    } finally {
      setIsUpdating(false);
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
        <p className="mt-1 text-sm text-gray-500">{error || "Could not retrieve order details."}</p>
        <Link
          href="/member/seller/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-5 py-2.5 text-xs font-bold text-white shadow"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Merchant Orders
        </Link>
      </div>
    );
  }

  const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
  const sellerSubtotal = order.items.reduce((acc, it) => acc + it.lineTotal, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/member/seller/orders"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
              Merchant Order <span className="font-mono text-[#5B46F6]">{order.orderNumber}</span>
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              Placed on {new Date(order.createdAt).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold ${paymentBadge.bg} ${paymentBadge.color} ${paymentBadge.border}`}
          >
            Payment: {paymentBadge.label}
          </span>
        </div>
      </div>

      {updateMsg && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-semibold ${
            updateMsg.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {updateMsg.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <span>{updateMsg.text}</span>
        </div>
      )}

      {/* Grid: Order Items & Delivery Target */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Items & Fulfillment update */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
            <h2 className="text-base font-bold text-gray-900">Your Products in This Order</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Update shipment status and tracking numbers for each item independently.
            </p>

            <div className="mt-5 divide-y divide-gray-100">
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
                        <p className="text-xs text-[#5B46F6] font-medium">Business: {item.businessName}</p>
                        {item.trackingNumber && (
                          <p className="text-xs text-gray-600 font-mono mt-1">
                            {item.carrier || "Courier"}: {item.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
                      <span className="text-sm font-bold text-gray-900">
                        ৳{item.lineTotal.toLocaleString("en-BD")}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${fulfillmentBadge.bg} ${fulfillmentBadge.color} ${fulfillmentBadge.border}`}
                      >
                        {fulfillmentBadge.label}
                      </span>
                      <button
                        onClick={() => handleOpenUpdate(item)}
                        className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-[#5B46F6] transition hover:bg-purple-100"
                      >
                        Update Dispatch
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between border-t border-gray-100 pt-4 text-base font-bold text-gray-900">
              <span>Your Sales Total</span>
              <span className="text-xl font-black text-[#5B46F6]">
                ৳{sellerSubtotal.toLocaleString("en-BD")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details & Courier Preparation */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="h-4 w-4 text-[#5B46F6]" />
              <h3 className="text-sm font-bold text-gray-900">Buyer Delivery Info</h3>
            </div>

            <div className="mt-3 space-y-2 text-xs text-gray-600">
              <p className="font-bold text-sm text-gray-900">{order.shippingAddress.fullName}</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <a href={`tel:${order.shippingAddress.phone}`} className="font-mono text-[#5B46F6] hover:underline">
                  {order.shippingAddress.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{order.shippingAddress.email}</span>
              </div>
              <div className="pt-2 text-gray-800">
                <p className="font-semibold text-gray-700">Shipping Address:</p>
                <p className="mt-0.5">
                  {order.shippingAddress.streetAddress}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.district}, {order.shippingAddress.division}
                </p>
                {order.shippingAddress.postalCode && (
                  <p className="text-gray-500">Postal Code: {order.shippingAddress.postalCode}</p>
                )}
              </div>
              {order.shippingAddress.deliveryInstructions && (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-2.5 text-amber-800">
                  <span className="font-bold">Instructions:</span> {order.shippingAddress.deliveryInstructions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fulfillment Update Modal */}
      {selectedItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Update Shipment & Tracking</h3>
            <p className="mt-1 text-xs text-gray-500">
              Keep the buyer informed about the progress of this item.
            </p>

            <form onSubmit={handleUpdateFulfillment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">Fulfillment Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ItemFulfillmentStatus)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200/80 bg-white p-2.5 text-xs outline-none focus:border-[#5B46F6] focus:ring-1 focus:ring-[#5B46F6]"
                >
                  <option value="PENDING">Pending (Preparing package)</option>
                  <option value="PROCESSING">Processing (Packaging in progress)</option>
                  <option value="SHIPPED">Shipped (Handed over to courier)</option>
                  <option value="DELIVERED">Delivered (Received by customer)</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Courier / Delivery Service</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. Steadfast, Pathao, eCourier, RedX, Sundarban"
                  className="mt-1.5 w-full rounded-xl border border-gray-200/80 p-2.5 text-xs outline-none focus:border-[#5B46F6] focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Courier Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. SF-982347102"
                  className="mt-1.5 w-full rounded-xl border border-gray-200/80 p-2.5 text-xs outline-none focus:border-[#5B46F6] focus:ring-1 focus:ring-[#5B46F6]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemId(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 rounded-xl bg-[#5B46F6] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#4a36e2] disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
