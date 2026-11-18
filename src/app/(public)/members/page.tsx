import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { MembersDirectoryView } from "@/features/public/members/components/members-directory-view";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PublicMemberProfile } from "@/types/profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sisterhood Directory | BDSisters.org",
  description:
    "Discover and connect with verified Bangladeshi women leaders, founders, tech professionals, and creators across Bangladesh and the diaspora.",
};

export default async function MembersPage() {
  let members: PublicMemberProfile[] = [];

  try {
    const res = await apiClient.get<{ users?: PublicMemberProfile[]; data?: PublicMemberProfile[] }>(
      API_ENDPOINTS.users.list
    );
    if (res.data?.users && Array.isArray(res.data.users)) {
      members = res.data.users;
    } else if (res.data?.data && Array.isArray(res.data.data)) {
      members = res.data.data;
    } else if (Array.isArray(res.data)) {
      members = res.data as unknown as PublicMemberProfile[];
    }
  } catch {
    // Graceful fallback to demo members inside MembersDirectoryView
    members = [];
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FAFAFC] min-h-screen">
      <Container size="xl">
        <MembersDirectoryView initialMembers={members} />
      </Container>
    </div>
  );
}
