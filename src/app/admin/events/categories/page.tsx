import { Metadata } from "next";
import { CategoriesListView } from "@/features/admin/events/components/categories/categories-list-view";

export const metadata: Metadata = {
  title: "Event Categories | BDSisters Admin",
  description: "Manage classifications, topics, and structures for summits and workshops.",
};

export default function EventCategoriesPage() {
  return <CategoriesListView />;
}
