import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MembershipPlanForm } from "@/features/admin/memberships/components/plans/membership-plan-form";
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
    title: plan ? `Edit ${plan.name} | BDSisters Admin` : "Edit Membership Plan | BDSisters Admin",
    description: "Modify membership plan attributes, pricing, and benefits.",
  };
}

export default async function AdminEditMembershipPlanPage({ params }: PageProps) {
  const { planId } = await params;
  const plan = getMembershipPlanById(planId) || DEMO_MEMBERSHIP_PLANS[0];

  if (!plan) {
    notFound();
  }

  return <MembershipPlanForm initialPlan={plan} isEdit={true} />;
}
