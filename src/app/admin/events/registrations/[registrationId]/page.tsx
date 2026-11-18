import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_REGISTRATIONS } from "@/features/admin/events/data/mock-events";
import { RegistrationDetailView } from "@/features/admin/events/components/registrations/registration-detail-view";

interface PageProps {
  params: Promise<{ registrationId: string }>;
}

export async function generateStaticParams() {
  return DEMO_REGISTRATIONS.map((reg) => ({
    registrationId: reg.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { registrationId } = await params;
  const reg = DEMO_REGISTRATIONS.find((r) => r.id === registrationId);
  return {
    title: reg ? `Registration: ${reg.attendeeName} | BDSisters Admin` : "Registration Not Found | BDSisters Admin",
  };
}

export default async function RegistrationDetailPage({ params }: PageProps) {
  const { registrationId } = await params;
  const reg = DEMO_REGISTRATIONS.find((r) => r.id === registrationId);

  if (!reg) {
    notFound();
  }

  return <RegistrationDetailView registration={reg} />;
}
