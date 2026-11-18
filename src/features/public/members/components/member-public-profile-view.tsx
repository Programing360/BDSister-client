"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  Calendar,
  Lock,
  User,
  ExternalLink,
} from "lucide-react";
import { FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import type { PublicMemberProfile } from "@/types/profile";

interface MemberPublicProfileViewProps {
  member: PublicMemberProfile;
}

export function MemberPublicProfileView({ member }: MemberPublicProfileViewProps) {
  if (member.isRestricted) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200/80 shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">Private Profile</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            This sister has chosen to keep her profile visible only to authenticated members of the BDSisters community.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/members"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
          >
            Back to Directory
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-[#5B46F6] text-white text-xs font-semibold hover:bg-[#4C38E0]"
          >
            Sign In to View
          </Link>
        </div>
      </div>
    );
  }

  const locationString = [
    member.location?.address,
    member.location?.district || member.location?.city,
    member.location?.division,
    member.location?.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#5B46F6] transition-colors px-3 py-1.5 rounded-xl hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sisterhood Directory</span>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200/80">
        {/* Cover Banner */}
        <div className="h-44 sm:h-60 w-full relative bg-gradient-to-r from-[#5B46F6] via-[#7B61FF] to-[#C084FC]">
          {member.coverImage && (
            <img
              src={member.coverImage}
              alt={member.displayName}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info Header */}
        <div className="px-6 sm:px-8 pb-8 relative pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-20 sm:-mt-24 mb-6">
            {/* Avatar */}
            <div className="relative inline-block">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.displayName}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-purple-50 text-[#5B46F6] border-4 border-white shadow-xl flex items-center justify-center font-bold text-4xl">
                  {member.displayName?.charAt(0)?.toUpperCase() || <User className="w-16 h-16" />}
                </div>
              )}
              {member.isVerified && (
                <div
                  className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white"
                  title="Verified Sister"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Badges / Membership */}
            <div className="flex flex-wrap items-center gap-2">
              {member.isVerified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Sister</span>
                </span>
              )}
              {member.membershipTier && member.membershipTier !== "FREE" && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#5B46F6] border border-purple-200">
                  {member.membershipTier} Member
                </span>
              )}
            </div>
          </div>

          {/* Name & Headline */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {member.displayName}
            </h1>
            {member.headline && (
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                {member.headline}
              </p>
            )}
            {locationString && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
                <MapPin className="w-4 h-4 text-[#5B46F6] shrink-0" />
                <span>{locationString}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {member.bio}
              </p>
            </div>
          )}

          {/* Contact Details (Respecting Privacy Redactions) */}
          {(member.email || member.phone) && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-600">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 hover:text-[#5B46F6] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#5B46F6]" />
                  <span>{member.email}</span>
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-2 hover:text-[#5B46F6] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#5B46F6]" />
                  <span>{member.phone}</span>
                </a>
              )}
            </div>
          )}

          {/* Social Links */}
          {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-2.5">
              {member.socialLinks.linkedin && (
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#5B46F6] hover:bg-purple-50/50 transition-colors"
                  title="LinkedIn Profile"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
              {member.socialLinks.github && (
                <a
                  href={member.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#5B46F6] hover:bg-purple-50/50 transition-colors"
                  title="GitHub Profile"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {member.socialLinks.website && (
                <a
                  href={member.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#5B46F6] hover:bg-purple-50/50 transition-colors"
                  title="Personal Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {member.socialLinks.facebook && (
                <a
                  href={member.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#5B46F6] hover:bg-purple-50/50 transition-colors"
                  title="Facebook"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
              )}
              {member.socialLinks.instagram && (
                <a
                  href={member.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#5B46F6] hover:bg-purple-50/50 transition-colors"
                  title="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {member.socialLinks.twitter && (
                <a
                  href={member.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#5B46F6] hover:bg-purple-50/50 transition-colors"
                  title="X / Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Two Column Grid for Skills, Experience, Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((sk) => (
                <span
                  key={sk.id || sk.name}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-xs font-semibold text-[#5B46F6]"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {member.interests && member.interests.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Sisterhood Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Career Experience */}
        {member.experience && member.experience.length > 0 && (
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#5B46F6]" />
              <span>Career Experience</span>
            </h2>
            <div className="space-y-4 divide-y divide-gray-100">
              {member.experience.map((exp) => (
                <div key={exp.id} className="pt-4 first:pt-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#5B46F6]">{exp.company}</p>
                  {exp.description && (
                    <p className="text-xs text-gray-600 pt-1 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {member.education && member.education.length > 0 && (
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-200/80 space-y-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#5B46F6]" />
              <span>Education & Qualifications</span>
            </h2>
            <div className="space-y-4 divide-y divide-gray-100">
              {member.education.map((edu) => (
                <div key={edu.id} className="pt-4 first:pt-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} – {edu.current ? "Present" : edu.endDate || "Completed"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#5B46F6]">{edu.institution}</p>
                  {edu.fieldOfStudy && (
                    <p className="text-xs text-gray-500">Major: {edu.fieldOfStudy}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
