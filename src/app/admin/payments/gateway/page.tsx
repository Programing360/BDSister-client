import { Metadata } from "next";
import { ZiniPayGatewayView } from "@/features/admin/payments/components/gateway/zinipay-gateway-view";

export const metadata: Metadata = {
  title: "ZiniPay Payment Gateway | BDSisters Admin",
  description: "Configure and inspect ZiniPay merchant payment gateway credentials and IPN webhook handlers.",
};

export default function AdminPaymentGatewayPage() {
  return <ZiniPayGatewayView />;
}
