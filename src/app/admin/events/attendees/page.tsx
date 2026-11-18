import { Metadata } from "next";
import { AttendeesListView } from "@/features/admin/events/components/attendees/attendees-list-view";

export const metadata: Metadata = {
  title: "Attendee Management & Gate Check-In | BDSisters Admin",
  description: "Real-time gate check-ins, attendee rosters, and ticket badge scanning.",
};

export default function AttendeesPage() {
  return <AttendeesListView />;
}
