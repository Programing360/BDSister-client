import { redirect } from "next/navigation";

export default function AdminCmsHomepageRedirectPage() {
  redirect("/admin/content/pages");
}
