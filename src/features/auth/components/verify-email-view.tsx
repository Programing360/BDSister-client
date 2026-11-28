"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { apiClient, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuth } from "@/hooks/use-auth";

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";
  const registered = searchParams.get("registered") === "true";

  const { refreshUser } = useAuth();

  // State
  const [emailInput, setEmailInput] = useState(emailParam);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Resend state
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(registered ? 60 : 0);

  // 1. Auto-verify if user arrived with ?token=... from legacy email link
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function executeTokenVerification() {
      setIsVerifying(true);
      setVerificationError(null);
      try {
        const response = await apiClient.post<any>(API_ENDPOINTS.auth.verifyEmail, {
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

        // Refresh user context and navigate
        if (refreshUser) {
          await refreshUser().catch(() => { });
        }

        setTimeout(() => {
          router.replace("/member");
        }, 1500);
      } catch (err: unknown) {
        if (!isMounted) return;
        setVerificationError("An error occurred during link verification. Please use your 6-digit OTP.");
        setIsVerifying(false);
      }
    }

    executeTokenVerification();
    return () => {
      isMounted = false;
    };
  }, [token, router, refreshUser]);

  // 2. Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // 3. Auto-focus first input on load
  useEffect(() => {
    if (!token && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [token]);

  // 4. Handle OTP box key changes
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const numericVal = value.replace(/\D/g, "");

    // Handle paste of full or partial code
    if (numericVal.length > 1) {
      const chars = numericVal.slice(0, 6).split("");
      const nextOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (chars[i]) {
          nextOtp[i] = chars[i] || "";
        }
      }
      setOtp(nextOtp);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = numericVal;
    setOtp(nextOtp);

    // Auto-advance to next box
    if (numericVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const nextOtp = [...otp];
    pasted.split("").forEach((char, idx) => {
      if (idx < 6) nextOtp[idx] = char;
    });
    setOtp(nextOtp);
    const targetIdx = Math.min(pasted.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  // 5. Submit 6-digit OTP
  const handleVerifyOtp = async () => {
    const fullOtp = otp.join("");
    const targetEmail = (emailInput || emailParam).trim();

    if (!targetEmail) {
      setVerificationError("Please enter your registered email address.");
      return;
    }

    if (fullOtp.length !== 6) {
      setVerificationError("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.auth.verifyEmail, {
        email: targetEmail,
        otp: fullOtp,
      });

      if (response.error) {
        setVerificationError(response.error.message || "Invalid or expired verification code.");
        setIsVerifying(false);
        return;
      }

      setVerificationSuccess(true);
      setIsVerifying(false);

      // Refresh auth state to populate user from new cookie
      if (refreshUser) {
        await refreshUser().catch(() => { });
      }

      // Check role if present in response
      const userRole = response.data?.user?.role || response.data?.data?.role || "";
      const isStaff = userRole === "Admin" || userRole === "SuperAdmin";
      const targetDestination = isStaff ? "/admin" : "/member";

      setTimeout(() => {
        router.replace(targetDestination);
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setVerificationError(err.message);
      } else {
        setVerificationError(
          err instanceof Error ? err.message : "Verification failed. Please try again.",
        );
      }
      setIsVerifying(false);
    }
  };

  // 6. Resend fresh OTP
  const handleResend = async () => {
    const targetEmail = (emailInput || emailParam).trim();
    if (!targetEmail || cooldown > 0 || isResending) return;

    setIsResending(true);
    setResendSuccess(false);
    setVerificationError(null);

    try {
      const response = await apiClient.post<any>("/api/auth/resend-verification", {
        email: targetEmail,
      });

      if (response.error) {
        setVerificationError(response.error.message || "Failed to resend verification code.");
        setIsResending(false);
        return;
      }

      setResendSuccess(true);
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsResending(false);
    } catch (err: unknown) {
      setVerificationError("Network error while resending. Please check your connection.");
      setIsResending(false);
    }
  };

  // Scenario 1: Token verification success
  if (verificationSuccess) {
    return (
      <div className="space-y-6 text-center py-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10 border border-emerald-100">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {/* <Sparkles className="h-3.5 w-3.5" /> */}
            Verified & Authenticated
          </span>
          <h2 className="text-2xl font-black text-gray-900">Email Verified Successfully!</h2>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Welcome to BDSisters! You are logged in. Redirecting you to your member dashboard...
          </p>
        </div>
        <div>
          <button
            onClick={() => router.replace("/member")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B9891] hover:bg-[#487a74] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B9891]/25 transition-all"
          >
            <span>Go to Dashboard Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Guarantee Pill */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-[#5B9891]/10 px-4 py-2.5 text-xs font-semibold text-[#10443e]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#D98408]" />
        <span>Secure 6-Digit Email Verification • BDSisters.org</span>
      </div>

      {/* Header Heading */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] border border-[#5B9891]/20 text-[#5B9891] shadow-sm">
          <KeyRound className="h-8 w-8 text-[#5B9891]" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
          Enter Verification Code
        </h2>
        <p className="mt-1.5 text-sm text-gray-600">
          We&apos;ve sent a 6-digit confirmation code to:
        </p>
        {emailInput ? (
          <div className="mx-auto mt-2 inline-block rounded-xl border border-[#5B9891]/30 bg-[#FAF8F5] px-4 py-1.5 text-sm font-bold text-[#111E28]">
            {emailInput}
          </div>
        ) : (
          <p className="text-xs text-gray-500 mt-1">your registered email address</p>
        )}
      </div>

      {/* Error or Success Alerts */}
      {verificationError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 animate-in fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p>{verificationError}</p>
        </div>
      )}

      {resendSuccess && (
        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p>A fresh 6-digit verification code has been dispatched to your email!</p>
        </div>
      )}

      {/* If email was not passed in URL, allow user to input it */}
      {!emailParam && (
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Registered Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. sister@bdsisters.org"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 focus:border-[#5B9891] focus:outline-none focus:ring-4 focus:ring-[#5B9891]/15"
            />
          </div>
        </div>
      )}

      {/* 6-Digit OTP Box Grid */}
      <div className="space-y-3">
        <label className="block text-center text-xs font-bold uppercase tracking-wider text-gray-500">
          6-Digit Verification Code
        </label>
        <div className="flex justify-center items-center gap-2.5 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`h-12 w-11 sm:h-14 sm:w-12 text-center text-2xl font-black rounded-xl border transition-all duration-150 focus:outline-none ${digit
                ? "border-[#5B9891] bg-[#FAF8F5] text-[#111E28] ring-2 ring-[#5B9891]/20"
                : "border-gray-200 bg-white text-gray-900 focus:border-[#5B9891] focus:ring-4 focus:ring-[#5B9891]/15"
                }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-gray-400">
          Enter the code from your email (valid for 10 minutes)
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleVerifyOtp}
        disabled={isVerifying || otp.join("").length !== 6}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b776e] hover:bg-[#234b46] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B9891] transition-all active:scale-[0.99] disabled:cursor-not-allowed "
      >
        {isVerifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Verifying Code...</span>
          </>
        ) : (
          <>
            <span>Verify & Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Resend Action */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={!emailInput || cooldown > 0 || isResending}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1a5f57] hover:text-[#487a74] hover:underline disabled:cursor-not-allowed  transition"
        >
          {isResending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Sending new code...</span>
            </>
          ) : (
            <>
              <RotateCw className="h-3.5 w-3.5" />
              <span>
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive code? Resend OTP"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Switch links */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
        <Link href="/register" className="hover:text-[#5B9891] hover:underline">
          Wrong email? Register again
        </Link>
        <Link href="/login" className="font-semibold text-[#1b6159] hover:underline">
          Sign In with Password
        </Link>
      </div>
    </div>
  );
}
