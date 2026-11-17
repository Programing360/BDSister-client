import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Homepage CMS | BDSisters Administration",
};

export default function AdminCmsHomepagePage() {
  return (
    <AdminModulePlaceholder
      title="Homepage Visual Editor"
      category="CMS & Content"
      description="Configure hero spotlights, featured sisters, testimonial carousels, and value propositions"
      plannedStep="Admin Step 10 (CMS)"
    />
  );
}
