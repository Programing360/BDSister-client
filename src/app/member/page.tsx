import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { getProfileByUserId, calculateDetailedProfileCompletion } from "@/lib/services/profile-service";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { getShopByBusinessId } from "@/lib/services/shop-service";
import {
  WelcomeBanner,
  ProfileCompletionCard,
  VerificationCard,
  QuickAccessGrid,
  ActivityOverview,
  UpcomingEventsPreview,
  RecommendedLearningPreview,
  BusinessOverviewCard,
  NotificationPreviewCard,
} from "@/features/member/components";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "BDSisters Member Dashboard - Overview, profile status, community, and business tools.",
};

export default async function MemberDashboardOverviewPage() {
  const session = await requireServerSession("/member");
  const profile = await getProfileByUserId(session.user.id, {
    displayName: session.user.name,
    avatar: session.user.image,
  });
  const profileReport = calculateDetailedProfileCompletion(session.user, profile);

  const businesses = await getBusinessesByOwnerId(session.user.id);
  const primaryBusiness = businesses[0] || null;
  const shop = primaryBusiness ? await getShopByBusinessId(primaryBusiness.id) : null;

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Greeting Banner */}
      <WelcomeBanner user={session.user} />

      {/* 2. Profile Health & Trust Verification Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <ProfileCompletionCard report={profileReport} />
        <VerificationCard
          user={session.user}
          identityStatus={profile.isVerified ? "VERIFIED" : "NOT_STARTED"}
        />
      </div>

      {/* 3. Quick Access Cards */}
      <QuickAccessGrid />

      {/* 4. Business & Activity Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <BusinessOverviewCard business={primaryBusiness} shop={shop} />
        <ActivityOverview />
      </div>

      {/* 5. Events, Learning, & Notifications Triple Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <UpcomingEventsPreview />
        <RecommendedLearningPreview />
        <NotificationPreviewCard />
      </div>
    </div>
  );
}
