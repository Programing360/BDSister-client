import { Metadata } from "next";
import { AdminEventsView } from "@/features/admin/events/components/admin-events-view";

export const metadata: Metadata = {
  title: "Events & Workshops Overview | BDSisters Admin",
  description: "Executive control and intelligence suite for events, summits, workshops, and registrations.",
};

export default function AdminEventsPage() {
  return <AdminEventsView mode="upcoming" />;
}
