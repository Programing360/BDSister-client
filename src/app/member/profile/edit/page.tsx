import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { getProfileByUserId } from "@/lib/services/profile-service";
import { ProfileEditForm } from "@/features/profile/components";

export const metadata: Metadata = {
  title: "Edit Profile | BDSisters",
  description: "Update your personal story, career experience, education, and connected links.",
};

export default async function MemberProfileEditPage() {
  const session = await requireServerSession("/member/profile/edit");
  const profile = await getProfileByUserId(session.user.id, {
    displayName: session.user.name,
    avatar: session.user.image,
  });

  return <ProfileEditForm user={session.user} profile={profile} />;
}
