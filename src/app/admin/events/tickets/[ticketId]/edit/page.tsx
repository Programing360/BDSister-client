import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_TICKETS } from "@/features/admin/events/data/mock-events";
import { TicketForm } from "@/features/admin/events/components/tickets/ticket-form";

interface PageProps {
  params: Promise<{ ticketId: string }>;
}

export async function generateStaticParams() {
  return DEMO_TICKETS.map((t) => ({ ticketId: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ticketId } = await params;
  const ticket = DEMO_TICKETS.find((t) => t.id === ticketId);
  return {
    title: ticket ? `Edit ${ticket.name} | BDSisters Admin` : "Edit Ticket | BDSisters Admin",
  };
}

export default async function EditTicketPage({ params }: PageProps) {
  const { ticketId } = await params;
  const ticket = DEMO_TICKETS.find((t) => t.id === ticketId);

  if (!ticket) {
    notFound();
  }

  return <TicketForm initialData={ticket} isEdit={true} />;
}
