import { notFound } from "next/navigation";
import { getAdminMemberById } from "@/features/admin/members/data/admin-members-data";
import { MemberEditForm } from "@/features/admin/members/components/member-edit-form";

interface PageProps {
  params: Promise<{
    memberId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { memberId } = await params;
  const member = getAdminMemberById(memberId);
  return {
    title: member ? `Edit ${member.name} (${member.memberId}) | BDSisters Admin` : "Edit Member | BDSisters Admin",
    description: "Modify member profile information, account status, privileges, and district settings.",
  };
}

export default async function AdminMemberEditPage({ params }: PageProps) {
  const { memberId } = await params;
  const member = getAdminMemberById(memberId);

  if (!member) {
    notFound();
  }

  return <MemberEditForm member={member} />;
}
