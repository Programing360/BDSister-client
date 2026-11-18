import { Metadata } from "next";
import { CategoryForm } from "@/features/admin/resources/components/categories/category-form";

export const metadata: Metadata = {
  title: "Create Resource Category | BDSisters Admin",
  description: "Define a new thematic category for guides, articles, and LMS courses.",
};

export default function CreateCategoryPage() {
  return <CategoryForm isEdit={false} />;
}
