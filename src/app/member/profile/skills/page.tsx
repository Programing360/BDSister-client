import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { getProfileByUserId } from "@/lib/services/profile-service";
import { SkillsManager } from "@/features/profile/components";

export const metadata: Metadata = {
  title: "Skills & Interests | BDSisters",
  description: "Manage your professional skills, expertise level, languages, and community interest tags.",
};

export default async function MemberProfileSkillsPage() {
  const session = await requireServerSession("/member/profile/skills");
  const profile = await getProfileByUserId(session.user.id);

  return (
    <SkillsManager
      initialSkills={profile.skills}
      initialInterests={profile.interests}
      initialLanguages={profile.languages}
    />
  );
}
