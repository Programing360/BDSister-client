import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Menus & Navigation | BDSisters Administration",
};

export default function AdminCmsMenusPage() {
  return (
    <AdminModulePlaceholder
      title="Header & Footer Navigation Menus"
      category="CMS & Content"
      description="Manage public navigation hierarchy, dropdown categories, and mobile drawer items"
      plannedStep="Admin Step 10 (CMS)"
    />
  );
}
