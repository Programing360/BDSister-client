import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Promotional Banners | BDSisters Administration",
};

export default function AdminCmsBannersPage() {
  return (
    <AdminModulePlaceholder
      title="Promotional Banners & Announcements"
      category="CMS & Content"
      description="Design and schedule seasonal Eid festival banners, artisan sale announcements, and platform alerts"
      plannedStep="Admin Step 10 (CMS)"
    />
  );
}
