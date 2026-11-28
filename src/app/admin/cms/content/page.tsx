import { redirect } from "next/navigation";

export default function AdminCmsContentRedirect() {
  redirect("/admin/content/pages");
}
