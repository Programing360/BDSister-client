import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { getProfileByUserId } from "@/lib/services/profile-service";
import { PrivacySettingsForm } from "@/features/profile/components";

export const metadata: Metadata = {
  title: "Privacy Settings | BDSisters",
  description: "Manage your profile visibility, contact disclosure, and privacy preferences.",
};

export default async function MemberProfilePrivacyPage() {
  const session = await requireServerSession("/member/profile/privacy");
  const profile = await getProfileByUserId(session.user.id);

  return <PrivacySettingsForm initialSettings={profile.privacySettings} />;
}
