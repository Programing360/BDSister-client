import React from "react";
import { Metadata } from "next";
import { ModerationQueueView } from "@/features/admin/community/components/moderation/moderation-queue-view";

export const metadata: Metadata = {
  title: "Content Moderation Queue | BDSisters Admin",
  description: "Centralized review queue for pending discussions, posts, and comments.",
};

export default function ModerationQueuePage() {
  return <ModerationQueueView />;
}
