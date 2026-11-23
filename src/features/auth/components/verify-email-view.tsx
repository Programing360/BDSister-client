"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  // Token verification states
  const [isVerifying, setIsVerifying] = useState(Boolean(token));
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Resend state
  const [emailInput, setEmailInput] = useState(emailParam ?? "");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ১. ইমেইলের লিংক থেকে token পেলে Express ব্যাকএন্ডের POST /api/auth/verify-email কল করা
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function executeVerification() {
      try {
        const response = await apiClient.post(API_ENDPOINTS.auth.verifyEmail, {
          token,
        });

        if (!isMounted) return;

        if (response.error) {
          setVerificationError(
            response.error.message || "This verification link has expired or is invalid.",
          );
          setIsVerifying(false);
          return;
        }

        setVerificationSuccess(true);
        setIsVerifying(false);

        // ইমেইল ভেরিফাই হওয়ার পর লগইন পেজে (বা মেম্বার এরিয়ায়) রিডাইরেক্ট
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn("[Email Verification Request Failed]", err);
        setVerificationError("An error occurred during verification. Please request a new link.");
        setIsVerifying(false);
      }
    }

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token, router]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // ২. Resend বাটনে ক্লিক করলে Express ব্যাকএন্ডের POST /api/auth/resend-verification কল করা
  const handleResend = async () => {
    if (!emailInput || cooldown > 0 || isResending) return;

    setIsResending(true);
    setResendSuccess(false);
    setVerificationError(null);

    try {
      const response = await apiClient.post("/api/auth/resend-verification", {
        email: emailInput.trim(),
      });

      if (response.error) {
        setVerificationError(response.error.message || "Failed to resend verification link.");
        setIsResending(false);
        return;
      }

      setResendSuccess(true);
      setCooldown(60);
      setIsResending(false);
    } catch (err: unknown) {
      console.warn("[Resend Request Failed]", err);
      setVerificationError("Network error while resending. Please try again.");
      setIsResending(false);
    }
  };

  // Scenario 1: Currently verifying token from email link
  if (isVerifying) {
    return (
      <div className="space-y-6 text-center py-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#5B46F6]/10 text-[#5B46F6]">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Verifying Your Account...</h2>
          <p className="text-sm text-gray-600">
            Please wait a moment while we validate your credentials and activate your membership.
          </p>
        </div>
      </div>
    );
  }

  // Scenario 2: Token verification was successful
  if (verificationSuccess) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" />
            Email Verified
          </span>
          <h2 className="text-2xl font-black text-gray-900">Email Verified Successfully!</h2>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Your email has been verified. Redirecting you to Sign In...
          </p>
        </div>
        <div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8]"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Scenario 3: Waiting state (User just signed up, needs to check email)
  return (
    <div className="space-y-6">
      {/* Icon & Heading */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5B46F6]/10 text-[#5B46F6]">
          <Mail className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">Verify Your Email</h2>
        <p className="mt-1.5 text-sm text-gray-600">We&apos;ve sent a secure activation link to:</p>
        {emailInput ? (
          <div className="mx-auto mt-2 inline-block rounded-xl border border-[#5B46F6]/20 bg-[#5B46F6]/15 px-4 py-1.5 text-sm font-bold text-[#5B46F6]">
            {emailInput}
          </div>
        ) : (
          <p className="text-xs text-gray-500">your registered email address</p>
        )}
      </div>

      {/* Error or Success Alerts */}
      {verificationError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p>{verificationError}</p>
        </div>
      )}

      {resendSuccess && (
        <div className="flex items-start gap-3 rounded-2xl bg-emerald-100/90 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <p>Verification email has been sent. Please check your inbox.</p>
        </div>
      )}

      {/* Step Instructions */}
      <div className="rounded-2xl shadow border-gray-200/80 bg-gray-50/80 p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Next steps to activate your access:
        </h3>
        <ol className="space-y-2.5 text-xs text-gray-700">
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B46F6] text-[10px] font-bold text-white">
              1
            </span>
            <span>Check your email inbox (and spam/promotions folder).</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B46F6] text-[10px] font-bold text-white">
              2
            </span>
            <span>
              Click the <strong>&ldquo;Verify Email Address&rdquo;</strong> button.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B46F6] text-[10px] font-bold text-white">
              3
            </span>
            <span>Sign in once your email is verified and your account is approved.</span>
          </li>
        </ol>
      </div>

      {/* Resend Action */}
      <div className="space-y-3 pt-2">
        {!emailParam && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Didn&apos;t receive it? Enter your email:
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3.5 text-sm font-medium text-gray-900 focus:border-[#5B46F6] focus:outline-none focus:ring-4 focus:ring-[#5B46F6]/15"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={!emailInput || cooldown > 0 || isResending}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#5B46F6]" />
              <span>Sending link...</span>
            </>
          ) : (
            <>
              <RotateCw className="h-4 w-4 text-[#5B46F6]" />
              <span>
                {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend Verification Email"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Switch links */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
        <Link href="/register" className="hover:text-[#5B46F6] hover:underline">
          Wrong email? Register again
        </Link>
        <Link href="/login" className="font-semibold text-[#5B46F6] hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
