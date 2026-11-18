import { Metadata } from "next";
import { MembershipPlansView } from "@/features/admin/memberships/components/plans/membership-plans-view";

export const metadata: Metadata = {
  title: "Membership Plans | BDSisters Admin",
  description: "Configure and manage Free and Paid membership packages on BDSisters.org.",
};

export default function AdminMembershipPlansPage() {
  return <MembershipPlansView />;
}
