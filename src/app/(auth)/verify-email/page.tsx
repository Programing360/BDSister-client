import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout, AuthCard, VerifyEmailView } from "@/features/auth/components";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Verify your email address to activate your BDSisters.org account.",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Complete email verification to safeguard our verified women-only community space."
    >
      <AuthCard>
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
            </div>
          }
        >
          <VerifyEmailView />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
