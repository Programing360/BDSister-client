import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Contact Submissions | BDSisters Administration",
};

export default function AdminContactSubmissionsPage() {
  return (
    <AdminModulePlaceholder
      title="Public Contact Inquiries"
      category="Communication"
      description="Respond to public inquiries, media requests, sponsorship queries, and institutional outreach"
      plannedStep="Admin Step 11 (Communication)"
    />
  );
}
