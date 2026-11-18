"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { CourseEnrollment, EnrollmentStatus } from "../../types/resource";
import { EnrollmentStatusBadge } from "../common/resource-status-badge";
import {
  GraduationCap,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Mail,
  BookOpen,
  ArrowLeft,
  CreditCard,
  User,
  ShieldCheck,
  Phone,
  AlertCircle,
} from "lucide-react";

interface EnrollmentDetailViewProps {
  enrollment: CourseEnrollment;
}

export function EnrollmentDetailView({
  enrollment: initialEnrollment,
}: EnrollmentDetailViewProps) {
  const [enrollment, setEnrollment] =
    useState<CourseEnrollment>(initialEnrollment);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleStatusChange = (newStatus: EnrollmentStatus) => {
    setEnrollment((prev) => ({
      ...prev,
      enrollmentStatus: newStatus,
      lastActiveDate: new Date().toISOString(),
    }));
    setFeedbackMessage(
      `Enrollment status updated to "${newStatus}". (Demo only - not persisted to backend)`
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleUpdateProgress = (increment: number) => {
    setEnrollment((prev) => {
      const nextCompleted = Math.min(
        prev.totalLessonsCount,
        Math.max(0, prev.completedLessonsCount + increment)
      );
      const nextPercentage = Math.round(
        (nextCompleted / prev.totalLessonsCount) * 100
      );
      const nextStatus: EnrollmentStatus =
        nextPercentage === 100 ? "COMPLETED" : "ACTIVE";
      return {
        ...prev,
        completedLessonsCount: nextCompleted,
        progressPct: nextPercentage,
        enrollmentStatus: nextStatus,
        lastActiveDate: new Date().toISOString(),
      };
    });
    setFeedbackMessage(
      "Learner course progress adjusted. (Demo only - not persisted)"
    );
    setTimeout(() => setFeedbackMessage(null), 3500);
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
            href="/admin/resources/enrollments"
            className="hover:text-[#5B46F6] transition-colors"
          >
            Enrollments
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs">
            {enrollment.learnerName}
          </span>
        </div>

        <Link
          href="/admin/resources/enrollments"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Enrollments
        </Link>
      </div>

      {/* Demo Notification Banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/30 p-3.5 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#5B46F6] animate-pulse" />
          <span className="font-semibold text-[#5B46F6]">
            LMS Student Record:
          </span>
          <span>DEMO DATA — Not connected to live learning services.</span>
        </div>
        <div className="text-slate-500 font-medium">
          Enrollment ID: {enrollment.id}
        </div>
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

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Profile & Status Showcase */}
        <div className="lg:col-span-5 space-y-6" data-aos="fade-right">
          {/* Student Profile Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-indigo-500/5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Learner Profile
              </span>
              <EnrollmentStatusBadge status={enrollment.enrollmentStatus} />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-[#EAE6F7] border-2 border-indigo-200 flex items-center justify-center font-bold text-xl text-[#5B46F6] shrink-0">
                {enrollment.learnerName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {enrollment.learnerName}
                </h2>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{enrollment.learnerEmail}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{enrollment.learnerPhone}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Learner ID: {enrollment.learnerId}
                </div>
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Manage Enrollment Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange("ACTIVE")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                    enrollment.enrollmentStatus === "ACTIVE"
                      ? "bg-indigo-50 border-[#5B46F6] text-[#5B46F6]"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("COMPLETED")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                    enrollment.enrollmentStatus === "COMPLETED"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Completed
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("CANCELLED")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                    enrollment.enrollmentStatus === "CANCELLED"
                      ? "bg-rose-50 border-rose-500 text-rose-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Cancelled
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("SUSPENDED")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                    enrollment.enrollmentStatus === "SUSPENDED"
                      ? "bg-slate-100 border-slate-400 text-slate-800"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Suspended
                </button>
              </div>
            </div>
          </div>

          {/* Timeline & Metadata */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Enrollment Timeline
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Enrolled On:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Last Activity:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(enrollment.lastActiveDate).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Enrollment Type:</span>
                <span className="font-semibold text-slate-800">
                  {enrollment.enrollmentType}
                </span>
              </div>
              {enrollment.paymentReference && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Payment Reference:</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {enrollment.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Course Program & Learning Progress */}
        <div className="lg:col-span-7 space-y-6" data-aos="fade-left">
          {/* Course Details Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5B46F6] uppercase tracking-wider">
                <BookOpen className="h-4 w-4" /> Enrolled Course Program
              </div>
              <Link
                href={`/admin/resources/courses/${enrollment.courseId}`}
                className="text-xs font-semibold text-[#5B46F6] hover:underline"
              >
                View Full Course Page &rarr;
              </Link>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {enrollment.courseTitle}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Course ID: {enrollment.courseId}
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Curriculum Completion
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {enrollment.completedLessonsCount} of{" "}
                    {enrollment.totalLessonsCount} Lessons Completed
                  </p>
                </div>
                <div className="text-2xl font-black text-[#5B46F6]">
                  {enrollment.progressPct}%
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    enrollment.progressPct === 100
                      ? "bg-emerald-500"
                      : "bg-[#5B46F6]"
                  }`}
                  style={{ width: `${enrollment.progressPct}%` }}
                />
              </div>

              {/* Progress adjustment buttons (Demo Simulator) */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Simulate lesson completion:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateProgress(-1)}
                    disabled={enrollment.completedLessonsCount <= 0}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-50 transition"
                  >
                    -1 Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateProgress(1)}
                    disabled={
                      enrollment.completedLessonsCount >=
                      enrollment.totalLessonsCount
                    }
                    className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-[#5B46F6] disabled:opacity-50 transition"
                  >
                    +1 Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateProgress(enrollment.totalLessonsCount)
                    }
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition shadow-sm"
                  >
                    Complete 100%
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity & Note Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#5B46F6]" /> Admin Notes & Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This learner was enrolled through the BDSisters.org platform
              membership program. Learner credentials and ID compliance have
              been validated under the Step 5 Profile verification standard.
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Notice:</span> All progress updates
                and certificate triggers in this interface are frontend demonstrations
                and will connect to live student data persistence upon Step 12
                deployment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
