import { PageDetailView } from "@/features/admin/cms/components/pages/page-detail-view";
import { DEMO_CMS_PAGES } from "@/features/admin/cms/data/mock-cms";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return DEMO_CMS_PAGES.map((page) => ({
    pageId: page.id,
  }));
}

interface PageProps {
  params: Promise<{ pageId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { pageId } = await params;
  const page = DEMO_CMS_PAGES.find((p) => p.id === pageId);
  return {
    title: page ? `${page.title} Details | BDSisters CMS` : "Page Details | BDSisters CMS",
  };
}

export default async function AdminCmsPageDetailPage({ params }: PageProps) {
  const { pageId } = await params;
  const page = DEMO_CMS_PAGES.find((p) => p.id === pageId);

  if (!page) {
    notFound();
  }

  return <PageDetailView page={page} />;
}
