import React from "react";
import { MemberDetailsView } from "@/features/admin/members/components/member-details-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMemberDetailsPage({ params }: PageProps) {
  const { id } = await params;
  console.log(id)

  return <MemberDetailsView userId={id} />;
}