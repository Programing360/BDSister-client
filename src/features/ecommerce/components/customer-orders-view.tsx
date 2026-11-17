"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Search,
  ChevronRight,
  Clock,
  Calendar,
  AlertCircle,
  Loader2,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { OrderDocument, OrderStatus } from "@/types/order";
import { getOrderStatusBadge, getPaymentStatusBadge } from "../utils/ecommerce-utils";

export function CustomerOrdersView() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/member/orders");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setOrders(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch customer orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    if (activeTab === "ACTIVE") {
      if (["DELIVERED", "CANCELLED", "REFUNDED"].includes(order.orderStatus)) return false;
    } else if (activeTab === "DELIVERED") {
      if (order.orderStatus !== "DELIVERED") return false;
    } else if (activeTab === "CANCELLED") {
      if (!["CANCELLED", "REFUNDED"].includes(order.orderStatus)) return false;
    }

    // Filter by search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(term);
      const matchItem = order.items.some((item) => item.productName.toLowerCase().includes(term));
      return matchNumber || matchItem;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your purchases, review invoice details, and monitor delivery progress.
          </p>
        </div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a36e2]"
        >
          <ShoppingBag className="h-4 w-4" /> Shop More
        </Link>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "ACTIVE", label: "In Progress" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#5B46F6] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order # or product..."
            className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-[#5B46F6] focus:bg-white focus:ring-1 focus:ring-[#5B46F6]"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-[#5B46F6]">
            <Package className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || activeTab !== "ALL"
              ? "Try adjusting your search or tab filters."
              : "You haven't placed any orders yet on BDSisters.org."}
          </p>
          <Link
            href="/marketplace"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#4a36e2]"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusBadge = getOrderStatusBadge(order.orderStatus);
            const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-md transition hover:shadow-lg"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50/70 px-5 py-3.5 sm:px-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
                    >
                      {statusBadge.label}
                    </span>
                    {/* Payment Badge */}
                    <span
                      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${paymentBadge.bg} ${paymentBadge.color} ${paymentBadge.border}`}
                    >
                      {paymentBadge.label}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5 sm:p-6">
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200/80 shadow-sm">
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
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString("en-BD")}
                          </p>
                          <p className="text-[11px] text-[#5B46F6] font-medium">
                            Seller: {item.businessName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">
                            ৳{item.lineTotal.toLocaleString("en-BD")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-500">Total Payable:</span>
                      <span className="ml-2 text-lg font-black text-[#5B46F6]">
                        ৳{order.totalAmount.toLocaleString("en-BD")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/member/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-[#5B46F6] transition hover:bg-purple-100"
                      >
                        View Details <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
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
