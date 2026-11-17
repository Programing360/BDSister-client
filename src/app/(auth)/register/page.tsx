import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthLayout, AuthCard, RegisterForm } from "@/features/auth/components";
import { getServerSession } from "@/lib/auth/session";
import { getDefaultDashboardRoute } from "@/lib/security/redirect";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Free Account",
  description: "Join BDSisters.org, the premier professional and personal development platform for Bangladeshi women.",
};

export default async function RegisterPage() {
  const session = await getServerSession();

  if (session?.user) {
    const defaultRoute = getDefaultDashboardRoute(session.user.role);
    redirect(defaultRoute);
  }

  return (
    <AuthLayout
      title="Join Our Sisterhood"
      subtitle="Connect, collaborate, and grow with thousands of visionary Bangladeshi women across the nation and globe."
    >
      <AuthCard>
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
