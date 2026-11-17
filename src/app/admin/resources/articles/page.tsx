import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Resource Articles | BDSisters Administration",
};

export default function AdminResourceArticlesPage() {
  return (
    <AdminModulePlaceholder
      title="Articles & Knowledge Base"
      category="Learning Resources"
      description="Publish business guides, legal advice, financial literacy, and career toolkits"
      plannedStep="Admin Step 9 (Learning Resources)"
    />
  );
}
