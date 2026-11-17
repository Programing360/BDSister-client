import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getDefaultDashboardRoute } from "@/lib/security/redirect";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  const destination = getDefaultDashboardRoute(session?.user?.role);
  return NextResponse.redirect(new URL(destination, request.url));
}
