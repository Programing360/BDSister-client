import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CURATED_TOOLTIPS, cmsService } from "../../src/lib/services/cms-service.ts";
import { notificationService } from "../../src/lib/services/notification-service.ts";
import { communicationService } from "../../src/lib/services/communication-service.ts";
import { adminService } from "../../src/lib/services/admin-service.ts";

describe("Phase 6: CMS, Tooltips, Notifications & Communication Verification", () => {
  describe("Domain 9: CMS & Hover Glossary Tooltip Engine", () => {
    it("should provide comprehensive curated tooltips with all required platform terms", () => {
      assert.ok(CURATED_TOOLTIPS.length >= 8, "Must provide at least 8 essential terms");

      const terms = CURATED_TOOLTIPS.map((t) => t.term.toLowerCase());
      assert.ok(terms.includes("muhsina"));
      assert.ok(terms.includes("halal compliance"));
      assert.ok(terms.includes("vital few"));
      assert.ok(terms.includes("life harmony index"));
      assert.ok(terms.includes("smart nid"));
      assert.ok(terms.includes("zinipay secure"));
    });

    it("should resolve definitions with valid categories", async () => {
      const tooltips = await cmsService.getTooltips();
      for (const tip of tooltips) {
        assert.ok(tip.term && tip.term.length > 0);
        assert.ok(tip.definition && tip.definition.length > 15);
        assert.ok(["Platform", "Islamic/Ethical", "Legal/Regulatory", "Financial", "Sisterhood"].includes(tip.category));
      }
    });

    it("should provide structured CMS navigation fallback", async () => {
      const nav = await cmsService.getNavigation();
      assert.ok(nav.length > 0, "Navigation must have items");
      for (const item of nav) {
        assert.ok(item.label && item.label.length > 0);
        assert.ok(item.href && item.href.startsWith("/"));
      }
    });

    it("should return content for predefined CMS pages", async () => {
      const guidelines = await cmsService.getPageBySlug("community-guidelines");
      assert.ok(guidelines !== null);
      assert.strictEqual(guidelines.slug, "community-guidelines");
      assert.ok(guidelines.content.includes("Sisterly Dignity"));
    });
  });

  describe("Domain 10: In-App Notifications", () => {
    it("should retrieve initial notifications and calculate unread count", async () => {
      const count = await notificationService.getUnreadCount();
      assert.ok(typeof count === "number");
      assert.ok(count >= 0);

      const all = await notificationService.getNotifications();
      assert.ok(all.length >= 3);
    });

    it("should filter notifications by type and unread state", async () => {
      const unreadList = await notificationService.getNotifications({ unreadOnly: true });
      for (const item of unreadList) {
        assert.strictEqual(item.read, false);
      }
    });

    it("should mark a notification as read", async () => {
      const notifications = await notificationService.getNotifications();
      const first = notifications[0];
      if (first) {
        const updated = await notificationService.markAsRead(first.id);
        assert.strictEqual(updated.read, true);
      }
    });

    it("should mark all notifications as read", async () => {
      const res = await notificationService.markAllAsRead();
      assert.strictEqual(res.success, true);
      const remainingUnread = await notificationService.getUnreadCount();
      assert.strictEqual(remainingUnread, 0);
    });
  });

  describe("Domains 11 & 12: Contact Submissions & Newsletter", () => {
    it("should successfully process contact form submission", async () => {
      const res = await communicationService.submitContact({
        fullName: "Tasnim Rahman",
        email: "tasnim@example.com",
        subject: "Artisan Partnership Inquiry",
        category: "partnerships",
        message: "We would like to introduce our Jamdani weaver collective.",
      });

      assert.strictEqual(res.success, true);
      assert.ok(res.ticketId && res.ticketId.startsWith("TCK-"));
    });

    it("should successfully process newsletter subscription", async () => {
      const res = await communicationService.subscribeNewsletter("sister@example.com");
      assert.strictEqual(res.success, true);
      assert.ok(res.subscriberId && res.subscriberId.startsWith("SUB-"));
    });
  });

  describe("Domain 14: Admin Operations & Secure NID Inspection", () => {
    it("should return high-level platform telemetry metrics", async () => {
      const analytics = await adminService.getAnalytics();
      assert.ok(analytics.totalMembers > 1000);
      assert.ok(analytics.verifiedSisters > 500);
      assert.ok(analytics.totalVolumeBdt > 100000);
      assert.strictEqual(analytics.systemHealth, "OPTIMAL");
    });

    it("should provide pending identity verifications", async () => {
      const pending = await adminService.getPendingVerifications();
      assert.ok(pending.length > 0);
      assert.ok(pending[0]?.nidMasked.includes("•••"));
    });

    it("should enforce female officer authorization and watermarking on NID inspection", async () => {
      const inspection = await adminService.getUserNid("usr_test123");
      assert.ok(inspection.watermarkText.includes("CONFIDENTIAL"));
      assert.ok(inspection.authorizedOfficer.includes("Female Verification Officer"));
      assert.ok(inspection.privacyDisclaimer.includes("AES-256"));
    });

    it("should retrieve administrative audit logs and partner keys", async () => {
      const logs = await adminService.getAuditLogs();
      assert.ok(logs.length > 0);
      assert.strictEqual(logs[0]?.status, "SUCCESS");

      const keys = await adminService.getPartnerKeys();
      assert.ok(keys.length > 0);
      assert.strictEqual(keys[0]?.status, "ACTIVE");
    });
  });
});
