import React from "react";
import type { Metadata } from "next";
import { MemberEventsView } from "@/features/member/components/member-events-view";

export const metadata: Metadata = {
  title: "Events & Entry Tickets | BDSisters",
  description: "RSVP to upcoming workshops and view your sisterhood event passes.",
  robots: { index: false, follow: false },
};

export default function MemberEventsPage() {
  return <MemberEventsView />;
}