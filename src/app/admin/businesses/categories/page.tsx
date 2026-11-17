import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Business Categories | BDSisters Administration",
};

export default function AdminBusinessesCategoriesPage() {
  return (
    <AdminModulePlaceholder
      title="Business & Artisan Taxonomies"
      category="Commerce Taxonomy"
      description="Manage business categories, trade sectors, and artisan craft classifications"
      plannedStep="Admin Step 6 (Enterprise Review)"
    />
  );
}
