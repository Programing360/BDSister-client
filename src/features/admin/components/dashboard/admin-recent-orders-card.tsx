"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowUpRight,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { AdminOrderListItem } from "../../types/admin-analytics";
import { DEMO_ADMIN_ORDERS } from "../../data/admin-analytics-data";

export function AdminRecentOrdersCard() {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderListItem | null>(null);

  const getPaymentBadge = (status: AdminOrderListItem["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "REFUNDED":
        return "bg-purple-50 text-[#5B46F6] border-purple-200";
    }
  };

  const getOrderStatusBadge = (status: AdminOrderListItem["orderStatus"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "PROCESSING":
        return "bg-purple-50 text-[#5B46F6] border-purple-200";
      case "READY_TO_SHIP":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="rounded-2xl border-gray-200/80 bg-white p-6 shadow-2xs space-y-5">
      {/* 1. Header with View All Navigation */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              Recent Customer Orders
            </h3>
          </div>
          <p className="text-xs text-[#4B5563] mt-1">
            Latest purchase checkouts across verified artisan storefronts.
          </p>
        </div>

        <Link
          href="/admin/ecommerce/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B46F6] hover:text-[#7366F7] transition"
        >
          <span>View All Orders (5,840)</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. Responsive Orders Table */}
      {/* ========================================= */}
      {/* RESPONSIVE ORDERS TABLE */}
      {/* ========================================= */}

      <div className="w-full">

        {/* Desktop & Tablet Table */}
        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 md:block">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-xs">

              {/* Table Header */}
              <thead className="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4">Order ID</th>
                  <th className="whitespace-nowrap px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Items / Artisan Shop</th>
                  <th className="whitespace-nowrap px-5 py-4 text-right">
                    Amount (BDT)
                  </th>
                  <th className="whitespace-nowrap px-5 py-4 text-center">
                    Payment
                  </th>
                  <th className="whitespace-nowrap px-5 py-4 text-center">
                    Order Status
                  </th>
                  <th className="whitespace-nowrap px-5 py-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-50">

                {DEMO_ADMIN_ORDERS.map((order) => (
                  <tr
                    key={order.id}
                    className="group transition-colors duration-200 hover:bg-purple-50/30"
                  >

                    {/* Order ID */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-mono text-xs font-bold text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400">
                        {order.createdAt}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="min-w-[130px]">
                        <p className="truncate font-semibold text-gray-900">
                          {order.customer.name}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-gray-400">
                          {order.customer.phone}
                        </p>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <div className="max-w-[190px]">
                        <p className="truncate font-semibold text-gray-800">
                          {order.items[0]?.title ?? "No items"}
                          {order.items.length > 1 &&
                            ` (+${order.items.length - 1} more)`}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-gray-500">
                          {order.items[0]?.shopName ?? "N/A"}
                        </p>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <span className="font-bold text-gray-900">
                        ৳ {order.totalAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="whitespace-nowrap px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${getPaymentBadge(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="whitespace-nowrap px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${getOrderStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="whitespace-nowrap px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-[11px] font-bold text-gray-600 shadow-sm transition-all duration-200 hover:bg-purple-50 hover:text-[#5B46F6] hover:shadow-md"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================= */}
        {/* MOBILE ORDER CARDS */}
        {/* ========================================= */}

        <div className="space-y-3 md:hidden">

          {DEMO_ADMIN_ORDERS.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-md"
            >

              {/* Top: Order ID & Amount */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold text-gray-900">
                    {order.orderNumber}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    {order.createdAt}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-medium text-gray-400">
                    Total Amount
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-gray-900">
                    ৳ {order.totalAmount.toLocaleString()}
                  </p>
                </div>

              </div>

              {/* Customer */}
              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-sm font-bold text-[#5B46F6]">
                  {order.customer.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-gray-900">
                    {order.customer.name}
                  </p>

                  <p className="truncate text-[10px] text-gray-400">
                    {order.customer.phone}
                  </p>
                </div>

              </div>

              {/* Product Information */}
              <div className="mt-4 rounded-xl bg-gray-50/80 p-3">

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Order Items
                </p>

                <p className="mt-1 text-xs font-semibold text-gray-800">
                  {order.items[0]?.title ?? "No items"}
                  {order.items.length > 1 &&
                    ` (+${order.items.length - 1} more)`}
                </p>

                <p className="mt-1 text-[10px] text-gray-500">
                  {order.items[0]?.shopName ?? "N/A"}
                </p>

              </div>

              {/* Status Information */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                <div className="flex min-w-0 flex-col gap-1.5">

                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${getPaymentBadge(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>

                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${getOrderStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus.replace(/_/g, " ")}
                  </span>

                </div>

                {/* View Button */}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#5B46F6]/10 px-4 py-2.5 text-xs font-bold text-[#5B46F6] transition-all duration-200 hover:bg-[#5B46F6] hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* Empty State */}
        {DEMO_ADMIN_ORDERS.length === 0 && (
          <div className="rounded-2xl bg-white px-5 py-16 text-center shadow-sm ring-1 ring-gray-100">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#5B46F6]">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-gray-900">
              No orders found
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Orders will appear here when customers place them.
            </p>
          </div>
        )}

      </div>

      {/* 3. Order Detail Inspection Drawer / Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Order Inspector
                </span>
                <h3 className="text-base font-black text-gray-900 font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <User className="h-4 w-4 text-[#5B46F6]" />
                <span>{selectedOrder.customer.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-gray-400" />
                  {selectedOrder.customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  {selectedOrder.customer.email}
                </span>
                <span className="flex items-center gap-1 col-span-2">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  {selectedOrder.customer.location}
                </span>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700">Order Items</h4>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-[10px] text-gray-500">
                        Sold by {item.shopName}
                      </p>
                    </div>
                    <span className="font-bold text-gray-700">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Status */}
            <div className="flex items-center justify-between rounded-xl bg-purple-50 p-3 text-xs border border-purple-100">
              <div>
                <span className="text-[10px] text-purple-700 font-bold">Total Amount</span>
                <p className="text-lg font-black text-[#5B46F6]">
                  ৳ {selectedOrder.totalAmount.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getPaymentBadge(
                    selectedOrder.paymentStatus
                  )}`}
                >
                  Payment: {selectedOrder.paymentStatus}
                </span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getOrderStatusBadge(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <Link
                href="/admin/ecommerce/orders"
                className="rounded-xl bg-[#5B46F6] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#4a36e0]"
              >
                Go to Order Management
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
