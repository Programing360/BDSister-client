import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Pages Management | BDSisters Administration",
};

export default function AdminCmsPagesPage() {
  return (
    <AdminModulePlaceholder
      title="Content Management & Static Pages"
      category="CMS & Content"
      description="Edit terms of service, privacy policies, about pages, and mission vision content"
      plannedStep="Admin Step 10 (CMS)"
    />
  );
}
