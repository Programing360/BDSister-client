import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COMMUNITY_CATEGORIES } from "@/features/admin/community/data/mock-community";
import { CategoryForm } from "@/features/admin/community/components/categories/category-form";

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
    title: category ? `Edit ${category.name} | BDSisters Admin` : "Edit Category",
  };
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = DEMO_COMMUNITY_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return <CategoryForm initialData={category} isEdit={true} />;
}
