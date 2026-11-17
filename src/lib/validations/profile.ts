import { z } from "zod";

/**
 * Common regex and limits for profile validation
 */
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || val === "" || /^https?:\/\/.+/i.test(val) || /^[\w.-]+(\.[\w.-]+)+/i.test(val),
    { message: "Please enter a valid website address or URL (e.g. https://example.com)" }
  );

export const basicInfoSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must not exceed 60 characters"),
  headline: z
    .string()
    .trim()
    .max(120, "Headline must not exceed 120 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(2000, "Bio must not exceed 2,000 characters")
    .optional()
    .or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;

export const contactLocationSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(25, "Phone number must not exceed 25 characters")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .max(150, "Address must not exceed 150 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .max(60, "City must not exceed 60 characters")
    .optional()
    .or(z.literal("")),
  district: z
    .string()
    .trim()
    .max(60, "District must not exceed 60 characters")
    .optional()
    .or(z.literal("")),
  division: z
    .string()
    .trim()
    .max(60, "Division must not exceed 60 characters")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .trim()
    .max(60, "Country must not exceed 60 characters")
    .default("Bangladesh")
    .optional(),
});

export type ContactLocationInput = z.infer<typeof contactLocationSchema>;

export const educationItemSchema = z.object({
  id: z.string().min(1, "Item ID is required"),
  institution: z
    .string()
    .trim()
    .min(2, "Institution / University name is required")
    .max(120, "Institution name is too long"),
  degree: z
    .string()
    .trim()
    .min(2, "Degree or Certification is required")
    .max(100, "Degree name is too long"),
  fieldOfStudy: z
    .string()
    .trim()
    .max(100, "Field of study is too long")
    .optional()
    .or(z.literal("")),
  startDate: z.string().trim().optional().or(z.literal("")),
  endDate: z.string().trim().optional().or(z.literal("")),
  current: z.boolean().default(false),
  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1,000 characters")
    .optional()
    .or(z.literal("")),
});

export type EducationItemInput = z.infer<typeof educationItemSchema>;

export const experienceItemSchema = z.object({
  id: z.string().min(1, "Item ID is required"),
  company: z
    .string()
    .trim()
    .min(2, "Company or Organization name is required")
    .max(120, "Company name is too long"),
  role: z
    .string()
    .trim()
    .min(2, "Role or Job Title is required")
    .max(100, "Job title is too long"),
  location: z
    .string()
    .trim()
    .max(100, "Location is too long")
    .optional()
    .or(z.literal("")),
  startDate: z.string().trim().optional().or(z.literal("")),
  endDate: z.string().trim().optional().or(z.literal("")),
  current: z.boolean().default(false),
  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1,000 characters")
    .optional()
    .or(z.literal("")),
});

export type ExperienceItemInput = z.infer<typeof experienceItemSchema>;

export const skillItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Skill name cannot be empty").max(50, "Skill name too long"),
  category: z.string().trim().max(50).optional().or(z.literal("")),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]).default("INTERMEDIATE"),
});

export const languageItemSchema = z.object({
  language: z.string().trim().min(2, "Language name required").max(50),
  proficiency: z.enum(["BASIC", "CONVERSATIONAL", "FLUENT", "NATIVE"]).default("CONVERSATIONAL"),
});

export const skillsAndInterestsSchema = z.object({
  skills: z.array(skillItemSchema).default([]),
  interests: z.array(z.string().trim().min(1).max(50)).default([]),
  languages: z.array(languageItemSchema).default([]),
});

export type SkillsAndInterestsInput = z.infer<typeof skillsAndInterestsSchema>;

export const socialLinksSchema = z.object({
  linkedin: optionalUrl,
  github: optionalUrl,
  twitter: optionalUrl,
  facebook: optionalUrl,
  instagram: optionalUrl,
  website: optionalUrl,
});

export type SocialLinksInput = z.infer<typeof socialLinksSchema>;

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["PUBLIC", "MEMBERS_ONLY", "PRIVATE"]).default("PUBLIC"),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  showLocation: z.boolean().default(true),
  showEducation: z.boolean().default(true),
  showExperience: z.boolean().default(true),
  showSkills: z.boolean().default(true),
  showSocialLinks: z.boolean().default(true),
});

export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;

export const defaultPrivacySettings: PrivacySettingsInput = {
  profileVisibility: "PUBLIC",
  showEmail: false,
  showPhone: false,
  showLocation: true,
  showEducation: true,
  showExperience: true,
  showSkills: true,
  showSocialLinks: true,
};

export const fullProfileUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(60).optional(),
  headline: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  phone: z.string().trim().max(25).optional().or(z.literal("")),
  location: contactLocationSchema.optional(),
  education: z.array(educationItemSchema).optional(),
  experience: z.array(experienceItemSchema).optional(),
  skills: z.array(skillItemSchema).optional(),
  interests: z.array(z.string().trim().min(1).max(50)).optional(),
  languages: z.array(languageItemSchema).optional(),
  socialLinks: socialLinksSchema.optional(),
  privacySettings: privacySettingsSchema.optional(),
});

export type FullProfileUpdateInput = z.infer<typeof fullProfileUpdateSchema>;
