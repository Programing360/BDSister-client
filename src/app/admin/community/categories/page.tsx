import React from "react";
import { Metadata } from "next";
import { CategoriesListView } from "@/features/admin/community/components/categories/categories-list-view";

export const metadata: Metadata = {
  title: "Discussion Categories | BDSisters Admin",
  description: "Manage community discussion categories, taxonomy, and display priority.",
};

export default function CategoriesPage() {
  return <CategoriesListView />;
}
