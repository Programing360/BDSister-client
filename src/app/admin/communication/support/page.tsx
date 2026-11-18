import React from "react";
import { TicketsListView } from "@/features/admin/communication/components/support/tickets-list-view";

export const metadata = {
  title: "Support Tickets & Help Desk | BDSisters Admin",
  description: "Manage member tickets, priority issues, and resolutions"
};

export default function SupportPage() {
  return <TicketsListView />;
}
