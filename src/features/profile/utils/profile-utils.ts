import type {
  MemberProfileDocument,
  PublicMemberProfile,
  PrivacySettings,
} from "../../../types/profile.ts";
import { defaultPrivacySettings } from "../../../lib/validations/profile.ts";
import type { ProfileCompletionReport, ProfileStep } from "../../member/types/dashboard.ts";

/**
 * Creates default initial profile structure for a user
 */
export function createDefaultProfile(
  userId: string,
  displayName?: string,
  avatar?: string | null
): MemberProfileDocument {
  return {
    userId,
    displayName: displayName || "",
    headline: "",
    bio: "",
    avatar: avatar || null,
    coverImage: null,
    phone: null,
    location: {
      address: "",
      city: "",
      district: "",
      division: "",
      country: "Bangladesh",
    },
    education: [],
    experience: [],
    skills: [],
    interests: [],
    languages: [{ language: "Bengali", proficiency: "NATIVE" }],
    socialLinks: {},
    privacySettings: { ...defaultPrivacySettings },
    isVerified: false,
    membershipTier: "FREE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Privacy viewer context
 */
export interface PrivacyViewerContext {
  viewerUserId?: string | null;
  isAuthenticated?: boolean;
  viewerRole?: string | null;
}

/**
 * Filter profile by privacy settings based on the viewing actor.
 * Enforces field-level visibility on the server before sending to client.
 */
export function filterProfileByPrivacy(
  profile: MemberProfileDocument,
  viewerContext: PrivacyViewerContext = {}
): PublicMemberProfile {
  const { viewerUserId, isAuthenticated = false, viewerRole } = viewerContext;
  const isOwner = Boolean(viewerUserId && viewerUserId === profile.userId);
  const isAdmin = viewerRole === "ADMIN" || viewerRole === "SUPER_ADMIN";

  const displayName = profile.displayName || "BDSisters Member";

  // Owner and admins see full unredacted profile
  if (isOwner || isAdmin) {
    return {
      userId: profile.userId,
      displayName,
      headline: profile.headline || "",
      bio: profile.bio || "",
      avatar: profile.avatar || null,
      coverImage: profile.coverImage || null,
      phone: profile.phone || undefined,
      location: profile.location,
      education: profile.education || [],
      experience: profile.experience || [],
      skills: profile.skills || [],
      interests: profile.interests || [],
      languages: profile.languages || [],
      socialLinks: profile.socialLinks || {},
      isVerified: profile.isVerified ?? false,
      membershipTier: profile.membershipTier ?? "FREE",
      isRestricted: false,
      createdAt: profile.createdAt,
    };
  }

  const privacy: PrivacySettings = {
    ...defaultPrivacySettings,
    ...(profile.privacySettings || {}),
  };

  // 1. Fully PRIVATE profile
  if (privacy.profileVisibility === "PRIVATE") {
    return {
      userId: profile.userId,
      displayName: "Private Member",
      avatar: null,
      coverImage: null,
      isRestricted: true,
      restrictedReason: "PRIVATE_PROFILE",
    };
  }

  // 2. MEMBERS_ONLY profile when viewer is unauthenticated
  if (privacy.profileVisibility === "MEMBERS_ONLY" && !isAuthenticated) {
    return {
      userId: profile.userId,
      displayName,
      avatar: profile.avatar || null,
      headline: profile.headline || "",
      isRestricted: true,
      restrictedReason: "MEMBERS_ONLY",
    };
  }

  // 3. Normal view with granular field visibility flags applied
  return {
    userId: profile.userId,
    displayName,
    headline: profile.headline || "",
    bio: profile.bio || "",
    avatar: profile.avatar || null,
    coverImage: profile.coverImage || null,
    phone: privacy.showPhone ? profile.phone || undefined : undefined,
    location: privacy.showLocation ? profile.location : undefined,
    education: privacy.showEducation ? profile.education || [] : [],
    experience: privacy.showExperience ? profile.experience || [] : [],
    skills: privacy.showSkills ? profile.skills || [] : [],
    interests: profile.interests || [],
    languages: profile.languages || [],
    socialLinks: privacy.showSocialLinks ? profile.socialLinks || {} : {},
    isVerified: profile.isVerified ?? false,
    membershipTier: profile.membershipTier ?? "FREE",
    isRestricted: false,
    createdAt: profile.createdAt,
  };
}

/**
 * Evaluates real, deterministic profile completion percentage and steps.
 * Combines core AuthUser data with extended MemberProfileDocument data.
 */
export function calculateDetailedProfileCompletion(
  user: { name?: string | null; email?: string | null; image?: string | null; emailVerified?: boolean },
  profile?: MemberProfileDocument | null
): ProfileCompletionReport {
  const hasNameAndEmail = Boolean(user.name && user.email);
  const hasAvatar = Boolean(profile?.avatar || user.image);
  const hasCover = Boolean(profile?.coverImage);
  const hasHeadline = Boolean(profile?.headline && profile.headline.trim().length >= 3);
  const hasBio = Boolean(profile?.bio && profile.bio.trim().length >= 20);
  const hasLocation = Boolean(
    profile?.location?.city || profile?.location?.district || profile?.location?.division
  );
  const hasExperience = Boolean(profile?.experience && profile.experience.length > 0);
  const hasEducation = Boolean(profile?.education && profile.education.length > 0);
  const hasSkillsOrInterests = Boolean(
    (profile?.skills && profile.skills.length > 0) ||
    (profile?.interests && profile.interests.length > 0)
  );

  const steps: (ProfileStep & { weight: number })[] = [
    {
      id: "basic_account",
      label: "Account Information",
      description: "Full name and registered email address provided",
      completed: hasNameAndEmail,
      weight: 15,
      href: "/member/profile/edit",
    },
    {
      id: "avatar_photo",
      label: "Profile Photo",
      description: "Add a photo to help sisters recognize you in the network",
      completed: hasAvatar,
      weight: 10,
      href: "/member/profile/edit",
    },
    {
      id: "cover_banner",
      label: "Cover Banner",
      description: "Personalize your profile header with a cover image",
      completed: hasCover,
      weight: 10,
      href: "/member/profile/edit",
    },
    {
      id: "headline",
      label: "Professional Headline",
      description: "Concise summary of your expertise or entrepreneurship focus",
      completed: hasHeadline,
      weight: 10,
      href: "/member/profile/edit",
    },
    {
      id: "bio",
      label: "About Me Story",
      description: "Tell your sisterhood about your journey and ambitions",
      completed: hasBio,
      weight: 15,
      href: "/member/profile/edit",
    },
    {
      id: "location",
      label: "Location & District",
      description: "Specify your city or home district in Bangladesh or diaspora",
      completed: hasLocation,
      weight: 10,
      href: "/member/profile/edit",
    },
    {
      id: "experience",
      label: "Career & Business Experience",
      description: "Share your professional positions or startup milestones",
      completed: hasExperience,
      weight: 15,
      href: "/member/profile/edit",
    },
    {
      id: "education",
      label: "Education & Certifications",
      description: "Highlight your academic background and training",
      completed: hasEducation,
      weight: 10,
      href: "/member/profile/edit",
    },
    {
      id: "skills_interests",
      label: "Skills & Community Interests",
      description: "Tag your core competencies and topics you are passionate about",
      completed: hasSkillsOrInterests,
      weight: 5,
      href: "/member/profile/skills",
    },
  ];

  let calculatedWeight = 0;
  let completedCount = 0;

  for (const step of steps) {
    if (step.completed) {
      calculatedWeight += step.weight;
      completedCount++;
    }
  }

  const percentage = Math.min(100, Math.round(calculatedWeight));

  return {
    percentage,
    completedCount,
    totalCount: steps.length,
    steps: steps.map(({ weight: _weight, ...rest }) => rest),
  };
}
