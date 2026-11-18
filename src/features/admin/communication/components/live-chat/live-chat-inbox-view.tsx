"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Inbox
} from "lucide-react";
import {
  DEMO_LIVE_CHAT_CONVERSATIONS,
  formatDate
} from "../../data/mock-communication";
import type {
  LiveChatConversation,
  LiveChatStatus
} from "../../types/communication";

export function LiveChatInboxView() {
  const [conversations, setConversations] = useState<LiveChatConversation[]>(
    DEMO_LIVE_CHAT_CONVERSATIONS
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LiveChatStatus | "all">("all");

  const filtered = conversations.filter((c) => {
    const userName = c.userName || c.memberName || "";
    const userEmail = c.userEmail || c.memberEmail || "";
    const lastMessage = c.lastMessage || c.lastMessagePreview || "";
    const matchesSearch =
      userName.toLowerCase().includes(search.toLowerCase()) ||
      userEmail.toLowerCase().includes(search.toLowerCase()) ||
      lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Asynchronous Support Desk</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Support Message Threads & Inquiries
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Review and respond to customer support inquiries, seller messages, and ticket conversation threads asynchronously.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search chat inbox by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "open", "pending", "closed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const userName = item.userName || item.memberName || "Member";
          const userEmail = item.userEmail || item.memberEmail || "";
          const lastMessage = item.lastMessage || item.lastMessagePreview || "";
          return (
            <Link
              key={item.id}
              href={`/admin/communication/live-chat/${item.id}`}
              className="group block rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-sm">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    {item.status === "open" && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {userName}
                      </span>
                      <span className="text-xs text-slate-400">({userEmail})</span>
                      {item.unreadCount > 0 && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          {item.unreadCount} new
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                      {lastMessage}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Assigned to: {item.assignedTo || item.assignedAgent || "Support"}</span>
                      <span>•</span>
                      <span>{formatDate(item.lastMessageAt || item.lastActivity)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      item.status === "open"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.status === "open"
                          ? "bg-emerald-500"
                          : item.status === "pending"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {item.status}
                  </span>

                  <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl shadow-slate-200/50">
            <Inbox className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-semibold text-slate-800">No chats found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search criteria or status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
