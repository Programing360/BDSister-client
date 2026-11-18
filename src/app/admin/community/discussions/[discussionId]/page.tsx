import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_DISCUSSIONS } from "@/features/admin/community/data/mock-community";
import { DiscussionDetailView } from "@/features/admin/community/components/discussions/discussion-detail-view";

interface PageProps {
  params: Promise<{ discussionId: string }>;
}

export async function generateStaticParams() {
  return DEMO_DISCUSSIONS.map((d) => ({
    discussionId: d.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { discussionId } = await params;
  const discussion = DEMO_DISCUSSIONS.find((d) => d.id === discussionId);
  return {
    title: discussion ? `${discussion.title} | BDSisters Admin` : "Discussion Details",
  };
}

export default async function DiscussionDetailPage({ params }: PageProps) {
  const { discussionId } = await params;
  const discussion = DEMO_DISCUSSIONS.find((d) => d.id === discussionId);

  if (!discussion) {
    notFound();
  }

  return <DiscussionDetailView discussion={discussion} />;
}
