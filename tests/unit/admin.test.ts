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
  });
});
