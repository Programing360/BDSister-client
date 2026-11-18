import { Metadata } from "next";
import { CoursesListView } from "@/features/admin/resources/components/courses/courses-list-view";
import { DEMO_COURSES } from "@/features/admin/resources/data/mock-resources";

export const metadata: Metadata = {
  title: "Courses & Learning Programs (LMS) | BDSisters Admin",
  description:
    "Structured educational courses, interactive modules, lesson syllabi, and enrollment tracking.",
};

export default function AdminCoursesPage() {
  return <CoursesListView initialCourses={DEMO_COURSES} />;
}
