"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Loader2,
  ExternalLink,
  Sparkles,
  Inbox,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface NotificationItem {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
  actionUrl?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string;
}

export function MemberNotificationMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch unread count on mount
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await apiClient.get<{ count?: number; unreadCount?: number }>(
        API_ENDPOINTS.notifications.unreadCount
      );
      const raw = res as unknown as { count?: number; unreadCount?: number; data?: { count?: number } };
      const count =
        typeof raw?.count === "number"
          ? raw.count
          : typeof raw?.unreadCount === "number"
          ? raw.unreadCount
          : typeof raw?.data?.count === "number"
          ? raw.data.count
          : 0;
      setUnreadCount(count);
    } catch {
      // Fallback
    }
  }, []);

  // Fetch notifications list when dropdown opens
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<{ data?: NotificationItem[]; unreadCount?: number }>(
        API_ENDPOINTS.notifications.list
      );
      const raw = res as unknown as
        | { data?: NotificationItem[]; unreadCount?: number }
        | NotificationItem[];

      let list: NotificationItem[] = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (Array.isArray(raw?.data)) {
        list = raw.data;
      }

      setNotifications(list);
      if (typeof (raw as any)?.unreadCount === "number") {
        setUnreadCount((raw as any).unreadCount);
      } else {
        const computedUnread = list.filter((n) => !(n.isRead ?? n.read)).length;
        setUnreadCount(computedUnread);
      }
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Click outside and Escape key handler to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) return;
    setIsMarkingAll(true);
    try {
      await apiClient.patch("/api/notifications/read-all");
    } catch {
      try {
        await apiClient.post("/api/notifications/read-all");
      } catch {
        // Fallback simulated update
      }
    } finally {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      );
      setUnreadCount(0);
      setIsMarkingAll(false);
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    const notifId = item._id || item.id || "";
    const isUnread = !(item.isRead ?? item.read);

    if (isUnread && notifId) {
      try {
        await apiClient.patch(`/api/notifications/${notifId}/read`, {
          isRead: true,
        });
      } catch {
        // Optimistic update
      }
      setNotifications((prev) =>
        prev.map((n) =>
          (n._id === notifId || n.id === notifId)
            ? { ...n, isRead: true, read: true }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    setIsOpen(false);
    const targetLink = item.link || item.actionUrl;
    if (targetLink) {
      router.push(targetLink);
    }
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-BD", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label="View notifications"
        aria-expanded={isOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-2xs transition-all hover:border-[#5B9891]/40 hover:text-[#5B9891] active:scale-95"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D98408] text-[10px] font-bold text-white shadow-xs ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* In-Place Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-[#F7DFC7] bg-white shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F7DFC7]/60 bg-[#FAF8F5] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#D98408]/15 px-2 py-0.5 text-[10px] font-bold text-[#D98408]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#5B9891] hover:text-[#467A74] transition disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>{isMarkingAll ? "Marking..." : "Mark all read"}</span>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-[#5B9891]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <Inbox className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-700">No notifications yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  You are all caught up with sisterhood updates!
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !(item.isRead ?? item.read);
                return (
                  <button
                    key={item._id || item.id || Math.random().toString()}
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    className={`w-full text-left p-3.5 transition flex gap-3 items-start ${
                      isUnread
                        ? "bg-[#F7DFC7]/20 hover:bg-[#F7DFC7]/35"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      {isUnread ? (
                        <span className="flex h-2 w-2 rounded-full bg-[#D98408] ring-2 ring-[#D98408]/30" />
                      ) : (
                        <span className="flex h-2 w-2 rounded-full bg-gray-200" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-[#111E28] truncate">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {formatTimestamp(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">
                        {item.message}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#F7DFC7]/60 bg-[#FAF8F5] px-4 py-2.5 text-center">
            <Link
              href="/member/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[#5B9891] hover:text-[#467A74] inline-flex items-center gap-1 transition"
            >
              <span>View all notifications</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
