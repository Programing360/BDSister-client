import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getProfileByUserId, filterProfileByPrivacy } from "@/lib/services/profile-service";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to preview profile perspectives.");
  }

  const { searchParams } = new URL(req.url);
  const perspective = searchParams.get("as") || "owner"; // 'owner' | 'member' | 'public'

  try {
    const rawProfile = await getProfileByUserId(session.user.id, {
      displayName: session.user.name,
      avatar: session.user.image,
    });

    let filtered;
    if (perspective === "owner") {
      filtered = filterProfileByPrivacy(rawProfile, {
        viewerUserId: session.user.id,
        isAuthenticated: true,
        viewerRole: session.user.role,
      });
    } else if (perspective === "member") {
      filtered = filterProfileByPrivacy(rawProfile, {
        viewerUserId: "other-member-id",
        isAuthenticated: true,
        viewerRole: "MEMBER",
      });
    } else {
      // public perspective
      filtered = filterProfileByPrivacy(rawProfile, {
        viewerUserId: null,
        isAuthenticated: false,
        viewerRole: null,
      });
    }

    return successResponse({
      perspective,
      profile: filtered,
    });
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to generate preview",
    });
  }
}
