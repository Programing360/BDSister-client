import { Metadata } from "next";
import { AllEventsView } from "@/features/admin/events/components/list/all-events-view";

export const metadata: Metadata = {
  title: "All Events & Summits | BDSisters Admin",
  description: "Comprehensive catalogue of scheduled, ongoing, and past events.",
};

export default function AllEventsPage() {
  return <AllEventsView />;
}
