/**
 * In-App Notification Service for BDSisters.org (Domain 10)
 * Handles notification feed retrieval, unread count badge, and mark-as-read status.
 */

import { apiClient } from "../api/client.ts";
import { API_ENDPOINTS } from "../api/endpoints.ts";
import type { AppNotification, NotificationStats, NotificationType } from "../../types/notification.ts";

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_1",
    title: "Sisterhood Directory Profile Approved",
    message: "Your member profile has been verified by our moderation team and is now discoverable in the Sisterhood Directory.",
    type: "VERIFICATION",
    priority: "HIGH",
    read: false,
    actionUrl: "/member/profile",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
  },
  {
    id: "notif_2",
    title: "ZiniPay Payment Received — Order #BDS-10492",
    message: "Payment of ৳18,560 for Jamdani Saree Collection has been verified via ZiniPay Gateway.",
    type: "ORDER",
    priority: "NORMAL",
    read: false,
    actionUrl: "/member/orders",
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // 1.5h ago
  },
  {
    id: "notif_3",
    title: "Upcoming Masterclass: Islamic Ethical Marketing",
    message: "Join Ustaza Tasneem tonight at 8:00 PM for a live interactive workshop on Shariah-compliant retail.",
    type: "EVENT",
    priority: "NORMAL",
    read: false,
    actionUrl: "/events/islamic-ethical-marketing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
  },
  {
    id: "notif_4",
    title: "New Community Reply",
    message: "Sister Nusrat Jahan replied to your thread in 'Halal Business Scaling & Exports'.",
    type: "COMMUNITY",
    priority: "LOW",
    read: true,
    actionUrl: "/member/community",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
  },
  {
    id: "notif_5",
    title: "Muhsina Sisterhood Ramadan Grant Announcement",
    message: "Applications for the 2026 Micro-Grant Cohort for women artisans are now open. Review guidelines and apply.",
    type: "ANNOUNCEMENT",
    priority: "HIGH",
    read: true,
    actionUrl: "/member/goals",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2d ago
  },
];

let localNotifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];

export const notificationService = {
  /**
   * Fetch all member notifications with optional type and unread filter
   */
  async getNotifications(options?: {
    unreadOnly?: boolean;
    type?: NotificationType | "ALL";
  }): Promise<AppNotification[]> {
    try {
      const params: Record<string, string> = {};
      if (options?.unreadOnly) params.unreadOnly = "true";
      if (options?.type && options.type !== "ALL") params.type = options.type;

      const res = await apiClient.get<AppNotification[]>(
        API_ENDPOINTS.notifications.list,
        { params }
      );
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn(
        "[NotificationService] Live notifications API deferred, using simulated feed:",
        (err as Error).message
      );
    }

    let result = [...localNotifications];
    if (options?.unreadOnly) {
      result = result.filter((n) => !n.read);
    }
    if (options?.type && options.type !== "ALL") {
      result = result.filter((n) => n.type === options.type);
    }
    return result;
  },

  /**
   * Fetch the unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient.get<{ count: number }>(
        API_ENDPOINTS.notifications.unreadCount
      );
      if (typeof res.data?.count === "number") {
        return res.data.count;
      }
    } catch (err) {
      console.warn(
        "[NotificationService] Live unreadCount API deferred:",
        (err as Error).message
      );
    }

    return localNotifications.filter((n) => !n.read).length;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string): Promise<AppNotification> {
    try {
      const res = await apiClient.patch<AppNotification>(
        API_ENDPOINTS.notifications.markRead(id),
        { read: true }
      );
      if (res.data) return res.data;
    } catch (err) {
      console.warn(
        "[NotificationService] MarkAsRead API deferred:",
        (err as Error).message
      );
    }

    const index = localNotifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      localNotifications[index] = {
        ...localNotifications[index]!,
        read: true,
      };
      return localNotifications[index]!;
    }

    throw new Error("Notification not found");
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; updatedCount: number }> {
    try {
      const res = await apiClient.post<{ success: boolean; updatedCount: number }>(
        "/api/notifications/read-all"
      );
      if (res.data) return res.data;
    } catch (err) {
      console.warn(
        "[NotificationService] MarkAllAsRead API deferred:",
        (err as Error).message
      );
    }

    const unreadCount = localNotifications.filter((n) => !n.read).length;
    localNotifications = localNotifications.map((n) => ({ ...n, read: true }));
    return { success: true, updatedCount: unreadCount };
  },
};
