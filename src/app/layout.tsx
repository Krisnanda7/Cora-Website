import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { CoraProvider } from "@/context/CoraContext";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
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
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#2C1E18] font-sans selection:bg-[#3B5B3D]/15 selection:text-[#2C1E18]">
        <CoraProvider>{children}</CoraProvider>
      </body>
    </html>
  );
}
