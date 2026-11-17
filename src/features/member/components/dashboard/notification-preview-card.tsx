import React from "react";
import Link from "next/link";
import { Bell, ArrowRight, CheckCheck } from "lucide-react";
import { DashboardCard } from "../shared/dashboard-card";
import { EmptyState } from "../shared/empty-state";

export function NotificationPreviewCard() {
  return (
    <DashboardCard
      title="Notifications & Updates"
      subtitle="Direct updates from the BDSisters admin & community"
      icon={<Bell className="h-5 w-5" />}
      headerAction={
        <Link
          href="/member/notifications"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5B46F6] hover:underline"
        >
          <span>View Inbox</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <EmptyState
        icon={<CheckCheck className="h-6 w-6 text-emerald-500" />}
        title="You're all caught up"
        description="No unread community alerts, course updates, or messages at this time."
        actionHref="/member/notifications"
        actionLabel="Go to Notifications Center"
      />
    </DashboardCard>
  );
}
