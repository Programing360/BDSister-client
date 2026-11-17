import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { DashboardCard } from "../shared/dashboard-card";
import { EmptyState } from "../shared/empty-state";

export function UpcomingEventsPreview() {
  return (
    <DashboardCard
      title="Upcoming Events"
      subtitle="Webinars, skill workshops, and sisterhood meetups"
      icon={<Calendar className="h-5 w-5" />}
      headerAction={
        <Link
          href="/member/events"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5B46F6] hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <EmptyState
        icon={<Calendar className="h-6 w-6 text-gray-400" />}
        title="No upcoming registrations"
        description="You have not registered for any upcoming sisterhood webinars or meetups yet. Browse the event catalog to discover events in Dhaka, Chattogram, and online."
        actionHref="/member/events"
        actionLabel="Explore Events Calendar"
      />
    </DashboardCard>
  );
}
