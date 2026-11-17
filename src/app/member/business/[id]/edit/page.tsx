import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessById } from "@/lib/services/business-service";
import { BusinessEditForm } from "@/features/business/components";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Business Profile | BDSisters Member",
  description: "Update your business branding, contact channels, location, and legal entity details.",
};

export default async function BusinessEditPage({ params }: Props) {
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

  return <BusinessEditForm business={business} />;
}
