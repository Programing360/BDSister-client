import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_RESOURCE_CATEGORIES } from "@/features/admin/resources/data/mock-resources";
import { CategoryDetailView } from "@/features/admin/resources/components/categories/category-detail-view";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export async function generateStaticParams() {
  return DEMO_RESOURCE_CATEGORIES.map((c) => ({
    categoryId: c.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = DEMO_RESOURCE_CATEGORIES.find((c) => c.id === categoryId);
  return {
    title: category
      ? `${category.name} Category | BDSisters Admin`
      : "Category Not Found | BDSisters Admin",
    description: category?.description || "Category details and resource associations.",
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = DEMO_RESOURCE_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return <CategoryDetailView category={category} />;
}
