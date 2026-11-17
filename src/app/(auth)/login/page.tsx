import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthLayout, AuthCard, LoginForm } from "@/features/auth/components";
import { getServerSession } from "@/lib/auth/session";
import { getDefaultDashboardRoute, getSafeRedirectUrl } from "@/lib/security/redirect";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to BDSisters.org to connect with Bangladeshi women leaders, learn, and grow.",
};

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession();
  const resolvedSearchParams = await searchParams;

  if (session?.user) {
    const defaultRoute = getDefaultDashboardRoute(session.user.role);
    const target = getSafeRedirectUrl(resolvedSearchParams.callbackUrl, defaultRoute);
    redirect(target);
  }

  return (
    <AuthLayout
      title="Welcome Back, Sister"
      subtitle="Sign in to your BDSisters account to access your courses, directory, and events."
    >
      <AuthCard>
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
