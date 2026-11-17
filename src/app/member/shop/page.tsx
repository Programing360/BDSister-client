import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { getShopsByOwnerId } from "@/lib/services/shop-service";
import { ShopManagementView } from "@/features/shop/components";

export const metadata: Metadata = {
  title: "My Shop | BDSisters Member",
  description: "Manage your online storefront, branding, shipping, and return policies.",
};

export default async function MemberShopOverviewPage() {
  const session = await requireServerSession("/member/shop");
  const businesses = await getBusinessesByOwnerId(session.user.id);
  const shops = await getShopsByOwnerId(session.user.id);

  return (
    <ShopManagementView
      businesses={businesses}
      currentBusiness={businesses[0] || null}
      shop={shops[0] || null}
    />
  );
}
