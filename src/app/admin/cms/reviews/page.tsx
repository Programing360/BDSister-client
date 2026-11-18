import { ContentReviewsView } from "@/features/admin/cms/components/reviews/content-reviews-view";

export const metadata = {
  title: "Content Review & Moderation Queue | BDSisters CMS",
  description: "Editorial review and approval queue for draft pages, sections, and promotional content.",
};

export default function AdminCmsReviewsPage() {
  return <ContentReviewsView />;
}
