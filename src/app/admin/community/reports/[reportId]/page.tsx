import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_COMMUNITY_REPORTS } from "@/features/admin/community/data/mock-community";
import { ReportDetailView } from "@/features/admin/community/components/reports/report-detail-view";

interface PageProps {
  params: Promise<{ reportId: string }>;
}

export async function generateStaticParams() {
  return DEMO_COMMUNITY_REPORTS.map((r) => ({
    reportId: r.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reportId } = await params;
  const report = DEMO_COMMUNITY_REPORTS.find((r) => r.id === reportId);
  return {
    title: report ? `Report ${report.reportId} | BDSisters Admin` : "Report Details",
  };
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { reportId } = await params;
  const report = DEMO_COMMUNITY_REPORTS.find((r) => r.id === reportId);

  if (!report) {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
