import { Metadata } from "next";
import { ResourceForm } from "@/features/admin/resources/components/form/resource-form";

export const metadata: Metadata = {
  title: "Publish New Resource | BDSisters Admin",
  description:
    "Author and publish learning articles, guides, downloadable tools, and multimedia resources.",
};

export default function CreateResourcePage() {
  return <ResourceForm isEdit={false} />;
}
