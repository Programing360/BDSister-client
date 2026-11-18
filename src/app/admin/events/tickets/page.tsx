import { Metadata } from "next";
import { TicketsListView } from "@/features/admin/events/components/tickets/tickets-list-view";

export const metadata: Metadata = {
  title: "Ticket Types & Pricing | BDSisters Admin",
  description: "Configure tiers, quotas, and fees for events and masterclasses.",
};

export default function TicketsPage() {
  return <TicketsListView />;
}
