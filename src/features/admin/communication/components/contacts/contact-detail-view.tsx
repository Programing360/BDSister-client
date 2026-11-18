"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Save,
  CheckCircle2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  FileText,
  User,
  Clock,
  Archive,
} from "lucide-react";
import type { ContactSubmission, ContactStatus, PriorityLevel } from "../../types/communication";
import {
  PriorityBadge,
  ContactStatusBadge,
} from "../common/communication-status-badges";

import { DEMO_CONTACT_SUBMISSIONS } from "../../data/mock-communication";

interface ContactDetailViewProps {
  contact?: ContactSubmission;
  contactId?: string;
}

export function ContactDetailView({ contact: initialContactProp, contactId }: ContactDetailViewProps) {
  const initialContact: ContactSubmission =
    initialContactProp ||
    DEMO_CONTACT_SUBMISSIONS.find((c) => c.id === contactId) ||
    DEMO_CONTACT_SUBMISSIONS[0]!;
  const [contact, setContact] = useState<ContactSubmission>(initialContact);
  const [status, setStatus] = useState<ContactStatus>(contact.status);
  const [priority, setPriority] = useState<PriorityLevel>(contact.priority);
  const [internalNotes, setInternalNotes] = useState(contact.internalNotes || "");
  const [replyMessage, setReplyMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveMetadata = () => {
    setContact({
      ...contact,
      status,
      priority,
      internalNotes,
    });
    triggerToast("Inquiry status & internal notes updated (Demo UI)");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      sender: "BDSisters Admin Team",
      text: replyMessage,
      sentAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    const updatedReplies = contact.replyHistory ? [...contact.replyHistory, newReply] : [newReply];

    setContact({
      ...contact,
      status: "REPLIED",
      replyHistory: updatedReplies,
    });
    setStatus("REPLIED");
    setReplyMessage("");
    triggerToast(`Reply sent to ${contact.email} (Demo UI — no real email dispatched)`);
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
                href="/admin/communication/contacts"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Inquiries List
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Inquiry #{contact.id}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {contact.subject}
            </h1>
            <p className="text-sm text-slate-300">
              Submitted by {contact.senderName} ({contact.email}) on {contact.submissionDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveMetadata}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Updates
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols): Inquiry Body & Reply Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inquiry Message Box */}
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm">
                  {contact.senderName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{contact.senderName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{contact.email}</span>
                    {contact.phone && <span>• {contact.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PriorityBadge priority={contact.priority} />
                <ContactStatusBadge status={contact.status} />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50/70 p-5 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
              {contact.message}
            </div>

            <div className="text-[11px] text-slate-400">
              Category: <strong className="text-slate-600">{contact.category}</strong> • Received: {contact.submissionDate}
            </div>
          </div>

          {/* Reply History if present */}
          {contact.replyHistory && contact.replyHistory.length > 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Reply History ({contact.replyHistory.length})
              </h3>
              <div className="space-y-3">
                {contact.replyHistory.map((rep) => (
                  <div key={rep.id} className="rounded-xl bg-indigo-50/40 p-4 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-indigo-900">{rep.sender}</span>
                      <span className="text-slate-400">{rep.sentAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {rep.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Composer Form */}
          <form
            onSubmit={handleSendReply}
            className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Send Response to {contact.senderName}</h3>
                <p className="text-xs text-slate-500">Drafted response will simulate sending an email to {contact.email}.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Demo Mailer
              </span>
            </div>

            <div>
              <textarea
                rows={5}
                required
                placeholder="Write your professional response on behalf of BDSisters administration..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full rounded-xl bg-slate-50 p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Standard Sisterhood greeting and official signature are appended automatically.
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

        {/* Right Column (1 Col): Status, Priority & Internal Notes */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Inquiry Controls</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="NEW">New</option>
                <option value="READ">Read</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REPLIED">Replied</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Tier
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

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Administrative Notes
              </label>
              <textarea
                rows={4}
                placeholder="Add confidential notes for other admin team members..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full rounded-xl bg-slate-50 p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveMetadata}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-slate-800 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              Save Note & Status
            </button>
          </div>

          {/* Quick Sender Metadata Card */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sender Details
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <User className="h-4 w-4 text-indigo-600" />
              <span>{contact.senderName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span className="font-mono">{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Phone className="h-4 w-4 text-indigo-600" />
                <span>{contact.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>{contact.submissionDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
