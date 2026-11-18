"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminBusinessItem } from "../types/admin-business.ts";
import {
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

interface FeaturedBusinessesViewProps {
  initialBusinesses: AdminBusinessItem[];
}

export function FeaturedBusinessesView({ initialBusinesses }: FeaturedBusinessesViewProps) {
  const [allBusinesses, setAllBusinesses] = useState<AdminBusinessItem[]>(initialBusinesses);
  const [featuredList, setFeaturedList] = useState<AdminBusinessItem[]>(
    initialBusinesses
      .filter((b) => b.isFeatured)
      .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const availableToFeature = allBusinesses.filter(
    (b) => b.status === "APPROVED" && !featuredList.some((f) => f.id === b.id)
  );

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...featuredList];
    const current = newList[index];
    const prev = newList[index - 1];
    if (!current || !prev) return;

    newList[index] = prev;
    newList[index - 1] = current;

    // reassign order
    const updated = newList.map((item, idx) => ({ ...item, featuredOrder: idx + 1 }));
    setFeaturedList(updated);
    setToastMessage(`Moved "${current.name}" up to rank #${index}.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleMoveDown = (index: number) => {
    if (index === featuredList.length - 1) return;
    const newList = [...featuredList];
    const current = newList[index];
    const next = newList[index + 1];
    if (!current || !next) return;

    newList[index] = next;
    newList[index + 1] = current;

    const updated = newList.map((item, idx) => ({ ...item, featuredOrder: idx + 1 }));
    setFeaturedList(updated);
    setToastMessage(`Moved "${current.name}" down to rank #${index + 2}.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRemoveFeatured = (id: string) => {
    const item = featuredList.find((b) => b.id === id);
    setFeaturedList((prev) => prev.filter((b) => b.id !== id));
    setAllBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFeatured: false, featuredOrder: undefined } : b))
    );
    setToastMessage(`Removed "${item?.name || "Business"}" from featured list.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddFeatured = (bizId: string) => {
    const biz = allBusinesses.find((b) => b.id === bizId);
    if (!biz) return;
    const updatedBiz: AdminBusinessItem = {
      ...biz,
      isFeatured: true,
      featuredOrder: featuredList.length + 1,
    };
    setFeaturedList([...featuredList, updatedBiz]);
    setAllBusinesses((prev) =>
      prev.map((b) => (b.id === bizId ? updatedBiz : b))
    );
    setToastMessage(`Added "${biz.name}" to featured spotlights.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Businesses</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Curated Featured Businesses & Spotlights</h1>
          <p className="text-xs text-gray-500">
            Manage top spotlight sister enterprises displayed on the public landing page and marketplace home banners.
          </p>
        </div>

        {/* Add from Approved Pool */}
        {availableToFeature.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddFeatured(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 font-medium"
            >
              <option value="" disabled>
                + Add Business to Spotlights...
              </option>
              {availableToFeature.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.businessCode})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Featured Cards / List */}
      <div className="space-y-3">
        {featuredList.map((biz, idx) => (
          <div
            key={biz.id}
            className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#5B46F6]/30 transition-all"
          >
            {/* Rank badge & Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-bold flex items-center justify-center text-sm shrink-0">
                #{idx + 1}
              </div>

              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                {biz.logo ? (
                  <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/businesses/${biz.id}`}
                    className="font-bold text-sm text-gray-900 hover:text-[#5B46F6] transition-colors"
                  >
                    {biz.name}
                  </Link>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  <span className="font-medium text-gray-700">{biz.category}</span> • Owner: {biz.ownerName} ({biz.ownerId})
                </div>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                  {biz.businessCode} • ৳{(biz.totalRevenueBDT / 1000).toLocaleString()}k GMV • {biz.productCount} Products
                </div>
              </div>
            </div>

            {/* Position Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                onClick={() => handleMoveUp(idx)}
                disabled={idx === 0}
                title="Move Up"
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleMoveDown(idx)}
                disabled={idx === featuredList.length - 1}
                title="Move Down"
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleRemoveFeatured(biz.id)}
                title="Remove from Featured"
                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {featuredList.length === 0 && (
          <div className="bg-white border border-gray-200/80 rounded-xl p-12 text-center shadow-xs">
            <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No businesses currently featured</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Select any approved enterprise from the dropdown above to add them to the homepage spotlight showcase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
