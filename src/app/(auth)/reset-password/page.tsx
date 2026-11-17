import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout, AuthCard, ResetPasswordForm } from "@/features/auth/components";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Set a new secure password for your BDSisters.org account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Please enter and confirm your new secure password below."
    >
      <AuthCard>
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
