import React from "react";
import { Activity, Clock } from "lucide-react";
import { DashboardCard } from "../shared/dashboard-card";
import { EmptyState } from "../shared/empty-state";

export function ActivityOverview() {
  return (
    <DashboardCard
      title="Recent Activity"
      subtitle="Your personal interaction timeline across BDSisters"
      icon={<Activity className="h-5 w-5" />}
    >
      <EmptyState
        icon={<Clock className="h-6 w-6 text-gray-400" />}
        title="No recent activity yet"
        description="Your course enrollments, community contributions, and marketplace interactions will be chronicled here."
        actionHref="/member/community"
        actionLabel="Join Community Discussion"
      />
    </DashboardCard>
  );
}
