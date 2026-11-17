"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, AlertCircle, ArrowLeft, ArrowRight, Loader2, CheckCircle2, RotateCw } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { requestPasswordReset } from "@/lib/auth/auth-client";
import { AuthInput } from "./auth-input";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendReset = async (email: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (response.error) {
        setErrorMessage(response.error.message || "Failed to process password reset. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      setSubmittedEmail(email);
      setCooldown(60);
      setIsLoading(false);
    } catch (err: unknown) {
      console.warn("[Forgot Password Request Failed]", err);
      const errorStr = String(err);
      if (errorStr.includes("Failed to fetch") || errorStr.includes("NetworkError") || errorStr.includes("activeContentBlocker")) {
        setErrorMessage(
          "Unable to reach the password reset service. Please check your connection or disable ad-blockers for localhost."
        );
      } else {
        setErrorMessage("A network error occurred. Please try again later.");
      }
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await handleSendReset(data.email);
  };

  const handleResend = async () => {
    if (cooldown > 0 || !submittedEmail) return;
    await handleSendReset(submittedEmail);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5B46F6]/10 text-[#5B46F6]">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Check Your Email
          </h2>
          <p className="text-sm text-gray-600">
            We have dispatched password reset instructions to:
          </p>
          <div className="rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-sm font-semibold text-gray-800">
            {submittedEmail}
          </div>
          <p className="text-xs text-gray-500 pt-1">
            If an account exists under this address, you will find a secure link valid for 1 hour. Please check your spam folder if you do not see it within a few moments.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#5B46F6]" />
                <span>Resending...</span>
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4 text-[#5B46F6]" />
                <span>
                  {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend reset link"}
                </span>
              </>
            )}
          </button>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#5B46F6] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="your.email@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          helperText="Enter the email associated with your BDSisters account."
          error={errors.email?.message}
          {...register("email")}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-xl hover:shadow-[#5B46F6]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending instructions...</span>
            </>
          ) : (
            <>
              <span>Send Reset Link</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#5B46F6] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
