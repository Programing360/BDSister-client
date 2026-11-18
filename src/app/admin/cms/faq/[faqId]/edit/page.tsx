import { FAQForm } from "@/features/admin/cms/components/faq/faq-form";
import { DEMO_FAQS } from "@/features/admin/cms/data/mock-cms";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return DEMO_FAQS.map((faq) => ({
    faqId: faq.id,
  }));
}

interface PageProps {
  params: Promise<{ faqId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { faqId } = await params;
  const faq = DEMO_FAQS.find((f) => f.id === faqId);
  return {
    title: faq ? `Edit FAQ: ${faq.question.slice(0, 30)}... | BDSisters CMS` : "Edit FAQ | BDSisters CMS",
  };
}

export default async function AdminCmsFaqEditPage({ params }: PageProps) {
  const { faqId } = await params;
  const faq = DEMO_FAQS.find((f) => f.id === faqId);

  if (!faq) {
    notFound();
  }

  return <FAQForm initialData={faq} faqId={faqId} />;
}
