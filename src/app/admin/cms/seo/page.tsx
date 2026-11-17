import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "SEO Management | BDSisters Administration",
};

export default function AdminCmsSeoPage() {
  return (
    <AdminModulePlaceholder
      title="Global SEO & OpenGraph Configuration"
      category="CMS & Content"
      description="Configure canonical tags, OpenGraph previews, JSON-LD schemas, and search indexing"
      plannedStep="Admin Step 10 (CMS)"
    />
  );
}
