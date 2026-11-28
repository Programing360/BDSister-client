import { redirect } from "next/navigation";

export default function AdminCmsNavRedirect() {
  redirect("/admin/content/menu");
}
