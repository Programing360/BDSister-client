"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CourseItem, CourseStatus } from "../../types/resource";
import {
  CourseLevelBadge,
  CourseStatusBadge,
} from "../common/resource-status-badge";
import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  GraduationCap,
  Layers,
  Sparkles,
  Users,
  Video,
  FileText,
  HelpCircle,
  Code,
  CheckCircle2,
  Share2,
  DollarSign,
  ArrowLeft,
  Award,
} from "lucide-react";

interface CourseDetailViewProps {
  course: CourseItem;
}

export function CourseDetailView({ course: initialCourse }: CourseDetailViewProps) {
  const [course, setCourse] = useState<CourseItem>(initialCourse);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [initialCourse.modules[0]?.id || ""]: true,
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleStatusChange = (newStatus: CourseStatus) => {
    setCourse((prev) => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }));
    setFeedbackMessage(
      `Course status updated to "${newStatus.replace("_", " ")}". (Demo only - not persisted to backend)`
    );
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const toggleFeatured = () => {
    setCourse((prev) => ({
      ...prev,
      isFeatured: !prev.isFeatured,
      updatedAt: new Date().toISOString(),
    }));
    setFeedbackMessage(
      course.isFeatured
        ? "Course removed from featured list. (Demo only)"
        : "Course marked as featured! (Demo only)"
    );
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4 text-[#5B46F6]" />;
      case "ARTICLE":
        return <FileText className="h-4 w-4 text-emerald-600" />;
      case "QUIZ_PLACEHOLDER":
        return <HelpCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/admin/resources"
            className="hover:text-[#5B46F6] transition-colors"
          >
            Resources
          </Link>
          <span>/</span>
          <Link
            href="/admin/resources/courses"
            className="hover:text-[#5B46F6] transition-colors"
          >
            Courses & LMS
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs">
            {course.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/resources/courses"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Courses
          </Link>
          <Link
            href={`/admin/resources/courses/${course.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5B46F6] text-xs font-semibold text-white hover:bg-[#4a36e2] transition-colors shadow-sm"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Course & Curriculum
          </Link>
        </div>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/30 p-3.5 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-semibold text-[#5B46F6]">
            LMS Curriculum View:
          </span>
          <span>DEMO DATA — Not connected to live learning services.</span>
        </div>
        <div className="text-slate-500 font-medium">Course ID: {course.id}</div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-3"
          >
            &times;
          </button>
        </div>
      )}

      {/* 2-Column Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cover Image & Key Metrics Showcase */}
        <div className="lg:col-span-5 space-y-6" data-aos="fade-right">
          {/* Cover Image Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-lg shadow-indigo-500/5">
            <div className="relative aspect-video w-full bg-slate-900 group">
              <Image
                src={course.coverImageUrl || "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80"}
                alt={course.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <CourseStatusBadge status={course.status} />
                <CourseLevelBadge level={course.level} />
                {course.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                    <Sparkles className="h-3 w-3" /> Featured
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-xs font-medium text-white/80">
                  {course.categoryName}
                </div>
                <div className="text-lg font-bold truncate">{course.title}</div>
              </div>
            </div>

            {/* Quick Status Management Bar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700">
                Course Publishing State:
              </div>
              <div className="flex items-center gap-2">
                {course.status !== "PUBLISHED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("PUBLISHED")}
                    className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
                  >
                    Publish Course
                  </button>
                )}
                {course.status === "PUBLISHED" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("ARCHIVED")}
                    className="px-2.5 py-1 rounded bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
                  >
                    Archive
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleFeatured}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition border ${
                    course.isFeatured
                      ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {course.isFeatured ? "Unfeature" : "Feature"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Users className="h-4 w-4 text-[#5B46F6]" /> Active Learners
              </div>
              <div className="text-xl font-bold text-slate-900">
                {course.enrolledLearnersCount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Completion: {course.completionRatePct}%
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Clock className="h-4 w-4 text-emerald-600" /> Duration
              </div>
              <div className="text-xl font-bold text-slate-900">
                {course.duration}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {course.modules.length} Modules • {course.lessonsCount} Lessons
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <DollarSign className="h-4 w-4 text-amber-600" /> Pricing Model
              </div>
              <div className="text-xl font-bold text-slate-900">
                {course.priceBDT > 0 ? `৳${course.priceBDT.toLocaleString()}` : "Free"}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {course.priceBDT > 0 ? "Paid Enrollment (ZiniPay)" : "Open Community Access"}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Award className="h-4 w-4 text-purple-600" /> Certification
              </div>
              <div className="text-xl font-bold text-slate-900">
                Verified
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                BDSisters Verified LMS
              </div>
            </div>
          </div>

          {/* Instructor Profile Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <GraduationCap className="h-4 w-4 text-[#5B46F6]" /> Lead Instructor
            </div>

            <div className="flex items-center gap-3.5">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-[#EAE6F7] border-2 border-indigo-100 shrink-0">
                {course.instructor.avatarUrl ? (
                  <Image
                    src={course.instructor.avatarUrl}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-[#5B46F6]">
                    {course.instructor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {course.instructor.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {course.instructor.organization || "Subject Expert"}
                </div>
              </div>
            </div>

            {course.instructor.bio && (
              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {course.instructor.bio}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Course Info, Curriculum & Syllabus */}
        <div className="lg:col-span-7 space-y-6" data-aos="fade-left">
          {/* Main Info Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5B46F6] mb-1">
                <span>{course.categoryName}</span>
                <span>•</span>
                <span className="capitalize">{course.level.replace("_", " ")} Level</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {course.shortDescription}
              </p>
            </div>

            {/* What You Will Learn / Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2.5">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Learning Outcomes
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5B46F6] mt-1.5 shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Full Course Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.fullDescription}
              </p>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && (
              <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <span className="font-bold text-slate-800">Prerequisites: </span>
                {course.prerequisites}
              </div>
            )}

            {/* Dates & Metadata */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Curriculum & Syllabus Accordion */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#5B46F6]" /> Course Syllabus & Modules
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {course.modules.length} modules, {course.lessonsCount} lessons, {course.duration} total length
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = course.modules.reduce(
                      (acc, m) => ({ ...acc, [m.id]: true }),
                      {}
                    );
                    setExpandedModules(allOpen);
                  }}
                  className="text-xs font-semibold text-[#5B46F6] hover:underline"
                >
                  Expand All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setExpandedModules({})}
                  className="text-xs font-semibold text-slate-500 hover:underline"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-3 pt-1">
              {course.modules.map((module, mIdx) => {
                const isOpen = !!expandedModules[module.id];
                return (
                  <div
                    key={module.id}
                    className="rounded-xl border border-slate-200 overflow-hidden transition shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100/60 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAE6F7] text-xs font-bold text-[#5B46F6] shrink-0">
                          {mIdx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {module.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {module.lessons.length} lessons
                            {module.description ? ` • ${module.description}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-medium text-slate-500">
                        {isOpen ? "▲ Hide" : "▼ Show"}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="divide-y divide-slate-100 bg-white">
                        {module.lessons.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 pl-6 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-slate-400 font-mono text-[11px] w-5 shrink-0">
                                {mIdx + 1}.{lIdx + 1}
                              </span>
                              <div className="p-1 rounded bg-slate-100 shrink-0">
                                {getLessonIcon(lesson.lessonType)}
                              </div>
                              <span className="font-semibold text-slate-800 truncate">
                                {lesson.title}
                              </span>
                              {lesson.isFreePreview && (
                                <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[10px] font-bold border border-emerald-200">
                                  Free Preview
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0 text-slate-500 font-mono text-[11px]">
                              <span>{lesson.duration}</span>
                              <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                                {lesson.lessonType.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
