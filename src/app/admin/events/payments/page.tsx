import { Metadata } from "next";
import { EventPaymentsView } from "@/features/admin/events/components/payments/event-payments-view";

export const metadata: Metadata = {
  title: "Event Payments & ZiniPay Ledger | BDSisters Admin",
  description: "Read-only financial audit records from the official ZiniPay gateway.",
};

export default function EventPaymentsPage() {
  return <EventPaymentsView />;
}
