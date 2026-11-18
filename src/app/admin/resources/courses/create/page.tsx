import { Metadata } from "next";
import { CourseForm } from "@/features/admin/resources/components/courses/course-form";

export const metadata: Metadata = {
  title: "Create Course & Curriculum Builder | BDSisters Admin",
  description:
    "Design and publish a multi-module learning program with lessons, readings, and exercises.",
};

export default function CreateCoursePage() {
  return <CourseForm isEdit={false} />;
}
