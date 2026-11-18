"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  User,
  Clock,
  CheckCircle2,
  Bot,
  Shield,
  MoreVertical
} from "lucide-react";
import {
  DEMO_LIVE_CHAT_CONVERSATIONS,
  formatDate
} from "../../data/mock-communication";
import type {
  LiveChatConversation,
  LiveChatMessage,
  LiveChatStatus
} from "../../types/communication";

interface Props {
  conversationId: string;
}

export function LiveChatConversationView({ conversationId }: Props) {
  const initial: LiveChatConversation =
    DEMO_LIVE_CHAT_CONVERSATIONS.find((c) => c.id === conversationId) ||
    DEMO_LIVE_CHAT_CONVERSATIONS[0]!;

  const [conversation, setConversation] = useState<LiveChatConversation>(initial);
  const [messages, setMessages] = useState<LiveChatMessage[]>(initial.messages || []);
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState<LiveChatStatus>(initial.status);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `msg-${Date.now()}`,
      senderType: "agent",
      senderName: "BDSisters Support (You)",
      content: replyText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyText("");
    showToast("Support reply recorded in ticket thread (Demo state)");
  };

  const handleStatusChange = (newStatus: LiveChatStatus) => {
    setStatus(newStatus);
    showToast(`Conversation marked as ${newStatus} (Demo state)`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium shadow-2xl shadow-indigo-500/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/live-chat"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Live Chat Session</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {conversation.userName}
            </h1>
            <p className="text-sm text-slate-300">
              User: <span className="text-white font-medium">{conversation.userEmail}</span> • Assigned: {conversation.assignedTo}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as LiveChatStatus)}
              className="rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
            >
              <option value="open" className="text-slate-900">Mark as Open</option>
              <option value="pending" className="text-slate-900">Mark as Pending</option>
              <option value="closed" className="text-slate-900">Mark as Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          <div className="text-center">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
              Session started on {formatDate(conversation.createdAt)}
            </span>
          </div>

          {messages.map((msg) => {
            const isAgent = msg.senderType === "agent";
            const isBot = msg.senderType === "bot";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${
                  isAgent ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isAgent
                      ? "bg-indigo-600 text-white"
                      : isBot
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {isAgent ? (
                    <Shield className="h-4 w-4" />
                  ) : isBot ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    msg.senderName[0]
                  )}
                </div>

                <div className="space-y-1">
                  <div
                    className={`flex items-center gap-2 text-[11px] text-slate-400 ${
                      isAgent ? "justify-end" : ""
                    }`}
                  >
                    <span className="font-semibold text-slate-700">{msg.senderName}</span>
                    <span>•</span>
                    <span>{formatDate(msg.timestamp)}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                      isAgent
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : isBot
                        ? "bg-amber-50 text-amber-950 rounded-tl-none border border-amber-200/50"
                        : "bg-white text-slate-800 rounded-tl-none shadow-md shadow-slate-200/50"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Input Bar */}
        <form
          onSubmit={handleSendReply}
          className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Type your message to the user..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
            <span>Send Reply</span>
          </button>
        </form>
      </div>
    </div>
  );
}
