"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Briefcase,
  ShoppingBag,
  ExternalLink,
  Edit,
  UserX,
  UserCheck,
  Award,
  BookOpen,
  GraduationCap,
  Globe,
  FileText,
  AlertCircle,
  Plus,
} from "lucide-react";
import { AdminMemberDetail, AdminAccountStatus } from "../types/admin-member";
import {
  AccountStatusBadge,
  MembershipBadge,
  EmailVerificationBadge,
  IdentityVerificationBadge,
} from "./member-status-badges";
import { MemberActionDialog, AdminActionType } from "./member-action-dialog";

interface MemberDetailsViewProps {
  member: AdminMemberDetail;
}

export function MemberDetailsView({ member }: MemberDetailsViewProps) {
  // Local state for interactive demo actions
  const [currentStatus, setCurrentStatus] = useState<AdminAccountStatus>(member.accountStatus);
  const [currentMembership, setCurrentMembership] = useState(member.membershipType);
  const [dialogAction, setDialogAction] = useState<AdminActionType | null>(null);
  const [adminNotes, setAdminNotes] = useState(member.adminNotes || []);
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleActionSuccess = (action: AdminActionType, newStatus: string, reason?: string) => {
    if (action === "SUSPEND" || action === "REACTIVATE" || action === "BAN") {
      setCurrentStatus(newStatus as AdminAccountStatus);
      if (reason) {
        setAdminNotes((prev) => [
          {
            id: `an_sim_${Date.now()}`,
            author: "Admin Auditor (Demo)",
            note: `${action} applied: ${reason}`,
            createdAt: "Just now",
          },
          ...prev,
        ]);
      }
    } else if (action === "CHANGE_MEMBERSHIP") {
      setCurrentMembership(newStatus as "FREE" | "PAID");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsAddingNote(true);
    setTimeout(() => {
      setAdminNotes((prev) => [
        {
          id: `an_sim_${Date.now()}`,
          author: "Admin User (You)",
          note: newNoteText.trim(),
          createdAt: "Just now",
        },
        ...prev,
      ]);
      setNewNoteText("");
      setIsAddingNote(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top back navigation & quick stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">System ID:</span>
          <span className="font-mono text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {member.id}
          </span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        {/* Cover pattern */}
        <div className="h-28 bg-linear-to-r from-[#5B46F6]/20 via-[#7366F7]/15 to-[#EAE6F7] dark:to-gray-800" />

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 gap-4">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-md border border-gray-100 dark:border-gray-700">
                <div className="w-full h-full rounded-xl bg-linear-to-br from-[#5B46F6] to-[#7366F7] flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h1>
                  <span className="font-mono text-xs font-bold text-[#5B46F6] px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                    {member.memberId}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {member.headline || "Registered BDSisters Community Member"}
                </p>
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0">
              <Link
                href={`/admin/members/${member.memberId || member.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </Link>

              {currentStatus === "ACTIVE" ? (
                <button
                  type="button"
                  onClick={() => setDialogAction("SUSPEND")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/40 transition"
                >
                  <UserX className="w-3.5 h-3.5" /> Suspend
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDialogAction("REACTIVATE")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Reactivate
                </button>
              )}

              <button
                type="button"
                onClick={() => setDialogAction("CHANGE_MEMBERSHIP")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-[#5B46F6] hover:bg-indigo-100 border border-indigo-200/60 transition"
              >
                <Award className="w-3.5 h-3.5" /> Change Tier
              </button>
            </div>
          </div>

          {/* Badges strip */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <AccountStatusBadge status={currentStatus} />
            <MembershipBadge type={currentMembership} planName={member.membershipPlan} />
            <EmailVerificationBadge verified={member.emailVerified} />
            <IdentityVerificationBadge status={member.verificationStatus} />
          </div>
        </div>
      </div>

      {/* Grid Layout: Details & Left Column vs Audit / Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Information panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-xs">
              <span className="text-xs text-gray-500 block">Profile Health</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.profileCompletion}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5B46F6]"
                  style={{ width: `${member.profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-xs">
              <span className="text-xs text-gray-500 block">Businesses</span>
              <div className="mt-1 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.businessesCount}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Registered stores</span>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-xs">
              <span className="text-xs text-gray-500 block">Market Orders</span>
              <div className="mt-1 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gray-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.ordersCount}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Platform purchases</span>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-xs">
              <span className="text-xs text-gray-500 block">Last Active</span>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {member.lastLogin}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Authenticated</span>
            </div>
          </div>

          {/* Contact & Location Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Contact & Location Records
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Email Address</span>
                  <span className="font-mono">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Phone Number</span>
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Location</span>
                  <span>
                    {[member.location?.city, member.location?.district, member.location?.country]
                      .filter(Boolean)
                      .join(", ") || "Bangladesh"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Registration Date</span>
                  <span className="font-mono">{member.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Bio & Professional Narrative */}
          {member.bio && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <BookOpen className="w-4 h-4 text-[#5B46F6]" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Profile Narrative & Bio
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {member.bio}
              </p>
            </div>
          )}

          {/* Experience & Education */}
          {(member.experience?.length || member.education?.length) ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-6">
              {/* Experience */}
              {member.experience && member.experience.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-[#5B46F6]" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Professional Experience
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {member.experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {exp.role}
                            </span>
                            <span className="text-gray-500 block">{exp.company}</span>
                          </div>
                          <span className="text-gray-400 font-mono text-[11px]">
                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-1.5 text-gray-600 dark:text-gray-300">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {member.education && member.education.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-[#5B46F6]" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Education Credentials
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {member.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {edu.degree} in {edu.fieldOfStudy}
                            </span>
                            <span className="text-gray-500 block">{edu.institution}</span>
                          </div>
                          <span className="text-gray-400 font-mono text-[11px]">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Skills & Languages */}
          {(member.skills?.length || member.languages?.length) ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                Skills & Communication Languages
              </h2>

              {member.skills && member.skills.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                      >
                        {skill.name} • {skill.level}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.languages && member.languages.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Spoken Languages
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {member.languages.map((lang, index) => (
                      <span
                        key={`${lang.language}-${index}`}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] border border-indigo-100 dark:border-indigo-900/40"
                      >
                        {lang.language} ({lang.proficiency})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Right 1 Column: Verification details, Subscription, and Admin Notes */}
        <div className="space-y-6">
          {/* Identity Verification Summary Box */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#5B46F6]" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Identity Verification
                </h3>
              </div>
              <IdentityVerificationBadge status={member.verificationStatus} />
            </div>

            {member.identityVerificationDetails ? (
              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Document Type:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {member.identityVerificationDetails.documentType.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Masked ID:</span>
                  <span className="font-mono text-gray-900 dark:text-white font-medium">
                    {member.identityVerificationDetails.documentNumberMasked}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted:</span>
                  <span>{member.identityVerificationDetails.submittedAt}</span>
                </div>
                {member.identityVerificationDetails.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reviewed By:</span>
                    <span>{member.identityVerificationDetails.reviewedBy}</span>
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    href={`/admin/verifications/${member.identityVerificationDetails.submissionId}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#5B46F6]/10 text-[#5B46F6] hover:bg-[#5B46F6]/20 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Inspect Verification
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-gray-400 space-y-1">
                <AlertCircle className="w-6 h-6 mx-auto text-gray-300 dark:text-gray-700" />
                <p>No identity documents submitted.</p>
              </div>
            )}
          </div>

          {/* Membership Subscription Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Subscription Plan
              </h3>
              <MembershipBadge type={currentMembership} planName={member.membershipPlan} />
            </div>

            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Current Plan:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {currentMembership === "PAID" ? "Pro Entrepreneur Tier" : "Free Community Tier"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Billing Rate:</span>
                <span className="font-mono text-gray-900 dark:text-white">
                  {currentMembership === "PAID" ? "৳ 1,500 / year" : "৳ 0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Auto Renewal:</span>
                <span>{currentMembership === "PAID" ? "Enabled (ZiniPay Tokenized)" : "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Internal Audit Notes Box */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5B46F6]" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Internal Admin Notes
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                {adminNotes.length} logs
              </span>
            </div>

            {/* List of notes */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {adminNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {note.author}
                    </span>
                    <span className="text-gray-400 font-mono">{note.createdAt}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {note.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Add note mini-form */}
            <form onSubmit={handleAddNote} className="pt-2 space-y-2">
              <textarea
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Log internal note or moderation flag..."
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6] placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isAddingNote || !newNoteText.trim()}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                {isAddingNote ? "Recording..." : "Add Admin Note"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Action Modal */}
      {dialogAction && (
        <MemberActionDialog
          isOpen={true}
          onClose={() => setDialogAction(null)}
          actionType={dialogAction}
          memberId={member.memberId || member.id}
          memberName={member.name}
          memberEmail={member.email}
          currentStatus={currentStatus}
          currentMembership={currentMembership}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
}
