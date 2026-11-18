import { Metadata } from "next";
import { ArticlesListView } from "@/features/admin/resources/components/articles/articles-list-view";

export const metadata: Metadata = {
  title: "Articles & Editorial Guides | BDSisters Admin",
  description:
    "Manage published editorial articles, long-form guides, legal briefs, and educational research.",
};

export default function AdminArticlesPage() {
  return <ArticlesListView />;
}
