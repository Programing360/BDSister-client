"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type {
  CourseEnrollment,
  EnrollmentStatus,
} from "../../types/resource";
import { DEMO_ENROLLMENTS } from "../../data/mock-resources";
import { EnrollmentTable } from "./enrollment-table";
import {
  Users,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  GraduationCap,
  Award,
  Clock,
  ArrowLeft,
} from "lucide-react";

interface EnrollmentsListViewProps {
  initialEnrollments?: CourseEnrollment[];
}

export function EnrollmentsListView({
  initialEnrollments,
}: EnrollmentsListViewProps) {
  const [enrollments, setEnrollments] =
    useState<CourseEnrollment[]>(initialEnrollments || DEMO_ENROLLMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enr) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUser =
          enr.learnerName.toLowerCase().includes(q) ||
          enr.learnerEmail.toLowerCase().includes(q);
        const matchesCourse = enr.courseTitle.toLowerCase().includes(q);
        const matchesRef = enr.paymentReference?.toLowerCase().includes(q);
        if (!matchesUser && !matchesCourse && !matchesRef) return false;
      }
      if (statusFilter !== "ALL" && enr.enrollmentStatus !== statusFilter) return false;
      if (paymentFilter !== "ALL" && enr.paymentStatus !== paymentFilter) return false;
      return true;
    });
  }, [enrollments, searchQuery, statusFilter, paymentFilter]);

  const handleStatusChange = (id: string, newStatus: EnrollmentStatus) => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enrollmentStatus: newStatus } : e))
    );
    setFeedbackMessage(
      `Enrollment status changed to "${newStatus}". (Demo only - not persisted to backend)`
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "ALL" ||
    paymentFilter !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
  };

  const completedCount = useMemo(
    () => enrollments.filter((e) => e.enrollmentStatus === "COMPLETED").length,
    [enrollments]
  );
  const activeCount = useMemo(
    () => enrollments.filter((e) => e.enrollmentStatus === "ACTIVE").length,
    [enrollments]
  );
  const paidCount = useMemo(
    () => enrollments.filter((e) => e.paymentStatus === "PAID").length,
    [enrollments]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
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
              Courses
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Enrollments</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE6F7] text-[#5B46F6]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Course Enrollment Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Track member course registrations, syllabus progress, completion metrics, and certificate releases.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/resources/courses"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Link>
        </div>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-pink-50/20 p-3.5 text-xs text-indigo-950 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-semibold text-[#5B46F6]">
            LMS Student Administration:
          </span>
          <span>DEMO DATA — Not connected to live learning services.</span>
        </div>
        <span className="text-slate-500 font-medium hidden sm:inline">
          {enrollments.length} Total Registrations
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5" data-aos="fade-up">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Users className="h-4 w-4 text-[#5B46F6]" /> Total Enrollments
          </div>
          <div className="text-xl font-bold text-slate-900">
            {enrollments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">All registered learners</div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Clock className="h-4 w-4 text-indigo-600" /> Active Learners
          </div>
          <div className="text-xl font-bold text-slate-900">{activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Currently studying</div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Completed
          </div>
          <div className="text-xl font-bold text-slate-900">{completedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">100% finished syllabus</div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Award className="h-4 w-4 text-purple-600" /> Paid Enrollments
          </div>
          <div className="text-xl font-bold text-slate-900">{paidCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">ZiniPay validated</div>
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

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by learner name, email, or course title..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Payment */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#5B46F6] focus:outline-none transition shadow-sm"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PAID">Paid</option>
              <option value="FREE">Free</option>
              <option value="PENDING">Pending Payment</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* Badges & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-600 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredEnrollments.length}</span> of{" "}
            <span className="font-bold text-slate-900">{enrollments.length}</span> records
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

      {/* Enrollments Table */}
      <EnrollmentTable
        enrollments={filteredEnrollments}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
