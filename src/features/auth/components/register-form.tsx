"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  User,
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Gift,
  Lock,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react";

import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

import { apiClient, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { PasswordStrength } from "./password-strength";
import { uploadSignedToCloudinary } from "@/lib/cloudinary/cloudinary";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialReferrerCode = searchParams.get("ref") || "";

  const [step, setStep] = useState<1 | 2>(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Identity Verification State
  const [docType, setDocType] = useState<"NID" | "PASSPORT" | "ACADEMIC">("NID");

  const [idNumber, setIdNumber] = useState("");

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referrerCode: initialReferrerCode,
      docType: "NID",
      idNumber: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const passwordValue = watch("password");

  // STEP 1 VALIDATION
  const handleNextStep = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    setErrorMessage(null);

    const isValid = await trigger(["name", "email", "referrerCode", "password", "confirmPassword"]);

    if (isValid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // GO BACK TO STEP 1
  const handlePreviousStep = () => {
    setErrorMessage(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // FILE HANDLERS
  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFrontFile(file);

    setFrontPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBackFile(file);

    setBackPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  // REMOVE FILES
  const handleRemoveFront = () => {
    if (frontPreview) URL.revokeObjectURL(frontPreview);

    setFrontFile(null);
    setFrontPreview(null);
  };

  const handleRemoveBack = () => {
    if (backPreview) URL.revokeObjectURL(backPreview);

    setBackFile(null);
    setBackPreview(null);
  };

  // FINAL REGISTRATION
  const onSubmit = async (data: RegisterFormData) => {
    if (!idNumber.trim()) {
      setErrorMessage("Please enter your official identification document number.");
      return;
    }

    if (!frontFile) {
      setErrorMessage("Please upload the front scan or photo of your identification document.");
      return;
    }

    // PASSPORT ছাড়া বাকিগুলোর জন্য Back Side চেক
    if (docType !== "PASSPORT" && !backFile) {
      setErrorMessage("Please upload the back scan or photo of your identification document.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // ১. ব্যাকএন্ড সিগনেচার নিয়ে ফাইলগুলো Cloudinary-তে আপলোড করা
      const [frontImageUrl, backImageUrl] = await Promise.all([
        uploadSignedToCloudinary(frontFile),
        backFile ? uploadSignedToCloudinary(backFile) : Promise.resolve(null),
      ]);

      // ২. প্রাপ্ত URL সহ JSON পেলোড তৈরি করা
      // ২. প্রাপ্ত URL সহ ব্যাকএন্ডের স্কিমা অনুযায়ী JSON পেলোড তৈরি করা
      const payload = {
        fullName: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        referralCode: data.referrerCode?.trim() || undefined,
        docType,
        idNumber: idNumber.trim(),
        nidOrPassportUrl: frontImageUrl,
        backImageUrl: backImageUrl || undefined,
      };

      // ৩. ব্যাকএন্ডের Register API-তে পাঠানো
      const res = await apiClient.post<{
        email?: string;
        userId?: string;
      }>(API_ENDPOINTS.auth.register, payload);

      console.log(res);

      if (res.error) {
        throw new ApiError(res.error.code, res.error.message, 400, res.error.details);
      }

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}&registered=true`);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please check your connection.",
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* COMMUNITY GUARANTEE */}
      <div className="flex items-center gap-2.5 rounded-2xl  bg-[#5B46F6]/5  text-xs font-semibold text-[#5B46F6]">
        <ShieldCheck className="h-4 w-4 shrink-0" />

        <span>Free lifetime membership for Bangladeshi women & entrepreneurs</span>
      </div>

      {/* STEP PROGRESS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">Create Your Account</p>

            <p className="text-xs text-gray-500 mt-1">Step {step} of 2</p>
          </div>

          <span className="text-xs font-semibold text-[#5B46F6]">
            {step === 1 ? "Account Information" : "Identity Verification"}
          </span>
        </div>

        <div className="flex gap-2">
          <div
            className={`h-1.5 flex-1 rounded-full transition-all ${
              step >= 1 ? "bg-[#5B46F6]" : "bg-gray-200"
            }`}
          />

          <div
            className={`h-1.5 flex-1 rounded-full transition-all ${
              step >= 2 ? "bg-[#5B46F6]" : "bg-gray-200"
            }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B46F6] text-white">
              {step === 1 ? (
                <span className="text-[10px] font-bold">1</span>
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>

            <span
              className={`text-xs font-semibold ${step === 1 ? "text-[#5B46F6]" : "text-gray-500"}`}
            >
              Account
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                step === 2 ? "bg-[#5B46F6] text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              <span className="text-[10px] font-bold">2</span>
            </div>

            <span
              className={`text-xs font-semibold ${step === 2 ? "text-[#5B46F6]" : "text-gray-400"}`}
            >
              Verification
            </span>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 animate-in fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

          <p>{errorMessage}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && step === 1) {
            e.preventDefault();
            handleNextStep();
          }
        }}
        className="space-y-5"
      >
        {/* ====================================== */}
        {/* STEP 1 - ACCOUNT INFORMATION */}
        {/* ====================================== */}

        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Account Information</h3>

              <p className="text-xs text-gray-500">
                Enter your basic information to create your account.
              </p>
            </div>

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
              helperText="Registration requires an active invitation code from a verified BDSisters member or official founder code."
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

            {/* CONTINUE BUTTON */}
            <button
              type="button"
              onClick={handleNextStep}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-xl active:scale-[0.99]"
            >
              <span>Continue to Verification</span>

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ====================================== */}
        {/* STEP 2 - IDENTITY VERIFICATION */}
        {/* ====================================== */}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Identity Verification</h3>

              <p className="text-xs text-gray-500">
                Upload your identification document to complete registration.
              </p>
            </div>

            {/* IDENTITY VERIFICATION BOX */}
            <div className="rounded-2xl border border-purple-200/90 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2 text-[#5B46F6]">
                  <ShieldCheck className="h-4 w-4" />

                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Identity Authentication
                  </h3>
                </div>

                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Mandatory
                </span>
              </div>

              {/* DOCUMENT TYPE */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Select Document Type
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["NID", "Smart NID"],
                      ["PASSPORT", "Passport"],
                      ["ACADEMIC", "Student ID"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setDocType(value);
                        setIdNumber("");
                      }}
                      className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition ${
                        docType === value
                          ? "border-[#5B46F6] bg-purple-50 text-[#5B46F6] ring-1 ring-[#5B46F6]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID NUMBER */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {docType === "NID"
                    ? "Smart NID Number"
                    : docType === "PASSPORT"
                      ? "Passport Number"
                      : "Student ID Number"}

                  <span className="text-rose-500"> *</span>
                </label>

                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={
                    docType === "NID"
                      ? "e.g. 1982736452"
                      : docType === "PASSPORT"
                        ? "e.g. A01234567"
                        : "e.g. STU-2024-89"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20 outline-none text-xs transition"
                />
              </div>

              {/* DOCUMENT UPLOADS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* FRONT SIDE */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Front Side Scan/Photo
                    <span className="text-rose-500"> *</span>
                  </label>

                  {frontFile ? (
                    <div className="relative rounded-xl border border-purple-200 bg-purple-50/50 p-2 text-center text-xs">
                      {frontPreview ? (
                        <Image
                          src={frontPreview}
                          alt="Front Preview"
                          width={300}
                          height={120}
                          unoptimized
                          className="w-full h-24 object-cover rounded-lg mb-1"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-24 text-gray-500 gap-1.5">
                          <FileText className="w-5 h-5 text-[#5B46F6]" />

                          <span className="font-mono text-[11px] truncate">{frontFile.name}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleRemoveFront}
                        className="absolute top-3 right-3 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                        title="Remove front document"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 px-3 py-2 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#5B46F6] bg-gray-50 hover:bg-purple-50/20 cursor-pointer transition text-center">
                      <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />

                      <span className="text-[11px] font-semibold text-gray-700">
                        Upload Front Side
                      </span>

                      <span className="text-[10px] text-gray-400">JPG, PNG, PDF &lt; 10MB</span>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        onChange={handleFrontChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* BACK SIDE */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Back Side{" "}
                    {docType === "PASSPORT" ? (
                      "(Optional)"
                    ) : (
                      <span className="text-rose-500">*</span>
                    )}
                  </label>

                  {backFile ? (
                    <div className="relative rounded-xl border border-purple-200 bg-purple-50/50 p-2 text-center text-xs">
                      {backPreview ? (
                        <Image
                          src={backPreview}
                          alt="Back Preview"
                          width={300}
                          height={120}
                          unoptimized
                          className="w-full h-24 object-cover rounded-lg mb-1"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-24 text-gray-500 gap-1.5">
                          <FileText className="w-5 h-5 text-[#5B46F6]" />

                          <span className="font-mono text-[11px] truncate">{backFile.name}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleRemoveBack}
                        className="absolute top-3 right-3 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                        title="Remove back document"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 px-3 py-2 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#5B46F6] bg-gray-50 hover:bg-purple-50/20 cursor-pointer transition text-center">
                      <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />

                      <span className="text-[11px] font-semibold text-gray-700">
                        Upload Back Side
                      </span>

                      <span className="text-[10px] text-gray-400">JPG, PNG, PDF &lt; 10MB</span>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        onChange={handleBackChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* PRIVACY GUARANTEE */}
              <div className="flex items-start gap-2 pt-3 border-t border-purple-100/80 text-[11px] text-purple-900 leading-relaxed">
                <Lock className="w-4 h-4 shrink-0 text-[#5B46F6] mt-0.5" />

                <p>
                  <strong>Privacy Guarantee:</strong> Only Admin will have access to ID documents.
                  Your ID is encrypted with AES-256 and reviewed strictly by female verification
                  officers. It is never displayed publicly.
                </p>
              </div>
            </div>

            {/* LEGAL AGREEMENTS */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
                  {...register("acceptTerms")}
                />

                <span className="text-xs text-gray-600">
                  I accept the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-semibold text-[#5B46F6] hover:underline"
                  >
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
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-semibold text-[#5B46F6] hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and data protection terms.
                </span>
              </label>

              {errors.acceptPrivacy && (
                <p className="text-xs font-medium text-red-600">{errors.acceptPrivacy.message}</p>
              )}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-gray-200 bg-white text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />

                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Join BDSisters Community</span>

                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* SWITCH TO LOGIN */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Already a member?{" "}
          <Link href="/login" className="font-bold text-[#5B46F6] hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
