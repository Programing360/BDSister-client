import React from "react";
import { NotificationTemplatesView } from "@/features/admin/communication/components/notifications/notification-templates-view";

export const metadata = {
  title: "Notification Templates | BDSisters Admin",
  description: "Configure dynamic notification trigger templates"
};

export default function NotificationTemplatesPage() {
  return <NotificationTemplatesView />;
}
