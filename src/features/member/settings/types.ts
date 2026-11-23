/**
 * Member Settings Types for BDSisters.org
 */

export interface NotificationPreferences {
  orderUpdates: boolean;
  communityReplies: boolean;
  weeklyNewsletter: boolean;
  eventReminders: boolean;
  directMessages: boolean;
}

export interface AccountGeneralSettings {
  displayName: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  isPhoneVerified: boolean;
  preferredLanguage: "bn" | "en";
  division: string;
  district: string;
  directoryDiscoverable: boolean;
  notifications: NotificationPreferences;
}

export interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecuritySettingsData {
  twoFactorEnabled: boolean;
  twoFactorMethod: "AUTHENTICATOR" | "SMS";
  lastPasswordChange: string;
  activeSessions: ActiveSessionItem[];
}

export interface PrivacySettingsData {
  profileVisibility: "PUBLIC" | "MEMBERS_ONLY" | "PRIVATE";
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showEducation: boolean;
  showExperience: boolean;
  showSkills: boolean;
  showSocialLinks: boolean;
}
