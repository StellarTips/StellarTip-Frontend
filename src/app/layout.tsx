import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | StellarTip",
    default: "StellarTip — Instant Micro-tipping for Creators",
  },
  description:
    "Enable creators to receive instant, global micro-payments through a decentralized platform on the Stellar network.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "StellarTip",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-surface-50 font-sans text-surface-900 antialiased dark:bg-surface-950 dark:text-surface-100">
        {children}
      </body>
    </html>
  );
}
