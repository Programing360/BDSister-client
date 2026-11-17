import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  basicInfoSchema,
  contactLocationSchema,
  educationItemSchema,
  experienceItemSchema,
  skillsAndInterestsSchema,
  privacySettingsSchema,
  defaultPrivacySettings,
} from "../../src/lib/validations/profile.ts";
import {
  createDefaultProfile,
  filterProfileByPrivacy,
  calculateDetailedProfileCompletion,
} from "../../src/features/profile/utils/profile-utils.ts";
import type { MemberProfileDocument } from "../../src/types/profile.ts";

describe("Member Profile System & Privacy Verification", () => {
  describe("Zod Validation Schemas", () => {
    it("should validate valid basic info and reject names shorter than 2 chars", () => {
      const valid = basicInfoSchema.safeParse({
        displayName: "Tasnim Sultana",
        headline: "Founder & Creative Director",
        bio: "Passionate about empowering female artisans across Rajshahi and Sylhet.",
        avatar: "https://example.com/avatar.jpg",
      });
      assert.strictEqual(valid.success, true);

      const tooShortName = basicInfoSchema.safeParse({
        displayName: "A",
      });
      assert.strictEqual(tooShortName.success, false);
    });

    it("should reject headline longer than 120 characters", () => {
      const longHeadline = "A".repeat(125);
      const res = basicInfoSchema.safeParse({
        displayName: "Tasnim Sultana",
        headline: longHeadline,
      });
      assert.strictEqual(res.success, false);
    });

    it("should validate contact and location data with default country", () => {
      const res = contactLocationSchema.safeParse({
        phone: "+880 1711 000000",
        city: "Dhaka",
        district: "Dhaka",
        division: "Dhaka",
      });
      assert.strictEqual(res.success, true);
      if (res.success) {
        assert.strictEqual(res.data.country, "Bangladesh");
      }
    });

    it("should validate education and experience items", () => {
      const eduRes = educationItemSchema.safeParse({
        id: "edu_1",
        institution: "University of Dhaka",
        degree: "BBA in Finance",
        fieldOfStudy: "Finance",
        startDate: "2018",
        endDate: "2022",
        current: false,
      });
      assert.strictEqual(eduRes.success, true);

      const expRes = experienceItemSchema.safeParse({
        id: "exp_1",
        company: "Grameenphone",
        role: "Product Manager",
        current: true,
      });
      assert.strictEqual(expRes.success, true);
    });

    it("should enforce valid skill and language proficiencies", () => {
      const res = skillsAndInterestsSchema.safeParse({
        skills: [{ id: "s1", name: "Tailoring", level: "EXPERT" }],
        interests: ["Women Leadership", "E-Commerce"],
        languages: [{ language: "Bengali", proficiency: "NATIVE" }],
      });
      assert.strictEqual(res.success, true);
    });

    it("should validate privacy settings with proper defaults", () => {
      const res = privacySettingsSchema.safeParse({});
      assert.strictEqual(res.success, true);
      if (res.success) {
        assert.strictEqual(res.data.profileVisibility, "PUBLIC");
        assert.strictEqual(res.data.showEmail, false);
        assert.strictEqual(res.data.showPhone, false);
        assert.strictEqual(res.data.showLocation, true);
      }
    });
  });

  describe("Profile Completion Calculation", () => {
    it("should calculate baseline score for user with basic account info only", () => {
      const mockUser = {
        name: "Farhana Islam",
        email: "farhana@example.com",
        image: null,
      };
      const mockProfile = createDefaultProfile("usr_1", "Farhana Islam");

      const report = calculateDetailedProfileCompletion(mockUser, mockProfile);
      // Basic account = 15%, languages default present but skills_interests needs at least 1 skill or interest
      assert.strictEqual(report.percentage, 15);
      assert.strictEqual(report.completedCount, 1);
    });

    it("should reach 100% when all profile sections are comprehensively filled", () => {
      const mockUser = {
        name: "Farhana Islam",
        email: "farhana@example.com",
        image: "https://example.com/avatar.jpg",
      };
      const mockProfile: MemberProfileDocument = {
        userId: "usr_1",
        displayName: "Farhana Islam",
        headline: "Tech Founder & AI Researcher",
        bio: "Dedicated to building digital accessibility tools for Bangladeshi micro-entrepreneurs.",
        avatar: "https://example.com/avatar.jpg",
        coverImage: "https://example.com/cover.jpg",
        phone: "+880 1711 000000",
        location: {
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka",
          country: "Bangladesh",
        },
        education: [
          {
            id: "edu_1",
            institution: "BUET",
            degree: "B.Sc. in CSE",
          },
        ],
        experience: [
          {
            id: "exp_1",
            company: "TechSisters Ltd",
            role: "Founder & CEO",
            current: true,
          },
        ],
        skills: [{ id: "sk_1", name: "Next.js", level: "EXPERT" }],
        interests: ["Women in Tech", "AI", "Mentorship"],
        languages: [{ language: "Bengali", proficiency: "NATIVE" }],
        privacySettings: defaultPrivacySettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = calculateDetailedProfileCompletion(mockUser, mockProfile);
      assert.strictEqual(report.percentage, 100);
      assert.strictEqual(report.completedCount, 9);
    });
  });

  describe("Privacy Filtering Service", () => {
    const fullMockProfile: MemberProfileDocument = {
      userId: "usr_100",
      displayName: "Nusrat Jahan",
      headline: "Artisan Leather Crafts Specialist",
      bio: "Crafting sustainable leather products in Hazaribagh.",
      avatar: "https://example.com/nusrat.jpg",
      coverImage: "https://example.com/nusrat_cover.jpg",
      phone: "+880 1812 345678",
      location: {
        city: "Dhaka",
        district: "Dhaka",
        country: "Bangladesh",
      },
      education: [
        {
          id: "edu_1",
          institution: "Dhaka College",
          degree: "HSC",
        },
      ],
      experience: [
        {
          id: "exp_1",
          company: "Heritage Leather",
          role: "Master Artisan",
        },
      ],
      skills: [{ id: "sk_1", name: "Leather Crafting", level: "EXPERT" }],
      socialLinks: { linkedin: "https://linkedin.com/in/nusrat" },
      privacySettings: {
        profileVisibility: "PUBLIC",
        showEmail: false,
        showPhone: false,
        showLocation: false,
        showEducation: false,
        showExperience: false,
        showSkills: false,
        showSocialLinks: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should allow the profile owner to see all fields regardless of privacy toggles", () => {
      const filtered = filterProfileByPrivacy(fullMockProfile, {
        viewerUserId: "usr_100",
        isAuthenticated: true,
        viewerRole: "MEMBER",
      });

      assert.strictEqual(filtered.isRestricted, false);
      assert.strictEqual(filtered.phone, "+880 1812 345678");
      assert.strictEqual(filtered.location?.city, "Dhaka");
      assert.strictEqual(filtered.experience?.length, 1);
      assert.strictEqual(filtered.skills?.length, 1);
    });

    it("should allow platform administrators to inspect unredacted profiles", () => {
      const filtered = filterProfileByPrivacy(fullMockProfile, {
        viewerUserId: "admin_user",
        isAuthenticated: true,
        viewerRole: "ADMIN",
      });

      assert.strictEqual(filtered.isRestricted, false);
      assert.strictEqual(filtered.phone, "+880 1812 345678");
      assert.strictEqual(filtered.location?.city, "Dhaka");
    });

    it("should redact hidden fields for external viewers when toggles are OFF", () => {
      const filtered = filterProfileByPrivacy(fullMockProfile, {
        viewerUserId: "other_sister_200",
        isAuthenticated: true,
        viewerRole: "MEMBER",
      });

      assert.strictEqual(filtered.isRestricted, false);
      assert.strictEqual(filtered.phone, undefined);
      assert.strictEqual(filtered.location, undefined);
      assert.deepStrictEqual(filtered.education, []);
      assert.deepStrictEqual(filtered.experience, []);
      assert.deepStrictEqual(filtered.skills, []);
      assert.deepStrictEqual(filtered.socialLinks, {});
    });

    it("should return restricted minimal view when profile is set to PRIVATE", () => {
      const privateProfile: MemberProfileDocument = {
        ...fullMockProfile,
        privacySettings: {
          ...fullMockProfile.privacySettings!,
          profileVisibility: "PRIVATE",
        },
      };

      const filtered = filterProfileByPrivacy(privateProfile, {
        viewerUserId: "random_visitor",
        isAuthenticated: true,
        viewerRole: "MEMBER",
      });

      assert.strictEqual(filtered.isRestricted, true);
      assert.strictEqual(filtered.restrictedReason, "PRIVATE_PROFILE");
      assert.strictEqual(filtered.displayName, "Private Member");
      assert.strictEqual(filtered.avatar, null);
    });

    it("should restrict MEMBERS_ONLY profiles from unauthenticated visitors", () => {
      const membersOnlyProfile: MemberProfileDocument = {
        ...fullMockProfile,
        privacySettings: {
          ...fullMockProfile.privacySettings!,
          profileVisibility: "MEMBERS_ONLY",
        },
      };

      const filtered = filterProfileByPrivacy(membersOnlyProfile, {
        viewerUserId: null,
        isAuthenticated: false,
        viewerRole: null,
      });

      assert.strictEqual(filtered.isRestricted, true);
      assert.strictEqual(filtered.restrictedReason, "MEMBERS_ONLY");
    });
  });
});
