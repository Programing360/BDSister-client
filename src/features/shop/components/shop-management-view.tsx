"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  Settings,
  Camera,
  FileText,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { BusinessDocument } from "@/types/business";
import type { ShopDocument } from "@/types/shop";
import { getShopStatusBadge } from "../utils/shop-utils";

interface ShopManagementViewProps {
  businesses: BusinessDocument[];
  currentBusiness: BusinessDocument | null;
  shop: ShopDocument | null;
}

export function ShopManagementView({
  businesses,
  currentBusiness,
  shop,
}: ShopManagementViewProps) {
  // If user has no business at all
  if (businesses.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-xl border border-gray-200/80 text-center max-w-2xl mx-auto space-y-6 pb-12">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#5B46F6] flex items-center justify-center mx-auto shadow-md shadow-[#5B46F6]/10">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5B46F6] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Foundation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Register a Business First
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            In BDSisters, every shop belongs to an authenticated women-led business. Please register your venture first before configuring your online storefront.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/member/business/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-sm font-bold shadow-xl shadow-[#5B46F6]/25 transition-all active:scale-[0.98]"
          >
            <Store className="w-4 h-4" />
            <span>Register Your Business</span>
          </Link>
        </div>
      </div>
    );
  }

  const selectedBusiness = currentBusiness || businesses[0]!;
  const shopStatusBadge = getShopStatusBadge(shop ? shop.status : "NOT_CONFIGURED");
  const isBusinessApproved = selectedBusiness.status === "APPROVED";

  const isConfigured = Boolean(shop && shop.name);
  const hasBranding = Boolean(shop && (shop.logo || shop.banner));
  const hasPolicies = Boolean(
    shop &&
    shop.policies &&
    (shop.policies.shippingPolicy || shop.policies.returnPolicy)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200/60">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Digital Storefront Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {shop?.name || `${selectedBusiness.name} Storefront`}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
            Operating under: <span className="font-bold text-gray-900">{selectedBusiness.name}</span>
            {selectedBusiness.verificationStatus === "VERIFIED" && " (Accredited Sister Venture)"}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 self-start sm:self-auto">
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs ${
              shopStatusBadge.variant === "active"
                ? "bg-emerald-500 text-white border-emerald-400"
                : shopStatusBadge.variant === "pending"
                ? "bg-amber-500 text-white border-amber-400"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            {shopStatusBadge.label}
          </span>

          {shop && shop.status === "ACTIVE" && (
            <Link
              href={`/shops/${shop.slug}`}
              target="_blank"
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B46F6] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Shop</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Setup Health & Onboarding Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-4">
        <h2 className="text-base font-bold text-gray-900">Storefront Setup Checklist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isConfigured ? "bg-emerald-50/60 border-emerald-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">1. Shop Configuration</p>
              <p className="text-[11px] text-gray-500">
                {isConfigured ? "Store name & URL configured" : "Set store name and unique slug"}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              hasBranding ? "bg-emerald-50/60 border-emerald-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            {hasBranding ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">2. Visual Branding</p>
              <p className="text-[11px] text-gray-500">
                {hasBranding ? "Logo & banner customized" : "Upload logo and storefront banner"}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              hasPolicies ? "bg-emerald-50/60 border-emerald-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            {hasPolicies ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">3. Shop Policies</p>
              <p className="text-[11px] text-gray-500">
                {hasPolicies ? "Customer policies defined" : "Provide shipping, return & support policies"}
              </p>
            </div>
          </div>
        </div>

        {!isBusinessApproved && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Your parent business ({selectedBusiness.name}) is currently in{" "}
              <strong>{selectedBusiness.status}</strong> status. The storefront will become active once the business accreditation review completes.
            </span>
          </div>
        )}
      </div>

      {/* 3. Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B46F6] flex items-center justify-center mb-3">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Store Settings</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Configure your public storefront name, web slug, support email, and helpline phone.
            </p>
          </div>

          <Link
            href="/member/shop/settings"
            className="inline-flex items-center justify-between p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-[#5B46F6] text-xs font-bold transition-colors"
          >
            <span>Configure Store Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Branding card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Visual Branding</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Upload your high-resolution store avatar and promotional cover banner.
            </p>
          </div>

          <Link
            href="/member/shop/branding"
            className="inline-flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 text-xs font-bold transition-colors"
          >
            <span>Manage Branding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Policies card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Shop Policies</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Draft shipping timelines, return &amp; refund clauses, exchange terms, and support hours.
            </p>
          </div>

          <Link
            href="/member/shop/policies"
            className="inline-flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-700 text-xs font-bold transition-colors"
          >
            <span>Edit Shop Policies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
