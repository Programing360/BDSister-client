import React from "react";
import { AnnouncementDetailView } from "@/features/admin/communication/components/announcements/announcement-detail-view";
import { DEMO_ANNOUNCEMENTS } from "@/features/admin/communication/data/mock-communication";

export const metadata = {
  title: "Announcement Details | BDSisters Admin",
  description: "View platform announcement details and targeting"
};

export async function generateStaticParams() {
  return DEMO_ANNOUNCEMENTS.map((announcement) => ({
    announcementId: announcement.id
  }));
}

interface PageProps {
  params: Promise<{ announcementId: string }>;
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { announcementId } = await params;
  return <AnnouncementDetailView announcementId={announcementId} />;
}
