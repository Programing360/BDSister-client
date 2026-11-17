import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Pending Businesses | BDSisters Administration",
};

export default function AdminBusinessesPendingPage() {
  return (
    <AdminModulePlaceholder
      title="Pending Business Applications"
      category="Business Review"
      description="Review Trade Licenses, e-TIN certificates, and artisan registration submissions"
      plannedStep="Admin Step 6 (Enterprise Review)"
    />
  );
}
