"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { resetPassword } from "@/lib/auth/auth-client";
import { PasswordInput } from "./password-input";
import { PasswordStrength } from "./password-strength";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token ?? "",
    },
  });

  const passwordValue = watch("password");

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Invalid or Expired Token
          </h2>
          <p className="text-sm text-gray-600">
            The reset link is missing or has expired. For your account security, password reset tokens expire after 1 hour.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#4d3ad8]"
        >
          <span>Request New Reset Link</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await resetPassword({
        newPassword: data.password,
        token: data.token,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message || "Failed to reset password. The link may have expired."
        );
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 2000);
    } catch (err: unknown) {
      console.warn("[Reset Password Request Failed]", err);
      setErrorMessage("A network error occurred. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Password Reset Successful!
          </h2>
          <p className="text-sm text-gray-600">
            Your password has been securely updated. Redirecting you to the sign in page...
          </p>
        </div>
        <Link
          href="/login?reset=success"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#4d3ad8]"
        >
          <span>Sign In Now</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
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
        <input type="hidden" {...register("token")} />

        <div>
          <PasswordInput
            id="password"
            label="New Password"
            placeholder="Enter new password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-xl hover:shadow-[#5B46F6]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating password...</span>
            </>
          ) : (
            <>
              <span>Update Password</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
