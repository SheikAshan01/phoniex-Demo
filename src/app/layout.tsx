import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { StoreProvider } from "@/context/store-context";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { QuickViewModal } from "@/components/quick-view-modal";
import { ToastContainer } from "@/components/toast-container";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phonex.net.in"),
  title: "PHONEX — Sales | Services | Gadgets | Custom Mobile Skins & 9H Glass",
  description:
    "Explore precision custom mobile skins, ₹99 unbreakable tempered glass, and high-performance smartphone essentials from PHONEX. Verified offline centers in Coimbatore, Annur, and P. Puliam patti.",
  keywords: [
    "mobile skins",
    "custom phone skins",
    "unbreakable tempered glass",
    "₹99 tempered glass",
    "phone covers",
    "PHONEX",
    "Coimbatore mobile accessories",
    "Annur mobile service",
    "3M phone wrap",
  ],
  authors: [{ name: "PHONEX Gadgets" }],
  openGraph: {
    title: "PHONEX — Sales | Services | Gadgets",
    description:
      "Precision custom mobile skins, ₹99 unbreakable tempered glass, and fast GaN chargers. Premium craft for 500+ smartphones.",
    url: "https://phonex.net.in",
    siteName: "PHONEX",
    images: [
      {
        url: "/images/phonex-badge.png",
        width: 512,
        height: 512,
        alt: "PHONEX Brand Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PHONEX — Sales | Services | Gadgets",
    description:
      "Custom mobile skins, ₹99 unbreakable tempered glass & mobile essentials.",
    images: ["/images/phonex-badge.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
        <StoreProvider>
          <AnnouncementBar />
          <Suspense fallback={<div className="h-20 bg-white border-b border-slate-200" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <CartDrawer />
          <QuickViewModal />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
