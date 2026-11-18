import { FAQListView } from "@/features/admin/cms/components/faq/faq-list-view";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | BDSisters CMS",
  description: "Help center knowledge base questions, answers, and category management.",
};

export default function AdminCmsFaqPage() {
  return <FAQListView />;
}
