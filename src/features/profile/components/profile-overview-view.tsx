"use client";

import React, { useState } from "react";
import { ProfileHeader } from "./profile-header";
import { ProfileCompletionWidget } from "./profile-completion-widget";
import { ProfileAboutCard } from "./profile-about-card";
import { ProfileExperienceCard } from "./profile-experience-card";
import { ProfileEducationCard } from "./profile-education-card";
import { ProfileSkillsCard } from "./profile-skills-card";
import { ProfileContactCard } from "./profile-contact-card";
import { ProfilePreviewModal } from "./profile-preview-modal";
import type { MemberProfileDocument } from "@/types/profile";
import type { AuthUser } from "@/types/auth";
import type { ProfileCompletionReport } from "@/features/member/types/dashboard";

interface ProfileOverviewViewProps {
  user: AuthUser;
  profile: MemberProfileDocument;
  completion: ProfileCompletionReport;
}

export function ProfileOverviewView({ user, profile, completion }: ProfileOverviewViewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* 1. Profile Header Hero */}
      <ProfileHeader
        user={user}
        profile={profile}
        onOpenPreview={() => setIsPreviewOpen(true)}
      />

      {/* 2. Profile Health & Completeness Widget */}
      <ProfileCompletionWidget report={completion} />

      {/* 3. Main Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (2/3 on desktop) - Career, Education, Bio */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <ProfileAboutCard bio={profile.bio} />
          <ProfileExperienceCard experience={profile.experience} />
          <ProfileEducationCard education={profile.education} />
        </div>

        {/* Right Column (1/3 on desktop) - Contact & Skills */}
        <div className="space-y-6 sm:space-y-8">
          <ProfileContactCard
            email={user.email}
            phone={profile.phone}
            location={profile.location}
            privacySettings={profile.privacySettings}
          />
          <ProfileSkillsCard
            skills={profile.skills}
            interests={profile.interests}
            languages={profile.languages}
          />
        </div>
      </div>

      {/* 4. Live Privacy Perspective Preview Modal */}
      <ProfilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        user={user}
        profile={profile}
      />
    </div>
  );
}
