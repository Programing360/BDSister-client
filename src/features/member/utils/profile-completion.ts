import type { AuthUser } from "@/types/auth";
import type { ProfileCompletionReport, ProfileStep } from "../types/dashboard";

/**
 * Calculates real profile completion without fabricating fake progress metrics.
 * Evaluates real properties of the authenticated user entity.
 */
export function calculateProfileCompletion(user: AuthUser): ProfileCompletionReport {
  const steps: ProfileStep[] = [
    {
      id: "basic_info",
      label: "Account Information",
      description: "Full name and registered email address provided",
      completed: Boolean(user.name && user.email),
      href: "/member/profile/edit",
    },
    {
      id: "email_verification",
      label: "Email Verification",
      description: "Confirm active email address to secure your account",
      completed: Boolean(user.emailVerified),
      href: "/verify-email",
    },
    {
      id: "avatar",
      label: "Profile Photo",
      description: "Add a photo to help sisters recognize you in the network",
      completed: Boolean(user.image),
      href: "/member/profile/edit",
    },
    {
      id: "skills_bio",
      label: "Bio & Professional Skills",
      description: "Share your expertise, business domain, or career goals",
      completed: false, // Planned for Step 6 Profile Builder
      href: "/member/skills",
    },
    {
      id: "identity_verification",
      label: "Sisterhood Identity Check",
      description: "Verify your Bangladeshi residency or diaspora identity",
      completed: false, // Planned for Step 6 Verification Flow
      href: "/member/profile/verification",
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return {
    percentage,
    completedCount,
    totalCount,
    steps,
  };
}
