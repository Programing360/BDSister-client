import { Metadata } from "next";
import { AdminForumCategoriesView } from "@/features/admin/forums/components/admin-forum-categories-view";

export const metadata: Metadata = {
  title: "Forum Categories | BDSisters Admin",
  description: "Manage safe community forum discussion categories, topics, and moderation boards.",
};

export default function AdminForumCategoriesPage() {
  return <AdminForumCategoriesView />;
}
