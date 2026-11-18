import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_TICKETS } from "@/features/admin/events/data/mock-events";
import { TicketDetailView } from "@/features/admin/events/components/tickets/ticket-detail-view";

interface PageProps {
  params: Promise<{ ticketId: string }>;
}

export async function generateStaticParams() {
  return DEMO_TICKETS.map((t) => ({
    ticketId: t.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ticketId } = await params;
  const ticket = DEMO_TICKETS.find((t) => t.id === ticketId);
  return {
    title: ticket ? `${ticket.name} | BDSisters Admin` : "Ticket Not Found | BDSisters Admin",
  };
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { ticketId } = await params;
  const ticket = DEMO_TICKETS.find((t) => t.id === ticketId);

  if (!ticket) {
    notFound();
  }

  return <TicketDetailView ticket={ticket} />;
}
