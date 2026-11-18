import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_EVENTS } from "@/features/admin/events/data/mock-events";
import { EventForm } from "@/features/admin/events/components/form/event-form";

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
    title: event ? `Edit ${event.title} | BDSisters Admin` : "Edit Event | BDSisters Admin",
  };
}

export default async function EditEventPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = DEMO_EVENTS.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  return <EventForm initialData={event} isEdit={true} />;
}
