"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Sparkles,
  Eye,
  Code,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import type { EmailTemplate, EmailTemplateCategory } from "../../types/communication";

interface EmailTemplateEditorProps {
  initialData?: EmailTemplate;
  templateId?: string;
  isReadOnly?: boolean;
}

export function EmailTemplateEditor({ initialData, templateId, isReadOnly = false }: EmailTemplateEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData || templateId);

  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<EmailTemplateCategory>(
    initialData?.category || "WELCOME"
  );
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT">((initialData?.status as any) || "DRAFT");
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const standardVariables = [
    "name",
    "email",
    "siteName",
    "verificationLink",
    "supportUrl",
    "amount",
    "orderId",
    "ticketNumber",
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
      router.push("/admin/communication/email/templates");
    }, 1500);
  };

  const handleCopyVar = (varName: string) => {
    navigator.clipboard?.writeText(`{{${varName}}}`);
    setCopiedVar(varName);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !body) return;
    triggerToast(
      isEditing
        ? `Template "${name}" saved successfully (Demo UI).`
        : `New template "${name}" created (Demo UI).`
    );
  };

  // Interpolate demo variables for preview
  const previewBody = body
    .replace(/\{\{name\}\}/g, "Tanzina Islam")
    .replace(/\{\{email\}\}/g, "tanzina@bdsisters.org")
    .replace(/\{\{siteName\}\}/g, "BDSisters.org")
    .replace(/\{\{verificationLink\}\}/g, "https://bdsisters.org/verify/token-demo")
    .replace(/\{\{supportUrl\}\}/g, "https://bdsisters.org/support")
    .replace(/\{\{amount\}\}/g, "42,500")
    .replace(/\{\{orderId\}\}/g, "ORD-9921")
    .replace(/\{\{ticketNumber\}\}/g, "TKT-8841");

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
                href="/admin/communication/email/templates"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Email Templates
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Safe Transactional Template Studio
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {isEditing ? `Edit Template: ${name}` : "Create New Email Template"}
            </h1>
            <p className="text-sm text-slate-300">
              Compose brand-compliant email communications with structured variable interpolation and safe rendering.
            </p>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Template changes are simulated locally. No actual email provider mutations occur.</span>
        </div>
      </div>

      {/* Editor & Variable Palette */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Template Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZiniPay Payout Receipt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EmailTemplateCategory)}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                  >
                    <option value="WELCOME">Welcome Email</option>
                    <option value="VERIFICATION">Email Verification</option>
                    <option value="PASSWORD_RESET">Password Reset</option>
                    <option value="MEMBERSHIP">Membership Confirmation</option>
                    <option value="PAYMENT">Payment Confirmation</option>
                    <option value="APPROVAL">Profile Approval</option>
                    <option value="EVENT">Event Registration</option>
                    <option value="SUPPORT">Support Response</option>
                    <option value="ANNOUNCEMENT">General Announcement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payout Disbursed: ৳{{amount}} via {{payoutMethod}}"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              {/* View Switcher Tabs (Edit vs Preview) */}
              <div className="pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTab("edit")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        previewTab === "edit"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Editor Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("preview")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        previewTab === "preview"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Live Render Preview
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {body.length} characters
                  </span>
                </div>

                {previewTab === "edit" ? (
                  <textarea
                    rows={12}
                    required
                    placeholder="Compose structured email body. Use {{variable}} tags from the palette..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner leading-relaxed"
                  />
                ) : (
                  <div className="rounded-xl bg-slate-50/80 p-6 space-y-4 shadow-inner">
                    <div className="border-b border-slate-200/60 pb-3">
                      <span className="text-[11px] text-slate-400 font-semibold">Subject Preview:</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {subject.replace(/\{\{name\}\}/g, "Tanzina Islam").replace(/\{\{amount\}\}/g, "42,500")}
                      </h4>
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {previewBody}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Variable Palette & Publishing */}
          <div className="space-y-6">
            {/* Publishing Settings */}
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Publishing State</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "ACTIVE" | "DRAFT")}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                >
                  <option value="ACTIVE">Active (Available for triggers)</option>
                  <option value="DRAFT">Draft (Internal review)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <Link
                  href="/admin/communication/email/templates"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Template
                </button>
              </div>
            </div>

            {/* Variable Insertion Palette */}
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Available Variables
                </h4>
                <Tag className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500">
                Click any placeholder chip to copy its tag to clipboard:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {standardVariables.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleCopyVar(v)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    <span>{`{{${v}}}`}</span>
                    {copiedVar === v ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
