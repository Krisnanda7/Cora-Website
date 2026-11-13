import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { CoraProvider } from "@/context/CoraContext";
import "./globals.css";

const fraunces = localFont({
  src: "../../public/fonts/fraunces.woff2",
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakartaSans = localFont({
  src: "../../public/fonts/plus-jakarta-sans.woff2",
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://corasite-five.vercel.app"),
  title: {
    default: "CORA — Circular Food Innovation",
    template: "%s | CORA",
  },
  description:
    "Transforming coconut residues into nutritious food products, artisanal gluten-free coconut flour, cookies, brownies, and an empowered circular ecosystem in Bali.",
  keywords: [
    "CORA",
    "coconut residue",
    "coconut flour",
    "food upcycling",
    "circular economy",
    "gluten free",
    "Bali food tech",
    "zero waste",
    "SDGs",
  ],
  authors: [{ name: "CORA Innovation Team" }],
  creator: "CORA",
  publisher: "CORA Circular Food Innovation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "CORA — Circular Food Innovation",
    description:
      "Turning coconut milk residues into nutritious food products, AI-assisted recipes, and a circular community marketplace in Bali.",
    url: "https://corasite-five.vercel.app",
    siteName: "CORA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CORA — Circular Food Innovation",
    description:
      "Turning coconut milk residues into nutritious food products, AI-assisted recipes, and a circular community marketplace.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body
        className={`${fraunces.variable} ${plusJakartaSans.variable} min-h-full flex flex-col bg-[#FAF8F5] text-[#2C1E18] font-sans selection:bg-[#3B5B3D]/15 selection:text-[#2C1E18]`}
      >
        <CoraProvider>{children}</CoraProvider>
        <Analytics />
      </body>
    </html>
  );
}
