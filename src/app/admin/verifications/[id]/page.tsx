import { VerificationDetailsView } from "@/features/admin/verifications/components/verification-details-view";

export const metadata = {
  title: "Verification Inspection | BDSisters Admin",
  description: "Inspect official National ID or Passport documents under AES-256 vault security.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminVerificationDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <VerificationDetailsView verificationId={id} />;
}
