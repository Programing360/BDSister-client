import { Metadata } from "next";
import { GoalsDashboardView } from "@/features/member/goals/components/goals-dashboard-view";

export const metadata: Metadata = {
  title: "Discover Yourself & Goals | BDSisters Member Hub",
  description: "Diagnose your 8 life dimensions with the Holistic Development Wheel and achieve breakthroughs with the 80/20 Pareto goal engine.",
};

export default function MemberGoalsPage() {
  return <GoalsDashboardView />;
}
