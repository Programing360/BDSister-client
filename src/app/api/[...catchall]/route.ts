import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function handleNotFound(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `API endpoint ${request.nextUrl.pathname} not found or deferred`,
      },
    },
    { status: 404 }
  );
}

export async function GET(request: NextRequest) {
  return handleNotFound(request);
}

export async function POST(request: NextRequest) {
  return handleNotFound(request);
}

export async function PATCH(request: NextRequest) {
  return handleNotFound(request);
}

export async function PUT(request: NextRequest) {
  return handleNotFound(request);
}

export async function DELETE(request: NextRequest) {
  return handleNotFound(request);
}
