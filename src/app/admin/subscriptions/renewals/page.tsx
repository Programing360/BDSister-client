import { Metadata } from "next";
import { RenewalsListView } from "@/features/admin/memberships/components/renewals/renewals-list-view";

export const metadata: Metadata = {
  title: "Subscription Renewals Queue | BDSisters Admin",
  description: "Review upcoming and overdue member subscription renewals and dispatch reminders.",
};

export default function AdminSubscriptionRenewalsPage() {
  return <RenewalsListView />;
}
