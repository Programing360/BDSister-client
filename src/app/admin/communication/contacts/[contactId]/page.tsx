import React from "react";
import { ContactDetailView } from "@/features/admin/communication/components/contacts/contact-detail-view";
import { DEMO_CONTACT_SUBMISSIONS } from "@/features/admin/communication/data/mock-communication";

export const metadata = {
  title: "Contact Submission Details | BDSisters Admin",
  description: "View and manage contact submission details"
};

export async function generateStaticParams() {
  return DEMO_CONTACT_SUBMISSIONS.map((contact) => ({
    contactId: contact.id
  }));
}

interface PageProps {
  params: Promise<{ contactId: string }>;
}

export default async function ContactDetailPage({ params }: PageProps) {
  const { contactId } = await params;
  return <ContactDetailView contactId={contactId} />;
}
