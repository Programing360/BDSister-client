import React from "react";
import { SubscribersListView } from "@/features/admin/communication/components/newsletter/subscribers-list-view";

export const metadata = {
  title: "Newsletter Subscribers | BDSisters Admin",
  description: "Browse and export newsletter opt-in subscribers"
};

export default function SubscribersPage() {
  return <SubscribersListView />;
}
