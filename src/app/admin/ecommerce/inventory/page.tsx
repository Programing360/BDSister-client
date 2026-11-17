import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Inventory Hub | BDSisters Administration",
};

export default function AdminInventoryPage() {
  return (
    <AdminModulePlaceholder
      title="Platform Inventory Hub"
      category="Stock Auditing"
      description="Track stock levels, low-quantity alerts, batch allocations, and out-of-stock listings"
      plannedStep="Admin Step 7 (Commerce Hub)"
    />
  );
}
