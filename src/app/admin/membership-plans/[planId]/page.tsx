import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MembershipPlanDetailView } from "@/features/admin/memberships/components/plans/membership-plan-detail-view";
import {
  DEMO_MEMBERSHIP_PLANS,
  getMembershipPlanById,
} from "@/features/admin/memberships/data/mock-memberships";

interface PageProps {
  params: Promise<{ planId: string }>;
}

export async function generateStaticParams() {
  return DEMO_MEMBERSHIP_PLANS.map((p) => ({
    planId: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { planId } = await params;
  const plan = getMembershipPlanById(planId);
  return {
    title: plan ? `${plan.name} | BDSisters Admin` : "Membership Plan Details | BDSisters Admin",
    description: "Inspect membership plan pricing, benefits, and active sister enrollment.",
  };
}

export default async function AdminMembershipPlanDetailPage({ params }: PageProps) {
  const { planId } = await params;
  const plan = getMembershipPlanById(planId) || DEMO_MEMBERSHIP_PLANS[0];

  if (!plan) {
    notFound();
  }

  return <MembershipPlanDetailView plan={plan} />;
}
