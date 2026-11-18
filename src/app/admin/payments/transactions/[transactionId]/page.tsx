import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TransactionDetailView } from "@/features/admin/payments/components/transactions/transaction-detail-view";
import {
  DEMO_PAYMENT_TRANSACTIONS,
  getPaymentTransactionById,
} from "@/features/admin/payments/data/mock-payments";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

export async function generateStaticParams() {
  return DEMO_PAYMENT_TRANSACTIONS.map((t) => ({
    transactionId: t.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { transactionId } = await params;
  const tx = getPaymentTransactionById(transactionId);
  return {
    title: tx ? `Transaction ${tx.transactionId} | BDSisters Admin` : "Transaction Details | BDSisters Admin",
    description: "Detailed ZiniPay settlement and member reconciliation breakdown.",
  };
}

export default async function AdminTransactionDetailPage({ params }: PageProps) {
  const { transactionId } = await params;
  const tx = getPaymentTransactionById(transactionId) || DEMO_PAYMENT_TRANSACTIONS[0];

  if (!tx) {
    notFound();
  }

  return <TransactionDetailView transaction={tx} />;
}
