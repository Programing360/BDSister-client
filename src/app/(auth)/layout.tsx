import React from "react";

export const metadata = {
  title: {
    template: "%s | BDSisters.org",
    default: "Authentication | BDSisters.org",
  },
  description: "Secure authentication portal for BDSisters.org community members and administrators.",
};

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#EAE6F7] text-gray-900">{children}</div>;
}
