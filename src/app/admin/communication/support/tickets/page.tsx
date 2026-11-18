import React from "react";
import { TicketsListView } from "@/features/admin/communication/components/support/tickets-list-view";

export const metadata = {
  title: "Support Tickets | BDSisters Admin",
  description: "View and filter support tickets across categories"
};

export default function SupportTicketsPage() {
  return <TicketsListView />;
}
