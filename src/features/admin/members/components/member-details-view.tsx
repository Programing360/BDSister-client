"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  UserCheck,
  Award,
  BookOpen,
  FileText,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  UserPlus,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { BackendMember } from "./members-list-view";
import { MemberActionDialog, MemberActionType } from "./member-action-dialog";

interface FullMemberProfile extends BackendMember {
  bio?: string;
  headline?: string;
  whatsapp?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
  skills?: Array<{ name: string; level?: string }>;
  subjectsOfInterest?: string[];
  identityVerification?: {
    verificationStatus?: string;
    documentType?: string;
    docType?: string;
    idNumber?: string;
    nidOrPassportUrl?: string;
    backImageUrl?: string;
    submittedAt?: string;
    auditLog?: Array<{
      action: string;
      timestamp: string;
      notes?: string;
    }>;
  };
}

interface MemberDetailsViewProps {
  userId: string;
}

export function MemberDetailsView({ userId }: MemberDetailsViewProps) {
  const [member, setMember] = useState<FullMemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogAction, setDialogAction] = useState<MemberActionType | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  console.log(member)

  const fetchMemberDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // GET /api/admin/users/:userId (includes nidOrPassportUrl & logs audit access)
      const res = await apiClient.get<{ data?: FullMemberProfile }>(
        API_ENDPOINTS.admin.userDetail(userId)
      );
      const raw = res as unknown as { data?: FullMemberProfile };
      console.log(raw.data);
      if (raw.data) {
        setMember(raw.data);
      } else {
        throw new Error("Member profile not found.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load member details.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchMemberDetails();
  }, [userId, fetchMemberDetails]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-[#5B9891]/20 bg-white space-y-3">
        <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
        <p className="text-xs font-semibold text-gray-600">
          Loading member profile & secure verification documents...
        </p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5B9891] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Members
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error || "Member not found."}</p>
        </div>
      </div>
    );
  }

  const referrerInfo =
    typeof member.referredBy === "object" && member.referredBy !== null
      ? `${member.referredBy.fullName || "Member"} (${member.referredBy.email || ""})`
      : member.referredBy || "No referrer recorded";

  const statusBadgeClass =
    member.status === "Active"
      ? "bg-[#5B9891]/15 text-[#467A74] border-[#5B9891]/30"
      : member.status === "Pending"
        ? "bg-[#F2B55D]/25 text-[#D98408] border-[#F2B55D]/50"
        : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#5B9891] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Members Directory
        </Link>
        <span className="font-mono text-[11px] font-semibold px-3 py-1 rounded-lg bg-[#FAF8F5] border border-gray-200 text-gray-600">
          ID: {member._id}
        </span>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#5B9891]/25 via-[#F7DFC7]/60 to-[#F2B55D]/25" />

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-10 gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-gray-100 overflow-hidden">
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={member.fullName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#5B9891] flex items-center justify-center text-white text-2xl font-bold">
                    {(member.fullName || "B").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{member.fullName}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {member.headline || "BDSisters Community Member"}
                </p>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDialogAction("UPDATE_STATUS")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#5B9891] text-white hover:bg-[#467A74] transition shadow-2xs"
              >
                <UserCheck className="w-4 h-4" /> Approve / Update Status
              </button>

              <button
                type="button"
                onClick={() => setDialogAction("UPDATE_ROLE")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F7DFC7] text-[#D98408] hover:bg-[#F2B55D]/40 border border-[#D98408]/30 transition"
              >
                <Award className="w-4 h-4" /> Assign Role ({member.role})
              </button>
            </div>
          </div>

          {/* Status & Role Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-gray-100">
            <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${statusBadgeClass}`}>
              Account: {member.status}
            </span>
            <span className="rounded-full border border-[#D98408]/30 bg-[#F7DFC7]/60 px-3 py-0.5 text-xs font-bold text-[#D98408]">
              Role: {member.role}
            </span>
            {member.profileStatus && (
              <span className="rounded-full border border-gray-200 bg-[#FAF8F5] px-3 py-0.5 text-xs font-semibold text-gray-700">
                Profile Status: {member.profileStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Profile & Referral Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact, Location & Referrer */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Member Details & Referral Attribution
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#5B9891]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-gray-400 block">Email Address</span>
                  <span className="font-semibold text-gray-900">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#5B9891]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-gray-400 block">Phone / WhatsApp</span>
                  <span className="font-semibold text-gray-900">
                    {member.phone || member.whatsapp || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#5B9891]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-gray-400 block">Location (District, State, Country)</span>
                  <span className="font-semibold text-gray-900">
                    {[member.district, member.state, member.country].filter(Boolean).join(", ") ||
                      "Bangladesh"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#5B9891]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-gray-400 block">Joined Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(member.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Referrer Box (Requirement: All profilers must have referees) */}
              <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-[#F7DFC7] bg-[#FAF8F5] p-3.5">
                <div className="p-2 rounded-lg bg-[#F7DFC7] text-[#D98408]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#D98408] block">
                    Referred By (Existing Sister Referee)
                  </span>
                  <span className="font-bold text-gray-900">{referrerInfo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Skills */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <BookOpen className="w-4 h-4 text-[#5B9891]" />
              <h2 className="text-base font-bold text-gray-900">Profile Summary & Skills</h2>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {member.bio || "No profile summary added yet."}
            </p>

            {member.skills && member.skills.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase block mb-2">
                  Skills & Competencies
                </span>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#5B9891]/10 text-[#467A74] border border-[#5B9891]/20"
                    >
                      {skill.name} {skill.level ? `• ${skill.level}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Private NID/Passport Verification & Audit Trail */}
        <div className="space-y-6">
          {/* Private NID / Passport Document Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#D98408]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D98408]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Private ID Verification
                </h3>
              </div>
              <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                {member.identityVerification?.verificationStatus || "Pending"}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-100">
              Confidential: Only authorized administrators can inspect NID/Passport documents. Access is logged.
            </p>

            {/* Document Metadata (docType & idNumber) */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/80 p-3 rounded-xl border border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Document Type
                </span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md font-bold text-[11px] bg-[#5B9891]/10 text-[#467A74]">
                  {member.identityVerification?.docType === "PASSPORT"
                    ? "Passport"
                    : member.identityVerification?.docType === "ACADEMIC"
                    ? "Academic / Student ID"
                    : "National ID (NID)"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Document / ID Number
                </span>
                <span className="font-semibold text-gray-900 tracking-wider">
                  {member.identityVerification?.idNumber || "Not Provided"}
                </span>
              </div>
            </div>

            {/* Document Images (Front & Back) */}
            {member.identityVerification?.nidOrPassportUrl || member.identityVerification?.backImageUrl ? (
              <div className="space-y-4">
                {/* Front Image */}
                {member.identityVerification?.nidOrPassportUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5B9891]" />
                        Front Side
                      </span>
                      <a
                        href={member.identityVerification.nidOrPassportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#5B9891] hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Full View
                      </a>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <img
                        src={member.identityVerification.nidOrPassportUrl}
                        alt="Front Side Document"
                        className="w-full max-h-52 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Back Image */}
                {member.identityVerification?.backImageUrl && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D98408]" />
                        Back Side
                      </span>
                      <a
                        href={member.identityVerification.backImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#D98408] hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Full View
                      </a>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <img
                        src={member.identityVerification.backImageUrl}
                        alt="Back Side Document"
                        className="w-full max-h-52 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-400">
                No NID or Passport file uploaded yet.
              </div>
            )}
          </div>

          {/* Verification Audit Trail */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="w-4 h-4 text-[#5B9891]" />
              <h3 className="text-sm font-bold text-gray-900">Document Access & Status Logs</h3>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {member.identityVerification?.auditLog &&
                member.identityVerification.auditLog.length > 0 ? (
                member.identityVerification.auditLog
                  .slice()
                  .reverse()
                  .map((log, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-100 text-[11px] space-y-0.5"
                    >
                      <p className="font-bold text-gray-800">{log.action}</p>
                      {log.notes && <p className="text-gray-500">{log.notes}</p>}
                      <p className="text-[10px] text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">
                  No audit logs recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status & Role Modal */}
      {dialogAction && (
        <MemberActionDialog
          isOpen={true}
          onClose={() => setDialogAction(null)}
          member={member}
          actionType={dialogAction}
          onSuccess={async (msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 4000);
            await fetchMemberDetails();
          }}
        />
      )}
    </div>
  );
}