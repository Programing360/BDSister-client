export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "FINANCE_ADMIN"
  | "CONTENT_MANAGER"
  | "SUPPORT_AGENT"
  | "MEMBER";

export type AccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: AccountStatus;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

export type AdminRole = Extract<
  UserRole,
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "FINANCE_ADMIN"
  | "CONTENT_MANAGER"
  | "SUPPORT_AGENT"
>;

export type MemberRole = Extract<UserRole, "MEMBER">;
