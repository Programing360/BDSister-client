import { FAQForm } from "@/features/admin/cms/components/faq/faq-form";

export const metadata = {
  title: "Create FAQ | BDSisters CMS",
  description: "Compose and publish a new help question and answer.",
};

export default function AdminCmsFaqCreatePage() {
  return <FAQForm />;
}
