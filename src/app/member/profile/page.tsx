import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { getProfileByUserId, calculateDetailedProfileCompletion } from "@/lib/services/profile-service";
import { ProfileOverviewView } from "@/features/profile/components";

export const metadata: Metadata = {
  title: "My Profile | BDSisters",
  description: "View and manage your BDSisters professional profile, portfolio, and sisterhood presence.",
};

export default async function MemberProfilePage() {
  const session = await requireServerSession("/member/profile");
  const profile = await getProfileByUserId(session.user.id, {
    displayName: session.user.name,
    avatar: session.user.image,
  });

  const completion = calculateDetailedProfileCompletion(session.user, profile);

  return (
    <ProfileOverviewView
      user={session.user}
      profile={profile}
      completion={completion}
    />
  );
}
