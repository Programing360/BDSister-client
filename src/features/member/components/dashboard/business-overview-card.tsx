"use client";

import React from "react";
import Link from "next/link";
import { Store, ArrowRight, Sparkles, ShieldCheck, ShoppingBag, Plus } from "lucide-react";
import { DashboardCard } from "../shared/dashboard-card";
import type { BusinessDocument } from "@/types/business";
import type { ShopDocument } from "@/types/shop";

interface BusinessOverviewCardProps {
  business?: BusinessDocument | null;
  shop?: ShopDocument | null;
}

export function BusinessOverviewCard({ business, shop }: BusinessOverviewCardProps) {
  if (business) {
    const isApproved = business.status === "APPROVED";
    const isVerified = business.verificationStatus === "VERIFIED";

    return (
      <DashboardCard
        title="My Enterprise & Brand"
        subtitle="Manage your women-led venture, accreditation, and storefront"
        icon={<Store className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#5B46F6]/20 bg-gradient-to-br from-[#5B46F6]/5 via-white to-purple-50/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-gray-900">{business.name}</h4>
                {isVerified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Accredited
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5B46F6] border border-purple-200">
                  {business.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {business.category} • {business.businessType}
              </p>
            </div>

            <Link
              href={`/member/business/${business.id}`}
              className="px-4 py-2 rounded-xl bg-[#5B46F6] hover:bg-[#4d3ad8] text-white text-xs font-bold shadow-md shadow-[#5B46F6]/20 flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-[0.98]"
            >
              <span>Manage Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Shop summary pill */}
            <div className="p-3.5 rounded-xl border border-gray-200/80 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Digital Store</p>
                  <p className="text-gray-400 text-[11px]">
                    {shop ? shop.status : "Not Configured"}
                  </p>
                </div>
              </div>
              <Link
                href="/member/shop"
                className="text-[#5B46F6] font-semibold hover:underline"
              >
                {shop ? "Open" : "Setup"}
              </Link>
            </div>

            {/* Quick new registration link */}
            <div className="p-3.5 rounded-xl border border-gray-200/80 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5B46F6] flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Multi-Venture</p>
                  <p className="text-gray-400 text-[11px]">Register another brand</p>
                </div>
              </div>
              <Link
                href="/member/business/create"
                className="text-[#5B46F6] font-semibold hover:underline"
              >
                Add
              </Link>
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Women Entrepreneurs Hub"
      subtitle="Showcase your brand and products across Bangladesh"
      icon={<Store className="h-5 w-5" />}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#5B46F6]/20 bg-gradient-to-br from-[#5B46F6]/5 via-white to-purple-50/40 p-6 text-center sm:p-7">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/25">
          <Store className="h-6 w-6" />
        </div>

        <div className="mt-3.5 inline-flex items-center gap-1 rounded-full bg-[#5B46F6]/10 px-3 py-1 text-[11px] font-bold text-[#5B46F6]">
          <Sparkles className="h-3 w-3" />
          <span>Empower Your Brand</span>
        </div>

        <h4 className="mt-2 text-base font-extrabold text-gray-900">
          Have a Business or Boutique?
        </h4>

        <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-gray-600 sm:text-sm">
          Register your women-led business profile to receive verified vendor status, create digital shop listings, and access bulk B2B sister buyers.
        </p>

        <div className="mt-5">
          <Link
            href="/member/business/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-lg active:scale-98"
          >
            <span>Register Your Business</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}
