import type { UserRole } from "@/types/auth";

/**
 * Validates a candidate callback URL to prevent open redirect vulnerabilities.
 * Ensures the target is strictly a relative internal path on the same origin.
 */
export function getSafeRedirectUrl(
  candidateUrl?: string | null,
  fallbackUrl: string = "/member"
): string {
  if (!candidateUrl) {
    return fallbackUrl;
  }

  // Must begin with single forward slash and not start with double slash or backslash
  if (
    !candidateUrl.startsWith("/") ||
    candidateUrl.startsWith("//") ||
    candidateUrl.startsWith("/\\")
  ) {
    return fallbackUrl;
  }

  // Must not contain protocol schemes (e.g., "javascript:", "data:", "https:")
  const firstSlashIdx = candidateUrl.indexOf("/", 1);
  const potentialScheme = firstSlashIdx > 0 ? candidateUrl.slice(1, firstSlashIdx) : candidateUrl.slice(1);
  if (potentialScheme.includes(":")) {
    return fallbackUrl;
  }

  return candidateUrl;
}

/**
 * Determines the default home route for an authenticated user based on RBAC role.
 */
export function getDefaultDashboardRoute(role?: UserRole | string | null): string {
  const adminRoles = [
    "SUPER_ADMIN",
    "ADMIN",
    "MODERATOR",
    "FINANCE_ADMIN",
    "CONTENT_MANAGER",
    "SUPPORT_AGENT",
  ];

  if (role && adminRoles.includes(role)) {
    return "/admin";
  }

  return "/member";
}
