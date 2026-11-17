"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Plus,
  Briefcase,
  MapPin,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Edit3,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { BusinessDocument } from "@/types/business";
import { getBusinessStatusBadge } from "../utils/business-utils";

interface BusinessListViewProps {
  businesses: BusinessDocument[];
}

export function BusinessListView({ businesses }: BusinessListViewProps) {
  const hasBusinesses = businesses.length > 0;

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-200/80 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#5B46F6] text-xs font-bold mb-3 border border-purple-200/60">
            <Store className="w-3.5 h-3.5" />
            <span>Women Entrepreneurs Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Businesses
          </h1>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            Manage your registered women-led ventures, institutional verification badges, and associated online shops.
          </p>
        </div>

        <div className="relative z-10 self-start sm:self-auto">
          <Link
            href="/member/business/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-sm font-bold shadow-lg shadow-[#5B46F6]/25 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Business</span>
          </Link>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* 2. Business Cards Grid or Empty State */}
      {hasBusinesses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((biz) => {
            const statusBadge = getBusinessStatusBadge(biz.status);
            const isVerified = biz.verificationStatus === "VERIFIED";

            return (
              <div
                key={biz.id}
                className="bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden flex flex-col justify-between transition-all hover:border-[#5B46F6]/40"
              >
                {/* Card Top Cover & Logo */}
                <div>
                  <div className="h-32 w-full bg-gradient-to-r from-[#5B46F6] to-[#7366F7] relative">
                    {biz.coverImage && (
                      <Image
                        src={biz.coverImage}
                        alt={biz.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${
                          statusBadge.variant === "approved"
                            ? "bg-emerald-500/90 text-white border-emerald-400"
                            : statusBadge.variant === "pending"
                            ? "bg-amber-500/90 text-white border-amber-400"
                            : statusBadge.variant === "rejected"
                            ? "bg-red-500/90 text-white border-red-400"
                            : "bg-gray-800/80 text-white border-gray-600"
                        }`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-4 pt-0 relative">
                    {/* Logo & Headline */}
                    <div className="flex items-end gap-4 -mt-10 mb-3">
                      <div className="w-16 h-16 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden relative shrink-0">
                        {biz.logo ? (
                          <Image
                            src={biz.logo}
                            alt={biz.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-[#EAE6F7] text-[#5B46F6] flex items-center justify-center font-bold text-xl">
                            {biz.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-lg font-bold text-gray-900 truncate">
                            {biz.name}
                          </h2>
                          {isVerified && (
                            <span title="Verified Sister Venture">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-[#5B46F6]">{biz.category}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {biz.shortDescription}
                    </p>

                    {/* Meta info tags */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{biz.location.district || biz.location.city}, {biz.location.division}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span>{biz.businessType}</span>
                      </div>
                      {biz.hasActiveShop && (
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Shop Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {biz.status === "APPROVED" && (
                      <Link
                        href={`/businesses/${biz.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl text-gray-500 hover:text-[#5B46F6] hover:bg-white border border-transparent hover:border-gray-200 transition-all text-xs font-semibold flex items-center gap-1"
                        title="View Public Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">Public Page</span>
                      </Link>
                    )}
                    <Link
                      href={`/member/business/${biz.id}/edit`}
                      className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all text-xs font-semibold flex items-center gap-1"
                      title="Edit Details"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                  </div>

                  <Link
                    href={`/member/business/${biz.id}`}
                    className="px-4 py-2 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-xs font-bold shadow-md shadow-[#5B46F6]/20 flex items-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    <span>Manage Business</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-xl border border-gray-200/80 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#5B46F6] flex items-center justify-center mx-auto shadow-md shadow-[#5B46F6]/10">
            <Store className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5B46F6] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Your Sisterhood Brand</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              You haven&apos;t registered a business yet
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Register your boutique, startup, handicraft workshop, or agency to build brand authority, gain verified sister credentials, and start selling across Bangladesh.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/member/business/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-sm font-bold shadow-xl shadow-[#5B46F6]/25 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Register Your First Business</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
