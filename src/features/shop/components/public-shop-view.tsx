"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  ShieldCheck,
  Mail,
  Phone,
  Truck,
  RotateCcw,
  RefreshCw,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react";
import type { PublicShopProfile } from "@/types/shop";

interface PublicShopViewProps {
  shop: PublicShopProfile;
}

export function PublicShopView({ shop }: PublicShopViewProps) {
  const [activeTab, setActiveTab] = useState<"products" | "policies">("products");

  return (
    <div className="min-h-screen bg-[#EAE6F7]/40 pb-20">
      {/* 1. Shop Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-[#5B46F6] via-[#7366F7] to-[#8C80F8]">
        {shop.banner && (
          <Image
            src={shop.banner}
            alt={shop.name}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      {/* 2. Shop Identity Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden relative shrink-0">
                {shop.logo ? (
                  <Image
                    src={shop.logo}
                    alt={shop.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#EAE6F7] text-[#5B46F6] flex items-center justify-center font-bold text-3xl">
                    {shop.name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {shop.name}
                  </h1>
                  {shop.isBusinessVerified && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Accredited Venture
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-gray-500">
                  <span>Operated by</span>
                  <Link
                    href={`/businesses/${shop.businessSlug}`}
                    className="font-bold text-[#5B46F6] hover:underline"
                  >
                    {shop.businessName}
                  </Link>
                </div>
              </div>
            </div>

            {/* Support contact strip */}
            <div className="flex items-center justify-center sm:justify-end gap-3 flex-wrap text-xs text-gray-600">
              {shop.supportPhone && (
                <a
                  href={`tel:${shop.supportPhone}`}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 text-gray-700 hover:text-[#5B46F6] flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{shop.supportPhone}</span>
                </a>
              )}
              {shop.supportEmail && (
                <a
                  href={`mailto:${shop.supportEmail}`}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 text-gray-700 hover:text-[#5B46F6] flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Support Email</span>
                </a>
              )}
            </div>
          </div>

          {shop.shortDescription && (
            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl pt-2 border-t border-gray-100">
              {shop.shortDescription}
            </p>
          )}

          {/* Navigation sub-tabs */}
          <div className="flex items-center gap-3 pt-6">
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeTab === "products"
                  ? "bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/20"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Catalog Products
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("policies")}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeTab === "policies"
                  ? "bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/20"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Customer Policies
            </button>
          </div>
        </div>

        {/* 3. Tab Contents */}
        <div className="mt-8">
          {activeTab === "products" && (
            <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-xl border border-gray-200/80 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5B46F6] flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Products Coming Soon
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                This store is currently preparing its artisan inventory and product listings for the upcoming marketplace release.
              </p>
              <div className="pt-2">
                <Link
                  href={`/businesses/${shop.businessSlug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#5B46F6] hover:underline"
                >
                  <span>Learn more about {shop.businessName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Policy */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Truck className="w-4 h-4 text-[#5B46F6]" />
                  <span>Shipping &amp; Courier Terms</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {shop.policies.shippingPolicy || "Standard delivery applies across all 64 districts of Bangladesh."}
                </p>
              </div>

              {/* Return Policy */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Return &amp; Refund Guidelines</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {shop.policies.returnPolicy || "Returns handled in accordance with BDSisters artisan quality guarantees."}
                </p>
              </div>

              {/* Exchange Policy */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>Exchange Terms</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {shop.policies.exchangePolicy || "Exchanges subject to product availability and original conditions."}
                </p>
              </div>

              {/* Support Hours */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Customer Support Hours</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {shop.policies.customerSupportHours || "Saturday to Thursday, standard business hours."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
