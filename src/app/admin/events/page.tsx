import { Metadata } from "next";
import { EventsOverviewView } from "@/features/admin/events/components/overview/events-overview-view";

export const metadata: Metadata = {
  title: "Events & Workshops Overview | BDSisters Admin",
  description: "Executive control and intelligence suite for events, summits, workshops, and registrations.",
};

export default function AdminEventsPage() {
  return <EventsOverviewView />;
}
