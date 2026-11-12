import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { CoraProvider } from "@/context/CoraContext";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CORA — Circular Food Innovation",
  description:
    "Turning coconut residues into nutritious food products, AI-assisted recipes, and a circular community marketplace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#2C1E18] font-sans">
        <CoraProvider>{children}</CoraProvider>
      </body>
    </html>
  );
}
