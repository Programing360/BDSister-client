import React from "react";
import { NotificationsOverviewView } from "@/features/admin/communication/components/notifications/notifications-overview-view";

export const metadata = {
  title: "Notifications Hub | BDSisters Admin",
  description: "Multi-channel in-app and push notification management"
};

export default function NotificationsPage() {
  return <NotificationsOverviewView />;
}
