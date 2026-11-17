import type {
  OrderStatus,
  PaymentStatus,
  ItemFulfillmentStatus,
} from "@/types/order";

export interface StatusBadgeInfo {
  label: string;
  color: string;
  bg: string;
  border: string;
}

export function getOrderStatusBadge(status: OrderStatus): StatusBadgeInfo {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Confirmed",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    case "READY_TO_SHIP":
      return {
        label: "Ready to Ship",
        color: "text-indigo-700",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        color: "text-purple-700",
        bg: "bg-purple-50",
        border: "border-purple-200",
      };
    case "DELIVERED":
      return {
        label: "Delivered",
        color: "text-emerald-800",
        bg: "bg-emerald-100/60",
        border: "border-emerald-300",
      };
    case "PENDING_PAYMENT":
      return {
        label: "Pending Payment",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    case "CANCELLATION_REQUESTED":
      return {
        label: "Cancel Requested",
        color: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
      };
    default:
      return {
        label: status,
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}

export function getPaymentStatusBadge(status: PaymentStatus): StatusBadgeInfo {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    case "PROCESSING":
      return {
        label: "Payment Processing",
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    case "PENDING":
      return {
        label: "Pending",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    case "FAILED":
      return {
        label: "Failed",
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        color: "text-gray-600",
        bg: "bg-gray-100",
        border: "border-gray-200",
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        color: "text-purple-700",
        bg: "bg-purple-50",
        border: "border-purple-200",
      };
    default:
      return {
        label: status,
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}

export function getFulfillmentStatusBadge(status: ItemFulfillmentStatus): StatusBadgeInfo {
  switch (status) {
    case "DELIVERED":
      return {
        label: "Delivered",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        color: "text-purple-700",
        bg: "bg-purple-50",
        border: "border-purple-200",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    case "PENDING":
      return {
        label: "Pending",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
      };
    default:
      return {
        label: status,
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}

export const getItemFulfillmentBadge = getFulfillmentStatusBadge;
