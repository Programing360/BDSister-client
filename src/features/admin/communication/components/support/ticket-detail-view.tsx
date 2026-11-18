"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Save,
  CheckCircle2,
  Trash2,
  Sparkles,
  LifeBuoy,
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  FileText,
} from "lucide-react";
import type { SupportTicket, TicketStatus, PriorityLevel, TicketMessage } from "../../types/communication";
import {
  PriorityBadge,
  TicketStatusBadge,
} from "../common/communication-status-badges";

import { DEMO_SUPPORT_TICKETS } from "../../data/mock-communication";

interface TicketDetailViewProps {
  ticket?: SupportTicket;
  ticketId?: string;
}

export function TicketDetailView({ ticket: initialTicketProp, ticketId }: TicketDetailViewProps) {
  const initialTicket: SupportTicket =
    initialTicketProp ||
    DEMO_SUPPORT_TICKETS.find((t) => t.id === ticketId) ||
    DEMO_SUPPORT_TICKETS[0]!;
  const [ticket, setTicket] = useState<SupportTicket>(initialTicket);
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<PriorityLevel>(ticket.priority);
  const [assignedAdmin, setAssignedAdmin] = useState(ticket.assignedAdmin);
  const [replyText, setReplyText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateMetadata = () => {
    setTicket({
      ...ticket,
      status,
      priority,
      assignedAdmin,
      lastUpdated: new Date().toISOString().replace("T", " ").slice(0, 16),
    });
    triggerToast("Ticket metadata and assignment updated (Demo UI)");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      senderName: `${assignedAdmin} (Admin Support)`,
      senderEmail: "support@bdsisters.org",
      senderType: "ADMIN",
      message: replyText,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    setTicket({
      ...ticket,
      status: "WAITING_FOR_RESPONSE",
      lastUpdated: newMessage.timestamp,
      messages: [...ticket.messages, newMessage],
    });
    setStatus("WAITING_FOR_RESPONSE");
    setReplyText("");
    triggerToast(`Reply sent to ${ticket.memberName} (Demo UI)`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteText.trim()) return;
    setTicket({
      ...ticket,
      internalNotes: [...ticket.internalNotes, internalNoteText],
    });
    setInternalNoteText("");
    triggerToast("Internal note appended.");
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/support/tickets"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Tickets List
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-300">
                {ticket.ticketNumber}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {ticket.subject}
            </h1>
            <p className="text-sm text-slate-300">
              Submitted by {ticket.memberName} ({ticket.memberEmail}) on {ticket.createdDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdateMetadata}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Ticket State
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols): Conversation Timeline & Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversation Stream */}
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                Conversation Thread ({ticket.messages.length} messages)
              </h3>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={ticket.priority} />
                <TicketStatusBadge status={ticket.status} />
              </div>
            </div>

            <div className="space-y-4">
              {ticket.messages.map((msg) => {
                const isAdmin = msg.senderType === "ADMIN";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                        isAdmin
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-slate-50 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reply Composer Form */}
          <form
            onSubmit={handleSendReply}
            className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reply to {ticket.memberName}</h3>
                <p className="text-xs text-slate-500">
                  Response will be delivered to member&apos;s registered email and in-app support drawer.
                </p>
              </div>
            </div>

            <div>
              <textarea
                rows={5}
                required
                placeholder="Draft your helpful support response with sisterhood warmth and clarity..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full rounded-xl bg-slate-50 p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Ticket status will automatically change to &quot;Waiting for Response&quot; upon send.
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch Response
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (1 Col): Ticket Controls, Member Info & Notes */}
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Ticket Management</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resolution Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="WAITING_FOR_RESPONSE">Waiting for Response</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Administrator
              </label>
              <select
                value={assignedAdmin}
                onChange={(e) => setAssignedAdmin(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="Tanzina Islam">Tanzina Islam (Lead)</option>
                <option value="Farzana Yasmin">Farzana Yasmin (Compliance)</option>
                <option value="Sabrina Hossain">Sabrina Hossain (Grants)</option>
                <option value="Tech Support">Tech Support Operations</option>
                <option value="Events Desk">Events Desk Coordinator</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleUpdateMetadata}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-slate-800 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              Update Ticket State
            </button>
          </div>

          {/* Member Profile Summary Card */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Member Profile
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <User className="h-4 w-4 text-indigo-600" />
              <span>{ticket.memberName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span className="font-mono">{ticket.memberEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Shield className="h-4 w-4 text-indigo-600" />
              <span>ID: {ticket.memberId}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>Created: {ticket.createdDate}</span>
            </div>
          </div>

          {/* Internal Notes Box */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Internal Team Notes
            </h4>
            {ticket.internalNotes.length > 0 ? (
              <div className="space-y-2">
                {ticket.internalNotes.map((note, idx) => (
                  <div key={idx} className="rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900">
                    {note}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No internal notes yet.</p>
            )}

            <form onSubmit={handleAddNote} className="pt-2 space-y-2">
              <input
                type="text"
                placeholder="Add team note..."
                value={internalNoteText}
                onChange={(e) => setInternalNoteText(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-100 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                + Add Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
