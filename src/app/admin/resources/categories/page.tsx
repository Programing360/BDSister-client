import { Metadata } from "next";
import { CategoriesListView } from "@/features/admin/resources/components/categories/categories-list-view";

export const metadata: Metadata = {
  title: "Resource Categories | BDSisters Admin",
  description:
    "Organize learning content, taxonomy, slugs, colors, and resource grouping hierarchies.",
};

export default function ResourceCategoriesPage() {
  return <CategoriesListView />;
}
