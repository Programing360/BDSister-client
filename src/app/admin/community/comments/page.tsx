import React from "react";
import { Metadata } from "next";
import { CommentsListView } from "@/features/admin/community/components/comments/comments-list-view";

export const metadata: Metadata = {
  title: "Comments & Replies Management | BDSisters Admin",
  description: "Review and moderate discussion comments and sisterhood replies.",
};

export default function CommentsPage() {
  return <CommentsListView />;
}
