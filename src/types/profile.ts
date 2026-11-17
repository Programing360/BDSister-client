/**
 * BDSisters.org - Member Profile System Types
 * Step 6: Complete Member Profile Builder, Profile Management & Privacy Settings
 */

export type ProfileVisibility = "PUBLIC" | "MEMBERS_ONLY" | "PRIVATE";

export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "EXPERT";

export type LanguageProficiency = "BASIC" | "CONVERSATIONAL" | "FLUENT" | "NATIVE";

export interface LocationData {
  address?: string;
  city?: string;
  district?: string;
  division?: string;
  country?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string; // YYYY-MM or YYYY
  endDate?: string;   // YYYY-MM or YYYY
  current?: boolean;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string; // YYYY-MM or YYYY
  endDate?: string;   // YYYY-MM or YYYY
  current?: boolean;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category?: string;
  level?: SkillLevel;
}

export interface LanguageItem {
  language: string;
  proficiency: LanguageProficiency;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showEducation: boolean;
  showExperience: boolean;
  showSkills: boolean;
  showSocialLinks: boolean;
}

export interface MemberProfileDocument {
  _id?: any;
  userId: string;
  displayName?: string;
  headline?: string;
  bio?: string;
  avatar?: string | null;
  coverImage?: string | null;
  phone?: string | null;
  location?: LocationData;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  skills?: SkillItem[];
  interests?: string[];
  languages?: LanguageItem[];
  socialLinks?: SocialLinks;
  privacySettings?: PrivacySettings;
  isVerified?: boolean;
  membershipTier?: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filtered profile safe for public or fellow member view
 */
export interface PublicMemberProfile {
  userId: string;
  displayName: string;
  headline?: string;
  bio?: string;
  avatar?: string | null;
  coverImage?: string | null;
  email?: string;
  phone?: string;
  location?: LocationData;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  skills?: SkillItem[];
  interests?: string[];
  languages?: LanguageItem[];
  socialLinks?: SocialLinks;
  isVerified?: boolean;
  membershipTier?: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  isRestricted?: boolean;
  restrictedReason?: "PRIVATE_PROFILE" | "MEMBERS_ONLY";
  createdAt?: string | Date;
}
