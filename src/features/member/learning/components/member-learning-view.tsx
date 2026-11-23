"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Download,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
  FileText,
  BarChart2,
} from "lucide-react";

interface EnrolledCourse {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  category: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  currentLessonTitle: string;
  thumbnail: string;
  lastAccessed: string;
}

interface LearningResource {
  id: string;
  title: string;
  category: string;
  type: string;
  format: string;
  fileSize: string;
  downloadUrl?: string;
}

const MOCK_ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: "crs-1",
    slug: "bootstrapping-ecommerce-in-bangladesh",
    title: "Bootstrapping Your E-Commerce Brand in Bangladesh: Sourcing to Delivery",
    instructor: "Tahmina Rahman",
    category: "E-Commerce & Retail",
    progressPercent: 65,
    completedLessons: 8,
    totalLessons: 12,
    currentLessonTitle: "Module 9: Negotiating with Last-Mile Delivery Couriers (Pathao, Steadfast)",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80",
    lastAccessed: "2 days ago",
  },
  {
    id: "crs-2",
    slug: "financial-literacy-and-tax-for-women",
    title: "Financial Literacy, Tax Returns & Business Banking Mastery",
    instructor: "Amina Khatun, FCA",
    category: "Finance & Accounting",
    progressPercent: 30,
    completedLessons: 3,
    totalLessons: 10,
    currentLessonTitle: "Module 4: Calculating VAT Deductions & Withholding Tax under NBR Guidelines",
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    lastAccessed: "Yesterday",
  },
];

const MOCK_LEARNING_DOWNLOADS: LearningResource[] = [
  {
    id: "res-1",
    title: "Standard Independent Contractor Agreement (Bangla + English)",
    category: "Legal Kit",
    type: "Contract Template",
    format: "DOCX / PDF",
    fileSize: "1.2 MB",
    downloadUrl: "/downloads/sample-bdsisters-toolkit.pdf",
  },
  {
    id: "res-2",
    title: "Monthly Cashflow & Profit Margin Forecasting Spreadsheet",
    category: "Finance",
    type: "Excel Model",
    format: "XLSX",
    fileSize: "2.4 MB",
    downloadUrl: "/downloads/sample-bdsisters-toolkit.pdf",
  },
  {
    id: "res-3",
    title: "F-Commerce Customer Service Standard Operating Procedure (SOP)",
    category: "Operations",
    type: "Guide & Checklist",
    format: "PDF",
    fileSize: "950 KB",
    downloadUrl: "/downloads/sample-bdsisters-toolkit.pdf",
  },
];

export function MemberLearningView() {
  const [courses, setCourses] = useState<EnrolledCourse[]>(MOCK_ENROLLED_COURSES);
  const [downloads, setDownloads] = useState<LearningResource[]>(MOCK_LEARNING_DOWNLOADS);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              My Learning Academy
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Enrolled Courses &amp; Study Materials
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Resume your lessons, track your module completions, and download business toolkits.
          </p>
        </div>

        <Link href="/courses">
          <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold gap-1.5">
            <span>Browse All Courses</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Progress Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-text-secondary">Enrolled Courses</span>
            <h3 className="text-xl font-black text-text-primary">{courses.length} Active</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-text-secondary">Completed Lessons</span>
            <h3 className="text-xl font-black text-text-primary">
              {courses.reduce((acc, c) => acc + c.completedLessons, 0)} Lessons
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-heading-accent/10 text-heading-accent">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-text-secondary">Certification Status</span>
            <h3 className="text-xl font-black text-text-primary">1 in Progress</h3>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-primary" />
          <span>Continue Learning</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-6 shadow-card hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 font-bold text-primary text-[11px]">
                    {course.category}
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Active {course.lastAccessed}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Mentor: <strong>{course.instructor}</strong>
                </p>

                {/* Current lesson */}
                <div className="mt-4 rounded-2xl bg-surface/60 p-3.5 border border-border/70 text-xs">
                  <span className="text-text-secondary block font-semibold text-[11px]">
                    Next Up:
                  </span>
                  <span className="text-text-primary font-bold line-clamp-1 mt-0.5">
                    {course.currentLessonTitle}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      {course.completedLessons} of {course.totalLessons} lessons
                    </span>
                    <span className="font-bold text-primary">
                      {course.progressPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface border border-border/60">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between">
                <Link href={`/courses/${course.slug}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-2xl gap-1.5 shadow-button"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Resume Lesson</span>
                  </Button>
                </Link>
                <Link
                  href={`/courses/${course.slug}#curriculum`}
                  className="text-xs font-bold text-text-secondary hover:text-primary transition-colors"
                >
                  View Syllabus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Downloadable Toolkits & Resources */}
      <div className="space-y-4 pt-4 border-t border-border/80">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <span>Course Materials &amp; Downloadable Toolkits</span>
          </h2>
          <Link href="/resources">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">
              Resource Library
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {downloads.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-card"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="rounded-lg bg-surface px-2.5 py-0.5 font-bold text-text-secondary text-[11px] border border-border/60">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-text-secondary font-mono">
                    {item.format}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary line-clamp-2">
                  {item.title}
                </h4>
                <span className="text-xs text-text-secondary mt-1 block">
                  {item.type} • {item.fileSize}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-border/70">
                <a
                  href={item.downloadUrl || "/downloads/sample-bdsisters-toolkit.pdf"}
                  download
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Toolkit</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
