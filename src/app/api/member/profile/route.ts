import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getProfileByUserId,
  updateProfileByUserId,
  calculateDetailedProfileCompletion,
} from "@/lib/services/profile-service";
import { fullProfileUpdateSchema } from "@/lib/validations/profile";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("You must be logged in to access your profile.");
  }

  try {
    const profile = await getProfileByUserId(session.user.id, {
      displayName: session.user.name,
      avatar: session.user.image,
    });

    const completion = calculateDetailedProfileCompletion(session.user, profile);

    return successResponse({
      profile,
      completion,
    });
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to fetch profile",
    });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("You must be logged in to update your profile.");
  }

  try {
    const body = await req.json();
    const parseResult = fullProfileUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path.join(".");
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return validationErrorResponse(details);
    }

    const updatedProfile = await updateProfileByUserId(session.user.id, parseResult.data);
    const completion = calculateDetailedProfileCompletion(session.user, updatedProfile);

    return successResponse(
      {
        profile: updatedProfile,
        completion,
      },
      "Profile updated successfully."
    );
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to update profile",
    });
  }
}
