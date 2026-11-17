import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerUser, isAdmin } from "@/lib/auth/session";
import { getPublicShopBySlug } from "@/lib/services/shop-service";
import { PublicShopView } from "@/features/shop/components";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const user = await getServerUser();
  const adminFlag = await isAdmin();
  const shop = await getPublicShopBySlug(slug, user?.id, adminFlag);

  if (!shop) {
    return { title: "Store Not Found | BDSisters Marketplace" };
  }

  return {
    title: `${shop.name} | Women-Led Storefront | BDSisters`,
    description: shop.shortDescription || `Shop authentic women-made crafts and collections from ${shop.businessName}.`,
  };
}

export default async function PublicShopPage({ params }: Props) {
  const { slug } = await params;
  const user = await getServerUser();
  const adminFlag = await isAdmin();
  const shop = await getPublicShopBySlug(slug, user?.id, adminFlag);

  if (!shop) {
    notFound();
  }

  return <PublicShopView shop={shop} />;
}
