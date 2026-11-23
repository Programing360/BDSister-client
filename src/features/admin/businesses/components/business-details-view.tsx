"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Globe,
  CheckCircle2,
  XCircle,
  MousePointerClick,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { BackendBusiness } from "./businesses-list-view";

interface DetailedBusiness extends BackendBusiness {
  subscriptionHistory?: Array<{
    status: string;
    paidAt: string;
    amount: number;
    transactionId: string;
  }>;
}

export function BusinessDetailsView({ businessId }: { businessId: string }) {
  const [business, setBusiness] = useState<DetailedBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBusiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data?: DetailedBusiness }>(
        API_ENDPOINTS.business.detail(businessId)
      );
      const raw = res as unknown as { data?: DetailedBusiness };
      if (raw.data) setBusiness(raw.data);
      else throw new Error("Business profile not found.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load business details.");
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId) fetchBusiness();
  }, [businessId, fetchBusiness]);

  const handleSubscriptionChange = async (newStatus: "Paid" | "Unpaid") => {
    if (!business) return;
    setIsUpdating(true);
    try {
      await apiClient.patch(
        API_ENDPOINTS.admin.updateBusinessSubscription(business._id),
        { subscriptionStatus: newStatus }
      );
      await fetchBusiness();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update subscription.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-[#5B9891]/20 bg-white space-y-3">
        <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
        <p className="text-xs font-semibold text-gray-600">Loading business & brands...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/businesses"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5B9891]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Businesses
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error || "Business not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/businesses"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#5B9891]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Businesses Directory
        </Link>
        <span className="font-mono text-[11px] px-3 py-1 rounded-lg bg-[#FAF8F5] border border-gray-200 text-gray-600">
          ID: {business._id}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900">
              {business.userId?.fullName || "Sister Enterprise"}
            </h1>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-bold ${business.subscriptionStatus === "Paid"
                ? "bg-[#5B9891]/15 text-[#467A74] border-[#5B9891]/30"
                : "bg-[#F2B55D]/25 text-[#D98408] border-[#F2B55D]/50"
                }`}
            >
              Subscription: {business.subscriptionStatus}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {business.businessSummary || "Multi-brand business profile on BDSisters.org"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {business.subscriptionStatus === "Unpaid" ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleSubscriptionChange("Paid")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve Paid & Publish All Brands
            </button>
          ) : (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleSubscriptionChange("Unpaid")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" /> Revoke & Unpublish
            </button>
          )}
        </div>
      </div>

      {/* Brands Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">
          Registered Brands ({business.brands?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {business.brands?.map((brand, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7DFC7] text-[#D98408]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{brand.brandName}</h3>
                    <p className="text-xs text-gray-500">
                      Role: <strong>{brand.roleInBusiness || "Founder"}</strong>
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${brand.isPublished
                    ? "bg-[#5B9891]/15 text-[#467A74]"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {brand.isPublished ? "Published" : "Unpublished"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                {brand.websiteUrl ? (
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#5B9891] hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> Visit Website
                  </a>
                ) : (
                  <span className="text-gray-400">No external website</span>
                )}

                <span className="inline-flex items-center gap-1 font-mono font-bold text-gray-700">
                  <MousePointerClick className="h-3.5 w-3.5 text-[#D98408]" />
                  {brand.affiliateClicks || 0} clicks
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription History */}
      <div className="rounded-2xl  border-gray-200/80 bg-white p-6 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          Subscription & Grant History
        </h3>
        {business.subscriptionHistory && business.subscriptionHistory.length > 0 ? (
          <div className="space-y-2">
            {business.subscriptionHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-gray-100 px-4 py-2.5 text-xs"
              >
                <div>
                  <span className="font-bold text-gray-900">{item.status}</span>
                  <span className="ml-2 font-mono text-[11px] text-gray-500">
                    ({item.transactionId})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#5B9891]">৳{item.amount}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.paidAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-4 text-center">
            No subscription payment history recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}