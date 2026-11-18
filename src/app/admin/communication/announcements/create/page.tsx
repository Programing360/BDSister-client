import React from "react";
import { AnnouncementForm } from "@/features/admin/communication/components/announcements/announcement-form";

export const metadata = {
  title: "Create Announcement | BDSisters Admin",
  description: "Create and publish a new platform announcement"
};

export default function CreateAnnouncementPage() {
  return <AnnouncementForm />;
}
