import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_EVENTS } from "@/features/admin/events/data/mock-events";
import { EventDetailView } from "@/features/admin/events/components/list/event-detail-view";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateStaticParams() {
  return DEMO_EVENTS.map((event) => ({
    eventId: event.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = DEMO_EVENTS.find((e) => e.id === eventId);
  return {
    title: event ? `${event.title} | BDSisters Admin` : "Event Not Found | BDSisters Admin",
    description: event?.shortDescription || "Event details and attendee registry.",
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = DEMO_EVENTS.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  return <EventDetailView event={event} />;
}
