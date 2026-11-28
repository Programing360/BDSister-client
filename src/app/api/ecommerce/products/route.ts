import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // If Express backend is running, try proxying to Express backend first
  const backendUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  try {
    const url = new URL(req.url);
    const backendEndpoint = `${backendUrl.replace(/\/+$/, "")}/api/ecommerce/products${url.search}`;
    const res = await fetch(backendEndpoint, {
      headers: {
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // If backend proxy fails or backend is unreachable, fallback to direct MongoDB query
  }

  try {
    const db = await getDatabase();
    const query: any = {
      isDeleted: { $ne: true },
      isAvailable: { $ne: false },
    };

    const products = await db
      .collection("products")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: products,
      products,
      count: products.length,
      total: products.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load products" },
      { status: 500 }
    );
  }
}
