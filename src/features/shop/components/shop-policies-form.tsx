"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Truck,
  RotateCcw,
  RefreshCw,
  ShieldCheck,
  Clock,
} from "lucide-react";
import type { BusinessDocument } from "@/types/business";
import type { ShopDocument, ShopPolicies } from "@/types/shop";

interface ShopPoliciesFormProps {
  businesses: BusinessDocument[];
  shop: ShopDocument | null;
}

export function ShopPoliciesForm({ businesses, shop }: ShopPoliciesFormProps) {
  const router = useRouter();

  const businessId = shop?.businessId || businesses[0]?.id || "";
  const initialPolicies: ShopPolicies = shop?.policies || {};

  const [shippingPolicy, setShippingPolicy] = useState(
    initialPolicies.shippingPolicy ||
      "Deliveries within Dhaka Metropolitan area take 24-48 hours via Pathao / Steadfast. Outside Dhaka deliveries take 3-5 business days across all 64 districts."
  );
  const [returnPolicy, setReturnPolicy] = useState(
    initialPolicies.returnPolicy ||
      "Returns accepted within 7 days of receiving the package if the item arrives damaged or materially differs from description. Please keep original packaging."
  );
  const [exchangePolicy, setExchangePolicy] = useState(
    initialPolicies.exchangePolicy ||
      "Size or color exchanges are welcome within 5 business days, subject to product availability. Customer covers return courier fee."
  );
  const [privacyPolicy, setPrivacyPolicy] = useState(
    initialPolicies.privacyPolicy ||
      "Customer contact numbers and delivery addresses are strictly used for courier fulfillment and are never disclosed to external brokers."
  );
  const [customerSupportHours, setCustomerSupportHours] = useState(
    initialPolicies.customerSupportHours || "Saturday to Thursday: 10:00 AM – 8:00 PM (BST)"
  );

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) {
      setErrorMsg("No active business selected.");
      return;
    }

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/member/shop/policies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          shippingPolicy: shippingPolicy.trim(),
          returnPolicy: returnPolicy.trim(),
          exchangePolicy: exchangePolicy.trim(),
          privacyPolicy: privacyPolicy.trim(),
          customerSupportHours: customerSupportHours.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update policies.");
      }

      setSuccessMsg("Shop policies updated successfully!");
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl shadow-xl border border-gray-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/member/shop"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Back to shop overview"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Storefront Policies</h1>
            <p className="text-xs text-gray-500">
              Clear customer guidelines for shipping, returns, exchanges, and support hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href="/member/shop"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Policies</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Policies Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-[#5B46F6]" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Shipping &amp; Delivery Terms
            </label>
          </div>
          <textarea
            rows={3}
            maxLength={2000}
            value={shippingPolicy}
            onChange={(e) => setShippingPolicy(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] resize-y"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Return &amp; Refund Policy
            </label>
          </div>
          <textarea
            rows={3}
            maxLength={2000}
            value={returnPolicy}
            onChange={(e) => setReturnPolicy(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] resize-y"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Product Exchange Policy
            </label>
          </div>
          <textarea
            rows={3}
            maxLength={2000}
            value={exchangePolicy}
            onChange={(e) => setExchangePolicy(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] resize-y"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Buyer Privacy Disclosure
            </label>
          </div>
          <textarea
            rows={3}
            maxLength={2000}
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] resize-y"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Customer Support Hours
            </label>
          </div>
          <input
            type="text"
            maxLength={200}
            value={customerSupportHours}
            onChange={(e) => setCustomerSupportHours(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
          />
        </div>
      </div>
    </form>
  );
}
