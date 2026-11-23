import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { settingsService } from "../../src/lib/services/settings-service.ts";
import { ROUTES } from "../../src/config/routes.ts";

describe("Member Account & Privacy Settings Verification", () => {
  describe("Routing Configuration", () => {
    it("should verify all 3 member settings routes are registered in routes.ts", () => {
      assert.strictEqual(ROUTES.member.settings, "/member/settings");
      assert.strictEqual(ROUTES.member.settingsSecurity, "/member/settings/security");
      assert.strictEqual(ROUTES.member.settingsPrivacy, "/member/settings/privacy");
    });
  });

  describe("General Settings Service", () => {
    it("should fetch initial general account preferences", async () => {
      const settings = await settingsService.getGeneralSettings();
      assert.ok(settings.displayName && settings.displayName.length >= 2);
      assert.ok(settings.email && settings.email.includes("@"));
      assert.strictEqual(settings.isEmailVerified, true);
      assert.ok(["bn", "en"].includes(settings.preferredLanguage));
      assert.ok(typeof settings.notifications === "object");
      assert.strictEqual(settings.notifications.orderUpdates, true);
    });

    it("should update general account preferences cleanly", async () => {
      const updated = await settingsService.updateGeneralSettings({
        preferredLanguage: "en",
        directoryDiscoverable: true,
      });
      assert.strictEqual(updated.preferredLanguage, "en");
      assert.strictEqual(updated.directoryDiscoverable, true);
    });
  });

  describe("Security Credentials & Sessions", () => {
    it("should retrieve security settings and verify active sessions structure", async () => {
      const security = await settingsService.getSecuritySettings();
      assert.ok(Array.isArray(security.activeSessions));
      assert.ok(security.activeSessions.length >= 2);

      const current = security.activeSessions.find((s) => s.isCurrent);
      assert.ok(current, "Must identify current active device");
      assert.ok(current.ipAddress && current.browser);
    });

    it("should reject password change when new password is too short", async () => {
      await assert.rejects(
        () =>
          settingsService.changePassword({
            currentPassword: "correctCurrentPassword",
            newPassword: "short",
          }),
        /at least 8 characters/
      );
    });

    it("should accept valid password update", async () => {
      const res = await settingsService.changePassword({
        currentPassword: "OldPassword123!",
        newPassword: "NewSecretPassword2026!",
      });
      assert.strictEqual(res.success, true);
      assert.ok(res.message.includes("Password changed successfully"));
    });

    it("should toggle 2FA configuration", async () => {
      const enabledRes = await settingsService.toggle2FA(true, "AUTHENTICATOR");
      assert.strictEqual(enabledRes.enabled, true);

      const disabledRes = await settingsService.toggle2FA(false);
      assert.strictEqual(disabledRes.enabled, false);
    });

    it("should revoke other active sessions while preserving current session", async () => {
      const res = await settingsService.revokeAllOtherSessions();
      assert.strictEqual(res.success, true);

      const security = await settingsService.getSecuritySettings();
      assert.strictEqual(security.activeSessions.length, 1);
      assert.strictEqual(security.activeSessions[0]?.isCurrent, true);
    });
  });

  describe("Privacy & Sensitive Masking Controls", () => {
    it("should retrieve privacy settings with safe defaults (email and phone hidden by default)", async () => {
      const privacy = await settingsService.getPrivacySettings();
      assert.strictEqual(privacy.showEmail, false, "Email must default to hidden");
      assert.strictEqual(privacy.showPhone, false, "Phone must default to hidden");
      assert.ok(["PUBLIC", "MEMBERS_ONLY", "PRIVATE"].includes(privacy.profileVisibility));
    });

    it("should update privacy settings", async () => {
      const updated = await settingsService.updatePrivacySettings({
        profileVisibility: "MEMBERS_ONLY",
        showLocation: true,
      });
      assert.strictEqual(updated.profileVisibility, "MEMBERS_ONLY");
      assert.strictEqual(updated.showLocation, true);
    });

    it("should generate a downloadable personal account data export archive", async () => {
      const blob = await settingsService.exportAccountData();
      assert.ok(blob instanceof Blob);
      assert.strictEqual(blob.type, "application/json");
      assert.ok(blob.size > 50);
    });
  });
});
