import { Metadata } from "next";
import { SecurityEventsView } from "@/features/admin/security/components/security-events-view";

export const metadata: Metadata = {
  title: "Security Events & Threats | BDSisters Admin",
  description: "Monitor and respond to real-time intrusion attempts and perimeter threats.",
};

export default function SecurityEventsPage() {
  return <SecurityEventsView />;
}
