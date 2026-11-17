import { Metadata } from "next";
import { CartView } from "@/features/ecommerce/components/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart | BDSisters.org",
  description: "Review items in your shopping cart and proceed to checkout on BDSisters.org.",
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CartView />
      </div>
    </div>
  );
}
