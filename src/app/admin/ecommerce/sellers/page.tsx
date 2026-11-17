import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Sellers & Artisans | BDSisters Administration",
};

export default function AdminSellersPage() {
  return (
    <AdminModulePlaceholder
      title="Merchant & Artisan Network"
      category="Commerce Operations"
      description="Monitor active seller stores, payout status, and dispatch fulfillment performance"
      plannedStep="Admin Step 7 (Commerce Hub)"
    />
  );
}
