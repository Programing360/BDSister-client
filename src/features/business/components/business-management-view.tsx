"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  MapPin,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Edit3,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  CreditCard,
  Loader2,
  Sparkles,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import type { BusinessDocument } from "@/types/business";
import type { ShopDocument } from "@/types/shop";
import { getBusinessStatusBadge } from "../utils/business-utils";
import { ZiniPayService } from "@/lib/services/zinipay-service";

interface BusinessManagementViewProps {
  business: BusinessDocument;
  shop: ShopDocument | null;
}

export function BusinessManagementView({ business, shop }: BusinessManagementViewProps) {
  const statusBadge = getBusinessStatusBadge(business.status);
  const isVerified = business.verificationStatus === "VERIFIED";
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgradeSubscription = async () => {
    setIsUpgrading(true);
    try {
      await ZiniPayService.initiatePayment({
        amount: 999,
        customerName: business.ownerName || business.name,
        customerEmail: business.contact.email,
        customerPhone: business.contact.phone,
        purpose: "SUBSCRIPTION",
        autoRedirect: true,
        metadata: {
          businessId: business.id,
          businessName: business.name,
          tier: "VERIFIED_MERCHANT",
        },
      });
    } catch {
      alert("Failed to initiate ZiniPay subscription checkout.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const locationText = [
    business.location.address,
    business.location.city,
    business.location.district,
    business.location.division,
    business.location.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden relative">
        <div className="h-44 sm:h-60 w-full bg-gradient-to-r from-[#5B46F6] via-[#7366F7] to-[#8C80F8] relative">
          {business.coverImage && (
            <Image
              src={business.coverImage}
              alt={business.name}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          )}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${
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

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 -mt-14 sm:-mt-16 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden relative shrink-0">
                {business.logo ? (
                  <Image
                    src={business.logo}
                    alt={business.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#EAE6F7] text-[#5B46F6] flex items-center justify-center font-bold text-3xl">
                    {business.name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    {business.name}
                  </h1>
                  {isVerified && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">
                  {business.category} • {business.businessType}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center sm:justify-end gap-3 flex-wrap">
              <Link
                href={`/businesses/${business.slug}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#5B46F6]" />
                <span>Public Profile</span>
              </Link>
              <Link
                href={`/member/business/${business.id}/edit`}
                className="px-5 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Details</span>
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
            {business.shortDescription}
          </p>
        </div>
      </div>

      {/* 2. THREE-PANEL STATUS & MANAGEMENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Verification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isVerified
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {business.verificationStatus}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">Trade Verification</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {isVerified
                ? "Your trade accreditation documents are verified and published on directory listings."
                : "Submit Trade License, TIN, or institutional registration documents to earn the green accreditation shield."}
            </p>
          </div>

          <Link
            href={`/member/business/${business.id}/verification`}
            className="inline-flex items-center justify-between p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-[#5B46F6] text-xs font-bold transition-colors"
          >
            <span>{isVerified ? "View Verification Records" : "Submit Verification Documents"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Shop Integration Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {shop ? shop.status : "NOT CONFIGURED"}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">Digital Storefront (Shop)</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {shop
                ? `Associated Shop: ${shop.name}. Configure branding, shipping, return and refund policies.`
                : "Open your digital sisterhood storefront to list products and sell directly to consumers."}
            </p>
          </div>

          <Link
            href="/member/shop"
            className="inline-flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 text-xs font-bold transition-colors"
          >
            <span>{shop ? "Manage Storefront" : "Configure Shop"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Location & Region Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {business.location.division}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">Operating Region</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed truncate">
              {locationText || "Bangladesh"}
            </p>
          </div>

          <div className="pt-2 text-xs text-gray-500 border-t border-gray-100 flex items-center justify-between">
            <span>Contact: {business.contact.phone}</span>
            <span className="font-semibold">{business.contact.email}</span>
          </div>
        </div>

        {/* Subscription & Featured Merchant Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                MERCHANT TIER
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">Featured Business Subscription</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Unlock priority placement on the homepage, verified badge, and zero commission on marketplace transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleUpgradeSubscription}
            disabled={isUpgrading}
            className="w-full inline-flex items-center justify-between p-3 rounded-2xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-xs font-bold shadow-md shadow-[#5B46F6]/25 transition-all"
          >
            {isUpgrading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Connecting ZiniPay...
              </span>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Upgrade to Verified Merchant (৳999/mo)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. FULL STORY & CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Business Story &amp; Craft
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {business.fullDescription}
          </p>
        </div>

        {/* Connected Channels & Social Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Public Channels
          </h3>

          <div className="space-y-3 text-xs">
            {business.contact.website && (
              <a
                href={business.contact.website.startsWith("http") ? business.contact.website : `https://${business.contact.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-[#5B46F6] transition-colors"
              >
                <Globe className="w-4 h-4 shrink-0 text-[#5B46F6]" />
                <span className="truncate">{business.contact.website}</span>
              </a>
            )}

            {business.contact.facebook && (
              <a
                href={business.contact.facebook.startsWith("http") ? business.contact.facebook : `https://${business.contact.facebook}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#1877F2] transition-colors"
              >
                <FaFacebook className="w-4 h-4 shrink-0 text-[#1877F2]" />
                <span className="truncate">Facebook Page</span>
              </a>
            )}

            {business.contact.instagram && (
              <a
                href={business.contact.instagram.startsWith("http") ? business.contact.instagram : `https://${business.contact.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-[#E4405F] transition-colors"
              >
                <FaInstagram className="w-4 h-4 shrink-0 text-[#E4405F]" />
                <span className="truncate">Instagram Profile</span>
              </a>
            )}

            {business.contact.linkedin && (
              <a
                href={business.contact.linkedin.startsWith("http") ? business.contact.linkedin : `https://${business.contact.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#0A66C2] transition-colors"
              >
                <FaLinkedin className="w-4 h-4 shrink-0 text-[#0A66C2]" />
                <span className="truncate">LinkedIn Page</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
