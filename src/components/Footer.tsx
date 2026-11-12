import React from 'react';
import Link from 'next/link';
import { Leaf, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#E5DEC9] bg-[#EFECE3] text-[#2C1E18]">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B5B3D] text-white">
                <Leaf className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-xl font-bold tracking-tight text-[#2C1E18]">
                  CORA
                </p>
                <p className="text-xs font-medium text-[#6E5C52]">
                  Circular Food Innovation
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#5C4B42]">
              Mengubah residu ampas kelapa dari industri santan menjadi tepung
              kelapa bernutrisi tinggi, camilan sehat berbahan kelapa, serta
              ekosistem digital berkelanjutan bagi pemasok lokal.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3B5B3D]/25 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#3B5B3D]">
              <Leaf className="h-3.5 w-3.5" />
              Zero Coconut Residue Wasted
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
              Navigasi
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
                  href="/ecosystem"
                  className="transition hover:text-[#2C1E18]"
                >
                  Recipe &amp; CORABlend AI
                </Link>
              </li>
              <li>
                <Link
                  href="/ecosystem#pickup"
                  className="transition hover:text-[#2C1E18]"
                >
                  Coconut Pickup
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="transition hover:text-[#2C1E18]"
                >
                  Cek Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
              Hubungi Kami
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#5C4B42]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3B5B3D]" />
                <span>Jl. Inovasi Sirkular No. 18, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#3B5B3D]" />
                <span>hello@coracircular.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#3B5B3D]" />
                <span>+62 812-8800-2026</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#E5DEC9] pt-6 text-xs text-[#6E5C52] sm:flex-row sm:items-center">
          <p>&copy; 2026 PT CORA Circular Innovation. All rights reserved.</p>
          <Link
            href="/admin"
            className="font-medium text-[#3B5B3D] hover:underline"
          >
            Admin Operations Portal
          </Link>
        </div>
      </div>

      {/* Organic Green Leaf SVG Accent at Bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
        >
          {/* Soft sage foliage wave */}
          <path
            d="M0 100 L0 68 Q180 42 360 68 T720 62 T1080 68 T1440 58 L1440 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.14"
          />
          {/* Left organic leaf cluster */}
          <path
            d="M40 100 C55 62 95 45 125 60 C105 84 72 96 40 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.45"
          />
          <path
            d="M110 100 C135 72 175 64 200 78 C178 92 145 100 110 100 Z"
            fill="#4E9A34"
            fillOpacity="0.35"
          />
          <path
            d="M235 100 C252 68 288 58 312 72 C292 90 264 98 235 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.32"
          />
          {/* Center organic leaf cluster */}
          <path
            d="M580 100 C602 64 645 50 676 66 C650 88 616 98 580 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.4"
          />
          <path
            d="M665 100 C680 70 715 58 742 70 C724 88 696 98 665 100 Z"
            fill="#4E9A34"
            fillOpacity="0.32"
          />
          <path
            d="M785 100 C808 66 848 56 878 72 C852 90 818 98 785 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.35"
          />
          {/* Right organic leaf cluster */}
          <path
            d="M1120 100 C1145 64 1188 52 1218 68 C1192 88 1156 98 1120 100 Z"
            fill="#4E9A34"
            fillOpacity="0.34"
          />
          <path
            d="M1230 100 C1255 60 1300 44 1334 62 C1306 86 1268 98 1230 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.46"
          />
          <path
            d="M1345 100 C1368 70 1408 58 1435 72 C1412 90 1378 98 1345 100 Z"
            fill="#3B5B3D"
            fillOpacity="0.38"
          />
        </svg>
      </div>
    </footer>
  );
}

