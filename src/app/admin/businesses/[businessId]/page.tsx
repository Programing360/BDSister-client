import { notFound } from "next/navigation";
import { getAdminBusinessById } from "@/features/admin/businesses/data/admin-businesses-data";
import { BusinessDetailsView } from "@/features/admin/businesses/components/business-details-view";

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
      ? `${business.name} (${business.businessCode}) | BDSisters Administration`
      : "Business Details | BDSisters Administration",
    description: "360-degree view of sister enterprise, trade licenses, verification documents, and marketplace activity.",
  };
}

export default async function AdminBusinessDetailsPage({ params }: PageProps) {
  const { businessId } = await params;
  const business = getAdminBusinessById(businessId);

  if (!business) {
    notFound();
  }

  return <BusinessDetailsView business={business} />;
}
