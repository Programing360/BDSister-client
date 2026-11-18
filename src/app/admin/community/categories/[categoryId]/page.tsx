import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COMMUNITY_CATEGORIES } from "@/features/admin/community/data/mock-community";
import { CategoryDetailView } from "@/features/admin/community/components/categories/category-detail-view";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export async function generateStaticParams() {
  return DEMO_COMMUNITY_CATEGORIES.map((cat) => ({
    categoryId: cat.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = DEMO_COMMUNITY_CATEGORIES.find((c) => c.id === categoryId);
  return {
    title: category ? `${category.name} | BDSisters Admin` : "Category Details",
    description: category?.description || "Category details",
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = DEMO_COMMUNITY_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return <CategoryDetailView category={category} />;
}
