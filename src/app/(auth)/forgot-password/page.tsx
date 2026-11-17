import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthLayout, AuthCard, ForgotPasswordForm } from "@/features/auth/components";
import { getServerSession } from "@/lib/auth/session";
import { getDefaultDashboardRoute } from "@/lib/security/redirect";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password for your BDSisters.org account.",
};

export default async function ForgotPasswordPage() {
  const session = await getServerSession();

  if (session?.user) {
    const defaultRoute = getDefaultDashboardRoute(session.user.role);
    redirect(defaultRoute);
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter the email associated with your account and we will send you a secure reset link."
    >
      <AuthCard>
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
            </div>
          }
        >
          <ForgotPasswordForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
