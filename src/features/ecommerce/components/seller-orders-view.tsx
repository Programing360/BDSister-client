"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Search,
  Filter,
  ChevronRight,
  Clock,
  Calendar,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Store,
  User,
  MapPin,
} from "lucide-react";
import { OrderDocument, ItemFulfillmentStatus } from "@/types/order";
import {
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getItemFulfillmentBadge,
} from "../utils/ecommerce-utils";

export function SellerOrdersView() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchSellerOrders() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/member/seller/orders");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setOrders(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load seller orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSellerOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "ALL") {
      const hasMatchingItem = order.items.some((item) => item.fulfillmentStatus === statusFilter);
      if (!hasMatchingItem) return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchOrder = order.orderNumber.toLowerCase().includes(term);
      const matchCustomer = order.shippingAddress.fullName.toLowerCase().includes(term);
      const matchProduct = order.items.some((item) => item.productName.toLowerCase().includes(term));
      return matchOrder || matchCustomer || matchProduct;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-[#5B46F6]">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Merchant Sales & Orders
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Fulfill client purchases, update dispatch tracking, and manage shop fulfillment.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "All Items" },
            { id: "PENDING", label: "Pending" },
            { id: "PROCESSING", label: "Processing" },
            { id: "SHIPPED", label: "Shipped" },
            { id: "DELIVERED", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                statusFilter === tab.id
                  ? "bg-[#5B46F6] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer, item..."
            className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-[#5B46F6] focus:bg-white focus:ring-1 focus:ring-[#5B46F6]"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-[#5B46F6]">
            <Package className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">No merchant orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "ALL"
              ? "No orders match your filter criteria."
              : "When customers purchase items from your business shops, they will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
            // Calculate seller item subtotal
            const sellerSubtotal = order.items.reduce((sum, item) => sum + item.lineTotal, 0);

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-md transition hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50/70 px-5 py-3.5 sm:px-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${paymentBadge.bg} ${paymentBadge.color} ${paymentBadge.border}`}
                    >
                      Payment: {paymentBadge.label}
                    </span>
                  </div>
                </div>

                {/* Customer Snapshot */}
                <div className="border-b border-gray-100/80 bg-purple-50/20 px-5 py-2.5 sm:px-6 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-semibold text-gray-900">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      {order.shippingAddress.fullName}
                    </span>
                    <span className="text-gray-500">({order.shippingAddress.phone})</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {order.shippingAddress.city}, {order.shippingAddress.division}
                    </span>
                  </div>
                </div>

                {/* Items from Seller */}
                <div className="p-5 sm:p-6">
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => {
                      const fulfillmentBadge = getItemFulfillmentBadge(item.fulfillmentStatus);
                      return (
                        <div key={idx} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200/80 shadow-sm">
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
                              <p className="text-sm font-bold text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString("en-BD")} • Shop: {item.businessName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-bold ${fulfillmentBadge.bg} ${fulfillmentBadge.color} ${fulfillmentBadge.border}`}
                            >
                              {fulfillmentBadge.label}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              ৳{item.lineTotal.toLocaleString("en-BD")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-500">Your Sales Value:</span>
                      <span className="ml-2 text-base font-black text-[#5B46F6]">
                        ৳{sellerSubtotal.toLocaleString("en-BD")}
                      </span>
                    </div>

                    <Link
                      href={`/member/seller/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B46F6] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#4a36e2]"
                    >
                      Manage Fulfillment <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
