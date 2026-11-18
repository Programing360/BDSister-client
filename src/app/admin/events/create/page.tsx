import { Metadata } from "next";
import { EventForm } from "@/features/admin/events/components/form/event-form";

export const metadata: Metadata = {
  title: "Create Event | BDSisters Admin",
  description: "Schedule and publish a new event, conference, or community summit.",
};

export default function CreateEventPage() {
  return <EventForm isEdit={false} />;
}
