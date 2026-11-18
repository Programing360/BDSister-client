import { notFound } from "next/navigation";
import { getBusinessVerificationById } from "@/features/admin/businesses/data/admin-business-verifications-data";
import { BusinessVerificationDetailsView } from "@/features/admin/businesses/components/business-verification-details-view";

interface PageProps {
  params: Promise<{
    verificationId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { verificationId } = await params;
  const verification = getBusinessVerificationById(verificationId);
  return {
    title: verification
      ? `Verification - ${verification.businessName} | BDSisters Admin`
      : "Verification Details | BDSisters Admin",
    description: "Inspect synthetic trade license specimen, registration metadata, and approval actions.",
  };
}

export default async function AdminBusinessVerificationDetailsPage({ params }: PageProps) {
  const { verificationId } = await params;
  const verification = getBusinessVerificationById(verificationId);

  if (!verification) {
    notFound();
  }

  return <BusinessVerificationDetailsView verification={verification} />;
}
