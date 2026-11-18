import { PageBuilderWorkspace } from "@/features/admin/cms/components/page-builder/page-builder-workspace";

export const metadata = {
  title: "Visual Page Builder Studio | BDSisters CMS",
  description: "Drag-and-drop block layout editor with desktop/mobile live canvas preview.",
};

export default function AdminCmsPageBuilderPage() {
  return <PageBuilderWorkspace />;
}
