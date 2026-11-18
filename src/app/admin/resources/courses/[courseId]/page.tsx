import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COURSES } from "@/features/admin/resources/data/mock-resources";
import { CourseDetailView } from "@/features/admin/resources/components/courses/course-detail-view";

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
      ? `${course.title} | BDSisters Admin LMS`
      : "Course Not Found | BDSisters Admin",
    description: course?.shortDescription || "Course curriculum and syllabus details.",
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const course = DEMO_COURSES.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  return <CourseDetailView course={course} />;
}
