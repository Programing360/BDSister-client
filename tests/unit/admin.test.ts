import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { adminNavGroups } from "../../src/config/admin-navigation.ts";
import {
  DEMO_ADMIN_KPIS,
  DEMO_MEMBER_GROWTH,
  DEMO_REVENUE_TRENDS,
  DEMO_RECENT_ORDERS,
  DEMO_PENDING_APPROVALS,
  DEMO_RECENT_ACTIVITIES,
  DEMO_QUICK_ACTIONS,
} from "../../src/features/admin/data/admin-mock-data.ts";
import {
  DEMO_EVENT_KPIS,
  DEMO_EVENT_CATEGORIES,
  DEMO_EVENTS,
  DEMO_WORKSHOPS,
  DEMO_REGISTRATIONS,
  DEMO_ATTENDEES,
  DEMO_TICKETS,
  DEMO_EVENT_PAYMENTS,
  DEMO_EVENT_FEEDBACK,
  DEMO_EVENT_GROWTH_SERIES,
} from "../../src/features/admin/events/data/mock-events.ts";
import {
  DEMO_CMS_KPIS,
  DEMO_CMS_SECTIONS_HOMEPAGE,
  DEMO_CMS_PAGES,
  DEMO_NAVIGATION_ITEMS,
  DEMO_BANNERS,
  DEMO_SEO_SETTINGS,
  DEMO_FAQS,
  DEMO_WEBSITE_CONTENT,
  DEMO_MEDIA_ASSETS,
  DEMO_CONTENT_REVIEWS,
  DEMO_REVISIONS,
  DEMO_CMS_GROWTH_SERIES,
} from "../../src/features/admin/cms/data/mock-cms.ts";
import {
  DEMO_COMMUNICATION_KPIS,
  DEMO_CONTACT_SUBMISSIONS,
  DEMO_SUPPORT_TICKETS,
  DEMO_COMPLAINTS,
  DEMO_EMAIL_TEMPLATES,
  DEMO_EMAIL_LOGS,
  DEMO_NEWSLETTER_SUBSCRIBERS,
  DEMO_NEWSLETTER_CAMPAIGNS,
  DEMO_ANNOUNCEMENTS,
  DEMO_NOTIFICATION_TEMPLATES,
  DEMO_NOTIFICATION_HISTORY,
  DEMO_BULK_EMAIL_CAMPAIGNS,
  DEMO_LIVE_CHAT_CONVERSATIONS,
  DEMO_COMMUNICATION_CHANNELS,
  DEMO_COMMUNICATION_SETTINGS,
  DEMO_COMMUNICATION_GROWTH_SERIES,
} from "../../src/features/admin/communication/data/mock-communication.ts";
import {
  DEMO_MUHSINA_KPIS,
  DEMO_MUHSINA_WINGS,
  DEMO_MUHSINA_MEMBERS,
  DEMO_SYNC_LOGS,
  DEMO_MAPPING_CONFLICTS,
} from "../../src/features/admin/integrations/muhsina/data/mock-muhsina.ts";
import {
  DEMO_SECURITY_KPIS,
  DEMO_AUDIT_LOGS,
  DEMO_LOGIN_HISTORY,
  DEMO_ACTIVE_SESSIONS,
  DEMO_SECURITY_EVENTS,
  DEMO_BACKUPS,
  DEMO_SERVICE_HEALTH,
} from "../../src/features/admin/security/data/mock-security.ts";

describe("Admin Dashboard Foundation, Layout & Navigation Verification", () => {
  describe("Admin Navigation Structure", () => {
    it("should contain all 9 mandatory enterprise navigation groups", () => {
      const expectedGroups = [
        "Overview",
        "Platform Management",
        "Business & Commerce",
        "Community",
        "Events & Learning",
        "Website Management",
        "Communication",
        "Integrations",
        "System",
      ];

      const actualGroups = adminNavGroups.map((g) => g.label);
      assert.strictEqual(adminNavGroups.length, 9);
      expectedGroups.forEach((groupName) => {
        assert.ok(
          actualGroups.includes(groupName),
          `Missing expected admin navigation group: ${groupName}`
        );
      });
    });

    it("should ensure every navigation item has a valid label, href, and Lucide icon", () => {
      adminNavGroups.forEach((group) => {
        assert.ok(group.items.length > 0, `Group ${group.label} has no items`);
        group.items.forEach((item) => {
          assert.strictEqual(typeof item.label, "string");
          assert.ok(item.label.length > 0);
          assert.strictEqual(typeof item.href, "string");
          assert.ok(item.href.startsWith("/admin"));
          assert.ok(item.icon !== undefined, `Item ${item.label} is missing an icon`);

          if (item.children) {
            assert.ok(item.children.length > 0);
            item.children.forEach((child) => {
              assert.strictEqual(typeof child.label, "string");
              assert.strictEqual(typeof child.href, "string");
              assert.ok(child.href.startsWith("/admin"));
            });
          }
        });
      });
    });

    it("should have correct primary dashboard route pointing to /admin", () => {
      const overviewGroup = adminNavGroups.find((g) => g.id === "overview");
      assert.ok(overviewGroup);
      const dashboardItem = overviewGroup.items.find((i) => i.label === "Dashboard");
      assert.ok(dashboardItem);
      assert.strictEqual(dashboardItem.href, "/admin");
    });
  });

  describe("Demonstration Data Integrity & Presentation Isolation", () => {
    it("should define exactly 8 KPI metric cards covering platform dimensions", () => {
      assert.strictEqual(DEMO_ADMIN_KPIS.length, 8);
      const requiredMetricIds = [
        "total_members",
        "active_members",
        "pending_verifications",
        "total_businesses",
        "published_shops",
        "total_products",
        "total_orders",
        "total_revenue",
      ];

      const actualIds = DEMO_ADMIN_KPIS.map((m) => m.id);
      requiredMetricIds.forEach((id) => {
        assert.ok(actualIds.includes(id), `Missing required KPI metric: ${id}`);
      });
    });

    it("should ensure all KPI metrics have valid numbers, trends, and non-empty comparison text", () => {
      DEMO_ADMIN_KPIS.forEach((kpi) => {
        assert.ok(typeof kpi.rawNumber === "number" && kpi.rawNumber > 0);
        assert.ok(typeof kpi.value === "string" && kpi.value.length > 0);
        assert.ok(["up", "down", "neutral"].includes(kpi.trend));
        assert.ok(typeof kpi.comparisonText === "string" && kpi.comparisonText.length > 0);
        assert.ok(["users", "commerce", "trust"].includes(kpi.category));
      });
    });

    it("should contain 6 months of community growth and revenue tracking points", () => {
      assert.strictEqual(DEMO_MEMBER_GROWTH.length, 6);
      assert.strictEqual(DEMO_REVENUE_TRENDS.length, 6);

      DEMO_MEMBER_GROWTH.forEach((p) => {
        assert.ok(p.registeredMembers > 0);
        assert.ok(p.activeMembers > 0);
        assert.ok(p.businesses > 0);
      });

      DEMO_REVENUE_TRENDS.forEach((r) => {
        assert.ok(r.totalRevenue > 0);
        assert.ok(r.ordersCount > 0);
      });
    });

    it("should ensure demo orders represent valid BDT amounts and statuses", () => {
      assert.ok(DEMO_RECENT_ORDERS.length > 0);
      DEMO_RECENT_ORDERS.forEach((ord) => {
        assert.ok(ord.orderNumber.startsWith("BDS-"));
        assert.ok(ord.totalAmount > 0);
        assert.ok(["PAID", "PENDING", "FAILED", "REFUNDED"].includes(ord.paymentStatus));
        assert.ok(
          ["CONFIRMED", "PROCESSING", "READY_TO_SHIP", "SHIPPED", "DELIVERED"].includes(
            ord.orderStatus
          )
        );
      });
    });

    it("should ensure pending approvals have valid priority levels and descriptions", () => {
      assert.ok(DEMO_PENDING_APPROVALS.length > 0);
      DEMO_PENDING_APPROVALS.forEach((app) => {
        assert.ok(["HIGH", "NORMAL", "LOW"].includes(app.priority));
        assert.ok(app.title.length > 0);
        assert.ok(app.applicantName.length > 0);
      });
    });

    it("should provide 4 quick action workflows for immediate staff execution", () => {
      assert.strictEqual(DEMO_QUICK_ACTIONS.length, 4);
      DEMO_QUICK_ACTIONS.forEach((action) => {
        assert.ok(action.href.startsWith("/admin"));
        assert.ok(action.label.length > 0);
        assert.ok(action.description.length > 0);
      });
    });

    it("should ensure recent activity stream records are formatted and non-empty", () => {
      assert.ok(DEMO_RECENT_ACTIVITIES.length > 0);
      DEMO_RECENT_ACTIVITIES.forEach((activity) => {
        assert.ok(activity.id.length > 0);
        assert.ok(activity.actorName.length > 0);
        assert.ok(activity.action.length > 0);
        assert.ok(activity.target.length > 0);
        assert.ok(activity.timestamp.length > 0);
      });
    });
  });

  describe("Step 2: Platform Analytics & Overview Metric Integrity", () => {
    const timeframes = ["today", "7d", "30d", "90d", "year", "custom"] as const;

    it("should provide exactly 15 KPI metrics (5 primary + 10 additional) across all timeframes", async () => {
      const { DEMO_KPIS_BY_TIMEFRAME } = await import(
        "../../src/features/admin/data/admin-analytics-data.ts"
      );

      timeframes.forEach((tf) => {
        const list = DEMO_KPIS_BY_TIMEFRAME[tf];
        assert.ok(list, `Missing KPI dataset for timeframe: ${tf}`);
        assert.strictEqual(list.length, 15, `Timeframe ${tf} must define exactly 15 metrics`);

        const primaryList = list.filter((m) => m.isPrimary);
        const additionalList = list.filter((m) => !m.isPrimary);

        assert.strictEqual(primaryList.length, 5, `Timeframe ${tf} must have 5 primary metrics`);
        assert.strictEqual(
          additionalList.length,
          10,
          `Timeframe ${tf} must have 10 additional metrics`
        );

        // Check required metric IDs
        const actualIds = list.map((m) => m.id);
        const requiredIds = [
          "total_members",
          "active_members",
          "total_businesses",
          "total_orders",
          "total_revenue",
          "free_members",
          "paid_members",
          "pending_verifications",
          "published_businesses",
          "pending_business_approvals",
          "total_products",
          "pending_orders",
          "pending_payments",
          "successful_payments",
          "failed_payments",
        ];

        requiredIds.forEach((reqId) => {
          assert.ok(
            actualIds.includes(reqId),
            `Timeframe ${tf} missing required metric ID: ${reqId}`
          );
        });
      });
    });

    it("should ensure Member Growth datasets have valid intervals and non-negative numbers", async () => {
      const {
        DEMO_MEMBER_GROWTH_SERIES,
        DEMO_MEMBER_DISTRIBUTION,
        DEMO_MEMBER_ACTIVITY_SUMMARY,
      } = await import("../../src/features/admin/data/admin-analytics-data.ts");

      assert.strictEqual(DEMO_MEMBER_GROWTH_SERIES["7d"].length, 7);
      assert.strictEqual(DEMO_MEMBER_GROWTH_SERIES["30d"].length, 4);
      assert.strictEqual(DEMO_MEMBER_GROWTH_SERIES["90d"].length, 3);
      assert.strictEqual(DEMO_MEMBER_GROWTH_SERIES["12m"].length, 12);

      // Verify distribution percentages sum accurately
      const tierSum =
        DEMO_MEMBER_DISTRIBUTION.freePercentage + DEMO_MEMBER_DISTRIBUTION.paidPercentage;
      assert.ok(Math.abs(tierSum - 100) < 0.1, "Tier percentages must sum to 100%");

      const activeSum =
        DEMO_MEMBER_DISTRIBUTION.activePercentage +
        DEMO_MEMBER_DISTRIBUTION.inactivePercentage;
      assert.ok(Math.abs(activeSum - 100) < 0.1, "Active percentages must sum to 100%");

      assert.ok(DEMO_MEMBER_ACTIVITY_SUMMARY.profileCompletionAverage > 0);
      assert.ok(DEMO_MEMBER_ACTIVITY_SUMMARY.recentlyActiveMembers > 0);
    });

    it("should verify Business Ecosystem metrics, category shares, and verification compliance", async () => {
      const {
        DEMO_BUSINESS_CATEGORIES,
        DEMO_RECENT_BUSINESS_SUBMISSIONS,
        DEMO_BUSINESS_VERIFICATION_SUMMARY,
      } = await import("../../src/features/admin/data/admin-analytics-data.ts");

      assert.strictEqual(DEMO_BUSINESS_CATEGORIES.length, 6);
      const catPercentSum = DEMO_BUSINESS_CATEGORIES.reduce(
        (acc, c) => acc + c.percentage,
        0
      );
      assert.ok(Math.abs(catPercentSum - 100) < 0.5, "Category percentages must sum to ~100%");

      assert.ok(DEMO_RECENT_BUSINESS_SUBMISSIONS.length > 0);
      DEMO_RECENT_BUSINESS_SUBMISSIONS.forEach((sub) => {
        assert.ok(sub.businessName.length > 0);
        assert.ok(sub.verificationDocs.length > 0);
      });

      assert.ok(DEMO_BUSINESS_VERIFICATION_SUMMARY.tradeLicenseVerifiedRate > 50);
      assert.ok(DEMO_BUSINESS_VERIFICATION_SUMMARY.nidVerifiedRate > 90);
    });

    it("should verify E-commerce order lifecycle and top products/sellers", async () => {
      const {
        DEMO_ORDER_STATUS_BREAKDOWN,
        DEMO_PRODUCT_INVENTORY_BREAKDOWN,
        DEMO_TOP_SELLING_PRODUCTS,
        DEMO_TOP_PERFORMING_SELLERS,
      } = await import("../../src/features/admin/data/admin-analytics-data.ts");

      assert.ok(DEMO_ORDER_STATUS_BREAKDOWN.total > 0);
      const computedOrdersTotal =
        DEMO_ORDER_STATUS_BREAKDOWN.pending +
        DEMO_ORDER_STATUS_BREAKDOWN.processing +
        DEMO_ORDER_STATUS_BREAKDOWN.shipped +
        DEMO_ORDER_STATUS_BREAKDOWN.delivered +
        DEMO_ORDER_STATUS_BREAKDOWN.cancelled;
      assert.strictEqual(
        computedOrdersTotal,
        DEMO_ORDER_STATUS_BREAKDOWN.total,
        "Order status breakdown components must equal total orders"
      );

      assert.ok(DEMO_PRODUCT_INVENTORY_BREAKDOWN.total > 0);
      assert.strictEqual(DEMO_TOP_SELLING_PRODUCTS.length, 5);
      DEMO_TOP_SELLING_PRODUCTS.forEach((prod) => {
        assert.ok(prod.unitsSold > 0);
        assert.ok(prod.revenue > 0);
        assert.ok(prod.rank >= 1 && prod.rank <= 5);
      });

      assert.strictEqual(DEMO_TOP_PERFORMING_SELLERS.length, 4);
      DEMO_TOP_PERFORMING_SELLERS.forEach((seller) => {
        assert.ok(seller.ordersFulfilled > 0);
        assert.ok(seller.rating >= 4.0);
      });
    });

    it("should verify strict financial accounting constraints (Net = Gross - Refunds)", async () => {
      const {
        DEMO_FINANCIAL_SUMMARY,
        DEMO_PAYMENT_BREAKDOWN,
      } = await import("../../src/features/admin/data/admin-analytics-data.ts");

      // Strict financial rule: Net Revenue must equal Gross Revenue minus Refunded Amount
      const computedNet =
        DEMO_FINANCIAL_SUMMARY.grossRevenue - DEMO_FINANCIAL_SUMMARY.refundedAmount;
      assert.strictEqual(
        DEMO_FINANCIAL_SUMMARY.netRevenue,
        computedNet,
        "Net revenue must strictly equal gross revenue minus refunds"
      );

      // Pending and failed payments must not count toward successful revenue
      assert.ok(DEMO_FINANCIAL_SUMMARY.failedPaymentsCount > 0);
      assert.ok(DEMO_FINANCIAL_SUMMARY.pendingPaymentsCount > 0);
      assert.ok(DEMO_PAYMENT_BREAKDOWN.successfulPercentage > 90);
    });

    it("should support all 9 required activity types in the platform activity stream", async () => {
      const { DEMO_DETAILED_ACTIVITIES } = await import(
        "../../src/features/admin/data/admin-analytics-data.ts"
      );

      assert.strictEqual(DEMO_DETAILED_ACTIVITIES.length, 9);
      const actualTypes = DEMO_DETAILED_ACTIVITIES.map((a) => a.type);
      const requiredTypes = [
        "MEMBER_REGISTERED",
        "PROFILE_SUBMITTED",
        "VERIFICATION_SUBMITTED",
        "BUSINESS_CREATED",
        "BUSINESS_APPROVED",
        "PRODUCT_SUBMITTED",
        "ORDER_PLACED",
        "PAYMENT_RECEIVED",
        "SUPPORT_TICKET",
      ];

      requiredTypes.forEach((reqType) => {
        assert.ok(
          actualTypes.includes(reqType as (typeof actualTypes)[number]),
          `Missing required activity type: ${reqType}`
        );
      });
    });

    it("should ensure 5 approval categories and 8 quick actions point to valid /admin routes", async () => {
      const {
        DEMO_PENDING_APPROVAL_CATEGORIES,
        DEMO_QUICK_ACTIONS_STEP2,
      } = await import("../../src/features/admin/data/admin-analytics-data.ts");

      assert.strictEqual(DEMO_PENDING_APPROVAL_CATEGORIES.length, 5);
      DEMO_PENDING_APPROVAL_CATEGORIES.forEach((app) => {
        assert.ok(app.href.startsWith("/admin/"));
        assert.ok(app.pendingCount > 0);
      });

      assert.strictEqual(DEMO_QUICK_ACTIONS_STEP2.length, 8);
      DEMO_QUICK_ACTIONS_STEP2.forEach((qa) => {
        assert.ok(qa.href.startsWith("/admin/"));
        assert.ok(qa.isAvailable === true);
      });
    });
  });

  describe("Admin Step 3 - Member Management & Verification System Verification", () => {
    it("should verify Member KPI data metrics and completeness", async () => {
      const { DEMO_MEMBER_KPIS, DEMO_MEMBER_DISCLAIMER } = await import(
        "../../src/features/admin/members/data/admin-members-data.ts"
      );

      assert.ok(DEMO_MEMBER_KPIS.totalMembers > 10000);
      assert.ok(DEMO_MEMBER_KPIS.activeMembers > 0);
      assert.ok(DEMO_MEMBER_KPIS.freeMembers > DEMO_MEMBER_KPIS.paidMembers);
      assert.ok(DEMO_MEMBER_KPIS.suspendedMembers >= 0);
      assert.ok(DEMO_MEMBER_KPIS.pendingVerifications > 0);
      assert.ok(DEMO_MEMBER_DISCLAIMER.includes("DEMONSTRATION RECORDS"));
    });

    it("should verify Demonstration Members dataset integrity and district validity", async () => {
      const { DEMO_ADMIN_MEMBERS, getAdminMemberById } = await import(
        "../../src/features/admin/members/data/admin-members-data.ts"
      );
      const { BD_DISTRICTS } = await import(
        "../../src/features/admin/members/data/bangladesh-locations.ts"
      );

      assert.strictEqual(DEMO_ADMIN_MEMBERS.length >= 10, true);

      DEMO_ADMIN_MEMBERS.forEach((member) => {
        assert.ok(member.id.startsWith("mem_"));
        assert.ok(member.memberId.startsWith("BDS-MEM-"));
        assert.ok(member.name.length > 0);
        assert.ok(member.email.includes("@"));
        assert.ok(member.phone.startsWith("+880"));
        assert.ok(["ACTIVE", "SUSPENDED", "BANNED", "PENDING"].includes(member.accountStatus));
        assert.ok(["FREE", "PAID"].includes(member.membershipType));
        assert.ok(typeof member.emailVerified === "boolean");
        assert.ok(
          [
            "NOT_SUBMITTED",
            "PENDING",
            "UNDER_REVIEW",
            "VERIFIED",
            "REJECTED",
            "ACTION_REQUIRED",
          ].includes(member.verificationStatus)
        );
        assert.ok(member.profileCompletion >= 0 && member.profileCompletion <= 100);

        if (member.location?.district) {
          assert.ok(
            BD_DISTRICTS.includes(member.location.district as (typeof BD_DISTRICTS)[number]),
            `Invalid district in demo data: ${member.location.district}`
          );
        }
      });

      // Test member lookup helper
      const lookup1 = getAdminMemberById("mem_101");
      assert.ok(lookup1 !== undefined);
      assert.strictEqual(lookup1.name, "Nusrat Jahan Chowdhury");

      const lookup2 = getAdminMemberById("BDS-MEM-10492");
      assert.ok(lookup2 !== undefined);
      assert.strictEqual(lookup2.id, "mem_101");

      const lookupNone = getAdminMemberById("non_existent_id");
      assert.strictEqual(lookupNone, undefined);
    });

    it("should verify strict separation between Account Status, Membership, and Verification Status", async () => {
      const { DEMO_ADMIN_MEMBERS } = await import(
        "../../src/features/admin/members/data/admin-members-data.ts"
      );

      // Verify that free members can be verified, paid members can be unverified/pending, etc.
      const hasFreeVerified = DEMO_ADMIN_MEMBERS.some(
        (m) => m.membershipType === "FREE" && m.verificationStatus === "VERIFIED"
      );
      const hasPaidPending = DEMO_ADMIN_MEMBERS.some(
        (m) => m.membershipType === "PAID" && m.verificationStatus === "PENDING"
      );
      const hasSuspended = DEMO_ADMIN_MEMBERS.some(
        (m) => m.accountStatus === "SUSPENDED"
      );

      assert.ok(hasFreeVerified, "Should have free verified members (status independence)");
      assert.ok(hasPaidPending, "Should have paid pending verification members (status independence)");
      assert.ok(hasSuspended, "Should have suspended members in moderation demo");
    });

    it("should verify Verification Submissions dataset and document synthetic masking", async () => {
      const {
        DEMO_VERIFICATION_SUBMISSIONS,
        DEMO_VERIFICATION_KPIS,
        DEMO_VERIFICATION_DISCLAIMER,
        getAdminVerificationById,
      } = await import(
        "../../src/features/admin/verifications/data/admin-verifications-data.ts"
      );

      assert.ok(DEMO_VERIFICATION_KPIS.totalSubmissions > 1000);
      assert.ok(DEMO_VERIFICATION_KPIS.pendingReview > 0);
      assert.ok(DEMO_VERIFICATION_DISCLAIMER.includes("SYNTHETIC VERIFICATION DATASET"));
      assert.strictEqual(DEMO_VERIFICATION_SUBMISSIONS.length >= 8, true);

      DEMO_VERIFICATION_SUBMISSIONS.forEach((sub) => {
        assert.ok(sub.id.startsWith("ver_"));
        assert.ok(sub.submissionId.startsWith("BDS-VER-"));
        assert.ok(sub.memberId.startsWith("BDS-MEM-"));
        assert.ok(sub.memberName.length > 0);
        assert.ok(sub.documentNumberMasked.includes("****"), "Document number must be masked");
        assert.ok(["NATIONAL_ID", "PASSPORT"].includes(sub.documentType));
        assert.ok(
          [
            "PENDING",
            "UNDER_REVIEW",
            "VERIFIED",
            "REJECTED",
            "ACTION_REQUIRED",
          ].includes(sub.status)
        );
        assert.ok(sub.documents.length > 0);
        sub.documents.forEach((doc) => {
          assert.ok(doc.samplePreviewWatermark.includes("DEMO SAMPLE"));
          assert.ok(doc.fileSize.includes("MB") || doc.fileSize.includes("KB"));
        });
      });

      // Test verification lookup helper
      const lookupSub1 = getAdminVerificationById("ver_201");
      assert.ok(lookupSub1 !== undefined);
      assert.strictEqual(lookupSub1.memberName, "Sabrina Akter");

      const lookupSub2 = getAdminVerificationById("BDS-VER-2026-081");
      assert.ok(lookupSub2 !== undefined);
      assert.strictEqual(lookupSub2.id, "ver_201");

      const lookupSubNone = getAdminVerificationById("invalid_id");
      assert.strictEqual(lookupSubNone, undefined);
    });

    it("should verify all 7 Admin Step 3 routes are configured in routes.ts", async () => {
      const { ROUTES } = await import("../../src/config/routes.ts");

      assert.strictEqual(ROUTES.admin.members, "/admin/members");
      assert.strictEqual(ROUTES.admin.memberCreate, "/admin/members/create");
      assert.strictEqual(ROUTES.admin.memberDetails("BDS-MEM-10492"), "/admin/members/BDS-MEM-10492");
      assert.strictEqual(ROUTES.admin.memberEdit("BDS-MEM-10492"), "/admin/members/BDS-MEM-10492/edit");
      assert.strictEqual(ROUTES.admin.verifications, "/admin/verifications");
      assert.strictEqual(ROUTES.admin.verificationsPending, "/admin/verifications/pending");
      assert.strictEqual(ROUTES.admin.verificationDetails("ver_201"), "/admin/verifications/ver_201");
    });
  });

  describe("Step 4 - Role, Permission & Access Management System Verification", () => {
    it("should verify all 6 Admin Step 4 routes and sub-navigation are configured", async () => {
      const { ROUTES } = await import("../../src/config/routes.ts");

      assert.strictEqual(ROUTES.admin.roles, "/admin/roles");
      assert.strictEqual(ROUTES.admin.roleCreate, "/admin/roles/create");
      assert.strictEqual(ROUTES.admin.roleDetails("admin"), "/admin/roles/admin");
      assert.strictEqual(ROUTES.admin.roleEdit("admin"), "/admin/roles/admin/edit");
      assert.strictEqual(ROUTES.admin.permissions, "/admin/permissions");
      assert.strictEqual(ROUTES.admin.permissionsGroups, "/admin/permissions/groups");

      // Verify admin sub-navigation reflects Permission Groups
      const platformGroup = adminNavGroups.find((g) => g.id === "platform-management");
      assert.ok(platformGroup, "Platform management nav group must exist");
      const rolesItem = platformGroup.items.find((i) => i.href === "/admin/roles");
      assert.ok(rolesItem, "Roles & Permissions nav item must exist");
      assert.ok(rolesItem.children, "Roles item should have sub-links");
      const groupsSubItem = rolesItem.children.find((c) => c.href === "/admin/permissions/groups");
      assert.ok(groupsSubItem, "Permission Groups sub-navigation must exist");
    });

    it("should verify the 15 Functional Permission Domains and 72 Granular Capabilities", async () => {
      const {
        PERMISSION_GROUPS,
        PERMISSION_ITEMS,
        DEMO_PERMISSIONS_DISCLAIMER,
        getPermissionByKey,
        getPermissionsByGroup,
        getAllPermissionKeys,
      } = await import(
        "../../src/features/admin/roles/data/admin-permissions-data.ts"
      );

      assert.ok(DEMO_PERMISSIONS_DISCLAIMER.includes("FRONTEND PERMISSION MATRIX"));

      // Exactly 15 groups
      assert.strictEqual(PERMISSION_GROUPS.length, 15, "Must have exactly 15 permission groups");

      const expectedGroupIds = [
        "dashboard",
        "members",
        "verifications",
        "profiles",
        "roles",
        "businesses",
        "products",
        "orders",
        "payments",
        "community",
        "events",
        "resources",
        "cms",
        "communications",
        "security",
      ];

      const actualGroupIds = PERMISSION_GROUPS.map((g) => g.id);
      expectedGroupIds.forEach((id) => {
        assert.ok(actualGroupIds.includes(id), `Missing permission group: ${id}`);
      });

      // Exactly 72 granular permissions
      assert.strictEqual(PERMISSION_ITEMS.length, 72, "Must define exactly 72 granular permissions");

      const allKeys = getAllPermissionKeys();
      assert.strictEqual(allKeys.length, 72);

      PERMISSION_ITEMS.forEach((perm) => {
        assert.ok(perm.id.startsWith("perm_"), `Invalid permission id: ${perm.id}`);
        assert.ok(perm.key.includes("."), `Permission key must be formatted as domain.action: ${perm.key}`);
        assert.ok(perm.name.length > 0);
        assert.ok(perm.description.length > 0);
        assert.ok(actualGroupIds.includes(perm.groupId), `Orphan permission group: ${perm.groupId}`);
        assert.ok(
          ["STANDARD", "SENSITIVE", "CRITICAL"].includes(perm.riskLevel),
          `Invalid risk severity level: ${perm.riskLevel}`
        );
      });

      // Verify helpers
      const permByKey = getPermissionByKey("roles.create");
      assert.ok(permByKey !== undefined);
      assert.strictEqual(permByKey.groupId, "roles");
      assert.strictEqual(permByKey.riskLevel, "CRITICAL");

      const groupPerms = getPermissionsByGroup("verifications");
      assert.strictEqual(groupPerms.length, 5);
      groupPerms.forEach((p) => assert.strictEqual(p.groupId, "verifications"));
    });

    it("should verify Administrative Roles, Built-in Role Protection, and Custom Role definitions", async () => {
      const {
        DEMO_ADMIN_ROLES,
        DEMO_ROLE_KPIS,
        DEMO_ROLE_DISCLAIMER,
        getAdminRoleByIdOrSlug,
        getRoleKpis,
      } = await import(
        "../../src/features/admin/roles/data/admin-roles-data.ts"
      );

      assert.ok(DEMO_ROLE_DISCLAIMER.includes("SIMULATED ROLE REPOSITORY"));
      assert.strictEqual(DEMO_ADMIN_ROLES.length, 11, "Must contain 8 built-in roles and 3 custom roles");

      // Verify 8 built-in system roles
      const builtInRoles = DEMO_ADMIN_ROLES.filter((r) => r.type === "BUILT_IN");
      assert.strictEqual(builtInRoles.length, 8, "Must contain exactly 8 built-in roles");

      const expectedBuiltInSlugs = [
        "super-admin",
        "admin",
        "moderator",
        "finance-admin",
        "content-manager",
        "support-agent",
        "member",
        "guest",
      ];

      builtInRoles.forEach((r) => {
        assert.ok(expectedBuiltInSlugs.includes(r.slug), `Unexpected built-in role slug: ${r.slug}`);
        assert.strictEqual(r.isProtected, true, `Built-in role ${r.name} must be protected against deletion/modification`);
        assert.ok(r.permissionKeys.length > 0, `Role ${r.name} must have assigned permissions`);
      });

      // Super Admin must have all 72 capabilities
      const superAdmin = getAdminRoleByIdOrSlug("super-admin");
      assert.ok(superAdmin !== undefined);
      assert.strictEqual(superAdmin.permissionKeys.length, 72, "Super Admin must hold all 72 permissions");
      assert.strictEqual(superAdmin.isProtected, true);

      // Verify 3 custom roles
      const customRoles = DEMO_ADMIN_ROLES.filter((r) => r.type === "CUSTOM");
      assert.strictEqual(customRoles.length, 3, "Must contain exactly 3 custom roles");
      customRoles.forEach((r) => {
        assert.strictEqual(r.isProtected, false, `Custom role ${r.name} should be editable/deletable`);
        assert.ok(
          ["COMMERCE", "COMMUNITY", "FINANCE", "SYSTEM", "CUSTOM"].includes(r.category),
          `Invalid category: ${r.category}`
        );
        assert.ok(r.slug.length > 0);
      });

      // Test lookup helper
      const lookupById = getAdminRoleByIdOrSlug("role_moderator");
      assert.ok(lookupById !== undefined);
      assert.strictEqual(lookupById.slug, "moderator");

      const lookupBySlugCaseInsensitive = getAdminRoleByIdOrSlug("FINANCE-ADMIN");
      assert.ok(lookupBySlugCaseInsensitive !== undefined);
      assert.strictEqual(lookupBySlugCaseInsensitive.id, "role_finance_admin");

      const lookupNonExistent = getAdminRoleByIdOrSlug("non_existent_role");
      assert.strictEqual(lookupNonExistent, undefined);

      // Verify KPI counts
      const kpis = getRoleKpis();
      assert.strictEqual(kpis.totalRoles, 11);
      assert.strictEqual(kpis.builtInRoles, 8);
      assert.strictEqual(kpis.customRoles, 3);
      assert.strictEqual(kpis.availablePermissionGroups, 15);
      assert.strictEqual(kpis.totalPermissions, 72);
      assert.ok(kpis.activeRoleAssignments > 0);
    });

    it("should strictly maintain the separation between Membership Tier and Access Role", async () => {
      const { DEMO_ROLE_ASSIGNMENT_MEMBERS } = await import(
        "../../src/features/admin/roles/data/admin-roles-data.ts"
      );

      assert.strictEqual(DEMO_ROLE_ASSIGNMENT_MEMBERS.length >= 8, true);

      // Verify distinction: Paid members do NOT automatically receive administrative rights
      const paidMembers = DEMO_ROLE_ASSIGNMENT_MEMBERS.filter((m) => m.membershipType === "PAID");
      assert.ok(paidMembers.length > 0, "Must have PAID members in role assignment simulation");

      // Some paid members are regular custom specialists or mentors, not full super admins
      const freeMembers = DEMO_ROLE_ASSIGNMENT_MEMBERS.filter((m) => m.membershipType === "FREE");
      assert.ok(freeMembers.length > 0, "Must have FREE members in assignment simulation");

      // Verify data contract
      DEMO_ROLE_ASSIGNMENT_MEMBERS.forEach((assignment) => {
        assert.ok(assignment.id.startsWith("mem_"));
        assert.ok(assignment.memberId.startsWith("BDS-MEM-"));
        assert.ok(assignment.name.length > 0);
        assert.ok(assignment.email.includes("@"));
        assert.ok(["FREE", "PAID"].includes(assignment.membershipType));
        assert.ok(
          ["ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "INACTIVE"].includes(
            assignment.accountStatus
          )
        );
        assert.ok(typeof assignment.currentRole === "string");
        assert.ok(typeof assignment.currentRoleName === "string");
      });
    });

    it("should verify Role Audit History records", async () => {
      const { DEMO_ROLE_CHANGE_LOGS } = await import(
        "../../src/features/admin/roles/data/admin-roles-data.ts"
      );

      assert.strictEqual(DEMO_ROLE_CHANGE_LOGS.length >= 5, true);

      DEMO_ROLE_CHANGE_LOGS.forEach((log) => {
        assert.ok(log.id.startsWith("log_"));
        assert.ok(log.adminName.length > 0);
        assert.ok(log.adminRole.length > 0);
        assert.ok(
          ["ROLE_CREATED", "ROLE_UPDATED", "ROLE_MODIFIED", "ROLE_ASSIGNED", "ROLE_REVOKED"].includes(
            log.actionType
          )
        );
        assert.ok(log.timestamp.length > 0);
        assert.ok(log.affectedMemberName.length > 0);
        assert.ok(log.reason.length > 0);
      });
    });
  });

  describe("Admin Step 5 - Member Profile Management & Approval System Verification", () => {
    it("should verify all 9 Admin Step 5 routes and navigation children are configured", async () => {
      const { ROUTES } = await import("../../src/config/routes.ts");

      assert.strictEqual(ROUTES.admin.profiles, "/admin/profiles");
      assert.strictEqual(ROUTES.admin.profilePending, "/admin/profiles/pending");
      assert.strictEqual(ROUTES.admin.profilePublished, "/admin/profiles/published");
      assert.strictEqual(ROUTES.admin.profileRejected, "/admin/profiles/rejected");
      assert.strictEqual(ROUTES.admin.profileDetails("prof_301"), "/admin/profiles/prof_301");
      assert.strictEqual(ROUTES.admin.profileEdit("prof_301"), "/admin/profiles/prof_301/edit");
      assert.strictEqual(ROUTES.admin.profileCategories, "/admin/profiles/categories");
      assert.strictEqual(ROUTES.admin.profileReports, "/admin/profiles/reports");
      assert.strictEqual(ROUTES.admin.profileFeatured, "/admin/profiles/featured");

      // Verify admin sub-navigation reflects complete profile management hub
      const platformGroup = adminNavGroups.find((g) => g.id === "platform-management");
      assert.ok(platformGroup, "Platform management nav group must exist");
      const profilesItem = platformGroup.items.find((i) => i.href === "/admin/profiles");
      assert.ok(profilesItem, "Profiles nav item must exist");
      assert.ok(profilesItem.children, "Profiles item should have sub-links");

      const expectedSubLinks = [
        "/admin/profiles",
        "/admin/profiles/pending",
        "/admin/profiles/published",
        "/admin/profiles/categories",
        "/admin/profiles/reports",
        "/admin/profiles/featured",
      ];

      const actualSubHrefs = profilesItem.children.map((c) => c.href);
      expectedSubLinks.forEach((href) => {
        assert.ok(actualSubHrefs.includes(href), `Missing sub-nav href: ${href}`);
      });
    });

    it("should verify Profile KPI data and demonstration disclaimer", async () => {
      const {
        DEMO_PROFILE_KPIS,
        DEMO_PROFILES_DISCLAIMER,
      } = await import(
        "../../src/features/admin/profiles/data/admin-profiles-data.ts"
      );

      assert.ok(DEMO_PROFILES_DISCLAIMER.includes("SIMULATED PROFILE HUB"));
      assert.strictEqual(DEMO_PROFILE_KPIS.totalProfiles, 2537);
      assert.strictEqual(DEMO_PROFILE_KPIS.publishedProfiles, 2180);
      assert.strictEqual(DEMO_PROFILE_KPIS.pendingApproval, 142);
      assert.strictEqual(DEMO_PROFILE_KPIS.rejectedProfiles, 38);
      assert.strictEqual(DEMO_PROFILE_KPIS.draftProfiles, 115);
      assert.strictEqual(DEMO_PROFILE_KPIS.reportedProfiles, 18);
      assert.strictEqual(DEMO_PROFILE_KPIS.featuredProfiles, 24);
      assert.strictEqual(DEMO_PROFILE_KPIS.changesRequestedCount, 44);
    });

    it("should verify Demonstration Profiles dataset integrity and lookups", async () => {
      const {
        DEMO_ADMIN_PROFILES,
        getAdminProfileById,
        getAdminProfilesByStatus,
        getFeaturedProfiles,
      } = await import(
        "../../src/features/admin/profiles/data/admin-profiles-data.ts"
      );

      assert.ok(DEMO_ADMIN_PROFILES.length >= 10, "Must contain at least 10 demo profiles");

      const validApprovalStatuses = [
        "DRAFT",
        "PENDING_REVIEW",
        "UNDER_REVIEW",
        "PUBLISHED",
        "CHANGES_REQUESTED",
        "REJECTED",
        "SUSPENDED",
      ];

      const validVisibilities = ["PUBLIC", "MEMBERS_ONLY", "PRIVATE"];
      const validVerificationBadges = ["VERIFIED", "PENDING", "UNDER_REVIEW", "NOT_SUBMITTED", "REJECTED"];

      DEMO_ADMIN_PROFILES.forEach((profile) => {
        assert.ok(profile.id.startsWith("prof_"));
        assert.ok(profile.memberId.startsWith("BDS-MEM-"));
        assert.ok(profile.fullName.length > 0);
        assert.ok(profile.profession.length > 0);
        assert.ok(profile.email.includes("@"));
        assert.ok(profile.category.length > 0);
        assert.ok(validApprovalStatuses.includes(profile.approvalStatus), `Invalid approval status: ${profile.approvalStatus}`);
        assert.ok(validVisibilities.includes(profile.profileVisibility), `Invalid visibility: ${profile.profileVisibility}`);
        assert.ok(validVerificationBadges.includes(profile.verificationStatus), `Invalid verification: ${profile.verificationStatus}`);
        assert.ok(typeof profile.profileCompletion === "number" && profile.profileCompletion >= 0 && profile.profileCompletion <= 100);
        assert.ok(typeof profile.isFeatured === "boolean");
        assert.ok(typeof profile.business.hasBusiness === "boolean");
      });

      // Test Lookup Helpers
      const nusrat = getAdminProfileById("prof_301");
      assert.ok(nusrat !== undefined);
      assert.strictEqual(nusrat.fullName, "Nusrat Jahan Chowdhury");

      const byMemberId = getAdminProfileById("BDS-MEM-10492");
      assert.ok(byMemberId !== undefined);
      assert.strictEqual(byMemberId.id, "prof_301");

      const byUserIdCaseInsensitive = getAdminProfileById("USER_NUSRAT_JAHAN");
      assert.ok(byUserIdCaseInsensitive !== undefined);
      assert.strictEqual(byUserIdCaseInsensitive.id, "prof_301");

      const none = getAdminProfileById("non_existent_profile");
      assert.strictEqual(none, undefined);

      // Status filters
      const published = getAdminProfilesByStatus("PUBLISHED");
      assert.ok(published.length > 0);
      published.forEach((p) => assert.strictEqual(p.approvalStatus, "PUBLISHED"));

      const pending = getAdminProfilesByStatus("PENDING_REVIEW");
      assert.ok(pending.length > 0);
      pending.forEach((p) => assert.strictEqual(p.approvalStatus, "PENDING_REVIEW"));

      // Featured profiles
      const featured = getFeaturedProfiles();
      assert.ok(featured.length > 0);
      featured.forEach((p) => {
        assert.strictEqual(p.isFeatured, true);
        assert.ok(p.featuredOrder !== undefined && p.featuredOrder > 0);
      });
    });

    it("should verify dynamic profile completeness score calculation", async () => {
      const {
        getAdminProfileById,
        calculateProfileCompletenessScore,
      } = await import(
        "../../src/features/admin/profiles/data/admin-profiles-data.ts"
      );

      const nusrat = getAdminProfileById("prof_301");
      assert.ok(nusrat !== undefined);

      const scoreNusrat = calculateProfileCompletenessScore(nusrat);
      assert.strictEqual(scoreNusrat.percentage, 100, "Nusrat should have 100% complete profile");
      assert.strictEqual(scoreNusrat.breakdown.length, 8);
      scoreNusrat.breakdown.forEach((b) => assert.strictEqual(b.completed, true));

      const afroza = getAdminProfileById("prof_309");
      assert.ok(afroza !== undefined);
      const scoreAfroza = calculateProfileCompletenessScore(afroza);
      assert.ok(scoreAfroza.percentage < 100, "Afroza should have an incomplete profile");
      assert.strictEqual(scoreAfroza.percentage, 60);
    });

    it("should verify Profile Taxonomy Categories", async () => {
      const { DEMO_PROFILE_CATEGORIES } = await import(
        "../../src/features/admin/profiles/constants/profile-categories.ts"
      );

      assert.ok(DEMO_PROFILE_CATEGORIES.length >= 10, "Must contain at least 10 categories");

      const expectedSlugs = [
        "fashion-lifestyle",
        "creative-design",
        "entrepreneurship",
        "technology",
        "culinary-food",
        "healthcare-wellness",
        "education-training",
        "finance-accounting",
        "agriculture-agro",
        "professional-services",
        "social-development",
      ];

      const actualSlugs = DEMO_PROFILE_CATEGORIES.map((c) => c.slug);
      expectedSlugs.forEach((slug) => {
        assert.ok(actualSlugs.includes(slug), `Missing expected category slug: ${slug}`);
      });

      DEMO_PROFILE_CATEGORIES.forEach((cat) => {
        assert.ok(cat.id.startsWith("pcat_"));
        assert.ok(cat.name.length > 0);
        assert.ok(cat.description.length > 0);
        assert.ok(typeof cat.isActive === "boolean");
        assert.ok(typeof cat.profileCount === "number");
        assert.ok(typeof cat.displayOrder === "number");
      });
    });

    it("should verify Profile Reports & Moderation dataset", async () => {
      const { DEMO_PROFILE_REPORTS } = await import(
        "../../src/features/admin/profiles/data/admin-profile-reports-data.ts"
      );

      assert.ok(DEMO_PROFILE_REPORTS.length >= 5, "Must contain at least 5 report inquiries");

      const validReasons = [
        "FAKE_INFORMATION",
        "MISLEADING_CREDENTIALS",
        "INAPPROPRIATE_CONTENT",
        "HARASSMENT",
        "SPAM",
        "IMPERSONATION",
        "PRIVACY_VIOLATION",
        "OTHER",
      ];

      const validStatuses = ["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"];
      const validPriorities = ["LOW", "NORMAL", "HIGH", "URGENT"];

      DEMO_PROFILE_REPORTS.forEach((report) => {
        assert.ok(report.id.startsWith("rep_"));
        assert.ok(report.profileId.startsWith("prof_"));
        assert.ok(report.profileName.length > 0);
        assert.ok(report.reportingMemberName.length > 0);
        assert.ok(validReasons.includes(report.reason), `Invalid report reason: ${report.reason}`);
        assert.ok(validStatuses.includes(report.status), `Invalid report status: ${report.status}`);
        assert.ok(validPriorities.includes(report.priority), `Invalid priority: ${report.priority}`);
        assert.ok(report.description.length > 0);
      });
    });

    // ==========================================
    // STEP 6: BUSINESS MANAGEMENT & SELLER ADMIN
    // ==========================================
    it("should verify Admin Businesses dataset structure and required business fields", async () => {
      const { DEMO_ADMIN_BUSINESSES, DEMO_BUSINESS_KPIS } = await import(
        "../../src/features/admin/businesses/data/admin-businesses-data.ts"
      );

      assert.ok(DEMO_ADMIN_BUSINESSES.length >= 8, "Must contain at least 8 businesses");
      assert.strictEqual(DEMO_BUSINESS_KPIS.totalBusinesses, DEMO_ADMIN_BUSINESSES.length);
      assert.ok(DEMO_BUSINESS_KPIS.pendingApprovals > 0);
      assert.ok(DEMO_BUSINESS_KPIS.approvedBusinesses > 0);
      assert.ok(DEMO_BUSINESS_KPIS.verifiedBusinesses > 0);
      assert.ok(DEMO_BUSINESS_KPIS.totalProducts > 0);
      assert.ok(DEMO_BUSINESS_KPIS.totalRevenueBDT > 0);

      const validStatuses = ["APPROVED", "PENDING_REVIEW", "UNDER_REVIEW", "REJECTED", "SUSPENDED", "DRAFT"];
      const validVerificationStatuses = ["VERIFIED", "PENDING", "UNDER_REVIEW", "REJECTED", "NOT_SUBMITTED", "ACTION_REQUIRED"];

      DEMO_ADMIN_BUSINESSES.forEach((b) => {
        assert.ok(b.id.startsWith("biz_"), `Invalid business ID format: ${b.id}`);
        assert.ok(b.businessCode.startsWith("BDS-BIZ-"), `Invalid business code: ${b.businessCode}`);
        assert.ok(b.name.length > 0);
        assert.ok(b.slug.length > 0);
        assert.ok(b.category.length > 0);
        assert.ok(b.businessType.length > 0);
        assert.ok(validStatuses.includes(b.status), `Invalid status: ${b.status}`);
        assert.ok(validVerificationStatuses.includes(b.verificationStatus), `Invalid verification: ${b.verificationStatus}`);
        assert.ok(b.ownerId.startsWith("BDS-MEM-"), `Owner ID must reference member: ${b.ownerId}`);
        assert.ok(b.ownerName.length > 0);
        assert.ok(b.contact.email.length > 0);
        assert.ok(b.location.division.length > 0);
        assert.ok(b.location.district.length > 0);
        assert.ok(b.location.city.length > 0);
        assert.ok(typeof b.productCount === "number");
        assert.ok(typeof b.totalRevenueBDT === "number");
        assert.ok(typeof b.isFeatured === "boolean");
      });
    });

    it("should verify Business lookup and filter helper utilities", async () => {
      const {
        getAdminBusinessById,
        getAdminBusinessesByStatus,
        getFeaturedBusinesses,
        calculateBusinessKpis,
        DEMO_ADMIN_BUSINESSES,
      } = await import(
        "../../src/features/admin/businesses/data/admin-businesses-data.ts"
      );

      // Lookup by ID
      const byId = getAdminBusinessById("biz_101");
      assert.ok(byId !== undefined);
      assert.strictEqual(byId.name, "Nilambari Jamdani & Heritage Silk");

      // Lookup by code
      const byCode = getAdminBusinessById("BDS-BIZ-102");
      assert.ok(byCode !== undefined);
      assert.strictEqual(byCode.id, "biz_102");

      // Lookup by slug
      const bySlug = getAdminBusinessById("nilambari-crafts");
      assert.ok(bySlug !== undefined);
      assert.strictEqual(bySlug.id, "biz_101");

      // Status filter
      const approved = getAdminBusinessesByStatus("APPROVED");
      assert.ok(approved.length > 0);
      approved.forEach((b) => assert.strictEqual(b.status, "APPROVED"));

      const pending = getAdminBusinessesByStatus("PENDING_REVIEW");
      assert.ok(pending.length > 0);
      pending.forEach((b) => assert.strictEqual(b.status, "PENDING_REVIEW"));

      // Featured businesses
      const featured = getFeaturedBusinesses();
      assert.ok(featured.length > 0);
      featured.forEach((b) => {
        assert.strictEqual(b.isFeatured, true);
        assert.ok(b.featuredOrder !== undefined && b.featuredOrder > 0);
      });

      // Recalculate KPIs
      const kpis = calculateBusinessKpis(DEMO_ADMIN_BUSINESSES);
      assert.strictEqual(kpis.totalBusinesses, DEMO_ADMIN_BUSINESSES.length);
      assert.strictEqual(kpis.approvedBusinesses, approved.length);
    });

    it("should verify Business Categories master taxonomy registry", async () => {
      const { INITIAL_BUSINESS_CATEGORIES, getBusinessCategoryBySlug, getAllBusinessCategories } = await import(
        "../../src/features/admin/businesses/constants/business-categories.ts"
      );

      assert.ok(INITIAL_BUSINESS_CATEGORIES.length >= 14, "Must contain at least 14 business categories");

      const expectedSlugs = [
        "handloom-jamdani",
        "pottery-terracotta",
        "organic-wellness",
        "culinary-sweets-pitha",
        "boutique-fashion",
        "jute-eco-crafts",
        "homemade-specialty-foods",
        "jewelry-accessories",
        "home-decor-crafts",
        "digital-freelancing",
        "education-training",
        "health-childcare",
        "event-catering",
        "agriculture-gardening",
      ];

      const actualSlugs = INITIAL_BUSINESS_CATEGORIES.map((c) => c.slug);
      expectedSlugs.forEach((slug) => {
        assert.ok(actualSlugs.includes(slug), `Missing expected business category: ${slug}`);
      });

      const catJamdani = getBusinessCategoryBySlug("handloom-jamdani");
      assert.ok(catJamdani !== undefined);
      assert.strictEqual(catJamdani.name, "Traditional Handloom & Jamdani");
      assert.ok(catJamdani.businessCount > 0);

      const allCats = getAllBusinessCategories();
      assert.strictEqual(allCats.length, INITIAL_BUSINESS_CATEGORIES.length);
    });

    it("should verify Business Verification Records and synthetic specimen masking", async () => {
      const {
        DEMO_BUSINESS_VERIFICATIONS,
        getBusinessVerificationById,
        getBusinessVerificationsByStatus,
        getBusinessVerificationsByBusinessId,
      } = await import(
        "../../src/features/admin/businesses/data/admin-business-verifications-data.ts"
      );

      assert.ok(DEMO_BUSINESS_VERIFICATIONS.length >= 7, "Must contain at least 7 verification records");

      DEMO_BUSINESS_VERIFICATIONS.forEach((v) => {
        assert.ok(v.id.startsWith("ver_b"), `Invalid verification ID: ${v.id}`);
        assert.ok(v.businessId.startsWith("biz_"));
        assert.ok(v.businessCode.startsWith("BDS-BIZ-"));
        assert.ok(v.ownerId.startsWith("BDS-MEM-"));
        assert.ok(["TRADE_LICENSE", "TIN_CERTIFICATE", "NATIONAL_ID", "OWNERSHIP_DEED", "UTILITY_BILL", "BRAND_REGISTRATION", "OTHER"].includes(v.documentType));
        assert.ok(v.previewWatermark.includes("SYNTHETIC"), "Specimen watermark must specify synthetic record");
        assert.ok(["VERIFIED", "PENDING", "UNDER_REVIEW", "REJECTED", "ACTION_REQUIRED"].includes(v.status));
      });

      const lookup1 = getBusinessVerificationById("ver_b01");
      assert.ok(lookup1 !== undefined);
      assert.strictEqual(lookup1.businessName, "Nilambari Jamdani & Heritage Silk");

      const verified = getBusinessVerificationsByStatus("VERIFIED");
      assert.ok(verified.length > 0);
      verified.forEach((v) => assert.strictEqual(v.status, "VERIFIED"));

      const biz103Docs = getBusinessVerificationsByBusinessId("biz_103");
      assert.ok(biz103Docs.length >= 2, "biz_103 should have Trade License and TIN submissions");
    });

    it("should verify Business Customer Reviews and Moderation Reports datasets", async () => {
      const {
        DEMO_BUSINESS_REVIEWS,
        getBusinessReviewsByBusinessId,
        getBusinessReviewsByStatus,
      } = await import(
        "../../src/features/admin/businesses/data/admin-business-reviews-data.ts"
      );

      const {
        DEMO_BUSINESS_REPORTS,
        getBusinessReportsByStatus,
      } = await import(
        "../../src/features/admin/businesses/data/admin-business-reports-data.ts"
      );

      assert.ok(DEMO_BUSINESS_REVIEWS.length >= 7, "Must contain at least 7 reviews");
      assert.ok(DEMO_BUSINESS_REPORTS.length >= 5, "Must contain at least 5 reports");

      DEMO_BUSINESS_REVIEWS.forEach((r) => {
        assert.ok(r.id.startsWith("rev_"));
        assert.ok(r.businessId.startsWith("biz_"));
        assert.ok(r.rating >= 1 && r.rating <= 5);
        assert.ok(["PUBLISHED", "PENDING", "HIDDEN", "REJECTED", "REPORTED"].includes(r.status));
      });

      const biz101Reviews = getBusinessReviewsByBusinessId("biz_101");
      assert.ok(biz101Reviews.length >= 2);

      DEMO_BUSINESS_REPORTS.forEach((rep) => {
        assert.ok(rep.id.startsWith("rep_"));
        assert.ok(rep.businessId.startsWith("biz_"));
        assert.ok(["FAKE_INFORMATION", "IMPERSONATION", "FRAUD_SCAM", "MISLEADING_CONTENT", "COPYRIGHT_VIOLATION", "OFFENSIVE_CONTENT", "OTHER"].includes(rep.reason));
        assert.ok(["LOW", "NORMAL", "HIGH", "URGENT"].includes(rep.priority));
        assert.ok(["PENDING", "INVESTIGATING", "RESOLVED", "DISMISSED"].includes(rep.status));
      });
    });

    it("should verify Admin Sellers dataset and associations to members and businesses", async () => {
      const {
        DEMO_ADMIN_SELLERS,
        DEMO_SELLER_KPIS,
        getAdminSellerById,
        getAdminSellersByStatus,
        calculateSellerKpis,
      } = await import(
        "../../src/features/admin/sellers/data/admin-sellers-data.ts"
      );

      assert.ok(DEMO_ADMIN_SELLERS.length >= 7, "Must contain at least 7 sellers");
      assert.strictEqual(DEMO_SELLER_KPIS.totalSellers, DEMO_ADMIN_SELLERS.length);
      assert.ok(DEMO_SELLER_KPIS.approvedSellers > 0);
      assert.ok(DEMO_SELLER_KPIS.pendingSellers > 0);
      assert.ok(DEMO_SELLER_KPIS.totalMarketplaceRevenueBDT > 0);

      DEMO_ADMIN_SELLERS.forEach((s) => {
        assert.ok(s.id.startsWith("sell_"));
        assert.ok(s.sellerCode.startsWith("BDS-SEL-"));
        assert.ok(s.memberId.startsWith("BDS-MEM-"));
        assert.ok(s.memberName.length > 0);
        assert.ok(s.shopName.length > 0);
        assert.ok(["BUSINESS", "INDIVIDUAL", "SERVICE_PROVIDER"].includes(s.sellerType));
        assert.ok(["APPROVED", "PENDING_APPROVAL", "UNDER_REVIEW", "SUSPENDED", "REJECTED"].includes(s.status));
        assert.ok(["VERIFIED", "PENDING", "UNVERIFIED", "REJECTED"].includes(s.verificationStatus));
        assert.ok(s.commissionRatePercent > 0 && s.commissionRatePercent <= 50);
        assert.ok(["bKash", "Nagad", "Bank Transfer"].includes(s.payoutAccountType));
        assert.ok(s.payoutAccountNumber.length > 0);
      });

      // Association check for sell_201 (Nusrat Jahan)
      const nusratSeller = getAdminSellerById("sell_201");
      assert.ok(nusratSeller !== undefined);
      assert.strictEqual(nusratSeller.memberId, "BDS-MEM-10492");
      assert.strictEqual(nusratSeller.businessId, "biz_101");
      assert.strictEqual(nusratSeller.sellerType, "BUSINESS");
      assert.strictEqual(nusratSeller.isTopSeller, true);

      // Lookup by code
      const byCode = getAdminSellerById("BDS-SEL-202");
      assert.ok(byCode !== undefined);
      assert.strictEqual(byCode.id, "sell_202");

      // Status filter
      const approvedSellers = getAdminSellersByStatus("APPROVED");
      assert.ok(approvedSellers.length > 0);
      approvedSellers.forEach((s) => assert.strictEqual(s.status, "APPROVED"));

      // Recalculate KPIs
      const kpis = calculateSellerKpis(DEMO_ADMIN_SELLERS);
      assert.strictEqual(kpis.totalSellers, DEMO_ADMIN_SELLERS.length);
      assert.strictEqual(kpis.approvedSellers, approvedSellers.length);
    });

    // ==============================================================
    // STEP 8: PAYMENT, MEMBERSHIP & SUBSCRIPTION MANAGEMENT VERIFICATION
    // ==============================================================
    it("should verify all 14 Admin Step 8 routes and navigation children are configured", async () => {
      const paymentsGroup = adminNavGroups.find((g) => g.id === "business-commerce");
      assert.ok(paymentsGroup);

      const paymentsItem = paymentsGroup.items.find((i) => i.href === "/admin/payments");
      assert.ok(paymentsItem);
      assert.ok(paymentsItem.children && paymentsItem.children.length >= 6);

      const expectedPaymentRoutes = [
        "/admin/payments",
        "/admin/payments/transactions",
        "/admin/payments/gateway",
        "/admin/payments/refunds",
        "/admin/payments/invoices",
        "/admin/payments/reports",
      ];

      const actualPaymentRoutes = paymentsItem.children.map((c) => c.href);
      expectedPaymentRoutes.forEach((route) => {
        assert.ok(
          actualPaymentRoutes.includes(route),
          `Missing required payment subroute in navigation: ${route}`
        );
      });

      const platformGroup = adminNavGroups.find((g) => g.id === "platform-management");
      assert.ok(platformGroup);

      const plansItem = platformGroup.items.find((i) => i.href === "/admin/membership-plans");
      assert.ok(plansItem, "Missing Membership Plans navigation item");

      const subsItem = platformGroup.items.find((i) => i.href === "/admin/subscriptions");
      assert.ok(subsItem, "Missing Subscriptions navigation item");
      assert.ok(subsItem.children && subsItem.children.length >= 2);

      const expectedSubRoutes = ["/admin/subscriptions", "/admin/subscriptions/renewals"];
      const actualSubRoutes = subsItem.children.map((c) => c.href);
      expectedSubRoutes.forEach((route) => {
        assert.ok(actualSubRoutes.includes(route), `Missing required sub route: ${route}`);
      });
    });

    it("should verify ZiniPay Gateway exclusive configuration and security masking", async () => {
      const { DEMO_ZINIPAY_CONFIG } = await import(
        "../../src/features/admin/payments/data/mock-payments.ts"
      );

      assert.strictEqual(DEMO_ZINIPAY_CONFIG.provider, "ZINIPAY");
      assert.strictEqual(DEMO_ZINIPAY_CONFIG.isEnabled, true);
      assert.ok(["SANDBOX", "PRODUCTION"].includes(DEMO_ZINIPAY_CONFIG.environment));
      assert.ok(DEMO_ZINIPAY_CONFIG.merchantId.startsWith("ZNP-"));
      // Security check: Keys must be masked in demo object
      assert.ok(DEMO_ZINIPAY_CONFIG.apiKey.includes("••••"));
      assert.ok(DEMO_ZINIPAY_CONFIG.apiSecret.includes("••••"));
      assert.ok(DEMO_ZINIPAY_CONFIG.callbackUrl.includes("/api/payments/zinipay/verify"));
      assert.ok(DEMO_ZINIPAY_CONFIG.webhookUrl.includes("/api/payments/zinipay/webhook"));
      assert.ok(DEMO_ZINIPAY_CONFIG.supportedChannels.length >= 4);
    });

    it("should verify Payment Overview KPIs and financial accounting consistency", async () => {
      const { DEMO_PAYMENT_KPIS, formatBDT } = await import(
        "../../src/features/admin/payments/data/mock-payments.ts"
      );

      assert.ok(DEMO_PAYMENT_KPIS.totalPayments > 0);
      assert.ok(DEMO_PAYMENT_KPIS.successfulPayments > 0);
      assert.ok(DEMO_PAYMENT_KPIS.totalCollectedRevenueBDT > 0);
      assert.ok(DEMO_PAYMENT_KPIS.membershipRevenueBDT > 0);
      assert.ok(DEMO_PAYMENT_KPIS.marketplaceRevenueBDT > 0);

      // Total collected = Membership + Marketplace
      assert.strictEqual(
        DEMO_PAYMENT_KPIS.totalCollectedRevenueBDT,
        DEMO_PAYMENT_KPIS.membershipRevenueBDT + DEMO_PAYMENT_KPIS.marketplaceRevenueBDT
      );

      // Total payments must account for successful, pending, and failed
      assert.ok(
        DEMO_PAYMENT_KPIS.totalPayments >=
          DEMO_PAYMENT_KPIS.successfulPayments +
            DEMO_PAYMENT_KPIS.pendingPayments +
            DEMO_PAYMENT_KPIS.failedPayments
      );

      // BDT Formatter test
      assert.strictEqual(formatBDT(1500), "৳1,500");
      assert.strictEqual(formatBDT(350000), "৳3,50,000");
    });

    it("should verify Payment Transactions dataset integrity and ZiniPay channel mappings", async () => {
      const { DEMO_PAYMENT_TRANSACTIONS, getPaymentTransactionById } = await import(
        "../../src/features/admin/payments/data/mock-payments.ts"
      );

      assert.ok(DEMO_PAYMENT_TRANSACTIONS.length >= 8);
      const validStatuses = [
        "INITIATED",
        "PENDING",
        "PROCESSING",
        "SUCCESSFUL",
        "FAILED",
        "CANCELLED",
        "EXPIRED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ];

      const validMethods = [
        "ZINIPAY_BKASH",
        "ZINIPAY_NAGAD",
        "ZINIPAY_ROCKET",
        "ZINIPAY_CARD",
        "ZINIPAY_INTERNET_BANKING",
      ];

      DEMO_PAYMENT_TRANSACTIONS.forEach((tx) => {
        assert.ok(tx.id.startsWith("txn_"));
        assert.ok(tx.transactionId.startsWith("BDS-TXN-"));
        assert.ok(tx.gatewayTrxId.startsWith("ZNP_"));
        assert.ok(tx.memberId.startsWith("BDS-MEM-"));
        assert.ok(tx.amountBDT > 0);
        assert.strictEqual(tx.currency, "BDT");
        assert.strictEqual(tx.gateway, "ZINIPAY");
        assert.ok(validStatuses.includes(tx.status), `Invalid payment status: ${tx.status}`);
        assert.ok(validMethods.includes(tx.paymentMethod), `Invalid payment method: ${tx.paymentMethod}`);
        assert.ok(tx.timeline.length > 0);
      });

      // Lookup test
      const foundTx = getPaymentTransactionById("txn_801");
      assert.ok(foundTx !== undefined);
      assert.strictEqual(foundTx.transactionId, "BDS-TXN-2026-90412");
      assert.strictEqual(foundTx.paymentMethod, "ZINIPAY_BKASH");
    });

    it("should verify Refund Claims and Invoices datasets", async () => {
      const { DEMO_REFUNDS, DEMO_INVOICES, getRefundById, getInvoiceById } = await import(
        "../../src/features/admin/payments/data/mock-payments.ts"
      );

      assert.ok(DEMO_REFUNDS.length >= 3);
      DEMO_REFUNDS.forEach((ref) => {
        assert.ok(ref.id.startsWith("ref_"));
        assert.ok(ref.refundCode.startsWith("BDS-REF-"));
        assert.ok(ref.originalTransactionId.startsWith("txn_"));
        assert.ok(ref.requestedAmountBDT > 0);
        assert.ok(ref.refundReason.length > 0);
      });

      assert.ok(DEMO_INVOICES.length >= 3);
      DEMO_INVOICES.forEach((inv) => {
        assert.ok(inv.id.startsWith("inv_"));
        assert.ok(inv.invoiceNumber.startsWith("BDS-INV-"));
        assert.ok(inv.memberId.startsWith("BDS-MEM-"));
        assert.ok(inv.totalAmountBDT > 0);
        assert.ok(inv.items.length > 0);
      });
    });

    it("should verify Membership Plans taxonomy and subscription manual renewal rules", async () => {
      const {
        DEMO_MEMBERSHIP_PLANS,
        DEMO_MEMBERSHIP_SUBSCRIPTIONS,
        DEMO_SUBSCRIPTION_KPIS,
        getMembershipPlanById,
        getSubscriptionById,
      } = await import("../../src/features/admin/memberships/data/mock-memberships.ts");

      assert.ok(DEMO_MEMBERSHIP_PLANS.length >= 4);
      assert.strictEqual(DEMO_SUBSCRIPTION_KPIS.totalSubscriptions, 2380);
      assert.ok(DEMO_SUBSCRIPTION_KPIS.activeSubscriptions > 0);
      assert.ok(DEMO_SUBSCRIPTION_KPIS.expiringSoon > 0);

      // Verify Free vs Paid separation
      const freePlan = DEMO_MEMBERSHIP_PLANS.find((p) => p.type === "FREE");
      assert.ok(freePlan !== undefined);
      assert.strictEqual(freePlan.priceBDT, 0);

      const paidPlans = DEMO_MEMBERSHIP_PLANS.filter((p) => p.type === "PAID");
      assert.ok(paidPlans.length >= 2);
      paidPlans.forEach((p) => assert.ok(p.priceBDT > 0));

      // Verify Manual Renewal constraint: autoRenewEnabled must be false
      DEMO_MEMBERSHIP_SUBSCRIPTIONS.forEach((sub) => {
        assert.strictEqual(
          sub.autoRenewEnabled,
          false,
          "BDSisters memberships must not auto-debit; manual renewal required"
        );
        assert.strictEqual(sub.renewalType, "MANUAL");
      });
    });

    describe("Step 9 — Community & Forum Management Verification", () => {
      it("should verify complete Community Management navigation items and sub-routes", () => {
        const communityGroup = adminNavGroups.find((g) => g.id === "community");
        assert.ok(communityGroup, "Community navigation group not found");

        const expectedItemLabels = [
          "Community Overview",
          "Discussion Categories",
          "Discussions",
          "Posts",
          "Comments",
          "Moderation Queue",
          "Content Reports",
          "Moderators",
          "Community Settings",
        ];

        const actualLabels = communityGroup.items.map((i) => i.label);
        expectedItemLabels.forEach((label) => {
          assert.ok(
            actualLabels.includes(label),
            `Missing community navigation item: ${label}`
          );
        });

        // Verify Moderation Queue and Reports carry warning badges for pending reviews
        const modQueueItem = communityGroup.items.find((i) => i.label === "Moderation Queue");
        assert.ok(modQueueItem?.badge !== undefined);
        assert.strictEqual(modQueueItem?.badgeVariant, "warning");

        const reportsItem = communityGroup.items.find((i) => i.label === "Content Reports");
        assert.ok(reportsItem?.badge !== undefined);
        assert.strictEqual(reportsItem?.badgeVariant, "warning");
      });

      it("should verify Community KPIs and mock dataset dimensions", async () => {
        const {
          DEMO_COMMUNITY_KPIS,
          DEMO_COMMUNITY_CATEGORIES,
          DEMO_DISCUSSIONS,
          DEMO_COMMUNITY_POSTS,
          DEMO_COMMUNITY_COMMENTS,
          DEMO_MODERATION_QUEUE,
          DEMO_COMMUNITY_REPORTS,
          DEMO_COMMUNITY_MODERATORS,
          DEMO_COMMUNITY_SETTINGS,
        } = await import("../../src/features/admin/community/data/mock-community.ts");

        // KPI checks
        assert.ok(DEMO_COMMUNITY_KPIS.totalCommunityMembers >= 10000);
        assert.ok(DEMO_COMMUNITY_KPIS.activeMembers > 0);
        assert.ok(DEMO_COMMUNITY_KPIS.totalDiscussions > 0);
        assert.ok(DEMO_COMMUNITY_KPIS.totalPosts > 0);
        assert.ok(DEMO_COMMUNITY_KPIS.totalComments > 0);
        assert.ok(DEMO_COMMUNITY_KPIS.pendingModeration > 0);
        assert.ok(DEMO_COMMUNITY_KPIS.reportedContent > 0);
        assert.ok(DEMO_COMMUNITY_KPIS.activeModerators > 0);

        // Categories check
        assert.ok(DEMO_COMMUNITY_CATEGORIES.length >= 6);
        DEMO_COMMUNITY_CATEGORIES.forEach((cat) => {
          assert.ok(cat.id.length > 0);
          assert.ok(cat.name.length > 0);
          assert.ok(cat.slug.length > 0);
          assert.ok(["ACTIVE", "INACTIVE", "ARCHIVED"].includes(cat.status));
          assert.ok(cat.displayOrder > 0);
          assert.ok(cat.discussionsCount >= 0);
          assert.ok(cat.postsCount >= 0);
        });

        // Discussions check
        assert.ok(DEMO_DISCUSSIONS.length >= 5);
        DEMO_DISCUSSIONS.forEach((d) => {
          assert.ok(d.id.length > 0);
          assert.ok(d.title.length > 0);
          assert.ok(d.author.name.length > 0);
          assert.ok(
            ["DRAFT", "PUBLISHED", "UNDER_REVIEW", "LOCKED", "ARCHIVED", "REMOVED"].includes(
              d.status
            )
          );
        });

        // Posts check
        assert.ok(DEMO_COMMUNITY_POSTS.length >= 5);
        DEMO_COMMUNITY_POSTS.forEach((p) => {
          assert.ok(p.id.length > 0);
          assert.ok(p.discussionId.length > 0);
          assert.ok(p.content.length > 0);
          assert.ok(
            ["DRAFT", "PUBLISHED", "PENDING_REVIEW", "REJECTED", "HIDDEN", "ARCHIVED", "REMOVED"].includes(
              p.status
            )
          );
        });

        // Comments check
        assert.ok(DEMO_COMMUNITY_COMMENTS.length >= 4);
        DEMO_COMMUNITY_COMMENTS.forEach((c) => {
          assert.ok(c.id.length > 0);
          assert.ok(c.content.length > 0);
          assert.ok(
            ["PUBLISHED", "PENDING_REVIEW", "HIDDEN", "REJECTED", "REMOVED"].includes(c.status)
          );
        });

        // Moderation Queue check
        assert.ok(DEMO_MODERATION_QUEUE.length >= 5);
        DEMO_MODERATION_QUEUE.forEach((q) => {
          assert.ok(["DISCUSSION", "POST", "COMMENT"].includes(q.contentType));
          assert.ok(["LOW", "NORMAL", "HIGH", "URGENT"].includes(q.priority));
          assert.ok(
            ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "NEEDS_CHANGES"].includes(
              q.reviewStatus
            )
          );
        });

        // Community Reports check
        assert.ok(DEMO_COMMUNITY_REPORTS.length >= 5);
        DEMO_COMMUNITY_REPORTS.forEach((r) => {
          assert.ok(r.reportId.startsWith("REP-"));
          assert.ok(r.reporter.name.length > 0);
          assert.ok(r.reportedMember.name.length > 0);
          assert.ok(
            [
              "SPAM",
              "HARASSMENT",
              "BULLYING",
              "HATE_SPEECH",
              "MISINFORMATION",
              "INAPPROPRIATE",
              "COPYRIGHT",
              "FAKE_ACCOUNT",
              "OTHER",
            ].includes(r.category)
          );
          assert.ok(
            ["NEW", "UNDER_REVIEW", "RESOLVED", "DISMISSED", "ESCALATED"].includes(r.status)
          );
        });

        // Moderators check & RBAC isolation
        assert.ok(DEMO_COMMUNITY_MODERATORS.length >= 4);
        DEMO_COMMUNITY_MODERATORS.forEach((m) => {
          assert.ok(m.id.length > 0);
          assert.ok(m.member.name.length > 0);
          assert.ok(m.assignedCategoryIds.length > 0);
          assert.ok(["ACTIVE", "INACTIVE", "SUSPENDED"].includes(m.moderatorStatus));
          assert.ok(m.actionsCountLast30Days >= 0);
        });

        // Settings check
        assert.strictEqual(typeof DEMO_COMMUNITY_SETTINGS.communityEnabled, "boolean");
        assert.ok(DEMO_COMMUNITY_SETTINGS.maxAttachmentSizeMB > 0);
        assert.ok(DEMO_COMMUNITY_SETTINGS.communityGuidelines.length > 0);
      });
    });
  });

  describe("Step 10: Events & Workshops Management Verification", () => {
    describe("Event KPIs & Analytical Datasets", () => {
      it("should provide consistent platform-wide event metrics", () => {
        assert.strictEqual(typeof DEMO_EVENT_KPIS.totalEvents, "number");
        assert.ok(DEMO_EVENT_KPIS.totalEvents >= 40);
        assert.ok(DEMO_EVENT_KPIS.publishedEvents > 0);
        assert.ok(DEMO_EVENT_KPIS.upcomingEvents > 0);
        assert.ok(DEMO_EVENT_KPIS.totalRegistrations > 1000);
        assert.ok(DEMO_EVENT_KPIS.totalAttendees > 1000);
        assert.ok(DEMO_EVENT_KPIS.totalRegistrations >= DEMO_EVENT_KPIS.totalAttendees);
      });

      it("should define a valid 6-month historical event growth trajectory", () => {
        assert.strictEqual(DEMO_EVENT_GROWTH_SERIES.length, 6);
        DEMO_EVENT_GROWTH_SERIES.forEach((pt) => {
          assert.strictEqual(typeof pt.month, "string");
          assert.ok(pt.registrations >= pt.attendees);
        });
      });
    });

    describe("Event Categories Taxonomy", () => {
      it("should contain at least 5 structured event categories with slugs and icons", () => {
        assert.ok(DEMO_EVENT_CATEGORIES.length >= 5);
        DEMO_EVENT_CATEGORIES.forEach((cat) => {
          assert.ok(cat.id.startsWith("evt-cat-"));
          assert.ok(cat.name.length > 0);
          assert.ok(cat.slug.length > 0);
          assert.ok(cat.description.length > 0);
          assert.ok(["ACTIVE", "INACTIVE"].includes(cat.status));
          assert.ok(cat.eventsCount >= 0);
          assert.ok(cat.displayOrder > 0);
        });
      });
    });

    describe("Events Catalogue & Delivery Specifications", () => {
      it("should validate all events have complete scheduling, venue/online details, and capacity bounds", () => {
        assert.ok(DEMO_EVENTS.length >= 5);
        DEMO_EVENTS.forEach((evt) => {
          assert.ok(evt.id.startsWith("evt-"));
          assert.ok(evt.title.length > 0);
          assert.ok(evt.slug.length > 0);
          assert.ok(["PHYSICAL", "ONLINE", "HYBRID"].includes(evt.format));
          assert.ok(
            [
              "CONFERENCE",
              "SEMINAR",
              "WEBINAR",
              "NETWORKING",
              "EXHIBITION",
              "TRAINING",
              "MASTERCLASS",
              "COMMUNITY",
            ].includes(evt.eventType)
          );
          assert.ok(
            [
              "DRAFT",
              "PENDING_REVIEW",
              "PUBLISHED",
              "UPCOMING",
              "ONGOING",
              "COMPLETED",
              "CANCELLED",
              "ARCHIVED",
            ].includes(evt.status)
          );
          assert.ok(evt.capacity > 0);
          assert.ok(evt.registrationCount >= 0);
          assert.ok(evt.registrationCount <= evt.capacity);
          assert.ok(evt.organizer.name.length > 0);
          assert.ok(evt.organizer.email.includes("@"));

          // Venue vs Online platform checks
          if (
            (evt.format === "PHYSICAL" || evt.format === "HYBRID") &&
            evt.status !== "DRAFT"
          ) {
            assert.ok(evt.venue !== undefined);
            assert.ok(evt.venue?.city.length > 0);
          }
          if (evt.format === "ONLINE") {
            assert.ok(evt.onlinePlatform !== undefined);
          }
        });
      });
    });

    describe("Workshops & Masterclasses", () => {
      it("should validate intensive workshops have instructors, duration, and learning outcomes", () => {
        assert.ok(DEMO_WORKSHOPS.length >= 4);
        DEMO_WORKSHOPS.forEach((ws) => {
          assert.ok(ws.id.startsWith("wsp-"));
          assert.ok(ws.title.length > 0);
          assert.ok(ws.instructor.name.length > 0);
          assert.ok(ws.instructor.organization.length > 0);
          assert.ok(ws.skillsLearned.length > 0);
          assert.ok(ws.duration.length > 0);
          assert.ok(ws.capacity > 0);
          assert.ok(ws.priceBDT >= 0);
        });
      });
    });

    describe("Registrations & Attendee Gate Management", () => {
      it("should validate registrations have ticket types, attendee info, and timeline entries", () => {
        assert.ok(DEMO_REGISTRATIONS.length >= 5);
        DEMO_REGISTRATIONS.forEach((reg) => {
          assert.ok(reg.id.startsWith("reg-"));
          assert.ok(reg.eventId.length > 0);
          assert.ok(reg.attendeeName.length > 0);
          assert.ok(reg.attendeeEmail.includes("@"));
          assert.ok(
            ["FREE", "PAID", "VIP", "EARLY_BIRD", "STUDENT", "CUSTOM"].includes(
              reg.ticketType
            )
          );
          assert.ok(
            [
              "PENDING",
              "APPROVED",
              "REJECTED",
              "WAITLISTED",
              "CANCELLED",
            ].includes(reg.registrationStatus)
          );
          assert.ok(
            [
              "NOT_REQUIRED",
              "PENDING",
              "SUCCESSFUL",
              "FAILED",
              "REFUNDED",
            ].includes(reg.paymentStatus)
          );
          assert.ok(reg.timeline.length > 0);
        });
      });

      it("should validate gate attendees with check-in status options", () => {
        assert.ok(DEMO_ATTENDEES.length >= 3);
        DEMO_ATTENDEES.forEach((att) => {
          assert.ok(att.id.startsWith("att-"));
          assert.ok(att.name.length > 0);
          assert.ok(["CHECKED_IN", "NOT_CHECKED_IN"].includes(att.checkInStatus));
        });
      });
    });

    describe("Tickets, Pricing & Quota Management", () => {
      it("should validate ticket tiers with pricing and sales quotas", () => {
        assert.ok(DEMO_TICKETS.length >= 5);
        DEMO_TICKETS.forEach((t) => {
          assert.ok(t.id.startsWith("tkt-"));
          assert.ok(t.eventId.length > 0);
          assert.ok(t.priceBDT >= 0);
          assert.ok(t.totalQuantity > 0);
          assert.ok(t.soldQuantity >= 0);
          assert.ok(t.soldQuantity <= t.totalQuantity);
          assert.ok(["ACTIVE", "SOLD_OUT", "DISABLED", "UPCOMING"].includes(t.status));
        });
      });
    });

    describe("ZiniPay Payment Records & Feedback Moderation", () => {
      it("should strictly ensure ZiniPay is the designated payment gateway for all paid event transactions", () => {
        assert.ok(DEMO_EVENT_PAYMENTS.length >= 5);
        DEMO_EVENT_PAYMENTS.forEach((p) => {
          assert.ok(p.id.startsWith("epay-"));
          assert.strictEqual(p.gateway, "ZINIPAY");
          assert.ok(p.transactionReference.startsWith("ZINI-"));
          assert.ok(p.amountBDT > 0);
          assert.ok(
            ["SUCCESSFUL", "PENDING", "FAILED", "REFUNDED"].includes(p.status)
          );
        });
      });

      it("should validate event feedback reviews with star ratings between 1 and 5", () => {
        assert.ok(DEMO_EVENT_FEEDBACK.length >= 4);
        DEMO_EVENT_FEEDBACK.forEach((fb) => {
          assert.ok(fb.id.startsWith("fb-"));
          assert.ok(fb.rating >= 1 && fb.rating <= 5);
          assert.ok(fb.comment.length > 0);
          assert.ok(
            ["PUBLISHED", "HIDDEN", "PENDING_REVIEW"].includes(fb.status)
          );
        });
      });
    });

    describe("Admin Navigation Integration", () => {
      it("should verify Events & Learning navigation group contains enriched Step 10 routes", () => {
        const eventsGroup = adminNavGroups.find((g) => g.id === "events-learning");
        assert.ok(eventsGroup, "Events & Learning group not found");
        const eventsItem = eventsGroup.items.find((i) => i.label === "Events & Workshops");
        assert.ok(eventsItem, "Events & Workshops item not found");
        assert.ok(eventsItem.children && eventsItem.children.length >= 10);

        const childHrefs = eventsItem.children.map((c) => c.href);
        const expectedSubRoutes = [
          "/admin/events",
          "/admin/events/all",
          "/admin/events/create",
          "/admin/events/categories",
          "/admin/events/workshops",
          "/admin/events/registrations",
          "/admin/events/attendees",
          "/admin/events/tickets",
          "/admin/events/payments",
          "/admin/events/feedback",
          "/admin/events/archive",
        ];

        expectedSubRoutes.forEach((route) => {
          assert.ok(
            childHrefs.includes(route),
            `Missing expected event sub-route: ${route}`
          );
        });
      });
    });
  });

  // =========================================================================
  // STEP 11 — RESOURCE LIBRARY & LEARNING MANAGEMENT (LMS)
  // =========================================================================
  describe("Step 11: Resource Library & Learning Management (LMS)", () => {
    describe("Resource KPIs & Analytics", () => {
      it("should validate resource dashboard metrics and telemetry KPIs", async () => {
        const { DEMO_RESOURCE_KPIS } = await import(
          "../../src/features/admin/resources/data/mock-resources.ts"
        );

        assert.strictEqual(typeof DEMO_RESOURCE_KPIS.totalResources, "number");
        assert.ok(DEMO_RESOURCE_KPIS.totalResources > 0);
        assert.ok(DEMO_RESOURCE_KPIS.publishedResources > 0);
        assert.ok(DEMO_RESOURCE_KPIS.totalViews > 10000);
        assert.ok(DEMO_RESOURCE_KPIS.totalDownloads > 5000);
        assert.strictEqual(DEMO_RESOURCE_KPIS.totalCategories, 10);
      });

      it("should validate learning analytics progression and monthly cohort data", async () => {
        const { DEMO_LEARNING_ANALYTICS } = await import(
          "../../src/features/admin/resources/data/mock-resources.ts"
        );

        assert.ok(DEMO_LEARNING_ANALYTICS.totalEnrolledLearners > 0);
        assert.ok(DEMO_LEARNING_ANALYTICS.activeLearners > 0);
        assert.ok(DEMO_LEARNING_ANALYTICS.completedCoursesCount > 0);
        assert.ok(
          DEMO_LEARNING_ANALYTICS.averageCompletionRatePct > 0 &&
            DEMO_LEARNING_ANALYTICS.averageCompletionRatePct <= 100
        );
        assert.strictEqual(
          DEMO_LEARNING_ANALYTICS.monthlyEnrollmentSeries.length,
          6
        );
        assert.strictEqual(
          DEMO_LEARNING_ANALYTICS.progressDistribution.length,
          4
        );
      });
    });

    describe("Resource Categories Taxonomy", () => {
      it("should validate 10 standardized categories with slugs and icons", async () => {
        const { DEMO_RESOURCE_CATEGORIES } = await import(
          "../../src/features/admin/resources/data/mock-resources.ts"
        );

        assert.strictEqual(DEMO_RESOURCE_CATEGORIES.length, 10);

        DEMO_RESOURCE_CATEGORIES.forEach((cat) => {
          assert.ok(cat.id.startsWith("rcat-"));
          assert.ok(cat.name.length > 0);
          assert.ok(cat.slug.length > 0);
          assert.ok(cat.icon.length > 0);
          assert.strictEqual(typeof cat.resourcesCount, "number");
          assert.ok(["ACTIVE", "INACTIVE"].includes(cat.status));
        });
      });
    });

    describe("Resources Catalogue & Formats", () => {
      it("should validate diverse resources with formats, visibility, and author attributions", async () => {
        const { DEMO_RESOURCES } = await import(
          "../../src/features/admin/resources/data/mock-resources.ts"
        );

        assert.ok(DEMO_RESOURCES.length >= 6);

        const typesFound = new Set(DEMO_RESOURCES.map((r) => r.resourceType));
        assert.ok(typesFound.has("GUIDE"));
        assert.ok(typesFound.has("VIDEO"));
        assert.ok(typesFound.has("TEMPLATE"));
        assert.ok(typesFound.has("ARTICLE"));

        DEMO_RESOURCES.forEach((r) => {
          assert.ok(r.id.startsWith("res-"));
          assert.ok(r.title.length > 0);
          assert.ok(r.slug.length > 0);
          assert.ok(r.shortDescription.length > 0);
          assert.ok(
            [
              "PUBLISHED",
              "DRAFT",
              "PENDING_REVIEW",
              "UNDER_REVIEW",
              "ARCHIVED",
              "REJECTED",
            ].includes(r.status)
          );
          assert.ok(
            ["PUBLIC", "MEMBERS_ONLY", "PREMIUM"].includes(r.visibility)
          );
          assert.ok(r.author.name.length > 0);
          assert.ok(Array.isArray(r.tags) && r.tags.length > 0);
          assert.ok(r.viewsCount >= 0);
        });
      });
    });

    describe("Courses & LMS Curriculum Builder", () => {
      it("should validate structured courses with modules, lessons, and pricing", async () => {
        const { DEMO_COURSES } = await import(
          "../../src/features/admin/resources/data/mock-resources.ts"
        );

        assert.ok(DEMO_COURSES.length >= 4);

        DEMO_COURSES.forEach((course) => {
          assert.ok(course.id.startsWith("crs-"));
          assert.ok(course.title.length > 0);
          assert.ok(course.instructor.name.length > 0);
          assert.ok(
            ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"].includes(
              course.level
            )
          );
          assert.ok(
            ["PUBLISHED", "DRAFT", "ARCHIVED", "UNPUBLISHED"].includes(
              course.status
            )
          );
          assert.ok(Array.isArray(course.modules));
          assert.ok(course.enrolledLearnersCount >= 0);

          course.modules.forEach((mod) => {
            assert.ok(mod.id.length > 0);
            assert.ok(mod.title.length > 0);
            assert.ok(mod.lessons.length > 0);

            mod.lessons.forEach((lesson) => {
              assert.ok(lesson.id.length > 0);
              assert.ok(lesson.title.length > 0);
              assert.ok(
                [
                  "VIDEO",
                  "ARTICLE",
                  "QUIZ_PLACEHOLDER",
                  "DOWNLOADABLE",
                ].includes(lesson.lessonType)
              );
              assert.ok(lesson.duration.length > 0);
            });
          });
        });
      });
    });

    describe("Course Enrollments & Certifications", () => {
      it("should validate student enrollments, syllabus progression, and status", async () => {
        const { DEMO_ENROLLMENTS } = await import(
          "../../src/features/admin/resources/data/mock-resources.ts"
        );

        assert.ok(DEMO_ENROLLMENTS.length >= 5);

        DEMO_ENROLLMENTS.forEach((enr) => {
          assert.ok(enr.id.startsWith("enr-"));
          assert.ok(enr.courseId.startsWith("crs-"));
          assert.ok(enr.courseTitle.length > 0);
          assert.ok(enr.learnerName.length > 0);
          assert.ok(enr.learnerEmail.includes("@"));
          assert.ok(
            [
              "ACTIVE",
              "COMPLETED",
              "CANCELLED",
              "PENDING",
              "SUSPENDED",
            ].includes(enr.enrollmentStatus)
          );
          assert.ok(enr.progressPct >= 0 && enr.progressPct <= 100);
          assert.ok(enr.completedLessonsCount <= enr.totalLessonsCount);
          if (enr.enrollmentStatus === "COMPLETED") {
            assert.strictEqual(enr.progressPct, 100);
          }
        });
      });
    });

    describe("Editorial Reviews & Approvals", () => {
      it("should validate editorial review queue and priority triage", async () => {
        const { DEMO_APPROVALS } = await import(
          "../../src/features/admin/resources/data/mock-resources.ts"
        );

        assert.ok(DEMO_APPROVALS.length >= 2);

        DEMO_APPROVALS.forEach((appr) => {
          assert.ok(appr.id.startsWith("appr-"));
          assert.ok(appr.resourceId.startsWith("res-"));
          assert.ok(appr.resourceTitle.length > 0);
          assert.ok(
            [
              "PENDING",
              "APPROVED",
              "CHANGES_REQUESTED",
              "REJECTED",
              "UNDER_REVIEW",
            ].includes(appr.reviewStatus)
          );
          assert.ok(["LOW", "MEDIUM", "HIGH", "URGENT"].includes(appr.priority));
          assert.ok(appr.contributorName.length > 0);
        });
      });
    });

    describe("Admin Navigation Integration", () => {
      it("should verify Events & Learning navigation group contains enriched Step 11 routes", () => {
        const eventsGroup = adminNavGroups.find((g) => g.id === "events-learning");
        assert.ok(eventsGroup, "Events & Learning group not found");

        // 1. Resource Library item
        const resourceItem = eventsGroup.items.find((i) => i.label === "Resource Library");
        assert.ok(resourceItem, "Resource Library item not found");
        assert.ok(resourceItem.children && resourceItem.children.length >= 8);

        const resourceHrefs = resourceItem.children.map((c) => c.href);
        const expectedResourceRoutes = [
          "/admin/resources",
          "/admin/resources/all",
          "/admin/resources/create",
          "/admin/resources/categories",
          "/admin/resources/articles",
          "/admin/resources/videos",
          "/admin/resources/featured",
          "/admin/resources/approvals",
        ];

        expectedResourceRoutes.forEach((route) => {
          assert.ok(
            resourceHrefs.includes(route),
            `Missing expected resource sub-route: ${route}`
          );
        });

        // 2. Courses & LMS item
        const coursesItem = eventsGroup.items.find((i) => i.label === "Courses & LMS");
        assert.ok(coursesItem, "Courses & LMS item not found");
        assert.ok(coursesItem.children && coursesItem.children.length >= 4);

        const coursesHrefs = coursesItem.children.map((c) => c.href);
        const expectedCoursesRoutes = [
          "/admin/resources/courses",
          "/admin/resources/courses/create",
          "/admin/resources/enrollments",
          "/admin/resources/analytics",
        ];

        expectedCoursesRoutes.forEach((route) => {
          assert.ok(
            coursesHrefs.includes(route),
            `Missing expected courses sub-route: ${route}`
          );
        });
      });
    });
  });

  describe("STEP 12 — CMS & Website Content Management Verification", () => {
    describe("CMS KPIs & Analytics Data", () => {
      it("should contain comprehensive CMS metrics with consistent totals", () => {
        assert.ok(DEMO_CMS_KPIS.totalPages >= 12);
        assert.ok(DEMO_CMS_KPIS.publishedPages > 0);
        assert.ok(DEMO_CMS_KPIS.draftPages >= 0);
        assert.ok(DEMO_CMS_KPIS.totalSections >= 40);
        assert.ok(DEMO_CMS_KPIS.activeBanners > 0);
        assert.ok(DEMO_CMS_KPIS.mediaCount > 0);
      });

      it("should verify monthly revision growth trends", () => {
        assert.strictEqual(DEMO_CMS_GROWTH_SERIES.length, 6);
        DEMO_CMS_GROWTH_SERIES.forEach((series) => {
          assert.ok(series.month.length > 0);
          assert.ok(series.published > 0);
          assert.ok(series.updates >= series.published);
        });
      });
    });

    describe("Website Pages & Builder Structure", () => {
      it("should verify all 12 CMS pages contain valid slug, author, status and sections", () => {
        assert.ok(DEMO_CMS_PAGES.length >= 10);
        DEMO_CMS_PAGES.forEach((page) => {
          assert.ok(page.id.startsWith("page-"));
          assert.ok(page.title.length > 0);
          assert.ok(page.slug.length > 0);
          assert.ok(["STANDARD", "LANDING", "INFORMATIONAL", "CAMPAIGN", "CUSTOM"].includes(page.pageType));
          assert.ok(["DRAFT", "IN_REVIEW", "PUBLISHED", "SCHEDULED", "ARCHIVED"].includes(page.status));
          assert.ok(["OPTIMIZED", "NEEDS_REVIEW", "MISSING"].includes(page.seoStatus));
          assert.ok(page.author && page.author.name.length > 0);
          assert.ok(Array.isArray(page.sections));
        });
      });

      it("should verify homepage section ordering and hero configuration", () => {
        assert.ok(DEMO_CMS_SECTIONS_HOMEPAGE.length >= 8);
        const heroSection = DEMO_CMS_SECTIONS_HOMEPAGE.find((s) => s.sectionType === "HERO");
        assert.ok(heroSection, "Hero section not found in homepage layout");
        assert.ok(heroSection.title.includes("Women Entrepreneurs"));
        assert.strictEqual(heroSection.order, 1);
        assert.strictEqual(heroSection.isVisible, true);
        assert.ok(heroSection.ctaText && heroSection.ctaUrl);
      });
    });

    describe("Navigation, Headers & Footers", () => {
      it("should verify primary and footer navigation items adhere to contract", () => {
        const primaryItems = DEMO_NAVIGATION_ITEMS.filter((i) => i.location === "PRIMARY");
        const footerItems = DEMO_NAVIGATION_ITEMS.filter((i) => i.location === "FOOTER");

        assert.ok(primaryItems.length >= 5);
        assert.ok(footerItems.length >= 6);

        DEMO_NAVIGATION_ITEMS.forEach((item) => {
          assert.ok(item.label.length > 0);
          assert.ok(item.url.length > 0);
          assert.ok(["PRIMARY", "FOOTER", "UTILITY", "MOBILE"].includes(item.location));
          assert.strictEqual(typeof item.displayOrder, "number");
          assert.strictEqual(typeof item.isVisible, "boolean");
        });
      });
    });

    describe("Banners & Announcements", () => {
      it("should verify marketing campaigns and alert banners", () => {
        assert.ok(DEMO_BANNERS.length >= 4);
        DEMO_BANNERS.forEach((banner) => {
          assert.ok(banner.id.startsWith("ban-"));
          assert.ok(banner.title.length > 0);
          assert.ok(["HERO_BANNER", "PROMOTIONAL", "ANNOUNCEMENT_BAR", "EVENT_BANNER", "CAMPAIGN"].includes(banner.bannerType));
          assert.ok(["DRAFT", "SCHEDULED", "ACTIVE", "EXPIRED", "ARCHIVED"].includes(banner.status));
          assert.ok(banner.startDate.length > 0 && banner.endDate.length > 0);
          assert.strictEqual(typeof banner.clicksCount, "number");
          assert.strictEqual(typeof banner.impressionsCount, "number");
        });
      });
    });

    describe("SEO Metadata & SERP Scoring", () => {
      it("should verify SEO settings, scores, and meta tags", () => {
        assert.ok(DEMO_SEO_SETTINGS.length >= 4);
        DEMO_SEO_SETTINGS.forEach((seo) => {
          assert.ok(seo.id.startsWith("seo-"));
          assert.ok(seo.pageId.length > 0);
          assert.ok(seo.pageTitle.length > 0);
          assert.ok(seo.canonicalUrl.startsWith("https://bdsisters.org"));
          assert.ok(seo.score >= 0 && seo.score <= 100);
          assert.ok(["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"].includes(seo.metaRobots));
        });
      });
    });

    describe("FAQ Knowledge Base & Website Policies", () => {
      it("should verify categorized FAQs", () => {
        assert.ok(DEMO_FAQS.length >= 4);
        DEMO_FAQS.forEach((faq) => {
          assert.ok(faq.id.startsWith("faq-"));
          assert.ok(faq.question.endsWith("?"));
          assert.ok(faq.answer.length > 20);
          assert.ok(faq.category.length > 0);
          assert.strictEqual(typeof faq.displayOrder, "number");
        });
      });

      it("should verify standard website documents and legal policies", () => {
        assert.ok(DEMO_WEBSITE_CONTENT.length >= 4);
        const types = DEMO_WEBSITE_CONTENT.map((c) => c.contentType);
        assert.ok(types.includes("ABOUT"));
        assert.ok(types.includes("MISSION"));
        assert.ok(types.includes("PRIVACY"));
        assert.ok(types.includes("TERMS"));

        DEMO_WEBSITE_CONTENT.forEach((doc) => {
          assert.ok(doc.title.length > 0);
          assert.ok(doc.content.length > 50);
          assert.strictEqual(doc.status, "PUBLISHED");
          assert.ok(doc.version >= 1);
        });
      });
    });

    describe("Media Library & Editorial Governance", () => {
      it("should verify media assets and dimensions", () => {
        assert.ok(DEMO_MEDIA_ASSETS.length >= 5);
        DEMO_MEDIA_ASSETS.forEach((asset) => {
          assert.ok(asset.id.startsWith("med-"));
          assert.ok(asset.fileName.length > 0);
          assert.ok(asset.url.startsWith("https://"));
          assert.ok(asset.altText.length > 0);
          assert.ok(asset.fileSizeBytes > 0);
          assert.strictEqual(asset.status, "ACTIVE");
        });
      });

      it("should verify content review approval queue", () => {
        assert.ok(DEMO_CONTENT_REVIEWS.length >= 3);
        DEMO_CONTENT_REVIEWS.forEach((rev) => {
          assert.ok(rev.id.startsWith("rev-"));
          assert.ok(rev.contentId.length > 0);
          assert.ok(["PAGE", "HOMEPAGE", "BANNER", "FAQ", "POLICY"].includes(rev.contentType));
          assert.ok(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "CHANGES_REQUESTED"].includes(rev.reviewStatus));
          assert.ok(["LOW", "MEDIUM", "HIGH", "URGENT"].includes(rev.priority));
        });
      });

      it("should verify revision history and changelog snapshots", () => {
        assert.ok(DEMO_REVISIONS.length >= 4);
        DEMO_REVISIONS.forEach((revision) => {
          assert.ok(revision.id.startsWith("rvs-"));
          assert.ok(revision.contentId.length > 0);
          assert.ok(revision.revisionNumber > 0);
          assert.ok(revision.changeSummary.length > 0);
          assert.ok(revision.editorName.length > 0);
          assert.ok(["ACTIVE", "SUPERSEDED", "RESTORED"].includes(revision.status));
        });
      });
    });

    describe("Admin Navigation Integration", () => {
      it("should verify Website Management navigation group contains all 11 rich CMS tools", () => {
        const cmsGroup = adminNavGroups.find((g) => g.id === "website-management");
        assert.ok(cmsGroup, "Website Management group not found in admin nav");

        const expectedItemLabels = [
          "CMS Overview",
          "Website Pages",
          "Homepage Studio",
          "Header & Footer",
          "Banners & Campaigns",
          "SEO & Social Cards",
          "FAQ Knowledge Base",
          "Static Content & Policies",
          "Media Library",
          "Content Reviews",
          "Revision History",
        ];

        const actualItemLabels = cmsGroup.items.map((i) => i.label);
        expectedItemLabels.forEach((label) => {
          assert.ok(
            actualItemLabels.includes(label),
            `Missing expected CMS nav item: ${label}`
          );
        });
      });
    });
  });

  // =========================================================================
  // STEP 13 — Communication, Support & Notification Management Verification
  // =========================================================================
  describe("STEP 13 — Communication, Support & Notification Management", () => {
    describe("Communication KPIs & Telemetry Data", () => {
      it("should contain comprehensive communication metrics with realistic values", () => {
        assert.ok(DEMO_COMMUNICATION_KPIS.totalContactMessages >= 150);
        assert.ok(DEMO_COMMUNICATION_KPIS.unreadMessages >= 10);
        assert.ok(DEMO_COMMUNICATION_KPIS.openSupportTickets >= 20);
        assert.ok(DEMO_COMMUNICATION_KPIS.pendingComplaints >= 3);
        assert.ok(DEMO_COMMUNICATION_KPIS.resolvedTickets >= 200);
        assert.ok(DEMO_COMMUNICATION_KPIS.totalNewsletterSubscribers >= 5000);
        assert.ok(DEMO_COMMUNICATION_KPIS.activeAnnouncements >= 3);
        assert.ok(DEMO_COMMUNICATION_KPIS.emailsSentMonth >= 10000);
        assert.ok(DEMO_COMMUNICATION_KPIS.avgResolutionHours > 0);
      });

      it("should verify communication monthly growth telemetry series", () => {
        assert.ok(DEMO_COMMUNICATION_GROWTH_SERIES.length >= 6);
        DEMO_COMMUNICATION_GROWTH_SERIES.forEach((item) => {
          assert.ok(item.month.length > 0);
          assert.ok(item.tickets >= 0);
          assert.ok(item.contacts >= 0);
          assert.ok(item.emails >= 0);
        });
      });
    });

    describe("Contact Submissions & Inquiries", () => {
      it("should verify structured contact inquiries with categories and statuses", () => {
        assert.ok(DEMO_CONTACT_SUBMISSIONS.length >= 6);
        DEMO_CONTACT_SUBMISSIONS.forEach((contact) => {
          assert.ok(contact.id.startsWith("cnt-"));
          assert.ok(contact.senderName.length > 0);
          assert.ok(contact.email.includes("@"));
          assert.ok(contact.subject.length > 0);
          assert.ok(contact.message.length > 0);
        });
      });
    });

    describe("Support Tickets & Formal Complaints", () => {
      it("should verify support tickets, priority tags, and conversation threads", () => {
        assert.ok(DEMO_SUPPORT_TICKETS.length >= 6);
        DEMO_SUPPORT_TICKETS.forEach((ticket) => {
          assert.ok(ticket.id.startsWith("tkt-"));
          assert.ok(ticket.ticketNumber.startsWith("TKT-"));
          assert.ok(ticket.memberName.length > 0);
          assert.ok(ticket.memberEmail.includes("@"));
          assert.ok(ticket.subject.length > 0);
          assert.ok(ticket.messages.length > 0);
        });
      });

      it("should verify formal consumer and marketplace dispute complaints", () => {
        assert.ok(DEMO_COMPLAINTS.length >= 4);
        DEMO_COMPLAINTS.forEach((c) => {
          assert.ok(c.id.startsWith("cmp-"));
          assert.ok(c.complaintNumber.startsWith("CMP-"));
          assert.ok(c.reporterName.length > 0);
          assert.ok(c.reportedUserOrContent.length > 0);
        });
      });
    });

    describe("Email Templates, Engine & Logs", () => {
      it("should verify system transactional email templates with variables", () => {
        assert.ok(DEMO_EMAIL_TEMPLATES.length >= 6);
        DEMO_EMAIL_TEMPLATES.forEach((tpl) => {
          assert.ok(tpl.id.startsWith("tpl-"));
          assert.ok(tpl.name.length > 0);
          assert.ok(tpl.subject.length > 0);
          assert.ok(tpl.body.length > 0);
          assert.ok(tpl.variables.length > 0);
        });
      });

      it("should verify outbound email dispatch audit logs", () => {
        assert.ok(DEMO_EMAIL_LOGS.length >= 6);
        DEMO_EMAIL_LOGS.forEach((log) => {
          assert.ok(log.id.startsWith("log-"));
          assert.ok(log.recipient.includes("@"));
          assert.ok(log.createdDate.length > 0);
        });
      });
    });

    describe("Newsletter Subscribers & Broadcast Campaigns", () => {
      it("should verify newsletter subscriber list and opt-in sources", () => {
        assert.ok(DEMO_NEWSLETTER_SUBSCRIBERS.length >= 8);
        DEMO_NEWSLETTER_SUBSCRIBERS.forEach((sub) => {
          assert.ok(sub.id.startsWith("sub-"));
          assert.ok(sub.email.includes("@"));
          assert.ok(sub.status.length > 0);
        });
      });

      it("should verify newsletter broadcast campaigns and engagement metrics", () => {
        assert.ok(DEMO_NEWSLETTER_CAMPAIGNS.length >= 4);
        DEMO_NEWSLETTER_CAMPAIGNS.forEach((camp) => {
          assert.ok(camp.id.startsWith("cmp-"));
          assert.ok(camp.name.length > 0);
          assert.ok(camp.subject.length > 0);
        });
      });
    });

    describe("Platform Announcements & Global Banners", () => {
      it("should verify announcement alerts, severity levels, and audience target filters", () => {
        assert.ok(DEMO_ANNOUNCEMENTS.length >= 5);
        DEMO_ANNOUNCEMENTS.forEach((a) => {
          assert.ok(a.id.startsWith("ann-"));
          assert.ok(a.title.length > 0);
          assert.ok(a.description.length > 0);
        });
      });
    });

    describe("Multi-Channel Notifications Hub", () => {
      it("should verify notification templates with multi-channel support", () => {
        assert.ok(DEMO_NOTIFICATION_TEMPLATES.length >= 6);
        DEMO_NOTIFICATION_TEMPLATES.forEach((tpl) => {
          assert.ok(tpl.id.startsWith("ntf-"));
          assert.ok(tpl.name.length > 0);
          assert.ok(tpl.title.length > 0);
        });
      });

      it("should verify notification history delivery and read receipts", () => {
        assert.ok(DEMO_NOTIFICATION_HISTORY.length >= 6);
        DEMO_NOTIFICATION_HISTORY.forEach((item) => {
          assert.ok(item.id.startsWith("nh-"));
          assert.ok(item.recipientEmail.includes("@"));
          assert.ok(["READ", "UNREAD"].includes(item.readStatus));
        });
      });
    });

    describe("Bulk Direct Email Campaigns", () => {
      it("should verify bulk email records and recipient estimates", () => {
        assert.ok(DEMO_BULK_EMAIL_CAMPAIGNS.length >= 3);
        DEMO_BULK_EMAIL_CAMPAIGNS.forEach((bulk) => {
          assert.ok(bulk.id.startsWith("blk-"));
          assert.ok(bulk.name.length > 0);
          assert.ok(bulk.recipientCount > 0);
        });
      });
    });

    describe("Live Chat Help Desk", () => {
      it("should verify real-time chat sessions and multi-actor message history", () => {
        assert.ok(DEMO_LIVE_CHAT_CONVERSATIONS.length >= 4);
        DEMO_LIVE_CHAT_CONVERSATIONS.forEach((chat) => {
          assert.ok(chat.id.startsWith("chat-"));
          assert.ok(chat.memberName.length > 0);
          assert.ok(chat.messages.length > 0);
          chat.messages.forEach((msg) => {
            assert.ok(["MEMBER", "AGENT"].includes(msg.senderType));
            assert.ok(msg.text.length > 0);
          });
        });
      });
    });

    describe("Omnichannel Gateways & Global Configuration", () => {
      it("should verify communication gateways and enabled channels", () => {
        assert.ok(DEMO_COMMUNICATION_CHANNELS.length >= 5);
        DEMO_COMMUNICATION_CHANNELS.forEach((ch) => {
          assert.ok(ch.id.startsWith("chn-"));
          assert.ok(["EMAIL", "WHATSAPP", "TELEGRAM", "CONTACT_FORM", "LIVE_CHAT"].includes(ch.type));
        });
      });

      it("should verify global communication SLA and mailbox settings", () => {
        assert.ok(DEMO_COMMUNICATION_SETTINGS.contactNotificationEmail.includes("@"));
        assert.ok(DEMO_COMMUNICATION_SETTINGS.supportEscalationHours > 0);
      });
    });

    describe("Admin Navigation Integration", () => {
      it("should verify Communication navigation group contains all 10 enriched tools", () => {
        const commGroup = adminNavGroups.find((g) => g.id === "communication");
        assert.ok(commGroup, "Communication group not found in admin nav");

        const expectedItemLabels = [
          "Overview",
          "Contact Inquiries",
          "Support & Help Desk",
          "Email Management",
          "Newsletter & Campaigns",
          "Announcements",
          "Notifications Hub",
          "Bulk Email",
          "Live Chat Inbox",
          "Channels & Settings",
        ];

        const actualItemLabels = commGroup.items.map((i) => i.label);
        expectedItemLabels.forEach((label) => {
          assert.ok(
            actualItemLabels.includes(label),
            `Missing expected communication nav item: ${label}`
          );
        });
      });
    });
  });

  describe("Admin Step 14 - Muhsina Organization Integration & System Security Verification", () => {
    describe("Muhsina Integration KPIs & Engine Status", () => {
      it("should verify total synced members, health rate, and operational status", () => {
        assert.ok(DEMO_MUHSINA_KPIS.totalSyncedMembers >= 4000);
        assert.ok(DEMO_MUHSINA_KPIS.syncHealthRate > 95);
        assert.strictEqual(DEMO_MUHSINA_KPIS.connectedWings, 5);
        assert.strictEqual(DEMO_MUHSINA_KPIS.syncEngineStatus, "OPERATIONAL");
        assert.strictEqual(DEMO_MUHSINA_KPIS.webhookStatus, "ACTIVE");
      });
    });

    describe("Organizational Wings Directory", () => {
      it("should verify all 5 connected wings with leads and focus areas", () => {
        assert.strictEqual(DEMO_MUHSINA_WINGS.length, 5);
        const wingCodes = DEMO_MUHSINA_WINGS.map((w) => w.code);
        assert.deepStrictEqual(wingCodes.sort(), ["CoP", "IMBD", "MCPO", "SWSA", "TSPP"].sort());

        DEMO_MUHSINA_WINGS.forEach((w) => {
          assert.ok(w.id.startsWith("wing-"));
          assert.ok(w.name.length > 0);
          assert.ok(w.leadName.length > 0);
          assert.ok(w.leadEmail.includes("@muhsina.org"));
          assert.ok(w.membersCount > 0);
          assert.ok(w.focusAreas.length > 0);
          assert.strictEqual(w.status, "ACTIVE");
        });
      });
    });

    describe("Cross-Platform Member Mapping & Conflict Review", () => {
      it("should verify cross-platform member mappings contain dual IDs and confidence scores", () => {
        assert.ok(DEMO_MUHSINA_MEMBERS.length >= 5);
        DEMO_MUHSINA_MEMBERS.forEach((m) => {
          assert.ok(m.bdsistersId.startsWith("BDS-"));
          assert.ok(m.muhsinaId.startsWith("MUH-"));
          assert.ok(m.matchConfidence >= 80);
          assert.ok(["SYNCHRONIZED", "PENDING_SYNC", "CONFLICT", "UNMAPPED"].includes(m.syncStatus));
        });
      });

      it("should verify synchronization logs contain duration and execution types", () => {
        assert.ok(DEMO_SYNC_LOGS.length >= 3);
        DEMO_SYNC_LOGS.forEach((log) => {
          assert.ok(log.recordsProcessed > 0);
          assert.ok(log.durationMs > 0);
          assert.ok(["SUCCESS", "WARNING", "FAILED"].includes(log.status));
        });
      });

      it("should verify conflict items have dual values and resolution severities", () => {
        assert.ok(DEMO_MAPPING_CONFLICTS.length >= 3);
        DEMO_MAPPING_CONFLICTS.forEach((c) => {
          assert.ok(c.bdsistersValue.length > 0);
          assert.ok(c.muhsinaValue.length > 0);
          assert.ok(["HIGH", "MEDIUM", "LOW"].includes(c.severity));
          assert.ok(["PENDING_REVIEW", "RESOLVED_LOCAL", "RESOLVED_REMOTE", "DISMISSED"].includes(c.status));
        });
      });
    });

    describe("System Security & Audit Controls", () => {
      it("should verify security KPIs, 2FA adoption, and audit logging", () => {
        assert.ok(DEMO_SECURITY_KPIS.securityScore >= 90);
        assert.ok(DEMO_SECURITY_KPIS.twoFactorAdoptionRate > 80);
        assert.ok(DEMO_SECURITY_KPIS.activeAdminSessions > 0);

        assert.ok(DEMO_AUDIT_LOGS.length >= 4);
        DEMO_AUDIT_LOGS.forEach((log) => {
          assert.ok(log.adminEmail.includes("@bdsisters.org"));
          assert.ok(log.ipAddress.length > 0);
          assert.ok(["SUCCESS", "DENIED", "FLAGGED"].includes(log.status));
        });
      });

      it("should verify login history, active sessions, and security events", () => {
        assert.ok(DEMO_LOGIN_HISTORY.length >= 4);
        assert.ok(DEMO_ACTIVE_SESSIONS.some((s) => s.isCurrentSession));
        assert.ok(DEMO_SECURITY_EVENTS.length >= 2);
        DEMO_SECURITY_EVENTS.forEach((e) => {
          assert.ok(e.mitigationAction.length > 0);
          assert.ok(["RESOLVED", "INVESTIGATING", "OPEN"].includes(e.status));
        });
      });

      it("should verify database backups integrity and service health monitoring", () => {
        assert.ok(DEMO_BACKUPS.length >= 3);
        DEMO_BACKUPS.forEach((b) => {
          assert.ok(b.checksum.startsWith("sha256:"));
          assert.strictEqual(b.status, "VERIFIED_INTEGRAL");
        });

        assert.ok(DEMO_SERVICE_HEALTH.length >= 5);
        DEMO_SERVICE_HEALTH.forEach((srv) => {
          assert.strictEqual(srv.status, "HEALTHY");
          assert.ok(srv.uptime.includes("%"));
        });
      });
    });

    describe("Admin Navigation & Centralized Routes Compliance", () => {
      it("should verify all Step 14 routes are properly registered in ROUTES.admin", async () => {
        const { ROUTES } = await import("../../src/config/routes.ts");
        assert.strictEqual(ROUTES.admin.muhsina, "/admin/integrations/muhsina");
        assert.strictEqual(ROUTES.admin.muhsinaWings, "/admin/integrations/muhsina/wings");
        assert.strictEqual(ROUTES.admin.muhsinaMembers, "/admin/integrations/muhsina/members");
        assert.strictEqual(ROUTES.admin.muhsinaConflicts, "/admin/integrations/muhsina/conflicts");
        assert.strictEqual(ROUTES.admin.muhsinaSync, "/admin/integrations/muhsina/synchronization");
        assert.strictEqual(ROUTES.admin.muhsinaSettings, "/admin/integrations/muhsina/settings");
        assert.strictEqual(ROUTES.admin.security, "/admin/security");
        assert.strictEqual(ROUTES.admin.securityAuditLogs, "/admin/security/audit-logs");
        assert.strictEqual(ROUTES.admin.securityLoginHistory, "/admin/security/login-history");
        assert.strictEqual(ROUTES.admin.securitySessions, "/admin/security/sessions");
        assert.strictEqual(ROUTES.admin.securityTwoFactor, "/admin/security/two-factor");
        assert.strictEqual(ROUTES.admin.securityEvents, "/admin/security/events");
        assert.strictEqual(ROUTES.admin.securityPrivacy, "/admin/security/privacy");
        assert.strictEqual(ROUTES.admin.systemBackups, "/admin/system/backups");
        assert.strictEqual(ROUTES.admin.systemHealth, "/admin/system/health");
        assert.strictEqual(ROUTES.admin.systemApiMonitoring, "/admin/system/api-monitoring");
        assert.strictEqual(ROUTES.admin.systemErrors, "/admin/system/errors");
      });

      it("should verify Integrations and System navigation groups contain Step 14 children", () => {
        const intGroup = adminNavGroups.find((g) => g.id === "integrations");
        assert.ok(intGroup, "Integrations group missing");
        const muhItem = intGroup.items.find((i) => i.label === "Muhsina Organization");
        assert.ok(muhItem && muhItem.children && muhItem.children.length >= 6);

        const sysGroup = adminNavGroups.find((g) => g.id === "system");
        assert.ok(sysGroup, "System group missing");
        const secItem = sysGroup.items.find((i) => i.label === "Security & Access");
        assert.ok(secItem && secItem.children && secItem.children.length >= 6);
      });
    });
  });
});
