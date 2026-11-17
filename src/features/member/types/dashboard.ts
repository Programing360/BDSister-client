import type { AuthUser } from "@/types/auth";

export interface ProfileStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  href: string;
}

export interface ProfileCompletionReport {
  percentage: number;
  completedCount: number;
  totalCount: number;
  steps: ProfileStep[];
}

export type IdentityVerificationStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "ACTION_REQUIRED";

export interface MemberDashboardOverview {
  user: AuthUser;
  profileCompletion: ProfileCompletionReport;
  identityStatus: IdentityVerificationStatus;
}
