import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessById } from "@/lib/services/business-service";
import { BusinessVerificationView } from "@/features/business/components";
import { toPlainObject } from "@/lib/utils/serialize";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Business Verification | BDSisters Member",
  description: "Submit and track trade license and institutional verification for your business.",
};

export default async function BusinessVerificationPage({ params }: Props) {
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

  return <BusinessVerificationView business={toPlainObject(business)} />;
}
