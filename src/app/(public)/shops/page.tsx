import React, { Suspense } from "react";
import type { Metadata } from "next";
import PublicShopView from "@/features/shop/components/public-shop-view";

export const metadata: Metadata = {
    title: "Shop with Us — Sisterhood Marketplace | BDSisters",
    description:
        "Browse exclusive discounts after MRP and wholesale deals from verified Bangladeshi sister-owned businesses.",
};

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] py-20 text-center text-sm text-gray-500">Loading marketplace...</div>}>
            <PublicShopView />
        </Suspense>
    );
}