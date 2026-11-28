import React from "react";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}