import { Metadata } from "next";
import { PrivacyDataAccessView } from "@/features/admin/security/components/privacy-data-access-view";

export const metadata: Metadata = {
  title: "Privacy & Data Access Controls | BDSisters Admin",
  description: "Member data protection, AES-256 document encryption, and female officer safe spaces.",
};

export default function PrivacyPage() {
  return <PrivacyDataAccessView />;
}
