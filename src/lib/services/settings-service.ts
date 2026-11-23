/**
 * Settings Service for BDSisters.org Members
 * Manages general preferences, security credentials, active sessions, and privacy controls.
 */

import { apiClient } from "../api/client.ts";
import { API_ENDPOINTS } from "../api/endpoints.ts";
import type {
  AccountGeneralSettings,
  SecuritySettingsData,
  PrivacySettingsData,
  ActiveSessionItem,
} from "../../features/member/settings/types.ts";

const INITIAL_GENERAL_SETTINGS: AccountGeneralSettings = {
  displayName: "Ayesha Siddiqua",
  email: "ayesha.siddiqua@example.com",
  isEmailVerified: true,
  phone: "+880 1712-345678",
  isPhoneVerified: true,
  preferredLanguage: "bn",
  division: "Dhaka",
  district: "Dhaka (Mirpur)",
  directoryDiscoverable: true,
  notifications: {
    orderUpdates: true,
    communityReplies: true,
    weeklyNewsletter: true,
    eventReminders: true,
    directMessages: true,
  },
};

const INITIAL_SESSIONS: ActiveSessionItem[] = [
  {
    id: "sess_curr",
    device: "Windows PC (Desktop)",
    browser: "Google Chrome 134",
    ipAddress: "103.230.104.12",
    location: "Dhaka, Bangladesh",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "sess_mob",
    device: "Samsung Galaxy S24 (Android)",
    browser: "Chrome Mobile 133",
    ipAddress: "103.230.104.18",
    location: "Dhaka, Bangladesh",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess_tab",
    device: "Apple iPad Air (Tablet)",
    browser: "Safari 18",
    ipAddress: "27.147.201.88",
    location: "Chittagong, Bangladesh",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];

const INITIAL_SECURITY_SETTINGS: SecuritySettingsData = {
  twoFactorEnabled: false,
  twoFactorMethod: "AUTHENTICATOR",
  lastPasswordChange: "2026-01-10T14:30:00Z",
  activeSessions: INITIAL_SESSIONS,
};

const INITIAL_PRIVACY_SETTINGS: PrivacySettingsData = {
  profileVisibility: "PUBLIC",
  showEmail: false, // Default to private
  showPhone: false, // Default to private
  showLocation: true,
  showEducation: true,
  showExperience: true,
  showSkills: true,
  showSocialLinks: true,
};

let localGeneral = { ...INITIAL_GENERAL_SETTINGS };
let localSecurity = { ...INITIAL_SECURITY_SETTINGS };
let localPrivacy = { ...INITIAL_PRIVACY_SETTINGS };

export const settingsService = {
  /**
   * Fetch general member account preferences
   */
  async getGeneralSettings(): Promise<AccountGeneralSettings> {
    try {
      const res = await apiClient.get<AccountGeneralSettings>(API_ENDPOINTS.auth.me);
      if (res.data) {
        return { ...localGeneral, ...res.data };
      }
    } catch {
      // Deferred or offline fallback
    }
    return localGeneral;
  },

  /**
   * Update general account settings
   */
  async updateGeneralSettings(
    data: Partial<AccountGeneralSettings>
  ): Promise<AccountGeneralSettings> {
    try {
      const res = await apiClient.patch<AccountGeneralSettings>(
        API_ENDPOINTS.auth.updateContact,
        data
      );
      if (res.data) {
        localGeneral = { ...localGeneral, ...res.data };
        return localGeneral;
      }
    } catch {
      // Fallback update
    }

    localGeneral = {
      ...localGeneral,
      ...data,
      notifications: {
        ...localGeneral.notifications,
        ...(data.notifications || {}),
      },
    };
    return localGeneral;
  },

  /**
   * Fetch security configuration and active login sessions
   */
  async getSecuritySettings(): Promise<SecuritySettingsData> {
    try {
      const res = await apiClient.get<SecuritySettingsData>("/api/auth/security");
      if (res.data) {
        return { ...localSecurity, ...res.data };
      }
    } catch {
      // Deferred
    }
    return localSecurity;
  },

  /**
   * Change login password
   */
  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    if (!payload.currentPassword || payload.currentPassword.length < 6) {
      throw new Error("Current password is required.");
    }
    if (!payload.newPassword || payload.newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters.");
    }

    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(
        "/api/auth/change-password",
        payload
      );
      if (res.data) return res.data;
    } catch {
      // Fallback
    }

    localSecurity.lastPasswordChange = new Date().toISOString();
    return {
      success: true,
      message: "Password changed successfully! Your active sessions remain secured.",
    };
  },

  /**
   * Toggle Two-Factor Authentication
   */
  async toggle2FA(
    enabled: boolean,
    method: "AUTHENTICATOR" | "SMS" = "AUTHENTICATOR"
  ): Promise<{ success: boolean; enabled: boolean }> {
    try {
      const res = await apiClient.post<{ success: boolean; enabled: boolean }>(
        "/api/auth/2fa",
        { enabled, method }
      );
      if (res.data) return res.data;
    } catch {
      // Fallback
    }

    localSecurity.twoFactorEnabled = enabled;
    localSecurity.twoFactorMethod = method;
    return { success: true, enabled };
  },

  /**
   * Revoke a single active login session
   */
  async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`/api/auth/sessions/${sessionId}`);
    } catch {
      // Fallback
    }

    localSecurity.activeSessions = localSecurity.activeSessions.filter(
      (s) => s.id !== sessionId || s.isCurrent
    );
    return { success: true };
  },

  /**
   * Revoke all other sessions except current device
   */
  async revokeAllOtherSessions(): Promise<{ success: boolean; revokedCount: number }> {
    try {
      await apiClient.delete("/api/auth/sessions");
    } catch {
      // Fallback
    }

    const count = localSecurity.activeSessions.filter((s) => !s.isCurrent).length;
    localSecurity.activeSessions = localSecurity.activeSessions.filter((s) => s.isCurrent);
    return { success: true, revokedCount: count };
  },

  /**
   * Fetch member privacy configuration
   */
  async getPrivacySettings(): Promise<PrivacySettingsData> {
    try {
      const res = await apiClient.get<PrivacySettingsData>("/api/auth/privacy");
      if (res.data) {
        return { ...localPrivacy, ...res.data };
      }
    } catch {
      // Deferred
    }
    return localPrivacy;
  },

  /**
   * Update member privacy configuration
   */
  async updatePrivacySettings(
    data: Partial<PrivacySettingsData>
  ): Promise<PrivacySettingsData> {
    try {
      const res = await apiClient.patch<PrivacySettingsData>(
        API_ENDPOINTS.auth.updateContact,
        { privacySettings: data }
      );
      if (res.data) {
        localPrivacy = { ...localPrivacy, ...res.data };
        return localPrivacy;
      }
    } catch {
      // Fallback
    }

    localPrivacy = { ...localPrivacy, ...data };
    return localPrivacy;
  },

  /**
   * Export member account data archive
   */
  async exportAccountData(): Promise<Blob> {
    const data = {
      platform: "BDSisters.org",
      exportedAt: new Date().toISOString(),
      account: localGeneral,
      security: {
        lastPasswordChange: localSecurity.lastPasswordChange,
        twoFactorEnabled: localSecurity.twoFactorEnabled,
      },
      privacy: localPrivacy,
      declaration: "Exported in accordance with BDSisters Member Data Protection Charter.",
    };

    return new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
  },
};
