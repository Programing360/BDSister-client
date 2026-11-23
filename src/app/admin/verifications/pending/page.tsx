import { VerificationsListView } from "@/features/admin/verifications/components/verifications-list-view";

export const metadata = {
  title: "Pending Verifications Queue | BDSisters Admin",
  description: "Priority queue of submissions awaiting auditor inspection and verification decision.",
};

export default function AdminPendingVerificationsPage() {
  return <VerificationsListView initialStatusFilter="PENDING" isPendingQueueOnly={true} />;
}
