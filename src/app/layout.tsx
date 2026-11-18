import type { Metadata } from "next";
import { AppProviders } from "@/providers";
import "@/styles/globals.css";
import { Besley, Geist, Inter } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
});

// const besley = Besley({
//   subsets: ["latin"],
//   variable: "--font-besley",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: {
    default: "BDSisters — Premium Community for Bangladeshi Women",
    template: "%s | BDSisters",
  },
  description:
    "A premium community, professional networking, personal development, and e-commerce platform for Bangladeshi women.",
  keywords: [
    "Bangladeshi women",
    "community",
    "networking",
    "e-commerce",
    "BDSisters",
  ],
  authors: [{ name: "BDSisters Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "BDSisters",
    title: "BDSisters — Community for Bangladeshi Women",
    description:
      "A premium community, professional networking, personal development, and e-commerce platform for Bangladeshi women.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background text-foreground font-sans antialiased ${inter.className}`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
