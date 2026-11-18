import React from "react";
import { NotificationHistoryView } from "@/features/admin/communication/components/notifications/notification-history-view";

export const metadata = {
  title: "Notification History | BDSisters Admin",
  description: "Audit trail of sent notifications and read statuses"
};

export default function NotificationHistoryPage() {
  return <NotificationHistoryView />;
}
