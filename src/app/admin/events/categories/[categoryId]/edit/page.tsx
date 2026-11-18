import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_EVENT_CATEGORIES } from "@/features/admin/events/data/mock-events";
import { CategoryForm } from "@/features/admin/events/components/categories/category-form";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export async function generateStaticParams() {
  return DEMO_EVENT_CATEGORIES.map((cat) => ({
    categoryId: cat.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = DEMO_EVENT_CATEGORIES.find((c) => c.id === categoryId);
  return {
    title: category ? `Edit ${category.name} | BDSisters Admin` : "Edit Category | BDSisters Admin",
  };
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = DEMO_EVENT_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return <CategoryForm initialData={category} isEdit={true} />;
}
