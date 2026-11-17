import { VerificationsListView } from "@/features/admin/verifications/components/verifications-list-view";

export const metadata = {
  title: "Identity Verifications | BDSisters Admin",
  description: "Review member identity documents, national IDs, passports, and audit compliance submissions.",
};

export default function AdminVerificationsPage() {
  return <VerificationsListView />;
}
