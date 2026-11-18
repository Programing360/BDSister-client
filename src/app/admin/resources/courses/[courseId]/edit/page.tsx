import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COURSES } from "@/features/admin/resources/data/mock-resources";
import { CourseForm } from "@/features/admin/resources/components/courses/course-form";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateStaticParams() {
  return DEMO_COURSES.map((c) => ({
    courseId: c.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  return {
    title: course
      ? `Edit: ${course.title} | BDSisters Admin LMS`
      : "Edit Course | BDSisters Admin",
    description: "Update course metadata, pricing, modules, and syllabus lessons.",
  };
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const course = DEMO_COURSES.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  return <CourseForm initialData={course} isEdit={true} />;
}
