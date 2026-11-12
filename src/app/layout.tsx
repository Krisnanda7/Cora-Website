import type { Metadata } from "next";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "CORA — Circular Food Innovation",
  description:
    "Turning coconut residues into nutritious food products, AI-assisted recipes, and a circular community marketplace.",
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
      </body>
    </html>
  );
}
