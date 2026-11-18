"use client";

import React from "react";
import Link from "next/link";
import type { CourseEnrollment, EnrollmentStatus } from "../../types/resource";
import { EnrollmentStatusBadge } from "../common/resource-status-badge";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Award,
  MoreVertical,
  Mail,
  CreditCard,
  Phone,
} from "lucide-react";

interface EnrollmentTableProps {
  enrollments: CourseEnrollment[];
  onStatusChange?: (id: string, newStatus: EnrollmentStatus) => void;
}

export function EnrollmentTable({
  enrollments,
  onStatusChange,
}: EnrollmentTableProps) {
  if (enrollments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-3 text-sm font-bold text-slate-800">
          No course enrollments found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          No learners match your current filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4">Learner & Member</th>
              <th className="py-3.5 px-4">Course Program</th>
              <th className="py-3.5 px-4">Learning Progress</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Enrolled / Last Active</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.map((enr) => (
              <tr key={enr.id} className="hover:bg-slate-50/60 transition">
                {/* Learner */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden bg-[#EAE6F7] border border-indigo-100 flex items-center justify-center font-bold text-[#5B46F6] shrink-0">
                      {enr.learnerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{enr.learnerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {enr.learnerEmail}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Course Program */}
                <td className="py-3 px-4 max-w-[200px]">
                  <Link
                    href={`/admin/resources/courses/${enr.courseId}`}
                    className="font-semibold text-slate-800 hover:text-[#5B46F6] transition line-clamp-2"
                  >
                    {enr.courseTitle}
                  </Link>
                  {enr.paymentReference && (
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                      <CreditCard className="h-2.5 w-2.5" /> Ref: {enr.paymentReference}
                    </div>
                  )}
                </td>

                {/* Progress bar */}
                <td className="py-3 px-4 w-44">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                      <span>{enr.progressPct}%</span>
                      <span className="text-slate-400 font-normal">
                        {enr.completedLessonsCount}/{enr.totalLessonsCount}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          enr.progressPct === 100
                            ? "bg-emerald-500"
                            : enr.progressPct > 50
                            ? "bg-[#5B46F6]"
                            : "bg-indigo-400"
                        }`}
                        style={{ width: `${enr.progressPct}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <EnrollmentStatusBadge status={enr.enrollmentStatus} />
                </td>

                {/* Dates */}
                <td className="py-3 px-4 text-slate-500 text-[11px]">
                  <div>Enrolled: {new Date(enr.enrollmentDate).toLocaleDateString()}</div>
                  <div className="text-slate-400">
                    Active: {new Date(enr.lastActiveDate).toLocaleDateString()}
                  </div>
                </td>

                {/* Payment */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                      enr.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : enr.paymentStatus === "FREE"
                        ? "bg-indigo-50 text-[#5B46F6] border border-indigo-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {enr.paymentStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/resources/enrollments/${enr.id}`}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#5B46F6] hover:bg-slate-50 transition"
                      title="View Enrollment Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>

                    {onStatusChange && (
                      <select
                        aria-label="Update Enrollment Status"
                        value={enr.enrollmentStatus}
                        onChange={(e) =>
                          onStatusChange(enr.id, e.target.value as EnrollmentStatus)
                        }
                        className="rounded-lg border border-slate-200 bg-white py-1 px-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#5B46F6]"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="SUSPENDED">Suspended</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {enrollments.map((enr) => (
          <div
            key={enr.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-[#EAE6F7] border border-indigo-100 flex items-center justify-center font-bold text-[#5B46F6] shrink-0">
                  {enr.learnerName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    {enr.learnerName}
                  </div>
                  <div className="text-[11px] text-slate-500">{enr.learnerEmail}</div>
                </div>
              </div>
              <EnrollmentStatusBadge status={enr.enrollmentStatus} />
            </div>

            <div className="border-t border-slate-100 pt-2 text-xs">
              <div className="font-semibold text-slate-800 line-clamp-1">
                {enr.courseTitle}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Enrolled: {new Date(enr.enrollmentDate).toLocaleDateString()}</span>
                <span>Active: {new Date(enr.lastActiveDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Progress: {enr.progressPct}%</span>
                <span className="text-slate-400 font-normal">
                  {enr.completedLessonsCount}/{enr.totalLessonsCount} Lessons
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5B46F6]"
                  style={{ width: `${enr.progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-600">
                Payment: {enr.paymentStatus}
              </span>

              <Link
                href={`/admin/resources/enrollments/${enr.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#5B46F6] text-white text-xs font-semibold hover:bg-[#4a36e2] transition"
              >
                <Eye className="h-3 w-3" /> View Record
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
