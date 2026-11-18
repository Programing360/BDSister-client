"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { CourseItem, CourseLevel, CourseStatus } from "../../types/resource";
import { DEMO_COURSES } from "../../data/mock-resources";
import { CourseTable } from "./course-table";
import {
  GraduationCap,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  BookOpen,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";

interface CoursesListViewProps {
  initialCourses?: CourseItem[];
}

export function CoursesListView({ initialCourses }: CoursesListViewProps) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses || DEMO_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.categoryName));
    return Array.from(set).sort();
  }, [courses]);

  // Filtered list
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesInstructor = c.instructor.name.toLowerCase().includes(q);
        const matchesCategory = c.categoryName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesInstructor && !matchesCategory) return false;
      }
      if (levelFilter !== "ALL" && c.level !== levelFilter) return false;
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (categoryFilter !== "ALL" && c.categoryName !== categoryFilter) return false;
      return true;
    });
  }, [courses, searchQuery, levelFilter, statusFilter, categoryFilter]);

  const handleTogglePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus: CourseStatus =
            c.status === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";
          return { ...c, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
    setFeedbackMessage(`Course publishing status toggled. (Demo only)`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleToggleFeatured = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, isFeatured: !c.isFeatured, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
    setFeedbackMessage(`Course featured spotlight toggled. (Demo only)`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    levelFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    categoryFilter !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setLevelFilter("ALL");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
  };

  const totalEnrollments = useMemo(() => {
    return courses.reduce((sum, c) => sum + c.enrolledLearnersCount, 0);
  }, [courses]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE6F7] text-[#5B46F6]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Courses & Learning Programs (LMS)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage structured courses, syllabi, interactive modules, lessons, and enrollment tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/resources/enrollments"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Users className="h-4 w-4 text-[#5B46F6]" />
            View Enrollments
          </Link>
          <Link
            href="/admin/resources/courses/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B46F6] text-xs font-semibold text-white hover:bg-[#4a36e2] transition-colors shadow-md shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </div>
      </div>

      {/* Demo notice banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-pink-50/20 p-3.5 text-xs text-indigo-950 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-semibold text-[#5B46F6]">LMS Administration:</span>
          <span>DEMO DATA — Not connected to live learning services.</span>
        </div>
        <span className="text-slate-500 font-medium hidden sm:inline">
          {courses.length} Courses Catalogued
        </span>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5" data-aos="fade-up">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <BookOpen className="h-4 w-4 text-[#5B46F6]" /> Total Courses
          </div>
          <div className="text-xl font-bold text-slate-900">{courses.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {courses.filter((c) => c.status === "PUBLISHED").length} active
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Users className="h-4 w-4 text-emerald-600" /> Total Enrollments
          </div>
          <div className="text-xl font-bold text-slate-900">
            {totalEnrollments.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Platform learners</div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Sparkles className="h-4 w-4 text-amber-600" /> Featured
          </div>
          <div className="text-xl font-bold text-slate-900">
            {courses.filter((c) => c.isFeatured).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Top-spotlight courses</div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Clock className="h-4 w-4 text-purple-600" /> Total Lessons
          </div>
          <div className="text-xl font-bold text-slate-900">
            {courses.reduce((sum, c) => sum + c.lessonsCount, 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all curricula</div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <span className="font-medium">{feedbackMessage}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, instructor, or topic..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="ALL_LEVELS">All Levels Welcome</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="UNPUBLISHED">Unpublished</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Filter Badges & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-600 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> of{" "}
            <span className="font-bold text-slate-900">{courses.length}</span> courses
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Table */}
      <CourseTable
        courses={filteredCourses}
        onTogglePublish={handleTogglePublish}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
}
