import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { getShopsByOwnerId } from "@/lib/services/shop-service";
import { ShopSettingsForm } from "@/features/shop/components";

export const metadata: Metadata = {
  title: "Shop Settings | BDSisters Member",
  description: "Configure store name, slug, support email, and customer helpline.",
};

export default async function ShopSettingsPage() {
  const session = await requireServerSession("/member/shop/settings");
  const businesses = await getBusinessesByOwnerId(session.user.id);

  if (businesses.length === 0) {
    redirect("/member/business/create");
  }

  const shops = await getShopsByOwnerId(session.user.id);

  return <ShopSettingsForm businesses={businesses} shop={shops[0] || null} />;
}
