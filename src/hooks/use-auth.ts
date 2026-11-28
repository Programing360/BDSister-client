"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthUser, UserRole } from "@/types/auth";

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPaidMember: boolean;
  isMember: boolean;
  hasRole: (role: UserRole | string) => boolean;
  hasAnyRole: (roles: Array<UserRole | string>) => boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const normalizeRole = (role?: string): string =>
  (role || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const lsToken =
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("access_token");
    if (lsToken) return lsToken;

    const match = document.cookie.match(/(?:^|;\s*)(?:token|auth_token)=([^;]+)/);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

// ─── Module-level cache & deduplication (prevents duplicate /me requests) ───
let cachedUser: AuthUser | null = null;
let hasCheckedSession = false;
let inFlightRequest: Promise<AuthUser | null> | null = null;

async function resolveCurrentUser(forceRefresh = false): Promise<AuthUser | null> {
  // Return cached user if session has already been checked and refresh wasn't forced
  if (!forceRefresh && hasCheckedSession && cachedUser) {
    return cachedUser;
  }

  // Share the same promise if a request is already in progress
  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = (async () => {
    try {
      const response = await apiClient.get<Record<string, unknown>>(
        API_ENDPOINTS.auth.me
      );

      const raw = response as unknown as Record<string, unknown>;
      const rawData = raw?.data as Record<string, unknown> | undefined;

      // Extract userData safely from raw.data?.user ?? raw.data ?? raw.user ?? (raw._id || raw.id ? raw : null)
      const rawCandidate =
        (rawData?.user as Record<string, unknown> | undefined) ??
        rawData ??
        (raw?.user as Record<string, unknown> | undefined) ??
        (raw?._id || raw?.id ? raw : null);

      const userData =
        rawCandidate &&
        typeof rawCandidate === "object" &&
        Boolean(
          (rawCandidate as Record<string, unknown>)._id ||
            (rawCandidate as Record<string, unknown>).id ||
            (rawCandidate as Record<string, unknown>).email
        )
          ? (rawCandidate as Record<string, unknown>)
          : null;

      if (userData) {
        const mappedUser = {
          ...userData,
          id: (userData._id as string) || (userData.id as string),
          name: (userData.fullName as string) || (userData.name as string),
          fullName: (userData.fullName as string) || (userData.name as string),
          image: (userData.profilePicture as string) || (userData.image as string),
        } as unknown as AuthUser;

        cachedUser = mappedUser;
        hasCheckedSession = true;
        return mappedUser;
      }

      cachedUser = null;
      hasCheckedSession = true;
      return null;
    } catch {
      cachedUser = null;
      hasCheckedSession = true;
      return null;
    } finally {
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(cachedUser);
  const [isLoading, setIsLoading] = useState<boolean>(!hasCheckedSession);

  const loadUser = useCallback(async (force = false) => {
    if (!hasCheckedSession || force) {
      setIsLoading(true);
    }

    const resolved = await resolveCurrentUser(force);
    setUser(resolved);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser(false);
  }, [loadUser]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Proceed with local cleanup
    } finally {
      cachedUser = null;
      hasCheckedSession = false;
      inFlightRequest = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "auth_token=; path=/; max-age=0";
        document.cookie = "user_role=; path=/; max-age=0";
        setUser(null);
        window.location.href = "/login";
      }
    }
  }, []);

  const hasRole = useCallback((role: UserRole | string): boolean => {
    if (!user?.role) return false;
    return normalizeRole(user.role) === normalizeRole(role);
  }, [user?.role]);

  const hasAnyRole = useCallback((roles: Array<UserRole | string>): boolean => {
    if (!user?.role) return false;
    const current = normalizeRole(user.role);
    return roles.some((r) => normalizeRole(r) === current);
  }, [user?.role]);

  const refreshUser = useCallback(async () => {
    await loadUser(true);
  }, [loadUser]);

  const adminRoles = [
    "SuperAdmin",
    "Admin",
    "Moderator",
    "SUPER_ADMIN",
    "ADMIN",
    "MODERATOR",
    "FINANCE_ADMIN",
    "CONTENT_MANAGER",
    "SUPPORT_AGENT",
  ];

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdmin: hasAnyRole(adminRoles),
    isPaidMember: hasRole("PaidMember"),
    isMember: hasAnyRole(["Member", "PaidMember"]),
    hasRole,
    hasAnyRole,
    refreshUser,
    logout,
  };
}