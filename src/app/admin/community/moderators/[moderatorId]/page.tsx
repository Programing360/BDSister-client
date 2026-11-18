import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COMMUNITY_MODERATORS } from "@/features/admin/community/data/mock-community";
import { ModeratorDetailView } from "@/features/admin/community/components/moderators/moderator-detail-view";

interface PageProps {
  params: Promise<{ moderatorId: string }>;
}

export async function generateStaticParams() {
  return DEMO_COMMUNITY_MODERATORS.map((m) => ({
    moderatorId: m.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moderatorId } = await params;
  const moderator = DEMO_COMMUNITY_MODERATORS.find((m) => m.id === moderatorId);
  return {
    title: moderator
      ? `${moderator.member.name} (Moderator) | BDSisters Admin`
      : "Moderator Details",
  };
}

export default async function ModeratorDetailPage({ params }: PageProps) {
  const { moderatorId } = await params;
  const moderator = DEMO_COMMUNITY_MODERATORS.find((m) => m.id === moderatorId);

  if (!moderator) {
    notFound();
  }

  return <ModeratorDetailView moderator={moderator} />;
}
