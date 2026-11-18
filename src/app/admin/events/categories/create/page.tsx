import { Metadata } from "next";
import { CategoryForm } from "@/features/admin/events/components/categories/category-form";

export const metadata: Metadata = {
  title: "Create Event Category | BDSisters Admin",
  description: "Define a new event classification category.",
};

export default function CreateCategoryPage() {
  return <CategoryForm isEdit={false} />;
}
