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
let cachedToken: string | null = null;
let inFlightRequest: Promise<AuthUser | null> | null = null;

async function resolveCurrentUser(forceRefresh = false): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) {
    cachedUser = null;
    cachedToken = null;
    return null;
  }

  // Return cached user if token hasn't changed and refresh wasn't forced
  if (!forceRefresh && cachedUser && cachedToken === token) {
    return cachedUser;
  }

  // Share the same promise if a request is already in progress
  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = (async () => {
    try {
      const response = await apiClient.get<{ data?: Record<string, unknown> }>(
        API_ENDPOINTS.auth.me
      );

      const raw = response as unknown as { data?: Record<string, unknown> };
      const userData = raw.data;

      if (userData) {
        const mappedUser = {
          ...userData,
          id: (userData._id as string) || (userData.id as string),
          name: (userData.fullName as string) || (userData.name as string),
          fullName: (userData.fullName as string) || (userData.name as string),
          image: (userData.profilePicture as string) || (userData.image as string),
        } as unknown as AuthUser;

        cachedUser = mappedUser;
        cachedToken = token;
        return mappedUser;
      }

      cachedUser = null;
      cachedToken = null;
      return null;
    } catch {
      return cachedUser;
    } finally {
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(cachedUser);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedUser);

  const loadUser = useCallback(async (force = false) => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (!cachedUser || force) {
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
      cachedToken = null;
      inFlightRequest = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "auth_token=; path=/; max-age=0";
        document.cookie = "user_role=; path=/; max-age=0";
        setUser(null);
        window.location.href = "/login";
      }
    }
  }, []);

  const hasRole = (role: UserRole | string): boolean => {
    if (!user?.role) return false;
    return normalizeRole(user.role) === normalizeRole(role);
  };

  const hasAnyRole = (roles: Array<UserRole | string>): boolean => {
    if (!user?.role) return false;
    const current = normalizeRole(user.role);
    return roles.some((r) => normalizeRole(r) === current);
  };

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
    refreshUser: () => loadUser(true),
    logout,
  };
}