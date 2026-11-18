import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../src/lib/validations/auth.ts";
import {
  getSafeRedirectUrl,
  getDefaultDashboardRoute,
} from "../../src/lib/security/redirect.ts";
import { checkRateLimit, resetRateLimit } from "../../src/lib/security/rate-limit.ts";

describe("Authentication Validation & Security Tests", () => {
  describe("Zod Validation Schemas", () => {
    it("should accept valid login input", () => {
      const valid = loginSchema.safeParse({
        email: "sister@bdsisters.org",
        password: "StrongPassword123!",
        rememberMe: true,
      });
      assert.strictEqual(valid.success, true);
    });

    it("should reject invalid login email", () => {
      const invalid = loginSchema.safeParse({
        email: "not-an-email",
        password: "Password123",
      });
      assert.strictEqual(invalid.success, false);
      if (!invalid.success) {
        assert.ok(invalid.error.issues.some((i) => i.path.includes("email")));
      }
    });

    it("should accept valid registration with strong password & legal agreements", () => {
      const valid = registerSchema.safeParse({
        name: "Farhana Ahmed",
        email: "farhana@example.com",
        password: "SecurePassword1",
        confirmPassword: "SecurePassword1",
        referrerCode: "REF-BDSISTER-100",
        acceptTerms: true,
        acceptPrivacy: true,
      });
      assert.strictEqual(valid.success, true);
    });

    it("should reject registration when passwords do not match", () => {
      const invalid = registerSchema.safeParse({
        name: "Farhana Ahmed",
        email: "farhana@example.com",
        password: "SecurePassword1",
        confirmPassword: "DifferentPassword1",
        referrerCode: "REF-BDSISTER-100",
        acceptTerms: true,
        acceptPrivacy: true,
      });
      assert.strictEqual(invalid.success, false);
      if (!invalid.success) {
        assert.ok(invalid.error.issues.some((i) => i.message.includes("match")));
      }
    });

    it("should reject registration without terms acceptance", () => {
      const invalid = registerSchema.safeParse({
        name: "Farhana Ahmed",
        email: "farhana@example.com",
        password: "SecurePassword1",
        confirmPassword: "SecurePassword1",
        referrerCode: "REF-BDSISTER-100",
        acceptTerms: false,
        acceptPrivacy: true,
      });
      assert.strictEqual(invalid.success, false);
    });

    it("should validate forgot password email format", () => {
      assert.strictEqual(
        forgotPasswordSchema.safeParse({ email: "valid@bdsisters.org" }).success,
        true
      );
      assert.strictEqual(
        forgotPasswordSchema.safeParse({ email: "invalid-email" }).success,
        false
      );
    });

    it("should validate reset password schema", () => {
      const valid = resetPasswordSchema.safeParse({
        password: "NewPassword1",
        confirmPassword: "NewPassword1",
        token: "sample-token-abc-123",
      });
      assert.strictEqual(valid.success, true);
    });
  });

  describe("Safe Open-Redirect Guard", () => {
    it("should accept valid internal paths", () => {
      assert.strictEqual(getSafeRedirectUrl("/member"), "/member");
      assert.strictEqual(getSafeRedirectUrl("/admin/users"), "/admin/users");
      assert.strictEqual(
        getSafeRedirectUrl("/courses/tech-leadership?cohort=2"),
        "/courses/tech-leadership?cohort=2"
      );
    });

    it("should neutralize open redirect attempts to external protocols or domains", () => {
      assert.strictEqual(getSafeRedirectUrl("https://evil-phishing.com"), "/member");
      assert.strictEqual(getSafeRedirectUrl("//evil-phishing.com"), "/member");
      assert.strictEqual(getSafeRedirectUrl("/\\evil.com"), "/member");
      assert.strictEqual(getSafeRedirectUrl("javascript:alert(1)"), "/member");
    });

    it("should fall back to provided custom default fallback", () => {
      assert.strictEqual(getSafeRedirectUrl(null, "/admin"), "/admin");
      assert.strictEqual(getSafeRedirectUrl("", "/admin"), "/admin");
    });
  });

  describe("Role-Based Default Dashboard Route", () => {
    it("should route members to /member", () => {
      assert.strictEqual(getDefaultDashboardRoute("MEMBER"), "/member");
      assert.strictEqual(getDefaultDashboardRoute(null), "/member");
      assert.strictEqual(getDefaultDashboardRoute(undefined), "/member");
    });

    it("should route staff and admins to /admin", () => {
      assert.strictEqual(getDefaultDashboardRoute("SUPER_ADMIN"), "/admin");
      assert.strictEqual(getDefaultDashboardRoute("ADMIN"), "/admin");
      assert.strictEqual(getDefaultDashboardRoute("MODERATOR"), "/admin");
      assert.strictEqual(getDefaultDashboardRoute("FINANCE_ADMIN"), "/admin");
      assert.strictEqual(getDefaultDashboardRoute("CONTENT_MANAGER"), "/admin");
      assert.strictEqual(getDefaultDashboardRoute("SUPPORT_AGENT"), "/admin");
    });
  });

  describe("Sliding Window Rate Limiter", () => {
    const testKey = "test-ip-127-0-0-1";

    it("should allow attempts within limit and track remaining count", () => {
      resetRateLimit(testKey);
      const res1 = checkRateLimit(testKey, 3, 10000);
      assert.strictEqual(res1.success, true);
      assert.strictEqual(res1.remaining, 2);

      const res2 = checkRateLimit(testKey, 3, 10000);
      assert.strictEqual(res2.success, true);
      assert.strictEqual(res2.remaining, 1);

      const res3 = checkRateLimit(testKey, 3, 10000);
      assert.strictEqual(res3.success, true);
      assert.strictEqual(res3.remaining, 0);

      const res4 = checkRateLimit(testKey, 3, 10000);
      assert.strictEqual(res4.success, false);
      assert.strictEqual(res4.remaining, 0);
    });

    it("should reset rate limit when explicitly requested", () => {
      resetRateLimit(testKey);
      const res = checkRateLimit(testKey, 3, 10000);
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.remaining, 2);
    });
  });
});
