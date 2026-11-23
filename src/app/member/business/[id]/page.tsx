import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessById } from "@/lib/services/business-service";
import { getShopByBusinessId } from "@/lib/services/shop-service";
import { BusinessManagementView } from "@/features/business/components";
import { toPlainObject } from "@/lib/utils/serialize";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusinessById(id);
  return {
    title: business ? `${business.name} | Manage Business` : "Business Management | BDSisters",
  };
}

export default async function BusinessDetailsPage({ params }: Props) {
  const session = await requireServerSession("/member/business");
  const { id } = await params;

  const business = await getBusinessById(id);
  if (!business) {
    notFound();
  }

  const isOwner = business.ownerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isOwner && !isAdmin) {
    redirect("/member/business");
  }

  const shop = await getShopByBusinessId(id);

  return <BusinessManagementView business={toPlainObject(business)} shop={toPlainObject(shop)} />;
}
