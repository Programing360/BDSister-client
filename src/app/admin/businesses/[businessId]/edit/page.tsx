import { notFound } from "next/navigation";
import { getAdminBusinessById } from "@/features/admin/businesses/data/admin-businesses-data";
import { BusinessEditForm } from "@/features/admin/businesses/components/business-edit-form";

interface PageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { businessId } = await params;
  const business = getAdminBusinessById(businessId);
  return {
    title: business
      ? `Edit ${business.name} | BDSisters Administration`
      : "Edit Business | BDSisters Administration",
  };
}

export default async function AdminBusinessEditPage({ params }: PageProps) {
  const { businessId } = await params;
  const business = getAdminBusinessById(businessId);

  if (!business) {
    notFound();
  }

  return <BusinessEditForm business={business} />;
}
