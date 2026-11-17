import { MembersListView } from "@/features/admin/members/components/members-list-view";

export const metadata = {
  title: "Member Management | BDSisters Admin",
  description: "Manage registered BDSisters platform members, inspect profile health, and audit account statuses.",
};

export default function AdminMembersPage() {
  return <MembersListView />;
}
