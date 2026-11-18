import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COMMUNITY_POSTS } from "@/features/admin/community/data/mock-community";
import { PostForm } from "@/features/admin/community/components/posts/post-form";

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
  return {
    title: `Edit Post ${postId} | BDSisters Admin`,
  };
}

export default async function EditPostPage({ params }: PageProps) {
  const { postId } = await params;
  const post = DEMO_COMMUNITY_POSTS.find((p) => p.id === postId);

  if (!post) {
    notFound();
  }

  return <PostForm initialData={post} />;
}
