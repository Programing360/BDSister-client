"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Mail, CheckCircle2 } from "lucide-react";
import { communicationService } from "@/lib/services/communication-service";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await communicationService.subscribeNewsletter(email);
      setIsSubscribed(true);
      toast.success(res.message || "Thank you for subscribing to BDSisters updates!");
    } catch {
      toast.error("Subscription could not be processed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl animate-fade-in">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>You are subscribed to BDSisters monthly bulletin!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
      <Input
        type="email"
        placeholder="Enter your email address..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
        required
        disabled={isLoading}
        className="bg-white/90"
      />
      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        className="shrink-0"
      >
        Subscribe
      </Button>
    </form>
  );
}
