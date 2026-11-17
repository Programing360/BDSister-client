import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  errorResponse,
} from "@/lib/api/response";
import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from "@/lib/services/cart-service";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "@/lib/validations/cart";

function getSessionId(req: NextRequest): string {
  return req.headers.get("x-cart-session") || "default_guest";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const sessionId = getSessionId(req);

  try {
    const cart = await getCart(session?.user?.id, sessionId);
    return successResponse(cart);
  } catch (err: any) {
    return errorResponse({ message: err.message || "Failed to load cart" }, 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const sessionId = getSessionId(req);

  try {
    const body = await req.json();
    const validated = addToCartSchema.parse(body);

    const cart = await addItemToCart({
      userId: session?.user?.id,
      sessionId,
      productId: validated.productId,
      quantity: validated.quantity,
    });

    return successResponse(cart, "Item added to cart successfully.");
  } catch (err: any) {
    if (err.name === "ZodError") {
      return errorResponse(
        { message: err.issues?.[0]?.message || "Invalid input" },
        400
      );
    }
    return errorResponse({ message: err.message || "Failed to add item to cart" }, 400);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  const sessionId = getSessionId(req);

  try {
    const body = await req.json();
    const validated = updateCartItemSchema.parse(body);

    const cart = await updateCartItemQuantity({
      userId: session?.user?.id,
      sessionId,
      productId: validated.productId,
      quantity: validated.quantity,
    });

    return successResponse(cart, "Cart item updated successfully.");
  } catch (err: any) {
    if (err.name === "ZodError") {
      return errorResponse(
        { message: err.issues?.[0]?.message || "Invalid input" },
        400
      );
    }
    return errorResponse({ message: err.message || "Failed to update cart" }, 400);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  const sessionId = getSessionId(req);

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      await clearCart(session?.user?.id, sessionId);
      const emptyCart = await getCart(session?.user?.id, sessionId);
      return successResponse(emptyCart, "Cart cleared successfully.");
    }

    if (!productId) {
      return errorResponse({ message: "Product ID is required to remove item." }, 400);
    }

    const cart = await removeItemFromCart({
      userId: session?.user?.id,
      sessionId,
      productId,
    });

    return successResponse(cart, "Item removed from cart.");
  } catch (err: any) {
    return errorResponse({ message: err.message || "Failed to remove item" }, 400);
  }
}
