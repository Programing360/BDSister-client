import { Metadata } from "next";
import { RefundsListView } from "@/features/admin/payments/components/refunds/refunds-list-view";

export const metadata: Metadata = {
  title: "Refund Management | BDSisters Admin",
  description: "Review, inspect, approve, or reject customer and artisan refund claims on BDSisters.org.",
};

export default function AdminRefundsPage() {
  return <RefundsListView />;
}
