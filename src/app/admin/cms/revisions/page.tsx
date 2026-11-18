import { RevisionsListView } from "@/features/admin/cms/components/revisions/revisions-list-view";

export const metadata = {
  title: "Revisions & Rollbacks | BDSisters CMS",
  description: "Audit trail of website page modifications with one-click version restore.",
};

export default function AdminCmsRevisionsPage() {
  return <RevisionsListView />;
}
