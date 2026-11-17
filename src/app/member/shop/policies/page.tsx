import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { getShopsByOwnerId } from "@/lib/services/shop-service";
import { ShopPoliciesForm } from "@/features/shop/components";

export const metadata: Metadata = {
  title: "Shop Policies | BDSisters Member",
  description: "Provide shipping, return & refund, exchange, and customer support guidelines.",
};

export default async function ShopPoliciesPage() {
  const session = await requireServerSession("/member/shop/policies");
  const businesses = await getBusinessesByOwnerId(session.user.id);

  if (businesses.length === 0) {
    redirect("/member/business/create");
  }

  const shops = await getShopsByOwnerId(session.user.id);

  return <ShopPoliciesForm businesses={businesses} shop={shops[0] || null} />;
}
