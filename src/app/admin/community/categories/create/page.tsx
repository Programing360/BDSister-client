import React from "react";
import { Metadata } from "next";
import { CategoryForm } from "@/features/admin/community/components/categories/category-form";

export const metadata: Metadata = {
  title: "Create Discussion Category | BDSisters Admin",
  description: "Define a new discussion category for the BDSisters community.",
};

export default function CreateCategoryPage() {
  return <CategoryForm />;
}
