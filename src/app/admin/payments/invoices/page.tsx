import { Metadata } from "next";
import { InvoicesListView } from "@/features/admin/payments/components/invoices/invoices-list-view";

export const metadata: Metadata = {
  title: "Invoices & Receipts | BDSisters Admin",
  description: "Browse, audit, and print customer electronic invoices and payment receipts.",
};

export default function AdminInvoicesPage() {
  return <InvoicesListView />;
}
