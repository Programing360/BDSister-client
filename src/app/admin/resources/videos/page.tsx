import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Video Masterclasses | BDSisters Administration",
};

export default function AdminResourceVideosPage() {
  return (
    <AdminModulePlaceholder
      title="Video Masterclasses & Tutorials"
      category="Learning Resources"
      description="Curate recorded masterclasses, artisan craft demonstrations, and leadership interviews"
      plannedStep="Admin Step 9 (Learning Resources)"
    />
  );
}
