import { Metadata } from "next";
import { PaymentsOverviewView } from "@/features/admin/payments/components/overview/payments-overview-view";

export const metadata: Metadata = {
  title: "Payment & Financial Overview | BDSisters Admin",
  description: "Reconciliation metrics, settlement revenue, and ZiniPay gateway performance for BDSisters.org.",
};

export default function AdminPaymentsPage() {
  return <PaymentsOverviewView />;
}
