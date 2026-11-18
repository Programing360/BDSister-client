import { Metadata } from "next";
import { RevenueReportsView } from "@/features/admin/payments/components/reports/revenue-reports-view";

export const metadata: Metadata = {
  title: "Revenue Reports & Audits | BDSisters Admin",
  description: "Comprehensive financial accounting schedules and revenue stream breakdowns.",
};

export default function AdminRevenueReportsPage() {
  return <RevenueReportsView />;
}
