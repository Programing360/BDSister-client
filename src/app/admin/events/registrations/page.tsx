import { Metadata } from "next";
import { RegistrationsListView } from "@/features/admin/events/components/registrations/registrations-list-view";

export const metadata: Metadata = {
  title: "Event Registrations | BDSisters Admin",
  description: "Attendee enrollment roster, approval queue, and payment links.",
};

export default function RegistrationsPage() {
  return <RegistrationsListView />;
}
