import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_ENROLLMENTS } from "@/features/admin/resources/data/mock-resources";
import { EnrollmentDetailView } from "@/features/admin/resources/components/enrollments/enrollment-detail-view";

interface PageProps {
  params: Promise<{ enrollmentId: string }>;
}

export async function generateStaticParams() {
  return DEMO_ENROLLMENTS.map((e) => ({
    enrollmentId: e.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { enrollmentId } = await params;
  const enrollment = DEMO_ENROLLMENTS.find((e) => e.id === enrollmentId);
  return {
    title: enrollment
      ? `Enrollment: ${enrollment.learnerName} | BDSisters Admin LMS`
      : "Enrollment Not Found | BDSisters Admin",
    description: "Learner course progress and certificate verification.",
  };
}

export default async function EnrollmentDetailPage({ params }: PageProps) {
  const { enrollmentId } = await params;
  const enrollment = DEMO_ENROLLMENTS.find((e) => e.id === enrollmentId);

  if (!enrollment) {
    notFound();
  }

  return <EnrollmentDetailView enrollment={enrollment} />;
}
