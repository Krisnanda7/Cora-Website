import React from 'react';
import Link from 'next/link';
import { Leaf, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#E5DEC9] bg-[#EFECE3] text-[#2C1E18]">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B5B3D] text-white">
                <Leaf className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-xl font-semibold tracking-tight text-[#2C1E18]">
                  CORA
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6E5C52]">
                  Circular Food Innovation
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#5C4B42]">
              Transforming coconut residue from coconut milk production into
              nutrient-rich coconut flour, wholesome snacks, and a sustainable
              digital ecosystem for local suppliers.
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3B5B3D]">
              Zero Coconut Residue Wasted
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3B5B3D]">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#5C4B42]">
              <li>
                <Link href="/" className="transition hover:text-[#2C1E18]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#impact"
                  className="transition hover:text-[#2C1E18]"
                >
                  Our Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition hover:text-[#2C1E18]"
                >
                  Our Product
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="transition hover:text-[#2C1E18]"
                >
                  Lacak Pesanan
                </Link>
              </li>
              <li>
                <Link
                  href="/ecosystem"
                  className="transition hover:text-[#2C1E18]"
                >
                  Recipe &amp; CORABlend AI
                </Link>
              </li>
              <li>
                <Link
                  href="/pickup"
                  className="transition hover:text-[#2C1E18]"
                >
                  Coconut Pickup
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-[#2C1E18]"
                >
                  About Us &amp; FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="transition hover:text-[#2C1E18]"
                >
                  Profil Pengguna
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="transition hover:text-[#2C1E18]"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3B5B3D]">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#5C4B42]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3B5B3D]" />
                <span>Denpasar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#3B5B3D]" />
                <span>cora@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#3B5B3D]" />
                <span>+6285858687329</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#E5DEC9] pt-6 text-xs text-[#6E5C52] sm:flex-row sm:items-center">
          <p>&copy; 2026 PT CORA Circular Innovation. All rights reserved.</p>
          <Link
            href="/admin"
            className="font-medium text-[#3B5B3D] hover:underline"
          >
            Admin Operations Portal
          </Link>
        </div>
      </div>

      {/* Delicate Organic Green Leaf SVG Accent at Bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
        >
          <path
            d="M0 100 L0 72 Q220 50 440 72 T880 68 T1320 72 L1440 66 L1440 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.1"
          />
          <path
            d="M48 100 C64 68 102 52 132 66 C112 86 78 96 48 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.32"
          />
          <path
            d="M122 100 C145 76 182 68 206 80 C184 93 152 100 122 100 Z"
            fill="#4E9A34"
            fillOpacity="0.24"
          />
          <path
            d="M590 100 C612 68 652 56 682 70 C658 90 624 98 590 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.28"
          />
          <path
            d="M675 100 C692 74 724 64 748 74 C730 90 704 98 675 100 Z"
            fill="#4E9A34"
            fillOpacity="0.22"
          />
          <path
            d="M1230 100 C1256 64 1300 48 1332 65 C1304 88 1266 98 1230 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.34"
          />
          <path
            d="M1346 100 C1368 74 1406 62 1432 75 C1410 92 1378 98 1346 100 Z"
            fill="#4E9A34"
            fillOpacity="0.24"
          />
        </svg>
      </div>
    </footer>
  );
}
