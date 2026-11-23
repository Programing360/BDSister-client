import { getDatabase } from "@/lib/db/mongodb";
import type {
  OrderDocument,
  OrderItemSnapshot,
  ShippingAddress,
  OrderStatus,
  PaymentStatus,
  ItemFulfillmentStatus,
} from "@/types/order";
import type { PaymentTransactionDocument } from "@/types/payment";
import { getCart, clearCart } from "@/lib/services/cart-service";
import { getProductById } from "@/lib/services/product-service";
import { findBusinessesByOwnerId as getBusinessesByOwnerId } from "@/lib/db/repositories/business-repository";
import { ZiniPayService, normalizeZiniPayStatus } from "@/lib/services/zinipay-service";
import { calculateInventoryStatus } from "@/features/product/utils/product-utils";

const ORDERS_COLLECTION = "orders";
const TRANSACTIONS_COLLECTION = "payment_transactions";

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(ORDERS_COLLECTION).createIndex({ id: 1 }, { unique: true });
    await db.collection(ORDERS_COLLECTION).createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection(ORDERS_COLLECTION).createIndex({ customerId: 1 });
    await db.collection(ORDERS_COLLECTION).createIndex({ sellerBusinessIds: 1 });
    await db.collection(ORDERS_COLLECTION).createIndex({ paymentStatus: 1, orderStatus: 1 });
    await db.collection(ORDERS_COLLECTION).createIndex({ createdAt: -1 });

    await db.collection(TRANSACTIONS_COLLECTION).createIndex({ id: 1 }, { unique: true });
    await db.collection(TRANSACTIONS_COLLECTION).createIndex({ invoiceId: 1 }, { unique: true });
    await db.collection(TRANSACTIONS_COLLECTION).createIndex({ orderId: 1 });
    indexEnsured = true;
  } catch (err) {
    console.warn("[OrderService] Index initialization deferred:", (err as Error).message);
  }
}

/**
 * Generates an auditable, human-friendly order reference number
 * Format: BDS-YYYYMM-XXXXX (e.g. BDS-202611-84920)
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `BDS-${yearMonth}-${randomSuffix}`;
}

/**
 * Calculates delivery fee based on customer address
 * Standard: 80 BDT for Dhaka division, 130 BDT nationwide delivery
 */
export function calculateDeliveryFee(division: string): number {
  if (division?.toLowerCase().includes("dhaka")) {
    return 80;
  }
  return 130;
}

/**
 * Creates an immutable Order document and initializes ZiniPay hosted invoice
 */
export async function createOrderFromCart(params: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  sessionId?: string;
}): Promise<{
  order: OrderDocument;
  paymentUrl: string;
}> {
  await ensureIndex();

  const cart = await getCart(params.customerId, params.sessionId);
  if (!cart || cart.items.length === 0) {
    throw new Error("Your shopping cart is empty.");
  }

  // 1. Re-validate all items against live database records & stock
  let subtotal = 0;
  const itemSnapshots: OrderItemSnapshot[] = [];
  const sellerBusinessIdsSet = new Set<string>();

  for (const item of cart.items) {
    const liveProduct = await getProductById(item.productId);
    if (!liveProduct) {
      throw new Error(`Product "${item.productName}" is no longer available.`);
    }

    if (liveProduct.status !== "ACTIVE" || liveProduct.visibility !== "PUBLIC") {
      throw new Error(`Product "${liveProduct.name}" is not available for purchase.`);
    }

    if (
      liveProduct.inventory.trackInventory !== false &&
      liveProduct.inventory.quantity < item.quantity
    ) {
      throw new Error(
        `Insufficient stock for "${liveProduct.name}". Only ${liveProduct.inventory.quantity} units available.`,
      );
    }

    const effectiveUnitPrice =
      liveProduct.pricing.salePrice && liveProduct.pricing.salePrice > 0
        ? liveProduct.pricing.salePrice
        : liveProduct.pricing.regularPrice;

    const lineTotal = effectiveUnitPrice * item.quantity;
    subtotal += lineTotal;
    sellerBusinessIdsSet.add(liveProduct.businessId);

    itemSnapshots.push({
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId: liveProduct.id,
      productSlug: liveProduct.slug,
      productName: liveProduct.name,
      productImage: liveProduct.primaryImage,
      sku: liveProduct.inventory.sku,
      unitPrice: effectiveUnitPrice,
      quantity: item.quantity,
      lineTotal,
      businessId: liveProduct.businessId,
      businessName: liveProduct.businessName,
      businessSlug: liveProduct.businessSlug,
      shopId: liveProduct.shopId,
      shopName: liveProduct.shopName,
      fulfillmentStatus: "PENDING",
    });
  }

  const shippingCharge = calculateDeliveryFee(params.shippingAddress.division);
  const discount = 0;
  const totalAmount = subtotal + shippingCharge - discount;

  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const orderNumber = generateOrderNumber();
  const now = new Date();

  // 2. Prepare hosted invoice with ZiniPay
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000";
  const redirectUrl = `${appUrl}/checkout/success`;
  const cancelUrl = `${appUrl}/checkout/cancelled`;
  const webhookUrl = `${appUrl}/api/payments/zinipay/webhook`;

  const invoiceResult = await ZiniPayService.createInvoice({
    amount: totalAmount,
    redirectUrl,
    cancelUrl,
    webhookUrl,
    customerName: params.customerName || params.shippingAddress.fullName,
    customerEmail: params.customerEmail || params.shippingAddress.email,
    metadata: {
      orderId,
      orderNumber,
      customerId: params.customerId,
    },
  });

  if (!invoiceResult.success) {
    throw new Error(invoiceResult.error || "Failed to initialize payment gateway invoice.");
  }

  // 3. Create payment transaction record
  const transactionId = `pt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const paymentTransaction: PaymentTransactionDocument = {
    id: transactionId,
    orderId,
    orderNumber,
    customerId: params.customerId,
    provider: "ZINIPAY",
    invoiceId: invoiceResult.invoiceId,
    paymentUrl: invoiceResult.paymentUrl,
    amount: totalAmount,
    currency: "BDT",
    status: "PENDING",
    idempotencyKey: `idemp_${orderId}_${invoiceResult.invoiceId}`,
    createdAt: now,
    updatedAt: now,
  };

  // 4. Create Order document
  const newOrder: OrderDocument = {
    id: orderId,
    orderNumber,
    customerId: params.customerId,
    customerName: params.customerName || params.shippingAddress.fullName,
    customerEmail: params.customerEmail || params.shippingAddress.email,
    customerPhone: params.customerPhone || params.shippingAddress.phone,
    shippingAddress: params.shippingAddress,
    items: itemSnapshots,
    sellerBusinessIds: Array.from(sellerBusinessIdsSet),
    subtotal,
    discount,
    shippingCharge,
    totalAmount,
    currency: "BDT",
    paymentMethod: "ZiniPay Hosted Gateway",
    paymentStatus: "PENDING",
    orderStatus: "PENDING_PAYMENT",
    paymentTransactionId: transactionId,
    zinipayInvoiceId: invoiceResult.invoiceId,
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDatabase();
  await db.collection<OrderDocument>(ORDERS_COLLECTION).insertOne(newOrder);
  await db
    .collection<PaymentTransactionDocument>(TRANSACTIONS_COLLECTION)
    .insertOne(paymentTransaction);

  // 5. Clear customer's cart
  await clearCart(params.customerId, params.sessionId);

  return {
    order: newOrder,
    paymentUrl: invoiceResult.paymentUrl,
  };
}

/**
 * Server-side payment verification and idempotent inventory deduction
 */
export async function verifyAndFinalizePayment(invoiceId: string): Promise<{
  success: boolean;
  status: PaymentStatus;
  order: OrderDocument | null;
  message?: string;
}> {
  await ensureIndex();

  if (!invoiceId) {
    return { success: false, status: "FAILED", order: null, message: "Missing invoice ID." };
  }

  const db = await getDatabase();
  const transaction = await db
    .collection<PaymentTransactionDocument>(TRANSACTIONS_COLLECTION)
    .findOne({ invoiceId });

  if (!transaction) {
    return {
      success: false,
      status: "FAILED",
      order: null,
      message: `Transaction record not found for invoice ID: ${invoiceId}`,
    };
  }

  const order = await db
    .collection<OrderDocument>(ORDERS_COLLECTION)
    .findOne({ id: transaction.orderId });

  if (!order) {
    return {
      success: false,
      status: "FAILED",
      order: null,
      message: "Order record not found.",
    };
  }

  // Idempotency: If already paid and finalized, return existing verified order
  if (order.paymentStatus === "PAID" && transaction.status === "PAID") {
    return {
      success: true,
      status: "PAID",
      order,
      message: "Payment already verified and finalized.",
    };
  }

  // 1. Verify with ZiniPay server
  const verifyResult = await ZiniPayService.verifyInvoice(invoiceId);

  if (!verifyResult.success) {
    return {
      success: false,
      status: "PROCESSING",
      order,
      message: verifyResult.error || "Payment verification in progress.",
    };
  }

  const normalizedStatus = normalizeZiniPayStatus(verifyResult.status);

  // 2. Amount verification check
  if (
    verifyResult.amount !== undefined &&
    Math.round(verifyResult.amount) !== Math.round(order.totalAmount)
  ) {
    console.error(
      `[ZiniPay Alert] Amount mismatch! Expected ৳${order.totalAmount}, got ৳${verifyResult.amount}`,
    );
    await db.collection(TRANSACTIONS_COLLECTION).updateOne(
      { invoiceId },
      {
        $set: {
          status: "FAILED",
          rawResponse: verifyResult.raw,
          updatedAt: new Date(),
        },
      },
    );
    return {
      success: false,
      status: "FAILED",
      order,
      message: "Payment amount does not match order total.",
    };
  }

  const now = new Date();

  if (normalizedStatus === "PAID") {
    // 3. Atomic stock deduction for each item in the order
    for (const item of order.items) {
      try {
        const prod = await getProductById(item.productId);
        if (prod && prod.inventory.trackInventory !== false) {
          const newQty = Math.max(0, prod.inventory.quantity - item.quantity);
          const newStatus = calculateInventoryStatus(
            newQty,
            prod.inventory.lowStockThreshold,
            prod.inventory.trackInventory,
          );

          await db.collection("products").updateOne(
            { id: item.productId, "inventory.quantity": { $gte: item.quantity } },
            {
              $inc: { "inventory.quantity": -item.quantity },
              $set: { "inventory.status": newStatus, updatedAt: now },
            },
          );
        }
      } catch (err: any) {
        console.warn(`[Inventory] Deduction warning for ${item.productId}:`, err.message);
      }
    }

    // 4. Update order & transaction to PAID & CONFIRMED
    await db.collection<OrderDocument>(ORDERS_COLLECTION).updateOne(
      { id: order.id },
      {
        $set: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
          zinipayTransactionId: verifyResult.transactionId,
          paidAt: now,
          updatedAt: now,
        },
      },
    );

    await db.collection<PaymentTransactionDocument>(TRANSACTIONS_COLLECTION).updateOne(
      { invoiceId },
      {
        $set: {
          status: "PAID",
          paymentMethod: verifyResult.paymentMethod,
          zinipayTrxId: verifyResult.transactionId,
          rawResponse: verifyResult.raw,
          verifiedAt: now,
          updatedAt: now,
        },
      },
    );

    const updatedOrder = await db
      .collection<OrderDocument>(ORDERS_COLLECTION)
      .findOne({ id: order.id });

    return {
      success: true,
      status: "PAID",
      order: updatedOrder,
    };
  }

  // If status is failed
  if (normalizedStatus === "FAILED" || normalizedStatus === "CANCELLED") {
    await db
      .collection<OrderDocument>(ORDERS_COLLECTION)
      .updateOne({ id: order.id }, { $set: { paymentStatus: normalizedStatus, updatedAt: now } });
    await db
      .collection(TRANSACTIONS_COLLECTION)
      .updateOne(
        { invoiceId },
        { $set: { status: normalizedStatus, rawResponse: verifyResult.raw, updatedAt: now } },
      );
  }

  return {
    success: false,
    status: normalizedStatus,
    order,
    message: `Payment status is ${verifyResult.status}`,
  };
}

/**
 * Retrieves a customer's personal order history
 */
export async function getCustomerOrders(
  customerId: string,
  options: { page?: number; limit?: number; status?: string } = {},
): Promise<{
  orders: OrderDocument[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await ensureIndex();

  if (!customerId) {
    return { orders: [], total: 0, page: 1, totalPages: 0 };
  }

  const db = await getDatabase();
  const query: any = { customerId };

  if (options.status && options.status !== "all") {
    query.orderStatus = options.status;
  }

  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(50, options.limit || 10));
  const skip = (page - 1) * limit;

  const total = await db.collection<OrderDocument>(ORDERS_COLLECTION).countDocuments(query);
  const orders = await db
    .collection<OrderDocument>(ORDERS_COLLECTION)
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Retrieves an order by ID, enforcing customer or seller ownership
 */
export async function getOrderById(
  orderId: string,
  customerId?: string,
): Promise<OrderDocument | null> {
  await ensureIndex();

  const db = await getDatabase();
  const query: any = { id: orderId };
  if (customerId) {
    query.customerId = customerId;
  }

  return await db.collection<OrderDocument>(ORDERS_COLLECTION).findOne(query);
}

/**
 * Retrieves orders containing items from businesses owned by a seller
 */
export async function getSellerOrders(
  sellerUserId: string,
  options: { page?: number; limit?: number; status?: string } = {},
): Promise<{
  orders: Array<{
    id: string;
    orderNumber: string;
    createdAt: Date;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    customerName: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    sellerItems: OrderItemSnapshot[];
    sellerSubtotal: number;
  }>;
  total: number;
  page: number;
  totalPages: number;
}> {
  await ensureIndex();

  if (!sellerUserId) {
    return { orders: [], total: 0, page: 1, totalPages: 0 };
  }

  // 1. Get seller's owned businesses
  const sellerBusinesses = await getBusinessesByOwnerId(sellerUserId);
  if (!sellerBusinesses || sellerBusinesses.length === 0) {
    return { orders: [], total: 0, page: 1, totalPages: 0 };
  }

  const sellerBizIds = sellerBusinesses.map((b) => b.id);
  const db = await getDatabase();

  const query: any = {
    sellerBusinessIds: { $in: sellerBizIds },
  };

  if (options.status && options.status !== "all") {
    query.orderStatus = options.status;
  }

  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(50, options.limit || 10));
  const skip = (page - 1) * limit;

  const total = await db.collection<OrderDocument>(ORDERS_COLLECTION).countDocuments(query);
  const rawOrders = await db
    .collection<OrderDocument>(ORDERS_COLLECTION)
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // 2. Filter items so the seller sees only their items
  const filteredOrders = rawOrders.map((ord) => {
    const sellerItems = ord.items.filter((item) => sellerBizIds.includes(item.businessId));
    const sellerSubtotal = sellerItems.reduce((acc, i) => acc + i.lineTotal, 0);

    return {
      id: ord.id,
      orderNumber: ord.orderNumber,
      createdAt: ord.createdAt,
      paymentStatus: ord.paymentStatus,
      orderStatus: ord.orderStatus,
      customerName: ord.customerName,
      customerPhone: ord.customerPhone,
      shippingAddress: ord.shippingAddress,
      sellerItems,
      sellerSubtotal,
    };
  });

  return {
    orders: filteredOrders,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Updates fulfillment status for a specific item owned by the seller
 */
export async function updateSellerItemFulfillment(params: {
  orderId: string;
  sellerUserId: string;
  itemId: string;
  fulfillmentStatus: ItemFulfillmentStatus;
  carrier?: string;
  trackingNumber?: string;
}): Promise<OrderDocument | null> {
  await ensureIndex();

  const sellerBusinesses = await getBusinessesByOwnerId(params.sellerUserId);
  const sellerBizIds = sellerBusinesses.map((b) => b.id);

  const db = await getDatabase();
  const order = await db
    .collection<OrderDocument>(ORDERS_COLLECTION)
    .findOne({ id: params.orderId });

  if (!order) {
    throw new Error("Order not found.");
  }

  const itemIndex = order.items.findIndex((i) => i.id === params.itemId);
  if (itemIndex === -1) {
    throw new Error("Item not found in order.");
  }

  const targetItem = order.items[itemIndex]!;
  if (!sellerBizIds.includes(targetItem.businessId)) {
    throw new Error("Unauthorized: You do not own the business associated with this item.");
  }

  const now = new Date();
  const updatedItems = [...order.items];
  updatedItems[itemIndex] = {
    ...targetItem,
    fulfillmentStatus: params.fulfillmentStatus,
    carrier: params.carrier || targetItem.carrier,
    trackingNumber: params.trackingNumber || targetItem.trackingNumber,
    updatedAt: now,
  };

  // Derive overall order status if all items are dispatched or delivered
  let newOrderStatus = order.orderStatus;
  const allShipped = updatedItems.every(
    (i) => i.fulfillmentStatus === "SHIPPED" || i.fulfillmentStatus === "DELIVERED",
  );
  const allDelivered = updatedItems.every((i) => i.fulfillmentStatus === "DELIVERED");

  if (allDelivered) {
    newOrderStatus = "DELIVERED";
  } else if (allShipped) {
    newOrderStatus = "SHIPPED";
  } else if (params.fulfillmentStatus === "PROCESSING" && order.orderStatus === "CONFIRMED") {
    newOrderStatus = "PROCESSING";
  }

  await db.collection<OrderDocument>(ORDERS_COLLECTION).updateOne(
    { id: params.orderId },
    {
      $set: {
        items: updatedItems,
        orderStatus: newOrderStatus,
        updatedAt: now,
      },
    },
  );

  return await db.collection<OrderDocument>(ORDERS_COLLECTION).findOne({ id: params.orderId });
}

/**
 * Customer order cancellation request
 */
export async function requestOrderCancellation(
  orderId: string,
  customerId: string,
  reason: string,
): Promise<OrderDocument | null> {
  const db = await getDatabase();
  const order = await db
    .collection<OrderDocument>(ORDERS_COLLECTION)
    .findOne({ id: orderId, customerId });

  if (!order) {
    throw new Error("Order not found or unauthorized.");
  }

  if (order.orderStatus === "DELIVERED" || order.orderStatus === "SHIPPED") {
    throw new Error(
      "Orders that have already been shipped or delivered cannot be cancelled directly.",
    );
  }

  const now = new Date();

  // If unpaid, can cancel immediately
  if (order.paymentStatus === "PENDING") {
    await db.collection<OrderDocument>(ORDERS_COLLECTION).updateOne(
      { id: orderId },
      {
        $set: {
          orderStatus: "CANCELLED",
          paymentStatus: "CANCELLED",
          cancellationReason: reason,
          updatedAt: now,
        },
      },
    );
  } else {
    // If paid, marks as cancellation requested for seller / support review
    await db.collection<OrderDocument>(ORDERS_COLLECTION).updateOne(
      { id: orderId },
      {
        $set: {
          orderStatus: "CANCELLATION_REQUESTED",
          cancellationReason: reason,
          updatedAt: now,
        },
      },
    );
  }

  return await db.collection<OrderDocument>(ORDERS_COLLECTION).findOne({ id: orderId });
}
