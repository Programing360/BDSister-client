import { Metadata } from "next";
import { TicketForm } from "@/features/admin/events/components/tickets/ticket-form";

export const metadata: Metadata = {
  title: "Create Ticket Tier | BDSisters Admin",
  description: "Define a new admission pass or ticket tier for an event.",
};

export default function CreateTicketPage() {
  return <TicketForm isEdit={false} />;
}
