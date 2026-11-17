import { getDatabase } from "@/lib/db/mongodb";
import type { CartDocument, CartItem } from "@/types/cart";
import { getProductById } from "@/lib/services/product-service";

const COLLECTION_NAME = "carts";

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).createIndex({ id: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ userId: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ sessionId: 1 });
    indexEnsured = true;
  } catch (err) {
    console.warn("[CartService] Index initialization deferred:", (err as Error).message);
  }
}

/**
 * Calculates subtotal and line items for a cart
 */
function recalculateCartTotals(items: CartItem[]): {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
} {
  let subtotal = 0;
  let itemCount = 0;

  const recalculated = items.map((item) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    itemCount += item.quantity;
    return {
      ...item,
      lineTotal,
    };
  });

  return {
    items: recalculated,
    subtotal,
    itemCount,
  };
}

/**
 * Retrieves the user's active cart or creates an empty cart
 */
export async function getCart(
  userId?: string,
  sessionId?: string
): Promise<CartDocument> {
  await ensureIndex();

  if (!userId && !sessionId) {
    return {
      id: "guest_empty",
      items: [],
      subtotal: 0,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const db = await getDatabase();
  const query: any = {};
  if (userId) {
    query.userId = userId;
  } else if (sessionId) {
    query.sessionId = sessionId;
  }

  let cart = await db.collection<CartDocument>(COLLECTION_NAME).findOne(query);

  if (!cart) {
    const newCart: CartDocument = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: userId || undefined,
      sessionId: !userId ? sessionId : undefined,
      items: [],
      subtotal: 0,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection<CartDocument>(COLLECTION_NAME).insertOne(newCart);
    return newCart;
  }

  return cart;
}

/**
 * Adds a validated product to cart
 */
export async function addItemToCart(params: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity: number;
}): Promise<CartDocument> {
  await ensureIndex();

  const product = await getProductById(params.productId);
  if (!product) {
    throw new Error("Product not found or unavailable.");
  }

  if (product.status !== "ACTIVE" || product.visibility !== "PUBLIC") {
    throw new Error("This product is currently not available for purchase.");
  }

  const trackStock = product.inventory.trackInventory !== false;
  const availableStock = trackStock ? product.inventory.quantity : 999;

  if (trackStock && availableStock <= 0) {
    throw new Error(`"${product.name}" is currently out of stock.`);
  }

  const cart = await getCart(params.userId, params.sessionId);
  const existingIndex = cart.items.findIndex(
    (item) => item.productId === params.productId
  );

  const effectivePrice =
    product.pricing.salePrice && product.pricing.salePrice > 0
      ? product.pricing.salePrice
      : product.pricing.regularPrice;

  let updatedItems = [...cart.items];

  if (existingIndex > -1) {
    const existing = updatedItems[existingIndex]!;
    const currentQty = existing.quantity;
    const newQty = currentQty + params.quantity;

    if (trackStock && newQty > availableStock) {
      throw new Error(
        `Only ${availableStock} units available for "${product.name}". Cannot add more.`
      );
    }

    updatedItems[existingIndex] = {
      ...existing,
      price: effectivePrice,
      regularPrice: product.pricing.regularPrice,
      salePrice: product.pricing.salePrice,
      quantity: newQty,
      lineTotal: effectivePrice * newQty,
      maxQuantity: availableStock,
      inStock: availableStock > 0,
    };
  } else {
    if (trackStock && params.quantity > availableStock) {
      throw new Error(
        `Only ${availableStock} units available for "${product.name}".`
      );
    }

    const newItem: CartItem = {
      id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: product.primaryImage,
      sku: product.inventory.sku,
      regularPrice: product.pricing.regularPrice,
      salePrice: product.pricing.salePrice,
      price: effectivePrice,
      quantity: params.quantity,
      lineTotal: effectivePrice * params.quantity,
      businessId: product.businessId,
      businessName: product.businessName,
      businessSlug: product.businessSlug,
      shopId: product.shopId,
      shopName: product.shopName,
      inStock: true,
      maxQuantity: availableStock,
    };

    updatedItems.push(newItem);
  }

  const { items, subtotal, itemCount } = recalculateCartTotals(updatedItems);
  const now = new Date();

  const db = await getDatabase();
  await db.collection<CartDocument>(COLLECTION_NAME).updateOne(
    { id: cart.id },
    {
      $set: {
        items,
        subtotal,
        itemCount,
        updatedAt: now,
      },
    }
  );

  return {
    ...cart,
    items,
    subtotal,
    itemCount,
    updatedAt: now,
  };
}

/**
 * Updates an item's quantity in cart (removes item if quantity is 0)
 */
export async function updateCartItemQuantity(params: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity: number;
}): Promise<CartDocument> {
  await ensureIndex();

  if (params.quantity <= 0) {
    return removeItemFromCart(params);
  }

  const cart = await getCart(params.userId, params.sessionId);
  const existingIndex = cart.items.findIndex(
    (item) => item.productId === params.productId
  );

  if (existingIndex === -1) {
    throw new Error("Item not found in your cart.");
  }

  const product = await getProductById(params.productId);
  if (product) {
    const trackStock = product.inventory.trackInventory !== false;
    const availableStock = trackStock ? product.inventory.quantity : 999;

    if (trackStock && params.quantity > availableStock) {
      throw new Error(
        `Only ${availableStock} units available for "${product.name}".`
      );
    }
  }

  const updatedItems = [...cart.items];
  const item = updatedItems[existingIndex]!;
  updatedItems[existingIndex] = {
    ...item,
    quantity: params.quantity,
    lineTotal: item.price * params.quantity,
  };

  const { items, subtotal, itemCount } = recalculateCartTotals(updatedItems);
  const now = new Date();

  const db = await getDatabase();
  await db.collection<CartDocument>(COLLECTION_NAME).updateOne(
    { id: cart.id },
    {
      $set: {
        items,
        subtotal,
        itemCount,
        updatedAt: now,
      },
    }
  );

  return {
    ...cart,
    items,
    subtotal,
    itemCount,
    updatedAt: now,
  };
}

/**
 * Removes a specific item from cart
 */
export async function removeItemFromCart(params: {
  userId?: string;
  sessionId?: string;
  productId: string;
}): Promise<CartDocument> {
  await ensureIndex();

  const cart = await getCart(params.userId, params.sessionId);
  const updatedItems = cart.items.filter(
    (item) => item.productId !== params.productId
  );

  const { items, subtotal, itemCount } = recalculateCartTotals(updatedItems);
  const now = new Date();

  const db = await getDatabase();
  await db.collection<CartDocument>(COLLECTION_NAME).updateOne(
    { id: cart.id },
    {
      $set: {
        items,
        subtotal,
        itemCount,
        updatedAt: now,
      },
    }
  );

  return {
    ...cart,
    items,
    subtotal,
    itemCount,
    updatedAt: now,
  };
}

/**
 * Empties all items from the cart
 */
export async function clearCart(
  userId?: string,
  sessionId?: string
): Promise<void> {
  await ensureIndex();
  const db = await getDatabase();
  const query: any = {};
  if (userId) query.userId = userId;
  else if (sessionId) query.sessionId = sessionId;

  await db.collection<CartDocument>(COLLECTION_NAME).updateOne(query, {
    $set: {
      items: [],
      subtotal: 0,
      itemCount: 0,
      updatedAt: new Date(),
    },
  });
}

/**
 * Merges a guest cart into an authenticated user's cart
 */
export async function mergeGuestCart(
  guestSessionId: string,
  userId: string
): Promise<CartDocument> {
  if (!guestSessionId || !userId) {
    return getCart(userId);
  }

  const guestCart = await getCart(undefined, guestSessionId);
  if (!guestCart || guestCart.items.length === 0) {
    return getCart(userId);
  }

  let userCart = await getCart(userId);

  for (const item of guestCart.items) {
    try {
      userCart = await addItemToCart({
        userId,
        productId: item.productId,
        quantity: item.quantity,
      });
    } catch {
      // Skip out-of-stock or invalid items
    }
  }

  await clearCart(undefined, guestSessionId);
  return userCart;
}
