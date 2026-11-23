import React from "react";
import { BusinessDetailsView } from "@/features/admin/businesses/components/business-details-view";

interface PageProps {
  params: Promise<{ businessId: string }>;
}

export default async function AdminBusinessDetailsPage({ params }: PageProps) {
  const { businessId } = await params;
  return <BusinessDetailsView businessId={businessId} />;
}