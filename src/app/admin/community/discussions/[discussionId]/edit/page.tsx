import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_DISCUSSIONS } from "@/features/admin/community/data/mock-community";
import { DiscussionForm } from "@/features/admin/community/components/discussions/discussion-form";

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
    title: discussion ? `Edit: ${discussion.title} | BDSisters Admin` : "Edit Discussion",
  };
}

export default async function EditDiscussionPage({ params }: PageProps) {
  const { discussionId } = await params;
  const discussion = DEMO_DISCUSSIONS.find((d) => d.id === discussionId);

  if (!discussion) {
    notFound();
  }

  return <DiscussionForm initialData={discussion} isEdit={true} />;
}
