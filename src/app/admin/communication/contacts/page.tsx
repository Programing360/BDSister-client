import React from "react";
import { ContactsListView } from "@/features/admin/communication/components/contacts/contacts-list-view";

export const metadata = {
  title: "Contact Form Submissions | BDSisters Admin",
  description: "View and respond to general inquiries and contact form submissions"
};

export default function ContactsPage() {
  return <ContactsListView />;
}
