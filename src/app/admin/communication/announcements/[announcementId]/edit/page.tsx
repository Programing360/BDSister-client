import React from "react";
import { AnnouncementForm } from "@/features/admin/communication/components/announcements/announcement-form";
import { DEMO_ANNOUNCEMENTS } from "@/features/admin/communication/data/mock-communication";

export const metadata = {
  title: "Edit Announcement | BDSisters Admin",
  description: "Modify platform announcement content and settings"
};

export async function generateStaticParams() {
  return DEMO_ANNOUNCEMENTS.map((announcement) => ({
    announcementId: announcement.id
  }));
}

interface PageProps {
  params: Promise<{ announcementId: string }>;
}

export default async function EditAnnouncementPage({ params }: PageProps) {
  const { announcementId } = await params;
  return <AnnouncementForm announcementId={announcementId} />;
}
