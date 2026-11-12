'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Laptop,
  Leaf,
  Recycle,
  ShoppingBag,
  Sprout,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { useCora } from '@/context/CoraContext';
import type { Product } from '@/types/cora';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const PILLARS = [
  {
    index: '01',
    title: 'Food Innovation',
    description:
      'Transforming coconut residues into alternative food ingredients',
    icon: Sprout,
  },
  {
    index: '02',
    title: 'Circular Economy',
    description: 'Giving value to what is often wasted',
    icon: Recycle,
  },
  {
    index: '03',
    title: 'Community Empowerment',
    description: 'Creating opportunities for local coconut suppliers',
    icon: Users,
  },
  {
    index: '04',
    title: 'Digital Solution',
    description: 'AI recipes, marketplace, and residue pickup system',
    icon: Laptop,
  },
] as const;

const JOURNEY_STEPS = [
  {
    step: 1,
    title: 'Coconut Residue',
    description: 'By-product from coconut milk production',
  },
  {
    step: 2,
    title: 'Drying Process',
    description: 'Hygienic and controlled drying to reduce moisture',
  },
  {
    step: 3,
    title: 'Coconut Flour',
    description: 'Milled into fine, nutrient-rich flour',
  },
  {
    step: 4,
    title: 'Food Product',
    description: 'Applied in various recipes such as cookies and brownies',
  },
  {
    step: 5,
    title: 'Digital Platform',
    description: 'AI recipes, marketplace, and coconut pickup system',
  },
] as const;

function HeroProductShowcase() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#3B5B3D]/20 bg-[#4A5F3D] shadow-xl">
      {/* Studio light vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5C744D]/75 via-transparent to-[#2D3E25]/75"
        aria-hidden="true"
      />

      {/* Subtle corner botanical silhouette */}
      <svg
        viewBox="0 0 180 180"
        className="pointer-events-none absolute -top-4 -right-4 h-36 w-36 text-[#FAF8F5]/12"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M160 15C118 25 90 52 80 92C118 82 148 56 160 15Z" />
        <path d="M135 65C95 75 68 100 58 138C96 128 124 102 135 65Z" />
        <path d="M98 18C72 34 56 58 54 88C78 72 94 48 98 18Z" />
      </svg>

      {/* Studio Products Stage */}
      <div className="relative px-4 pt-10 pb-2 sm:px-8 sm:pt-12">
        <div className="mx-auto flex max-w-lg items-end justify-center gap-2.5 sm:gap-4">
          {/* 1. CORA Cookies Pouch */}
          <div className="relative z-10 w-[108px] shrink-0 -rotate-2 transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:rotate-0 sm:w-[132px]">
            <div className="overflow-hidden rounded-t-xl rounded-b-lg border border-[#D8CBB8] bg-gradient-to-b from-[#FBF7F0] to-[#EDE3D4] p-2.5 shadow-lg">
              <div className="mx-auto mb-1.5 h-1.5 w-10 rounded-full bg-[#C9B9A4]/60" />
              <div className="rounded-lg border border-[#E5DEC9] bg-white/90 px-2 py-2.5 text-center">
                <p className="font-serif text-[11px] font-semibold tracking-wider text-[#2C1E18] sm:text-xs">
                  CORA
                </p>
                <p className="text-[10px] font-bold tracking-[0.08em] text-[#3B5B3D] sm:text-[11px]">
                  COOKIES
                </p>
                <p className="mt-0.5 text-[7px] font-medium text-[#6E5C52]">
                  Coconut Based Cookies
                </p>
                <div className="mt-2 flex items-center justify-center">
                  <div className="relative h-9 w-9 rounded-full bg-[#B97B48] shadow-inner sm:h-11 sm:w-11">
                    <span className="absolute top-2 left-2.5 h-1.5 w-1.5 rounded-full bg-[#3A2218]" />
                    <span className="absolute top-4 right-2.5 h-1.5 w-1.5 rounded-full bg-[#3A2218]" />
                    <span className="absolute bottom-2 left-4 h-1.5 w-1.5 rounded-full bg-[#3A2218]" />
                  </div>
                </div>
              </div>
              <div className="mt-2 h-2 rounded-b bg-[#6E4730]/80" />
            </div>
          </div>

          {/* 2. CORA Brownies Box - Cream Motif Choco-Dots */}
          <div className="relative z-20 w-[138px] shrink-0 transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 sm:w-[168px]">
            <div
              className="relative overflow-hidden rounded-xl border border-[#DFD4C3] bg-[#FAF5EC] p-3 shadow-2xl sm:p-3.5"
              style={{
                backgroundImage:
                  'radial-gradient(#5C3826 1.8px, transparent 1.8px), radial-gradient(#84563E 1.4px, transparent 1.4px)',
                backgroundSize: '18px 18px',
                backgroundPosition: '0 0, 9px 9px',
              }}
            >
              <div className="rounded-lg border border-[#E5DEC9] bg-[#FAF8F5]/95 px-2.5 py-4 text-center shadow-2xs sm:py-5">
                <span className="inline-block text-[8px] font-bold uppercase tracking-[0.14em] text-[#3B5B3D]">
                  Upcycled Craft
                </span>
                <p className="mt-1.5 font-serif text-base font-semibold tracking-tight text-[#2C1E18] sm:text-lg">
                  CORA
                </p>
                <p className="text-xs font-bold tracking-[0.08em] text-[#3B5B3D] sm:text-sm">
                  BROWNIES
                </p>
                <p className="mt-1 text-[8px] font-medium text-[#6E5C52] sm:text-[9px]">
                  Coconut Based Brownies
                </p>
                <div className="mt-2.5 flex justify-center gap-1">
                  <span className="h-5 w-5 rounded bg-[#4A2C1D]" />
                  <span className="h-5 w-5 rounded bg-[#3A2116]" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. CORA Upcycled Coconut Flour - Kemasan Biru Langit */}
          <div className="relative z-10 w-[106px] shrink-0 rotate-2 transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:rotate-0 sm:w-[128px]">
            <div className="overflow-hidden rounded-t-xl rounded-b-lg border border-[#9CCBE8] bg-gradient-to-b from-[#6CC4F0] via-[#A9DDF7] to-[#EDE2CE] p-2.5 shadow-lg">
              <div className="mx-auto mb-1.5 h-1.5 w-10 rounded-full bg-white/70" />
              <div className="rounded-lg bg-white/45 px-1.5 py-2 text-center backdrop-blur-[2px]">
                <p className="font-serif text-xs font-semibold tracking-wide text-[#184B6E] sm:text-sm">
                  CORA
                </p>
                <p className="mt-0.5 text-[8px] font-bold leading-tight text-[#1E3B4D] sm:text-[9px]">
                  Upcycled Coconut Flour
                </p>
              </div>
              <div className="mt-2 flex items-end justify-center gap-1.5 pb-1">
                <div className="relative h-8 w-8 rounded-full border-2 border-[#4B2D1E] bg-[#FAF8F5] shadow-sm sm:h-9 sm:w-9">
                  <div className="absolute inset-1.5 rounded-full bg-[#E6E3D8]" />
                </div>
                <div className="h-6 w-7 rounded-t-md bg-[#D6BC9B] shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wooden Shelf / Rak Kayu */}
      <div className="relative z-30">
        <div
          className="h-5 w-full border-t border-[#E0C7A4]/60 bg-gradient-to-b from-[#D7BC95] via-[#C3A378] to-[#9E7D54]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(120,82,45,0.08) 0px, rgba(120,82,45,0.08) 28px, transparent 28px, transparent 56px)',
          }}
        />
        <div className="h-3 w-full bg-[#7A5B3A] shadow-inner" />
      </div>
    </div>
  );
}

function JourneyCircleVisual({ step }: { step: number }) {
  if (step === 1) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill="#EDE9DF" />
        <circle cx="60" cy="60" r="46" fill="#C7BEB1" />
        <circle cx="60" cy="60" r="41" fill="#FAF8F5" />
        <g fill="#E8E3DA">
          <circle cx="48" cy="50" r="7" />
          <circle cx="66" cy="44" r="8" />
          <circle cx="74" cy="60" r="7" />
          <circle cx="58" cy="68" r="9" />
          <circle cx="44" cy="66" r="6" />
        </g>
        <g fill="#FFFFFF">
          <circle cx="54" cy="55" r="6" />
          <circle cx="68" cy="53" r="5" />
          <circle cx="60" cy="61" r="6" />
          <circle cx="50" cy="62" r="4" />
        </g>
      </svg>
    );
  }

  if (step === 2) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill="#EDE9DF" />
        <circle cx="60" cy="60" r="46" fill="#BFA98B" />
        <circle cx="60" cy="60" r="41" fill="#F2E7D5" />
        <g fill="#E3CEAE">
          <circle cx="48" cy="48" r="6" />
          <circle cx="66" cy="46" r="7" />
          <circle cx="74" cy="62" r="6" />
          <circle cx="57" cy="70" r="8" />
          <circle cx="44" cy="64" r="6" />
        </g>
        <path
          d="M42 32C44 26 40 22 43 17M60 30C62 24 58 20 61 15M78 32C80 26 76 22 79 17"
          stroke="#4E9A34"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (step === 3) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill="#EDE9DF" />
        <circle cx="60" cy="60" r="46" fill="#8C6B4F" />
        <circle cx="60" cy="60" r="41" fill="#E5CBA4" />
        <ellipse cx="60" cy="62" rx="28" ry="22" fill="#F0DAB7" />
        <ellipse cx="60" cy="58" rx="18" ry="13" fill="#F6E5CA" />
      </svg>
    );
  }

  if (step === 4) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill="#EDE9DF" />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="#FFFFFF"
          stroke="#D9D0C1"
          strokeWidth="2"
        />
        <rect x="33" y="34" width="32" height="28" rx="5" fill="#4A2C1D" />
        <rect x="37" y="38" width="24" height="20" rx="3" fill="#5D3725" />
        <circle cx="72" cy="56" r="16" fill="#B87744" />
        <circle cx="52" cy="74" r="15" fill="#C6844F" />
        <circle cx="68" cy="52" r="2.2" fill="#3A2116" />
        <circle cx="77" cy="60" r="2.2" fill="#3A2116" />
        <circle cx="48" cy="71" r="2.2" fill="#3A2116" />
        <circle cx="56" cy="78" r="2.2" fill="#3A2116" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="#EDE9DF" />
      <rect x="24" y="32" width="72" height="46" rx="6" fill="#2C1E18" />
      <rect x="28" y="36" width="64" height="38" rx="3" fill="#FAF8F5" />
      <rect x="28" y="36" width="64" height="12" rx="2" fill="#3B5B3D" />
      <rect x="33" y="52" width="24" height="16" rx="2" fill="#E6E3D8" />
      <rect
        x="61"
        y="52"
        width="26"
        height="6"
        rx="2"
        fill="#4E9A34"
        fillOpacity="0.65"
      />
      <rect x="61" y="61" width="20" height="6" rx="2" fill="#C7BEB1" />
      <path d="M16 80H104L98 87H22L16 80Z" fill="#8E8478" />
    </svg>
  );
}

export default function HomePage() {
  const { products, orders, addToCart } = useCora();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const impactStats = useMemo(() => {
    const productMap = new Map<string, Product>(
      products.map((p) => [p.id, p])
    );

    const verifiedOrders = orders.filter(
      (order) =>
        order.status === 'PROCESSING' ||
        order.status === 'SHIPPED' ||
        order.status === 'COMPLETED'
    );

    const totalGramsFromOrders = verifiedOrders.reduce((orderSum, order) => {
      const orderGrams = order.items.reduce((itemSum, item) => {
        const product = productMap.get(item.productId);
        const perUnitGram = product ? product.residueSavedGram : 250;
        return itemSum + perUnitGram * item.qty;
      }, 0);
      return orderSum + orderGrams;
    }, 0);

    return {
      totalKgFromTransactions: (totalGramsFromOrders / 1000).toFixed(2),
      verifiedOrderCount: verifiedOrders.length,
    };
  }, [orders, products]);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    window.setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#E5DEC9] bg-[#E6E3D8]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:py-24">
            {/* Hero Left */}
            <div className="lg:col-span-6 space-y-6">
              <div
                className="animate-cora-fade-up flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#3B5B3D]"
                style={{ animationDelay: '0ms' }}
              >
                <span className="h-[1.5px] w-7 bg-[#3B5B3D]" />
                <span>From Coconut Residue To A Brighter Tomorrow</span>
              </div>

              <h1
                className="animate-cora-fade-up font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-[#2C1E18] sm:text-5xl lg:text-[56px]"
                style={{ animationDelay: '90ms' }}
              >
                Turning Coconut Residues into New Possibilities
              </h1>

              <p
                className="animate-cora-fade-up max-w-xl text-base leading-relaxed text-[#54443B] sm:text-[17px]"
                style={{ animationDelay: '170ms' }}
              >
                Mengubah ampas santan kelapa menjadi tepung kelapa bernutrisi
                tinggi, cookies, dan brownies artisan yang menggerakkan ekonomi
                sirkular bagi pemasok kelapa lokal.
              </p>

              <div
                className="animate-cora-fade-up flex flex-wrap items-center gap-3.5 pt-2"
                style={{ animationDelay: '240ms' }}
              >
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#3B5B3D] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2F4A31]"
                >
                  Jelajahi Katalog Produk
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/#impact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2C1E18]/25 bg-transparent px-6 py-3.5 text-sm font-semibold text-[#2C1E18] transition hover:border-[#2C1E18] hover:bg-white/60"
                >
                  Lihat Dampak Sirkular
                </Link>
              </div>
            </div>

            {/* Hero Right */}
            <div
              className="animate-cora-fade-up lg:col-span-6"
              style={{ animationDelay: '140ms' }}
            >
              <HeroProductShowcase />
            </div>
          </div>
        </section>

        {/* 2. 4 PILLARS BAR */}
        <section
          aria-label="Pilar Inovasi CORA"
          className="relative z-10 -mt-7 px-4 sm:px-6 lg:px-8"
        >
          <Reveal>
            <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-xs">
              <div className="grid grid-cols-1 divide-y divide-[#E5DEC9] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                {PILLARS.map((pillar, index) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className={`group flex items-start gap-4 p-6 transition-colors duration-300 hover:bg-[#FAF8F5]/80 ${
                        index >= 2
                          ? 'sm:border-t sm:border-[#E5DEC9] lg:border-t-0'
                          : ''
                      } ${
                        index % 2 === 1
                          ? 'sm:border-l sm:border-[#E5DEC9] lg:border-l-0'
                          : ''
                      }`}
                    >
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-[#3B5B3D] transition-transform duration-300 group-hover:scale-110" />
                      <div>
                        <span className="block text-[10px] font-bold tracking-[0.16em] text-[#3B5B3D]/70 tabular-nums">
                          {pillar.index}
                        </span>
                        <h2 className="mt-0.5 text-sm font-bold tracking-tight text-[#2C1E18] sm:text-base">
                          {pillar.title}
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-[#6E5C52] sm:text-[13px]">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. OUR JOURNEY: FROM WASTE TO VALUE */}
        <section
          id="impact"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="grid items-start gap-12 lg:grid-cols-12">
            {/* Left Column */}
            <Reveal className="lg:col-span-4 space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                  Our Journey
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold leading-[1.15] tracking-[-0.015em] text-[#2C1E18] sm:text-4xl">
                  From Waste to Value
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-[#5C4B42] sm:text-[15px]">
                Produksi santan menghasilkan ampas kelapa dalam jumlah besar
                yang kerap terbuang. CORA mengeringkan, menggiling, dan
                mengolah ampas tersebut menjadi tepung kelapa berkualitas tinggi
                serta camilan lezat yang didukung platform digital.
              </p>

              {/* Dynamic Residue Saved Metric */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#3B5B3D]">
                    <Leaf className="h-3.5 w-3.5" />
                    Residu Terselamatkan
                  </span>
                  <span className="text-xs font-medium tabular-nums text-[#6E5C52]">
                    {impactStats.verifiedOrderCount} pesanan terverifikasi
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="font-serif text-3xl font-semibold tracking-tight tabular-nums text-[#2C1E18]">
                    {impactStats.totalKgFromTransactions} kg
                  </span>
                  <span className="text-xs font-medium text-[#6E5C52]">
                    ampas kelapa terolah
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#6E5C52]">
                  Terhitung otomatis dari transaksi terverifikasi di ekosistem
                  CORA.
                </p>
              </div>

              <div>
                <Link
                  href="/ecosystem"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-[#2C1E18] bg-transparent px-5 py-2.5 text-xs font-semibold tracking-wide text-[#2C1E18] transition-all duration-300 hover:bg-[#2C1E18] hover:text-[#FAF8F5] sm:text-sm"
                >
                  Learn More About Our Impact
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            {/* Right / Bottom: 5 Stages */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                {JOURNEY_STEPS.map((item, idx) => (
                  <Reveal key={item.step} delayMs={idx * 70}>
                    <div className="group flex h-full flex-col items-center rounded-2xl border border-[#E5DEC9] bg-white p-4 text-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#CFC5B1] hover:shadow-sm">
                      <div className="h-22 w-22 overflow-hidden rounded-full border border-[#E5DEC9] bg-[#FAF8F5] p-1 transition-transform duration-500 group-hover:scale-105">
                        <JourneyCircleVisual step={item.step} />
                      </div>

                      <div className="mt-4 flex flex-col items-center">
                        <span className="font-serif text-3xl font-semibold leading-none tabular-nums text-[#4E9A34]">
                          {item.step}
                        </span>
                        <h3 className="mt-2.5 text-sm font-bold tracking-tight text-[#2C1E18]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-[#6E5C52]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURED PRODUCT CATALOG PREVIEW */}
        <section className="border-t border-[#E5DEC9] bg-[#FAF8F5] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                    Circular Marketplace
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.015em] text-[#2C1E18] sm:text-4xl">
                    Produk Unggulan CORA
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-[#6E5C52] sm:text-[15px]">
                    Setiap pembelian berkontribusi langsung mengurangi limbah
                    ampas kelapa dan memberdayakan pemasok lokal.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 self-start rounded-full border border-[#DDD4C1] bg-white px-5 py-2.5 text-xs font-semibold text-[#2C1E18] transition hover:border-[#3B5B3D] hover:text-[#3B5B3D] sm:self-auto"
                >
                  Lihat Semua Produk
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, idx) => {
                const isAdded = addedProductId === product.id;
                const outOfStock = product.stock <= 0;

                return (
                  <Reveal key={product.id} delayMs={idx * 65}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#CFC5B1] hover:shadow-md">
                      <div className="relative aspect-square overflow-hidden border-b border-[#EFEAE0] bg-[#F5F1EA]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                        <span className="absolute top-3.5 left-3.5 rounded-full bg-[#3B5B3D] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#3B5B3D]">
                            <span className="inline-flex items-center gap-1">
                              <Leaf className="h-3 w-3" />
                              Saves {product.residueSavedGram}g residue
                            </span>
                            <span className="text-[#8A776C]">
                              {product.weightGram}g
                            </span>
                          </div>
                          <h3 className="mt-2 text-base font-bold leading-snug text-[#2C1E18]">
                            {product.name}
                          </h3>
                          <p className="mt-0.5 text-xs font-medium text-[#7A675D]">
                            {product.subtitle}
                          </p>
                          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#6E5C52]">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-5 border-t border-[#F0EAE0] pt-4">
                          <div className="flex items-baseline justify-between">
                            <span className="text-lg font-bold tabular-nums text-[#2C1E18]">
                              {formatRupiah(product.price)}
                            </span>
                            <span
                              className={`text-[11px] font-semibold tabular-nums ${
                                outOfStock ? 'text-red-600' : 'text-[#3B5B3D]'
                              }`}
                            >
                              {outOfStock ? 'Habis' : `Stok ${product.stock}`}
                            </span>
                          </div>

                          <div className="mt-3.5 flex items-center gap-2">
                            <button
                              type="button"
                              disabled={outOfStock}
                              onClick={() => handleQuickAdd(product)}
                              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                                isAdded
                                  ? 'bg-[#4E9A34] text-white'
                                  : 'bg-[#3B5B3D] text-white hover:bg-[#2F4A31] disabled:cursor-not-allowed disabled:bg-[#C7BEB1]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Ditambahkan
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  Tambah ke Keranjang
                                </>
                              )}
                            </button>
                            {isAdded && (
                              <button
                                type="button"
                                onClick={() =>
                                  window.dispatchEvent(
                                    new CustomEvent('cora:open-cart')
                                  )
                                }
                                className="rounded-full border border-[#3B5B3D]/30 bg-[#3B5B3D]/8 px-3 py-2.5 text-xs font-semibold text-[#3B5B3D] transition hover:bg-[#3B5B3D] hover:text-white"
                              >
                                Lihat
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
