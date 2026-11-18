import React from "react";
import { EmailTemplateEditor } from "@/features/admin/communication/components/email/email-template-editor";

export const metadata = {
  title: "Create Email Template | BDSisters Admin",
  description: "Compose a new system email template"
};

export default function CreateEmailTemplatePage() {
  return <EmailTemplateEditor />;
}
