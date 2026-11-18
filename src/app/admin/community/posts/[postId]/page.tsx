import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COMMUNITY_POSTS } from "@/features/admin/community/data/mock-community";
import { PostDetailView } from "@/features/admin/community/components/posts/post-detail-view";

interface PageProps {
  params: Promise<{ postId: string }>;
}

export async function generateStaticParams() {
  return DEMO_COMMUNITY_POSTS.map((p) => ({
    postId: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = DEMO_COMMUNITY_POSTS.find((p) => p.id === postId);
  return {
    title: post ? `Post ${post.id} | BDSisters Admin` : "Post Details",
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId } = await params;
  const post = DEMO_COMMUNITY_POSTS.find((p) => p.id === postId);

  if (!post) {
    notFound();
  }

  return <PostDetailView post={post} />;
}
