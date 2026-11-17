import { VerificationsListView } from "@/features/admin/verifications/components/verifications-list-view";

export const metadata = {
  title: "Pending Verifications Queue | BDSisters Admin",
  description: "Priority inspection queue for pending Bangladeshi identity verification submissions.",
};

export default function AdminPendingVerificationsPage() {
  return <VerificationsListView initialStatusFilter="PENDING" isPendingQueueOnly={true} />;
}
