"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpRight,
  Star,
  ShieldCheck,
  TrendingUp,
  Store,
  Eye,
} from "lucide-react";

import {
  DEMO_ORDER_STATUS_BREAKDOWN,
  DEMO_PRODUCT_INVENTORY_BREAKDOWN,
  DEMO_TOP_SELLING_PRODUCTS,
  DEMO_TOP_PERFORMING_SELLERS,
} from "../../data/admin-analytics-data";

export function AdminEcommerceAnalyticsCard() {
  const [activeTab, setActiveTab] = useState<"products" | "sellers">(
    "products"
  );

  const orderStatuses = [
    {
      label: "Pending",
      value: DEMO_ORDER_STATUS_BREAKDOWN.pending,
      description: "Awaiting merchant",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      shadow: "shadow-amber-100/60",
    },
    {
      label: "Processing",
      value: DEMO_ORDER_STATUS_BREAKDOWN.processing,
      description: "Packaging in progress",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      shadow: "shadow-purple-100/60",
    },
    {
      label: "Shipped",
      value: DEMO_ORDER_STATUS_BREAKDOWN.shipped,
      description: "With courier",
      icon: Truck,
      color: "text-sky-600",
      bg: "bg-sky-50",
      iconBg: "bg-sky-100",
      shadow: "shadow-sky-100/60",
    },
    {
      label: "Delivered",
      value: DEMO_ORDER_STATUS_BREAKDOWN.delivered,
      description: "Fulfillment complete",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      shadow: "shadow-emerald-100/60",
    },
    {
      label: "Cancelled",
      value: DEMO_ORDER_STATUS_BREAKDOWN.cancelled,
      description: "Cancelled orders",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      shadow: "shadow-rose-100/60",
    },
  ];

  const inventoryStats = [
    {
      label: "Live in Market",
      value: DEMO_PRODUCT_INVENTORY_BREAKDOWN.published,
      description: "Published products",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle2,
    },
    {
      label: "Pending Approval",
      value: DEMO_PRODUCT_INVENTORY_BREAKDOWN.pendingApproval,
      description: "Awaiting review",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: Clock,
    },
    {
      label: "Low Stock Alert",
      value: DEMO_PRODUCT_INVENTORY_BREAKDOWN.lowStock,
      description: "Below 20 units",
      color: "text-orange-600",
      bg: "bg-orange-50",
      icon: AlertTriangle,
    },
    {
      label: "Out of Stock",
      value: DEMO_PRODUCT_INVENTORY_BREAKDOWN.outOfStock,
      description: "Restocking required",
      color: "text-rose-600",
      bg: "bg-rose-50",
      icon: Package,
    },
  ];

  return (
    <section className="w-full min-w-0 space-y-7 overflow-hidden rounded-2xl bg-white p-4 shadow-xl shadow-gray-200/40 ring-1 ring-gray-100/80 sm:p-6 lg:p-7">

      {/* ========================================== */}
      {/* 1. HEADER */}
      {/* ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className=" min-w-0 items-start gap-3">



          <div className="min-w-0 flex items-center gap-2">
            <div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7058F5] to-[#5136DC] text-white shadow-lg shadow-purple-200/70">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold tracking-tight text-gray-900 sm:text-lg">
                E-Commerce Analytics
              </h3>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                Marketplace
              </span>
            </div>
            <div className="flex items-center gap-2 ">

              <Link
                href="/admin/ecommerce/orders"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-3.5 py-2.5 text-xs font-bold text-gray-600 shadow-sm transition-all hover:bg-purple-50 hover:text-[#5B46F6] hover:shadow-md"
              >
                Orders
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/admin/ecommerce/products"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B46F6]/10 px-3.5 py-2.5 text-xs font-bold text-[#5B46F6] shadow-sm transition-all hover:bg-[#5B46F6] hover:text-white hover:shadow-lg hover:shadow-purple-200"
              >
                Products
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

            </div>
          </div>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-gray-500">
            Monitor order fulfillment, inventory health, product
            performance, and artisan seller rankings.
          </p>

        </div>

        {/* Quick Navigation */}


      </div>


      {/* ========================================== */}
      {/* 2. ORDER LIFECYCLE PIPELINE */}
      {/* ========================================== */}

      <div className="space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-2">

          <div>
            <h4 className="text-sm font-extrabold text-gray-900">
              Order Lifecycle Pipeline
            </h4>

            <p className="mt-1 text-[11px] text-gray-400">
              Track orders across every fulfillment stage.
            </p>
          </div>

          <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-[#5B46F6]">
            5,840 Total Orders
          </span>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">

          {orderStatuses.map((status) => {
            const Icon = status.icon;

            return (
              <div
                key={status.label}
                className={`group min-w-0 rounded-2xl ${status.bg} p-3.5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-4`}
              >

                <div className="flex items-center justify-between gap-2">

                  <span className={`truncate text-[11px] font-bold ${status.color}`}>
                    {status.label}
                  </span>

                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${status.iconBg} ${status.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-4 w-4" />
                  </div>

                </div>

                <p className="mt-3 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                  {status.value.toLocaleString()}
                </p>

                <p className="mt-1 truncate text-[10px] font-medium text-gray-500">
                  {status.description}
                </p>

              </div>
            );
          })}

        </div>
      </div>


      {/* ========================================== */}
      {/* 3. INVENTORY OVERVIEW */}
      {/* ========================================== */}

      <div className="rounded-2xl bg-gray-50/80 p-4 shadow-inner shadow-gray-200/30 sm:p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#5B46F6] shadow-md shadow-purple-100/70">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-gray-900">
                Catalog & Inventory Health
              </h4>

              <p className="mt-0.5 text-[10px] text-gray-500">
                Product availability and stock monitoring.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
            <ShoppingBag className="h-3.5 w-3.5 text-[#5B46F6]" />

            <span className="text-xs font-bold text-gray-900">
              {DEMO_PRODUCT_INVENTORY_BREAKDOWN.total.toLocaleString()}
            </span>

            <span className="text-[10px] text-gray-400">
              Listed Products
            </span>
          </div>

        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

          {inventoryStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group min-w-0 rounded-xl bg-white p-3.5 shadow-md shadow-gray-200/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-4"
              >

                <div className="flex items-center justify-between gap-2">

                  <span className="truncate text-[10px] font-bold text-gray-500">
                    {stat.label}
                  </span>

                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                </div>

                <p className={`mt-3 text-xl font-black tracking-tight ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  {stat.description}
                </p>

              </div>
            );
          })}

        </div>
      </div>


      {/* ========================================== */}
      {/* 4. TOP PRODUCTS & SELLERS */}
      {/* ========================================== */}

      <div className="space-y-4">

        {/* Section Header */}

        <div className="flex flex-col gap-3">

          <div>
            <h4 className="text-sm font-extrabold text-gray-900">
              Marketplace Leaderboard
            </h4>

            <p className="mt-1 text-[11px] text-gray-400">
              Discover the best-performing products and artisan businesses.
            </p>
          </div>

          {/* Tabs */}

          <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-gray-100/80 p-1 shadow-inner shadow-gray-200/30 sm:w-fit">

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              aria-pressed={activeTab === "products"}
              className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-bold transition-all duration-200 sm:px-4 ${activeTab === "products"
                ? "bg-white text-[#5B46F6] shadow-md shadow-purple-100/70"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Top Products
              <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px]">
                5
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sellers")}
              aria-pressed={activeTab === "sellers"}
              className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-bold transition-all duration-200 sm:px-4 ${activeTab === "sellers"
                ? "bg-white text-[#5B46F6] shadow-md shadow-purple-100/70"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <Store className="h-3.5 w-3.5" />
              Top Sellers
              <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px]">
                4
              </span>
            </button>

          </div>

        </div>


        {/* ========================================== */}
        {/* TOP PRODUCTS */}
        {/* ========================================== */}

        {activeTab === "products" && (

          <div className="space-y-3">

            {/* Desktop Table */}

            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-md shadow-gray-200/40 ring-1 ring-gray-100 md:block">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[760px] text-left text-xs">

                  <thead className="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-400">

                    <tr>
                      <th className="whitespace-nowrap px-4 py-4">Rank</th>
                      <th className="px-4 py-4">Product</th>
                      <th className="px-4 py-4">Artisan Enterprise</th>
                      <th className="whitespace-nowrap px-4 py-4 text-right">Units Sold</th>
                      <th className="whitespace-nowrap px-4 py-4 text-right">Revenue</th>
                      <th className="whitespace-nowrap px-4 py-4 text-center">Stock</th>
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-50">

                    {DEMO_TOP_SELLING_PRODUCTS.map((prod) => (

                      <tr
                        key={prod.id}
                        className="group transition-colors duration-200 hover:bg-purple-50/30"
                      >

                        <td className="whitespace-nowrap px-4 py-4">

                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-purple-50 text-[10px] font-black text-[#5B46F6] shadow-sm">
                            #{prod.rank}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <p className="max-w-[180px] truncate font-bold text-gray-900">
                            {prod.name}
                          </p>

                        </td>

                        <td className="px-4 py-4">

                          <p className="max-w-[180px] truncate text-gray-500">
                            {prod.businessName}
                          </p>

                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-gray-900">
                          {prod.unitsSold.toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right">

                          <span className="font-extrabold text-[#5B46F6]">
                            ৳ {prod.revenue.toLocaleString()}
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-center">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${prod.stockRemaining < 10
                              ? "bg-rose-50 text-rose-700"
                              : "bg-emerald-50 text-emerald-700"
                              }`}
                          >
                            {prod.stockRemaining} left
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            </div>


            {/* Mobile Product Cards */}

            <div className="grid grid-cols-1 gap-3 md:hidden">

              {DEMO_TOP_SELLING_PRODUCTS.map((prod) => (

                <div
                  key={prod.id}
                  className="rounded-2xl bg-white p-4 shadow-md shadow-gray-200/40 ring-1 ring-gray-100 transition-all hover:shadow-lg"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-black text-[#5B46F6]">
                      #{prod.rank}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="break-words text-xs font-bold text-gray-900">
                        {prod.name}
                      </p>

                      <p className="mt-1 break-words text-[10px] text-gray-500">
                        {prod.businessName}
                      </p>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${prod.stockRemaining < 10
                        ? "bg-rose-50 text-rose-700"
                        : "bg-emerald-50 text-emerald-700"
                        }`}
                    >
                      {prod.stockRemaining} left
                    </span>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50/80 p-3">

                    <div>
                      <p className="text-[10px] text-gray-400">
                        Units Sold
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-gray-900">
                        {prod.unitsSold.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400">
                        Revenue
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-[#5B46F6]">
                        ৳ {prod.revenue.toLocaleString()}
                      </p>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}


        {/* ========================================== */}
        {/* TOP SELLERS */}
        {/* ========================================== */}

        {activeTab === "sellers" && (

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {DEMO_TOP_PERFORMING_SELLERS.map((seller) => (

              <div
                key={seller.id}
                className="group min-w-0 rounded-2xl bg-gray-50/70 p-4 shadow-md shadow-gray-200/30 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-purple-100/60"
              >

                {/* Seller Header */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7965FA] to-[#5136DC] text-white shadow-md shadow-purple-200/70">
                      <Store className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">

                      <div className="flex min-w-0 items-center gap-1.5">

                        <span className="truncate text-xs font-extrabold text-gray-900">
                          {seller.shopName}
                        </span>

                        {seller.verifiedBadge && (
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#5B46F6]" />
                        )}

                      </div>

                      <p className="mt-1 truncate text-[10px] text-gray-500">
                        {seller.artisanName}
                      </p>

                    </div>

                  </div>

                  <span className="shrink-0 rounded-lg bg-purple-100 px-2 py-1 text-[10px] font-black text-[#5B46F6]">
                    #{seller.rank}
                  </span>

                </div>


                {/* Seller Location */}

                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                  <Store className="h-3 w-3" />
                  <span>{seller.district}</span>
                </div>


                {/* Seller Performance */}

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-white p-3 shadow-sm">

                    <p className="text-[10px] text-gray-400">
                      Total Sales
                    </p>

                    <p className="mt-1 truncate text-sm font-extrabold text-[#5B46F6]">
                      ৳ {seller.totalSales.toLocaleString()}
                    </p>

                  </div>

                  <div className="rounded-xl bg-white p-3 shadow-sm">

                    <p className="text-[10px] text-gray-400">
                      Completed Orders
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-gray-900">
                      {seller.ordersFulfilled.toLocaleString()}
                    </p>

                  </div>

                </div>


                {/* Rating */}

                <div className="mt-3 flex items-center justify-between">

                  <div className="flex items-center gap-1.5">

                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                    <span className="text-xs font-extrabold text-gray-800">
                      {seller.rating}
                    </span>

                    <span className="text-[10px] text-gray-400">
                      Seller Rating
                    </span>

                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    Top Seller
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ========================================== */}
      {/* 5. FOOTER INFORMATION */}
      {/* ========================================== */}

      <div className="flex flex-col gap-2 rounded-xl bg-purple-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2">

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#5B46F6] shadow-sm">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>

          <p className="text-[10px] font-medium text-gray-500">
            Marketplace performance overview
          </p>

        </div>

        <p className="text-[10px] font-semibold text-[#5B46F6]">
          BDSisters.org Admin Analytics
        </p>

      </div>

    </section>
  );
}