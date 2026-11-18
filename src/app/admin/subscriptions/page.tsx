import { Metadata } from "next";
import { SubscriptionsListView } from "@/features/admin/memberships/components/subscriptions/subscriptions-list-view";

export const metadata: Metadata = {
  title: "Membership Subscriptions | BDSisters Admin",
  description: "Manage and monitor member subscription accounts, terms, and manual renewal requests.",
};

export default function AdminSubscriptionsPage() {
  return <SubscriptionsListView />;
}
