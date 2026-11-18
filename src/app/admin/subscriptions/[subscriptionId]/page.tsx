import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubscriptionDetailView } from "@/features/admin/memberships/components/subscriptions/subscription-detail-view";
import {
  DEMO_MEMBERSHIP_SUBSCRIPTIONS,
  getSubscriptionById,
} from "@/features/admin/memberships/data/mock-memberships";

interface PageProps {
  params: Promise<{ subscriptionId: string }>;
}

export async function generateStaticParams() {
  return DEMO_MEMBERSHIP_SUBSCRIPTIONS.map((s) => ({
    subscriptionId: s.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subscriptionId } = await params;
  const sub = getSubscriptionById(subscriptionId);
  return {
    title: sub ? `Subscription ${sub.subscriptionCode} | BDSisters Admin` : "Subscription Details | BDSisters Admin",
    description: "Detailed subscription account overview and payment settlement log.",
  };
}

export default async function AdminSubscriptionDetailPage({ params }: PageProps) {
  const { subscriptionId } = await params;
  const sub = getSubscriptionById(subscriptionId) || DEMO_MEMBERSHIP_SUBSCRIPTIONS[0];

  if (!sub) {
    notFound();
  }

  return <SubscriptionDetailView subscription={sub} />;
}
