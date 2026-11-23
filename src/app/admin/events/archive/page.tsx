import { Metadata } from "next";
import { AdminEventsView } from "@/features/admin/events/components/admin-events-view";

export const metadata: Metadata = {
  title: "Event Media & Archive | BDSisters Admin",
  description: "Historical summits, video recordings, attendee turnouts, and photo recaps.",
};

export default function EventArchivePage() {
  return <AdminEventsView mode="archive" />;
}
