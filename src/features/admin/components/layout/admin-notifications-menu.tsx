"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, ShieldCheck, ShoppingBag, FileText, ChevronRight } from "lucide-react";
import { notificationService } from "@/lib/services/notification-service";
import type { AppNotification } from "@/types/notification";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: "verification" | "order" | "business";
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "New NID Verification",
    description: "Afsana Karim submitted Smart NID document for manual review.",
    timestamp: "12m ago",
    unread: true,
    type: "verification",
  },
  {
    id: "notif_2",
    title: "Payment Confirmed via ZiniPay",
    description: "Order BDS-202611-10492 received ৳18,560 (Invoice: INV_ZINI_88392).",
    timestamp: "28m ago",
    unread: true,
    type: "order",
  },
  {
    id: "notif_3",
    title: "Artisan Enterprise Review",
    description: "Rupganj Handloom Studio requested Trade License & TIN verification.",
    timestamp: "1h ago",
    unread: true,
    type: "business",
  },
];

export function AdminNotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    notificationService
      .getNotifications()
      .then((data) => {
        console.log(data)
        if (isMounted && data && data.length > 0) {
          const mapped = data.map((n: any, idx: number) => ({
            id: n.id || n._id || `admin_notif_${idx}`,
            title: n.title || "Notification",
            description: n.message || n.description || "",
            timestamp: n.createdAt
              ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Just now",
            unread: n.read !== undefined ? !n.read : n.isRead !== undefined ? !n.isRead : true,
            type: (
              n.type && typeof n.type === "string" && n.type.toLowerCase() === "order"
                ? "order"
                : n.type && typeof n.type === "string" && n.type.toLowerCase() === "verification"
                  ? "verification"
                  : "business"
            ) as "verification" | "order" | "business",
          }));
          setNotifications(mapped);
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

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
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
    } catch { }
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Admin Notifications"
        aria-expanded={isOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 bg-white/90 text-gray-600 shadow-sm transition hover:border-[#5B46F6]/40 hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#5B46F6] text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 px-1">
            <div>
              <h3 className="text-xs font-bold text-gray-900">Platform Notifications</h3>
              <p className="text-[10px] text-gray-500">{unreadCount} unread administration alerts</p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#5B46F6] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="mt-2 divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
            {notifications.map((item, index) => {
              const itemKey = item.id || `admin_notif_${index}`;
              return (
                <div
                  key={itemKey}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition ${item.unread ? "bg-purple-50/50" : "hover:bg-gray-50"
                    }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${item.type === "verification"
                      ? "bg-amber-100 text-amber-700"
                      : item.type === "order"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-purple-100 text-[#5B46F6]"
                      }`}
                  >
                    {item.type === "verification" ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : item.type === "order" ? (
                      <ShoppingBag className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                      <span className="text-[10px] text-gray-400 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-2.5 mt-2 text-center">
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5B46F6] hover:underline"
            >
              <span>View All Notifications</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
