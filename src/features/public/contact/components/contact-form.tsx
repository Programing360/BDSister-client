"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Send, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required (at least 3 characters)"),
  category: z.enum([
    "general",
    "business",
    "membership",
    "partnerships",
    "feedback",
  ]),
  message: z.string().min(10, "Please provide a message with at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      category: "general",
      message: "",
    },
  });

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API roundtrip
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Thank you! Your message has been sent to our team.");
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-surface to-primary/5 p-8 sm:p-12 text-center space-y-5 shadow-card animate-fadeIn">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-text-primary">
            Message Successfully Received!
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Thank you for connecting with BDSisters.org. Our member support team has logged your message and will respond within 24 to 48 business hours.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsSubmitted(false)}
            className="font-semibold"
          >
            Send Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-border/80 bg-white p-6 sm:p-10 shadow-card"
      noValidate
    >
      <div className="border-b border-border/80 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Send a Direct Message
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary mt-1">
          How Can We Help You?
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          Fill in your details below and our team will get in touch directly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Nusrat Jahan"
            {...register("fullName")}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-neutral/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. nusrat@example.com"
            {...register("email")}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-neutral/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            placeholder="e.g. +880 1711 000000"
            {...register("phone")}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-neutral/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-primary mb-1.5">
            Inquiry Department <span className="text-rose-500">*</span>
          </label>
          <select
            {...register("category")}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="general">General Inquiries &amp; Questions</option>
            <option value="business">Business Directory &amp; Verification</option>
            <option value="membership">Sister Circles &amp; Membership</option>
            <option value="partnerships">Muhsina Foundation Alliances</option>
            <option value="feedback">Community Safety &amp; Moderation</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-text-primary mb-1.5">
          Subject <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Brief summary of your inquiry"
          {...register("subject")}
          className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-neutral/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-text-primary mb-1.5">
          Your Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder="Please describe how our team can best assist you..."
          {...register("message")}
          className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-text-primary placeholder:text-neutral/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.message.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full justify-center gap-2 font-bold text-base py-3.5 shadow-button hover:shadow-card-hover"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Inquiry</span>
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral pt-1">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span>Your contact information is strictly confidential under our Privacy Policy.</span>
      </div>
    </form>
  );
}
