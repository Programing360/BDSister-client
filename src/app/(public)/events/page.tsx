import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PublicEventsView } from "@/features/public/events/components/public-events-view";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Events & Workshops | BDSisters",
  description:
    "RSVP for free workshops or book tickets for upcoming BDSisters webinars and community gatherings.",
};

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B9891]" />
        </div>
      }
    >
      <PublicEventsView />
    </Suspense>
  );
}