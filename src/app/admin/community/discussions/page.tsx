import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Discussions Moderation | BDSisters Administration",
};

export default function AdminCommunityDiscussionsPage() {
  return (
    <AdminModulePlaceholder
      title="Community Discussions"
      category="Forum Moderation"
      description="Inspect threads, pin community announcements, and manage member discussion feeds"
      plannedStep="Admin Step 8 (Community & Moderation)"
    />
  );
}
