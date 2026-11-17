"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import type { BusinessDocument } from "@/types/business";
import type { ShopDocument } from "@/types/shop";

interface ShopSettingsFormProps {
  businesses: BusinessDocument[];
  shop: ShopDocument | null;
}

export function ShopSettingsForm({ businesses, shop }: ShopSettingsFormProps) {
  const router = useRouter();

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    shop?.businessId || businesses[0]?.id || ""
  );
  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId) || businesses[0];

  const [name, setName] = useState(shop?.name || (selectedBusiness ? `${selectedBusiness.name} Shop` : ""));
  const [slug, setSlug] = useState(shop?.slug || (selectedBusiness ? selectedBusiness.slug : ""));
  const [shortDescription, setShortDescription] = useState(shop?.shortDescription || (selectedBusiness?.shortDescription || ""));
  const [supportEmail, setSupportEmail] = useState(shop?.supportEmail || (selectedBusiness?.contact.email || ""));
  const [supportPhone, setSupportPhone] = useState(shop?.supportPhone || (selectedBusiness?.contact.phone || ""));

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Shop name is required.");
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
          businessId: selectedBusinessId,
          name: name.trim(),
          slug: slug.trim(),
          shortDescription: shortDescription.trim() || undefined,
          supportEmail: supportEmail.trim() || undefined,
          supportPhone: supportPhone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update shop settings.");
      }

      setSuccessMsg("Shop settings saved successfully!");
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
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
            <h1 className="text-xl font-bold text-gray-900">Storefront General Settings</h1>
            <p className="text-xs text-gray-500">
              Configure store name, unique URL slug, and customer support channels.
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
                <span>Save Settings</span>
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

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-5">
        {/* Parent business selector */}
        {businesses.length > 1 && (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Associated Parent Business *
            </label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.status})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Storefront Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. SilkHeritage Jamdani Store"
            required
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Unique Web Slug *
          </label>
          <div className="flex items-center rounded-2xl border border-gray-200/80 bg-gray-50 overflow-hidden focus-within:border-[#5B46F6]">
            <span className="px-3.5 text-xs font-semibold text-gray-400 select-none">
              bdsisters.org/shops/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="silkheritage-store"
              required
              className="flex-1 px-3 py-3 text-sm bg-transparent outline-none text-gray-900"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Lowercase alphanumeric characters and hyphens only.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Storefront Summary / Header Tagline
          </label>
          <textarea
            rows={3}
            maxLength={250}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A short welcome note for prospective shoppers..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Customer Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@mybrand.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Customer Helpline / WhatsApp
            </label>
            <input
              type="tel"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="+880 1711 000000"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
