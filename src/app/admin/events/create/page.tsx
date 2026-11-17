import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Create Event | BDSisters Administration",
};

export default function AdminEventCreatePage() {
  return (
    <AdminModulePlaceholder
      title="Create Platform Event"
      category="Events & Workshops"
      description="Schedule networking webinars, entrepreneurship summits, and physical workshops"
      plannedStep="Admin Step 9 (Events Hub)"
    />
  );
}
