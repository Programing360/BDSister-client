import React from "react";
import { BusinessDetailsView } from "@/features/admin/businesses/components/business-details-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBusinessDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <BusinessDetailsView businessId={id} />;
}