import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Admin Profile | BDSisters Administration",
};

export default function AdminProfilePage() {
  return (
    <AdminModulePlaceholder
      title="Administrator Profile"
      category="My Account"
      description="Manage administrator credentials, session history, and administrative notification preferences"
      plannedStep="Admin Step 2"
    />
  );
}
