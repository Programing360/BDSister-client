"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { signIn } from "@/lib/auth/auth-client";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { getSafeRedirectUrl, getDefaultDashboardRoute } from "@/lib/security/redirect";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const registeredEmail = searchParams.get("registered");
  const resetSuccess = searchParams.get("reset");
  const accountError = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (accountError === "account_suspended") {
      return "Your account has been suspended by administration. Please contact support.";
    }
    if (accountError === "account_deactivated") {
      return "Your account is deactivated. Please contact support to restore your access.";
    }
    return null;
  });
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: registeredEmail ?? "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setUnverifiedEmail(null);

    try {
      const response = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      });

      if (response.error) {
        const err = response.error;
        const msg = (err.message || "").toLowerCase();
        const code = (err.code || "").toLowerCase();

        if (msg.includes("verify") || code.includes("email_not_verified") || msg.includes("verification")) {
          setUnverifiedEmail(data.email);
          setErrorMessage(
            "Your email address has not been verified yet. Please check your inbox or request a new verification link."
          );
        } else if (msg.includes("credential") || code.includes("invalid_credentials") || msg.includes("password") || msg.includes("email")) {
          setErrorMessage("Invalid email or password. Please verify your credentials and try again.");
        } else {
          setErrorMessage(err.message || "Unable to sign in. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Successful sign in
      const user = response.data?.user as { role?: string } | undefined;
      const defaultRoute = getDefaultDashboardRoute(user?.role);
      const targetDestination = getSafeRedirectUrl(callbackUrl, defaultRoute);

      router.push(targetDestination);
      router.refresh();
    } catch (err: unknown) {
      console.warn("[Login Request Failed]", err);
      const errorStr = String(err);
      if (errorStr.includes("Failed to fetch") || errorStr.includes("NetworkError") || errorStr.includes("activeContentBlocker")) {
        setErrorMessage(
          "Unable to reach the authentication service. If you are using a browser extension such as an Ad-Blocker, Privacy Guard, or Active Content Blocker, please pause it for localhost, or verify that your local development server is running."
        );
      } else {
        setErrorMessage("A network error occurred while signing in. Please check your connection and try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Registered Notice */}
      {registeredEmail && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p>
            Registration successful! Please check your email (<strong>{registeredEmail}</strong>) to verify your account before logging in.
          </p>
        </div>
      )}

      {/* Password Reset Notice */}
      {resetSuccess && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p>
            Your password has been reset successfully. You can now sign in with your new credentials.
          </p>
        </div>
      )}

      {/* General / Rate-limit / Account Error Alert */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div className="space-y-2">
            <p>{errorMessage}</p>
            {unverifiedEmail && (
              <div>
                <Link
                  href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                  className="inline-flex items-center gap-1 font-bold text-[#5B46F6] underline hover:text-[#4834DF]"
                >
                  Resend verification email
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
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
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
                {...register("rememberMe")}
              />
              <span className="text-xs font-medium text-gray-600">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#5B46F6] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-xl hover:shadow-[#5B46F6]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In to BDSisters</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-bold text-[#5B46F6] hover:underline"
          >
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
}
