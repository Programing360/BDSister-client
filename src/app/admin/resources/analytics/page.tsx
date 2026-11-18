import { Metadata } from "next";
import { LearningAnalyticsView } from "@/features/admin/resources/components/analytics/learning-analytics-view";

export const metadata: Metadata = {
  title: "Learning Analytics & Telemetry | BDSisters Admin",
  description:
    "Student progression analytics, cohort retention, average study time, and certificate completion metrics.",
};

export default function AdminLearningAnalyticsPage() {
  return <LearningAnalyticsView />;
}
