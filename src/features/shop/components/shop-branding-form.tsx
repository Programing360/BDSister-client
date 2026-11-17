"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { ImageUploader } from "@/features/profile/components/image-uploader";
import type { BusinessDocument } from "@/types/business";
import type { ShopDocument } from "@/types/shop";

interface ShopBrandingFormProps {
  businesses: BusinessDocument[];
  shop: ShopDocument | null;
}

export function ShopBrandingForm({ businesses, shop }: ShopBrandingFormProps) {
  const router = useRouter();

  const businessId = shop?.businessId || businesses[0]?.id || "";
  const [logo, setLogo] = useState<string | null>(shop?.logo || null);
  const [banner, setBanner] = useState<string | null>(shop?.banner || null);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) {
      setErrorMsg("No active business found.");
      return;
    }

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/member/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          logo: logo || null,
          banner: banner || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update branding.");
      }

      setSuccessMsg("Shop branding saved successfully!");
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
            <h1 className="text-xl font-bold text-gray-900">Shop Visual Branding</h1>
            <p className="text-xs text-gray-500">
              Customize the logo and cover banner displayed to consumers in the marketplace.
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
                <span>Save Branding</span>
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

      {/* Main Branding Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ImageUploader
            type="avatar"
            label="Shop Logo / Badge"
            currentUrl={logo}
            onUploaded={(url) => setLogo(url)}
          />

          <ImageUploader
            type="cover"
            label="Storefront Banner"
            currentUrl={banner}
            onUploaded={(url) => setBanner(url)}
          />
        </div>
      </div>
    </form>
  );
}
