import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Newsletter Campaigns | BDSisters Administration",
};

export default function AdminNewslettersPage() {
  return (
    <AdminModulePlaceholder
      title="Newsletter Subscriptions & Broadcasts"
      category="Communication"
      description="Manage platform subscriber lists, broadcast sister community bulletins, and review open rates"
      plannedStep="Admin Step 11 (Communication)"
    />
  );
}
