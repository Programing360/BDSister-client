import { Metadata } from "next";
import { MembershipPlanForm } from "@/features/admin/memberships/components/plans/membership-plan-form";

export const metadata: Metadata = {
  title: "Create Membership Plan | BDSisters Admin",
  description: "Configure new membership packages, pricing tiers, and artisan benefits.",
};

export default function AdminCreateMembershipPlanPage() {
  return <MembershipPlanForm isEdit={false} />;
}
