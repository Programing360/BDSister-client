import React from "react";
import { CommunicationSettingsView } from "@/features/admin/communication/components/settings/communication-settings-view";

export const metadata = {
  title: "Communication Settings | BDSisters Admin",
  description: "Configure support mailboxes, SLA rules, and webhooks"
};

export default function CommunicationSettingsPage() {
  return <CommunicationSettingsView />;
}
