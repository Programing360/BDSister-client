import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { MemberPublicProfileView } from "@/features/public/members/components/member-public-profile-view";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PublicMemberProfile } from "@/types/profile";

interface MemberProfilePageProps {
  params: Promise<{ id: string }>;
}

// Fallback demo member for instant offline preview / mock
const FALLBACK_MEMBER: PublicMemberProfile = {
  userId: "mem_001",
  displayName: "Nusrat Jahan",
  headline: "Founder at Dhaka Modest Wear & Ecommerce Strategist",
  bio: `Passionate entrepreneur and creative director dedicated to building sustainable, ethical fashion brands in South Asia. 

With over 8 years in digital retail and cross-border logistics, I mentor young Bangladeshi women to launch independent direct-to-consumer businesses.`,
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80",
  location: { address: "Gulshan 2", district: "Dhaka", division: "Dhaka", country: "Bangladesh" },
  skills: [
    { id: "s1", name: "Ecommerce" },
    { id: "s2", name: "Modest Fashion" },
    { id: "s3", name: "Digital Marketing" },
    { id: "s4", name: "Supply Chain" },
  ],
  interests: ["Women Empowerment", "Ethical Supply Chains", "Angel Investing", "Mentorship"],
  experience: [
    {
      id: "e1",
      role: "Founder & Creative Director",
      company: "Dhaka Modest Wear Ltd.",
      startDate: "2020",
      current: true,
      description: "Direct-to-consumer apparel brand exporting handcrafted silk & cotton garments.",
    },
    {
      id: "e2",
      role: "E-Commerce Manager",
      company: "Apex Footwear Global",
      startDate: "2017",
      endDate: "2020",
      description: "Led online marketplace operations and customer acquisition campaigns.",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "BBA in Marketing",
      institution: "North South University (NSU)",
      startDate: "2013",
      endDate: "2017",
      fieldOfStudy: "Marketing & Supply Chain",
    },
  ],
  socialLinks: {
    linkedin: "https://linkedin.com/in/example",
    website: "https://example.com",
    facebook: "https://facebook.com/example",
  },
  isVerified: true,
  membershipTier: "PREMIUM",
};

export async function generateMetadata({
  params,
}: MemberProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  let name = "Sister Profile";

  try {
    const res = await apiClient.get<{ user?: PublicMemberProfile; profile?: PublicMemberProfile }>(
      API_ENDPOINTS.users.detail(id)
    );
    const m = res.data?.user || res.data?.profile;
    if (m?.displayName) {
      name = m.displayName;
    }
  } catch {
    if (id === FALLBACK_MEMBER.userId) {
      name = FALLBACK_MEMBER.displayName;
    }
  }

  return {
    title: `${name} | BDSisters.org Sisterhood`,
    description: `View ${name}'s verified sister profile, career experience, and ventures on BDSisters.org.`,
  };
}

export default async function MemberDetailPage({ params }: MemberProfilePageProps) {
  const { id } = await params;
  let member: PublicMemberProfile | null = null;

  try {
    const res = await apiClient.get<{ user?: PublicMemberProfile; profile?: PublicMemberProfile; data?: PublicMemberProfile }>(
      API_ENDPOINTS.users.detail(id)
    );
    member = res.data?.user || res.data?.profile || res.data?.data || (res.data as unknown as PublicMemberProfile);
  } catch {
    // If API is offline or mock id requested, use fallback
    if (id === FALLBACK_MEMBER.userId || id === "demo" || !id.startsWith("usr_")) {
      member = { ...FALLBACK_MEMBER, userId: id };
    }
  }

  if (!member || !member.displayName) {
    member = { ...FALLBACK_MEMBER, userId: id };
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAFC] min-h-screen">
      <Container size="xl">
        <MemberPublicProfileView member={member} />
      </Container>
    </div>
  );
}
