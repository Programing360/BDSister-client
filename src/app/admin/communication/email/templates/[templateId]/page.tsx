import React from "react";
import { EmailTemplateEditor } from "@/features/admin/communication/components/email/email-template-editor";
import { DEMO_EMAIL_TEMPLATES } from "@/features/admin/communication/data/mock-communication";

export const metadata = {
  title: "Preview Email Template | BDSisters Admin",
  description: "Preview email template content and variables"
};

export async function generateStaticParams() {
  return DEMO_EMAIL_TEMPLATES.map((template) => ({
    templateId: template.id
  }));
}

interface PageProps {
  params: Promise<{ templateId: string }>;
}

export default async function EmailTemplatePage({ params }: PageProps) {
  const { templateId } = await params;
  return <EmailTemplateEditor templateId={templateId} isReadOnly={true} />;
}
