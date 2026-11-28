import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const backendUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  try {
    const backendEndpoint = `${backendUrl.replace(/\/+$/, "")}/api/ecommerce/products/${id}`;
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
    // Fallback to direct MongoDB query if backend is unreachable
  }

  try {
    const db = await getDatabase();
    let filter: any = { isDeleted: { $ne: true } };

    if (ObjectId.isValid(id)) {
      filter.$or = [{ _id: new ObjectId(id) }, { slug: id }];
    } else {
      const escaped = id.replace(/-/g, " ").replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      filter.$or = [
        { slug: id },
        { title: { $regex: new RegExp("^" + escaped, "i") } },
      ];
    }

    const product = await db.collection("products").findOne(filter);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load product details" },
      { status: 500 }
    );
  }
}
