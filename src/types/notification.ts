/**
 * In-App Notification Types for BDSisters.org (Domain 10)
 */

export type NotificationType =
  | "SYSTEM"
  | "VERIFICATION"
  | "ORDER"
  | "COMMUNITY"
  | "EVENT"
  | "ANNOUNCEMENT"
  | "MEMBERSHIP";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationStats {
  total: number;
  unread: number;
}
