import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

function getBackendUrl(): string {
  return (
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  ).replace(/\/+$/, "");
}

export async function GET(req: NextRequest) {
  const backendUrl = getBackendUrl();
  try {
    const res = await fetch(`${backendUrl}/api/cart`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const backendUrl = getBackendUrl();
  try {
    const body = await req.json();
    const res = await fetch(`${backendUrl}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const backendUrl = getBackendUrl();
  try {
    const body = await req.json();
    const res = await fetch(`${backendUrl}/api/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const backendUrl = getBackendUrl();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const clearAll = searchParams.get("clearAll") === "true";

    const endpoint = clearAll
      ? `${backendUrl}/api/cart`
      : `${backendUrl}/api/cart/${productId || ""}`;

    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
