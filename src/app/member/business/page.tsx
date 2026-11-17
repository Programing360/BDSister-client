import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { BusinessListView } from "@/features/business/components";

export const metadata: Metadata = {
  title: "My Businesses | BDSisters Member",
  description: "Manage your registered businesses, accreditation status, and storefronts.",
};

export default async function MemberBusinessesPage() {
  const session = await requireServerSession("/member/business");
  const businesses = await getBusinessesByOwnerId(session.user.id);

  return <BusinessListView businesses={businesses} />;
}
