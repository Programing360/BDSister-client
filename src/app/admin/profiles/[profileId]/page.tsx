import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  DEMO_ADMIN_PROFILES,
  getAdminProfileById,
} from "@/features/admin/profiles/data/admin-profiles-data";
import { ProfileDetailsView } from "@/features/admin/profiles/components/profile-details-view";

interface PageProps {
  params: Promise<{
    profileId: string;
  }>;
}

export function generateStaticParams() {
  return DEMO_ADMIN_PROFILES.flatMap((p) => [
    { profileId: p.id },
    { profileId: p.memberId },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { profileId } = await params;
  const profile = getAdminProfileById(profileId);
  return {
    title: profile
      ? `${profile.fullName} (${profile.memberId}) | Profile Review`
      : "Profile Details | BDSisters Admin",
    description: profile?.headline || "Member profile review and moderation controls.",
  };
}

export default async function AdminProfileDetailsPage({ params }: PageProps) {
  const { profileId } = await params;
  const profile = getAdminProfileById(profileId);

  if (!profile) {
    notFound();
  }

  return <ProfileDetailsView initialProfile={profile} />;
}
