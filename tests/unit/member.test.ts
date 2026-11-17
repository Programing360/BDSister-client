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
  });
});
