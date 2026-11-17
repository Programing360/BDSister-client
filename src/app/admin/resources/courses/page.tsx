import { AdminModulePlaceholder } from "@/features/admin/components/shared/admin-module-placeholder";

export const metadata = {
  title: "Courses & Curricula | BDSisters Administration",
};

export default function AdminCoursesPage() {
  return (
    <AdminModulePlaceholder
      title="Courses & Structured Learning"
      category="Learning Resources"
      description="Manage structured cohort learning, syllabus modules, lessons, and completion certificates"
      plannedStep="Admin Step 9 (Learning Resources)"
    />
  );
}
