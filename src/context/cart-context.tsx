"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface CartItem {
  productId: string;
  slug?: string;
  title: string;
  brandName?: string;
  price: number;
  mrp?: number;
  salePrice?: number;
  image?: string;
  quantity: number;
  stock?: number;
  category?: string;
  isWholesale?: boolean;
  wholesalePrice?: number;
  lineTotal?: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  fetchCart: () => Promise<void>;
  addItem: (
    item: {
      productId: string;
      quantity?: number;
      isWholesale?: boolean;
    } | CartItem,
    openDrawerOnAdd?: boolean
  ) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper to parse backend cart response
  const applyCartResponse = useCallback((raw: any) => {
    const cartData = raw?.data?.cart || raw?.data || raw?.cart || raw;
    const rawItems = Array.isArray(cartData?.items)
      ? cartData.items
      : Array.isArray(raw?.items)
      ? raw.items
      : [];

    const parsedItems: CartItem[] = rawItems.map((item: any) => {
      const p = item.productId && typeof item.productId === "object" ? item.productId : {};
      const prodId =
        (p._id ? p._id.toString() : null) ||
        (item.productId ? (typeof item.productId === "string" ? item.productId : item.productId._id) : "") ||
        item.id ||
        "";

      const title = item.title || p.title || "Product";
      const brandName = item.brandName || p.brandName || "";
      const slug = item.slug || p.slug || prodId;
      const price = Number(item.price || p.salePrice || p.price || 0);
      const mrp = Number(item.mrp || p.mrpPrice || price);
      const image =
        item.image ||
        (Array.isArray(p.images) && p.images[0]) ||
        "";
      const quantity = Number(item.quantity || 1);
      const stock = typeof item.stock === "number" ? item.stock : (typeof p.stock === "number" ? p.stock : 999);
      const isWholesale = Boolean(item.isWholesale);
      const wholesalePrice = item.wholesalePrice || p.wholesalePrice;
      const lineTotal = price * quantity;

      return {
        productId: prodId,
        slug,
        title,
        brandName,
        price,
        mrp,
        image,
        quantity,
        stock,
        isWholesale,
        wholesalePrice,
        lineTotal,
      };
    });

    setItems(parsedItems);

    const calcTotalItems = parsedItems.reduce((acc, i) => acc + i.quantity, 0);
    const calcSubtotal = parsedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

    setTotalItems(raw?.totalItems ?? raw?.data?.totalItems ?? calcTotalItems);
    setSubtotal(raw?.subtotal ?? raw?.data?.subtotal ?? calcSubtotal);
  }, []);

  // Fetch cart from backend API
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated && !user) {
      setItems([]);
      setTotalItems(0);
      setSubtotal(0);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ecommerce.cart);
      applyCartResponse(res);
    } catch {
      // Non-fatal if user is unauthenticated or network is unavailable
      setItems([]);
      setTotalItems(0);
      setSubtotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, applyCartResponse]);

  // Sync cart whenever authentication state changes
  useEffect(() => {
    if (isAuthLoading) return;
    if (isAuthenticated) {
      fetchCart();
    } else {
      setItems([]);
      setTotalItems(0);
      setSubtotal(0);
    }
  }, [isAuthenticated, isAuthLoading, fetchCart]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  // Add Item: Calls backend POST /api/cart/add
  const addItem = useCallback(
    async (
      item: { productId: string; quantity?: number; isWholesale?: boolean } | CartItem,
      openDrawerOnAdd = true
    ): Promise<boolean> => {
      if (!isAuthenticated && !user) {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.pathname;
          router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
        }
        return false;
      }

      setIsLoading(true);
      try {
        const payload = {
          productId: item.productId,
          quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
          isWholesale: !!item.isWholesale,
        };

        const res = await apiClient.post<any>(API_ENDPOINTS.ecommerce.addToCart, payload);
        applyCartResponse(res);

        if (openDrawerOnAdd) {
          setIsDrawerOpen(true);
        }
        return true;
      } catch (err: any) {
        alert(err?.message || "Failed to add item to cart.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, router, applyCartResponse]
  );

  // Update Quantity: Calls backend PUT/PATCH /api/cart
  const updateQuantity = useCallback(
    async (productId: string, quantity: number): Promise<boolean> => {
      if (!isAuthenticated && !user) return false;

      setIsLoading(true);
      try {
        if (quantity <= 0) {
          const res = await apiClient.delete<any>(API_ENDPOINTS.ecommerce.removeFromCart(productId));
          applyCartResponse(res);
        } else {
          const res = await apiClient.put<any>(API_ENDPOINTS.ecommerce.cart, {
            productId,
            quantity,
          });
          applyCartResponse(res);
        }
        return true;
      } catch (err: any) {
        alert(err?.message || "Failed to update quantity.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, applyCartResponse]
  );

  // Remove Item: Calls backend DELETE /api/cart/:itemId
  const removeItem = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated && !user) return false;

      setIsLoading(true);
      try {
        const res = await apiClient.delete<any>(API_ENDPOINTS.ecommerce.removeFromCart(productId));
        applyCartResponse(res);
        return true;
      } catch (err: any) {
        alert(err?.message || "Failed to remove item.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, applyCartResponse]
  );

  // Clear Cart: Calls backend DELETE /api/cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated && !user) return false;

    setIsLoading(true);
    try {
      const res = await apiClient.delete<any>(API_ENDPOINTS.ecommerce.clearCart);
      applyCartResponse(res);
      return true;
    } catch (err: any) {
      alert(err?.message || "Failed to clear cart.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, applyCartResponse]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        isLoading,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        fetchCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
