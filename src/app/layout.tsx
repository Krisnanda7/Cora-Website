import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { CoraProvider } from "@/context/CoraContext";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
