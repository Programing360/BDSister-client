"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Gift,
  Lock,
} from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { signUp } from "@/lib/auth/auth-client";
import { apiClient, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { PasswordStrength } from "./password-strength";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialReferrerCode = searchParams.get("ref") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referrerCode: initialReferrerCode,
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Attempt official REST API endpoint: POST /api/auth/register
      const res = await apiClient.post<{ email?: string; userId?: string }>(
        API_ENDPOINTS.auth.register,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          referrerCode: data.referrerCode,
        }
      );

      if (res.error) {
        throw new ApiError(
          res.error.code,
          res.error.message,
          400,
          res.error.details
        );
      }

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}&registered=true`);
    } catch (err: unknown) {
      // If REST API endpoint responds with a specific domain error, show it
      if (err instanceof ApiError && err.status !== 404 && err.status !== 502) {
        setErrorMessage(err.message);
        setIsLoading(false);
        return;
      }

      // 2. Resilient fallback to Better-Auth client during offline/local development
      try {
        const response = await signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL: "/verify-email",
        });

        if (response.error) {
          const msg = (response.error.message || "").toLowerCase();
          if (
            msg.includes("already exists") ||
            msg.includes("duplicate") ||
            msg.includes("taken")
          ) {
            setErrorMessage(
              "An account with this email address already exists. Try signing in instead."
            );
          } else {
            setErrorMessage(response.error.message || "Failed to create account. Please try again.");
          }
          setIsLoading(false);
          return;
        }

        router.push(`/verify-email?email=${encodeURIComponent(data.email)}&registered=true`);
      } catch (clientErr: unknown) {
        console.warn("[Registration Fallback Failed]", clientErr);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "A network error occurred while creating your account. Please try again."
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Community Guarantee Pill */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-[#5B46F6]/15 bg-[#5B46F6]/5 px-4 py-2.5 text-xs font-semibold text-[#5B46F6]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#5B46F6]" />
        <span>Free lifetime membership for Bangladeshi women & entrepreneurs</span>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          id="name"
          type="text"
          label="Full Name"
          placeholder="e.g. Nusrat Jahan"
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="your.email@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthInput
          id="referrerCode"
          type="text"
          label="Sisterhood Referral Code"
          placeholder="e.g. SISTER-2026 or Founder Code"
          autoComplete="off"
          leftIcon={<Gift className="h-4 w-4 text-[#5B46F6]" />}
          helperText="Enter the referral code of the sister or community partner who invited you."
          error={errors.referrerCode?.message}
          {...register("referrerCode")}
        />

        <div>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* NID Confidentiality & Safe Space Disclosure */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4 text-xs text-purple-950 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-[#5B46F6]">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Identity Confidentiality &amp; Safe Space Disclosure</span>
          </div>
          <p className="text-[11px] leading-relaxed text-purple-900/80">
            BDSisters.org is an authenticated sanctuary for Bangladeshi women. Following registration, members may verify their National ID (NID) or Passport to unlock verified sister badges and seller privileges. Your documents are encrypted (AES-256) and reviewed exclusively by authorized female verification officers.
          </p>
        </div>

        {/* Legal Agreements */}
        <div className="space-y-2.5 pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
              {...register("acceptTerms")}
            />
            <span className="text-xs text-gray-600">
              I accept the{" "}
              <Link href="/terms" target="_blank" className="font-semibold text-[#5B46F6] hover:underline">
                Terms of Service
              </Link>{" "}
              and community guidelines.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs font-medium text-red-600">{errors.acceptTerms.message}</p>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
              {...register("acceptPrivacy")}
            />
            <span className="text-xs text-gray-600">
              I agree to the{" "}
              <Link href="/privacy" target="_blank" className="font-semibold text-[#5B46F6] hover:underline">
                Privacy Policy
              </Link>{" "}
              and data protection terms.
            </span>
          </label>
          {errors.acceptPrivacy && (
            <p className="text-xs font-medium text-red-600">{errors.acceptPrivacy.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-xl hover:shadow-[#5B46F6]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Join BDSisters Community</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-bold text-[#5B46F6] hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
