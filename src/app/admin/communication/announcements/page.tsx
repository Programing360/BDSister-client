import React from "react";
import { AnnouncementsListView } from "@/features/admin/communication/components/announcements/announcements-list-view";

export const metadata = {
  title: "Platform Announcements | BDSisters Admin",
  description: "Manage global announcement banners and notification broadcasts"
};

export default function AnnouncementsPage() {
  return <AnnouncementsListView />;
}
