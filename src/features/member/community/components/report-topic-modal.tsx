"use client";

import React, { useState } from "react";
import { forumService } from "@/lib/services/forum-service";
import type { ForumPost } from "@/types/forum";
import { Button } from "@/components/ui/button";
import { X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ReportTopicModalProps {
  post: ForumPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportTopicModal({ post, isOpen, onClose }: ReportTopicModalProps) {
  const [reason, setReason] = useState("harassment");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await forumService.reportPost(post.id, `${reason}: ${details}`);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Report Discussion</h2>
              <p className="text-xs text-text-secondary">Keep our community safe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-text-secondary hover:bg-surface hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-text-primary">Report Received</h4>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">
              Our female moderation team will review this thread promptly. Thank you for protecting our sanctuary.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-text-secondary">
              Reporting: <strong className="text-text-primary line-clamp-1">{post.title}</strong>
            </p>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Primary Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
              >
                <option value="harassment">Inappropriate or disrespectful behavior</option>
                <option value="privacy">Breach of member privacy / doxxing</option>
                <option value="spam">Commercial spam / unauthorized promotion</option>
                <option value="misleading">Scam or misleading financial scheme</option>
                <option value="other">Other policy violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Help moderators understand what occurred..."
                className="w-full rounded-2xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="rounded-2xl bg-danger hover:bg-danger/90 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
