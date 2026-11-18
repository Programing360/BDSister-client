import React from "react";
import { NotificationsOverviewView } from "@/features/admin/communication/components/notifications/notifications-overview-view";

export const metadata = {
  title: "Notifications Hub | BDSisters Admin",
  description: "Manage in-app, SMS, and push notification triggers"
};

export default function NotificationsPage() {
  return <NotificationsOverviewView />;
}
