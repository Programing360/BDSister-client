import { notFound } from "next/navigation";
import { getAdminMemberById } from "@/features/admin/members/data/admin-members-data";
import { MemberDetailsView } from "@/features/admin/members/components/member-details-view";

interface PageProps {
  params: Promise<{
    memberId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { memberId } = await params;
  const member = getAdminMemberById(memberId);
  return {
    title: member ? `${member.name} (${member.memberId}) | BDSisters Admin` : "Member Details | BDSisters Admin",
    description: "Detailed member profile, subscription tier, identity verification, and administrative audit history.",
  };
}

export default async function AdminMemberDetailsPage({ params }: PageProps) {
  const { memberId } = await params;
  const member = getAdminMemberById(memberId);

  if (!member) {
    notFound();
  }

  return <MemberDetailsView member={member} />;
}
