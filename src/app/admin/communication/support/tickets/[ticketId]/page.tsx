import React from "react";
import { TicketDetailView } from "@/features/admin/communication/components/support/ticket-detail-view";
import { DEMO_SUPPORT_TICKETS } from "@/features/admin/communication/data/mock-communication";

export const metadata = {
  title: "Support Ticket Details | BDSisters Admin",
  description: "View and resolve customer support ticket"
};

export async function generateStaticParams() {
  return DEMO_SUPPORT_TICKETS.map((ticket) => ({
    ticketId: ticket.id
  }));
}

interface PageProps {
  params: Promise<{ ticketId: string }>;
}

export default async function SupportTicketDetailPage({ params }: PageProps) {
  const { ticketId } = await params;
  return <TicketDetailView ticketId={ticketId} />;
}
