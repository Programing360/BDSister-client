import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  DEMO_ADMIN_PROFILES,
  getAdminProfileById,
} from "@/features/admin/profiles/data/admin-profiles-data";
import { ProfileEditForm } from "@/features/admin/profiles/components/profile-edit-form";

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
      ? `Edit ${profile.fullName} | BDSisters Admin`
      : "Edit Profile | BDSisters Admin",
    description: "Modify member profile narrative, skills, taxonomy, and visibility.",
  };
}

export default async function AdminProfileEditPage({ params }: PageProps) {
  const { profileId } = await params;
  const profile = getAdminProfileById(profileId);

  if (!profile) {
    notFound();
  }

  return <ProfileEditForm profile={profile} />;
}
