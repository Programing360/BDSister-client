import { VerificationsListView } from "@/features/admin/verifications/components/verifications-list-view";

export const metadata = {
  title: "Identity Verifications | BDSisters Admin",
  description:
    "Review Bangladeshi national identity documents, Smart NIDs, passports, and audit verification submissions.",
};

export default function AdminVerificationsPage() {
  return <VerificationsListView />;
}
