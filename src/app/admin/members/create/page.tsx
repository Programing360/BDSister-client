import { MemberCreateForm } from "@/features/admin/members/components/member-create-form";

export const metadata = {
  title: "Add New Member | BDSisters Administration",
  description: "Direct administrative registration and onboarding form for platform sister members.",
};

export default function AdminMemberCreatePage() {
  return <MemberCreateForm />;
}
