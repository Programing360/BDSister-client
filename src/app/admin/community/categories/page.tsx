import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Discussion Categories | BDSisters Administration",
};

export default function AdminCommunityCategoriesPage() {
  return (
    <AdminModulePlaceholder
      title="Discussion Topics & Categories"
      category="Forum Moderation"
      description="Configure sister circles, career topics, entrepreneurship forums, and regional groups"
      plannedStep="Admin Step 8 (Community & Moderation)"
    />
  );
}
