import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { getShopsByOwnerId } from "@/lib/services/shop-service";
import { ShopBrandingForm } from "@/features/shop/components";

export const metadata: Metadata = {
  title: "Shop Branding | BDSisters Member",
  description: "Customize storefront logo, banners, and visual presentation.",
};

export default async function ShopBrandingPage() {
  const session = await requireServerSession("/member/shop/branding");
  const businesses = await getBusinessesByOwnerId(session.user.id);

  if (businesses.length === 0) {
    redirect("/member/business/create");
  }

  const shops = await getShopsByOwnerId(session.user.id);

  return <ShopBrandingForm businesses={businesses} shop={shops[0] || null} />;
}
