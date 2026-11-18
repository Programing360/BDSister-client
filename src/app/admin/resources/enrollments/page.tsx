import { Metadata } from "next";
import { EnrollmentsListView } from "@/features/admin/resources/components/enrollments/enrollments-list-view";

export const metadata: Metadata = {
  title: "Course Enrollments | BDSisters Admin LMS",
  description:
    "Track student progress, registration status, course completion rates, and certificate awards.",
};

export default function AdminEnrollmentsPage() {
  return <EnrollmentsListView />;
}
