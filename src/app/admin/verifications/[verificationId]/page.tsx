import { notFound } from "next/navigation";
import { getAdminVerificationById } from "@/features/admin/verifications/data/admin-verifications-data";
import { VerificationDetailsView } from "@/features/admin/verifications/components/verification-details-view";

interface PageProps {
  params: Promise<{
    verificationId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { verificationId } = await params;
  const submission = getAdminVerificationById(verificationId);
  return {
    title: submission
      ? `Review ${submission.memberName} (${submission.submissionId}) | BDSisters Admin`
      : "Verification Review | BDSisters Admin",
    description: "Inspect identity documents, compare National ID records, and submit compliance audit decisions.",
  };
}

export default async function AdminVerificationDetailsPage({ params }: PageProps) {
  const { verificationId } = await params;
  const submission = getAdminVerificationById(verificationId);

  if (!submission) {
    notFound();
  }

  return <VerificationDetailsView submission={submission} />;
}
