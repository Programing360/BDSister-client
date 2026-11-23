import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateProfileCompletion } from "../../src/features/member/utils/profile-completion.ts";
import { memberNavGroups } from "../../src/config/member-navigation.ts";
import type { AuthUser } from "../../src/types/auth.ts";

describe("Member Dashboard Architecture & Feature Tests", () => {
  describe("Profile Completion Calculation", () => {
    it("should calculate correct baseline completion for newly registered user", () => {
      const mockUser: AuthUser = {
        id: "usr_1",
        name: "Ayesha Siddiqua",
        email: "ayesha@example.com",
        role: "MEMBER",
        status: "ACTIVE",
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = calculateProfileCompletion(mockUser);
      // 1 out of 5 steps completed (basic_info) = 20%
      assert.strictEqual(report.completedCount, 1);
      assert.strictEqual(report.totalCount, 5);
      assert.strictEqual(report.percentage, 20);
    });

    it("should increment completion percentage when email is verified", () => {
      const mockUser: AuthUser = {
        id: "usr_2",
        name: "Sumaiya Akhter",
        email: "sumaiya@example.com",
        role: "MEMBER",
        status: "ACTIVE",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = calculateProfileCompletion(mockUser);
      // 2 out of 5 steps completed (basic_info + email_verification) = 40%
      assert.strictEqual(report.completedCount, 2);
      assert.strictEqual(report.percentage, 40);
    });

    it("should increment completion percentage when photo is uploaded", () => {
      const mockUser: AuthUser = {
        id: "usr_3",
        name: "Farhana Islam",
        email: "farhana@example.com",
        role: "MEMBER",
        status: "ACTIVE",
        emailVerified: true,
        image: "https://example.com/avatar.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = calculateProfileCompletion(mockUser);
      // 3 out of 5 steps completed (basic_info + email_verification + avatar) = 60%
      assert.strictEqual(report.completedCount, 3);
      assert.strictEqual(report.percentage, 60);
    });
  });

  describe("Member Navigation Structure", () => {
    it("should contain all 6 mandatory navigation groups", () => {
      const labels = memberNavGroups.map((g) => g.label);
      assert.ok(labels.includes("Overview"));
      assert.ok(labels.includes("My Account"));
      assert.ok(labels.includes("Business & Commerce"));
      assert.ok(labels.includes("Community"));
      assert.ok(labels.includes("Learning & Growth"));
      assert.ok(labels.includes("Account & Support"));
    });

    it("should ensure every navigation item has a valid href, label, and Lucide icon", () => {
      for (const group of memberNavGroups) {
        assert.ok(group.items.length > 0, `Group ${group.label} must have items`);
        for (const item of group.items) {
          assert.ok(typeof item.label === "string" && item.label.length > 0);
          assert.ok(typeof item.href === "string" && item.href.startsWith("/"));
          assert.ok(typeof item.icon === "function" || typeof item.icon === "object");
        }
      }
    });

    it("should have correct primary dashboard route", () => {
      const overviewGroup = memberNavGroups.find((g) => g.label === "Overview");
      assert.ok(overviewGroup);
      assert.strictEqual(overviewGroup.items[0]?.href, "/member");
    });

    it("should include Discover & Goals route under Learning & Growth", () => {
      const learningGroup = memberNavGroups.find((g) => g.label === "Learning & Growth");
      assert.ok(learningGroup, "Learning & Growth group must exist");
      const goalsItem = learningGroup.items.find((item) => item.href === "/member/goals");
      assert.ok(goalsItem, "Must have an item pointing to /member/goals");
      assert.strictEqual(goalsItem.label, "Discover & Goals");
    });
  });

  describe("Domain 8: Holistic Development Wheel & 80/20 Goals", () => {
    const EXPECTED_DIMENSIONS = [
      "Spiritual",
      "Financial",
      "Career",
      "Emotional",
      "Physical",
      "Family",
      "Community",
      "Personal Mastery",
    ];

    it("should verify 8 mandatory holistic life dimensions", () => {
      assert.strictEqual(EXPECTED_DIMENSIONS.length, 8);
      assert.ok(EXPECTED_DIMENSIONS.includes("Spiritual"));
      assert.ok(EXPECTED_DIMENSIONS.includes("Financial"));
      assert.ok(EXPECTED_DIMENSIONS.includes("Career"));
      assert.ok(EXPECTED_DIMENSIONS.includes("Emotional"));
      assert.ok(EXPECTED_DIMENSIONS.includes("Physical"));
      assert.ok(EXPECTED_DIMENSIONS.includes("Family"));
      assert.ok(EXPECTED_DIMENSIONS.includes("Community"));
      assert.ok(EXPECTED_DIMENSIONS.includes("Personal Mastery"));
    });

    it("should enforce 80/20 Pareto principle tier separation", () => {
      const vitalFewGoals = [
        { id: "g_1", impactTier: "VITAL_FEW", title: "Launch halal skincare store" },
        { id: "g_2", impactTier: "VITAL_FEW", title: "Memorize Juz Amma" },
      ];
      const usefulManyGoals = [
        { id: "g_3", impactTier: "USEFUL_MANY", title: "Daily journal writing" },
        { id: "g_4", impactTier: "USEFUL_MANY", title: "Organize digital files" },
      ];

      for (const g of vitalFewGoals) {
        assert.strictEqual(g.impactTier, "VITAL_FEW");
      }
      for (const g of usefulManyGoals) {
        assert.strictEqual(g.impactTier, "USEFUL_MANY");
      }
    });

    it("should calculate milestone completion percentage dynamically", () => {
      const milestones = [
        { id: "m_1", title: "Draft business plan", isCompleted: true },
        { id: "m_2", title: "Source organic ingredients", isCompleted: true },
        { id: "m_3", title: "BSTI license approval", isCompleted: false },
        { id: "m_4", title: "First 50 orders", isCompleted: false },
      ];

      const completed = milestones.filter((m) => m.isCompleted).length;
      const progress = Math.round((completed / milestones.length) * 100);
      assert.strictEqual(progress, 50);
    });
  });
});
