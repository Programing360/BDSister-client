import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Refunds & Disputes | BDSisters Administration",
};

export default function AdminRefundsPage() {
  return (
    <AdminModulePlaceholder
      title="Refunds & Dispute Management"
      category="Financial Reconciliation"
      description="Resolve buyer return requests, courier transit damages, and ZiniPay payment refunds"
      plannedStep="Admin Step 7 (Commerce Hub)"
    />
  );
}
