import React from "react";
import { Metadata } from "next";
import { PostsListView } from "@/features/admin/community/components/posts/posts-list-view";

export const metadata: Metadata = {
  title: "Posts Moderation | BDSisters Admin",
  description: "Audit individual community posts, inspect media attachments, and enforce content safety.",
};

export default function PostsPage() {
  return <PostsListView />;
}
