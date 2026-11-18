import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_RESOURCE_CATEGORIES } from "@/features/admin/resources/data/mock-resources";
import { CategoryForm } from "@/features/admin/resources/components/categories/category-form";

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
      ? `Edit: ${category.name} | BDSisters Admin`
      : "Edit Category | BDSisters Admin",
    description: "Update category name, slug, description, and accent style.",
  };
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = DEMO_RESOURCE_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return <CategoryForm initialData={category} isEdit={true} />;
}
