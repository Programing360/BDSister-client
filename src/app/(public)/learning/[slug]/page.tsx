import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/features/public/learning/components/learning-card";
import { publicService } from "@/features/public/services/public-service";
import {
  Clock,
  BookOpen,
  Users,
  Star,
  CheckCircle2,
  PlayCircle,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
  FileText,
  MessageSquare,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await publicService.getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | BDSisters.org",
    };
  }

  return {
    title: `${course.title} | BDSisters Academy`,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await publicService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const allCourses = await publicService.getCourses();
  const relatedCourses = allCourses
    .filter((c) => c.slug !== course.slug)
    .slice(0, 3);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Learning Academy", href: "/learning" },
    { label: course.title },
  ];

  const syllabus = [
    {
      module: "Module 1",
      title: "Foundations & Ecosystem Context",
      duration: "45 mins",
      lessons: [
        "Landscape analysis & Bangladesh market realities",
        "Essential foundational setup & avoiding common pitfalls",
        "Case study: A sister enterprise journey from inception to profitability",
      ],
    },
    {
      module: "Module 2",
      title: "Strategic Execution & Operational Tools",
      duration: "1 hr 15 mins",
      lessons: [
        "Hands-on walkthrough of standard operating procedures",
        "Downloadable spreadsheets, legal boilerplates & calculators",
        "Step-by-step implementation roadmap",
      ],
    },
    {
      module: "Module 3",
      title: "Growth, Scaling & Overcoming Plateaus",
      duration: "1 hr 30 mins",
      lessons: [
        "Multi-channel distribution & financial prudence",
        "Delegation, hiring support & protecting mental energy",
        "Real-world peer review and troubleshooting scenarios",
      ],
    },
    {
      module: "Module 4",
      title: "Capstone Project & Verified Certification",
      duration: "50 mins",
      lessons: [
        "Submitting your implementation project for feedback",
        "Peer grading and mentor review",
        "Unlocking your verifiable digital credential",
      ],
    },
  ];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Breadcrumb strip */}
      <div className="border-b border-border/80 bg-white/70 backdrop-blur-md py-3.5 sticky top-[72px] z-20">
        <Container size="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      <Section spacing="lg" className="pt-6 sm:pt-10">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Course Detail Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Cover Image banner */}
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-card">
                <Image
                  src={course.coverImage || course.thumbnail || "/images/placeholders/course-1.jpg"}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholders/course-1.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    <span>{course.category}</span>
                  </span>
                  <span className="inline-flex items-center rounded-full bg-text-primary/80 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md capitalize">
                    {course.level} Level
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <div className="backdrop-blur-sm bg-black/40 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                    <span>Instructor:</span>
                    <strong className="text-white font-bold">{course.instructor}</strong>
                  </div>
                </div>
              </div>

              {/* Title and Ratings */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary leading-tight tracking-tight">
                  {course.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-secondary border-b border-border/80 pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-primary font-medium">Lead Mentor:</span>
                    <strong className="text-primary font-bold">{course.instructor}</strong>
                    {course.instructorTitle && (
                      <span className="text-neutral hidden sm:inline">({course.instructorTitle})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-text-primary">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{(course.rating ?? 4.9).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-text-secondary">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{course.enrolledCount ?? 420} Sisters Enrolled</span>
                  </div>
                </div>
              </div>

              {/* Course Overview */}
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                  Course Narrative &amp; Purpose
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* What You Will Master */}
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    What You Will Master in This Track
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(course.learningObjectives && course.learningObjectives.length > 0
                    ? course.learningObjectives
                    : [
                        "Actionable frameworks tailored to the Bangladeshi market context",
                        "Downloadable spreadsheets, contract templates, and checklists",
                        "Direct access to the course discussion circle for instructor questions",
                        "Official BDSisters completion certificate to showcase on your profile",
                      ]
                  ).map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-2xl bg-surface/60 p-4 border border-border/60"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed">
                        {obj}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Syllabus Outline */}
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-text-primary">Curriculum Modules</h3>
                  </div>
                  <span className="text-xs font-semibold text-neutral">
                    {course.lessonsCount ?? 12} Lessons • Self-Paced
                  </span>
                </div>

                <div className="space-y-4">
                  {syllabus.map((mod) => (
                    <div
                      key={mod.module}
                      className="rounded-2xl border border-border/70 bg-surface/40 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                            {mod.module}
                          </span>
                          <h4 className="font-bold text-sm text-text-primary">{mod.title}</h4>
                        </div>
                        <span className="text-xs font-semibold text-neutral">{mod.duration}</span>
                      </div>
                      <ul className="space-y-2 text-xs text-text-secondary pl-1">
                        {mod.lessons.map((lesson, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Spotlight */}
              <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-surface to-primary/5 p-6 sm:p-8 shadow-soft space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Meet Your Instructor
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white font-extrabold text-2xl shadow-md">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">{course.instructor}</h4>
                    <p className="text-xs font-semibold text-primary">{course.instructorTitle || "Senior Industry Mentor"}</p>
                    <p className="text-xs text-text-secondary mt-1.5 max-w-xl">
                      A seasoned professional passionate about equipping Bangladeshi women with practical, actionable skills to build financial resilience and institutional strength.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Enrollment Box */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-7 shadow-card space-y-6">
                  {/* Tuition Header */}
                  <div className="flex items-baseline justify-between border-b border-border/80 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Enrollment Fee
                    </span>
                    <span className="text-3xl font-extrabold text-primary">
                      {!course.price ? "Free Access" : `৳${course.price.toLocaleString("en-BD")}`}
                    </span>
                  </div>

                  {/* Course Specs Grid */}
                  <div className="space-y-3.5 text-xs text-text-secondary">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" /> Estimated Time
                      </span>
                      <strong className="text-text-primary">{course.duration}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" /> Curriculum Depth
                      </span>
                      <strong className="text-text-primary">{course.lessonsCount ?? 12} Modules</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" /> Certification
                      </span>
                      <strong className="text-text-primary">Verified Digital Credential</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" /> Peer Discussion
                      </span>
                      <strong className="text-text-primary">Included with Cohort</strong>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <div className="space-y-3 border-t border-border/80 pt-5">
                    <Link
                      href={`/register?redirect=/learning/${course.slug}`}
                      className="block w-full"
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full justify-center gap-2 font-bold text-base py-3.5 shadow-button hover:shadow-card-hover"
                      >
                        <GraduationCap className="h-5 w-5" />
                        <span>Start Learning for Free</span>
                      </Button>
                    </Link>
                    <p className="text-[11px] text-center text-text-secondary">
                      Requires free BDSisters membership to track module progress.
                    </p>
                  </div>

                  {/* Trust Banner */}
                  <div className="rounded-2xl border border-border/80 bg-surface/50 p-4 flex items-center gap-3 text-xs text-text-secondary">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>
                      Self-paced online curriculum with lifetime access to materials and updates.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Courses Carousel / Grid */}
          {relatedCourses.length > 0 && (
            <div className="mt-20 border-t border-border pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Curated Academy Tracks
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                    Explore Other Masterclasses
                  </h3>
                </div>
                <Link
                  href="/learning"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-heading-accent transition-colors"
                >
                  <span>Browse all courses</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCourses.map((c) => (
                  <LearningCard key={c.id} course={c} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
