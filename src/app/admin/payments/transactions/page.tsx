import { Metadata } from "next";
import { TransactionsListView } from "@/features/admin/payments/components/transactions/transactions-list-view";

export const metadata: Metadata = {
  title: "Payment Transactions | BDSisters Admin",
  description: "Browse, audit, and filter all ZiniPay payment transactions on BDSisters.org.",
};

export default function AdminTransactionsPage() {
  return <TransactionsListView />;
}
