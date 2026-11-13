'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Globe2,
  Handshake,
  Laptop,
  Leaf,
  Package,
  Recycle,
  Scale,
  ShoppingBag,
  Sparkles,
  Sprout,
  TrendingUp,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { useCora } from '@/context/CoraContext';
import type { Product } from '@/types/cora';

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
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
    <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-stone-900/90 shadow-md ring-1 ring-white/10 transform-gpu transition-[border-color,box-shadow] duration-300 hover:border-white/35 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src="/images/hero/hero.jpg"
          alt="CORA Circular Food Product Showcase - Coconut Flour, Brownies, and Cookies"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/20" />

        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#3B5B3D] shadow-sm">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            100% Upcycled Flour
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-sm">
            Residue to Value
          </span>
        </div>

        <div className="absolute right-4 bottom-4 left-4 sm:right-5 sm:bottom-5 sm:left-5 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-2.5 sm:px-5 sm:py-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#3B5B3D] text-white">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#2C1E18]">
                CORA Signature Collection
              </p>
              <p className="text-[10px] sm:text-xs font-medium text-[#6E5C52]">
                Flour • Brownies • Cookies
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
          >
            Explore
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function JourneyCircleVisual({ step }: { step: number }) {
  if (step === 1) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-full bg-[#EDE9DF] p-0.5 ring-2 ring-[#3B5B3D]/25 shadow-inner">
        <Image
          src="/images/ingredients/coconut.jpg"
          alt="Fresh Coconut Residue"
          fill
          sizes="96px"
          className="rounded-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#EAE4D5] to-[#D5C9B5] text-[#4A5D3F] ring-2 ring-[#3B5B3D]/25">
        <svg
          viewBox="0 0 48 48"
          className="h-10 w-10 transition-transform duration-500 hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 24 C14 20 18 20 20 24 C22 28 26 28 28 24 C30 20 34 20 36 24" />
          <path d="M12 18 C14 14 18 14 20 18 C22 22 26 22 28 18 C30 14 34 14 36 18" />
          <path d="M12 30 C14 26 18 26 20 30 C22 34 26 34 28 30 C30 26 34 26 36 30" />
        </svg>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-full bg-[#EDE9DF] p-0.5 ring-2 ring-[#3B5B3D]/25 shadow-inner">
        <Image
          src="/images/ingredients/coconut-flour.jpg"
          alt="Fine Coconut Flour Bowl"
          fill
          sizes="96px"
          className="rounded-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-full bg-[#EDE9DF] p-0.5 ring-2 ring-[#3B5B3D]/25 shadow-inner">
        <Image
          src="/images/journey/brownies.jpg"
          alt="Artisanal Brownies Product"
          fill
          sizes="96px"
          className="rounded-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#E6EFE3] to-[#D5E5D0] text-[#3B5B3D] ring-2 ring-[#3B5B3D]/25">
      <Laptop className="h-10 w-10 transition-transform duration-500 hover:scale-110" />
    </div>
  );
}

export default function HomePage() {
  const { products, orders, suppliers, pickupRequests, addToCart, impactSettings } = useCora();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const impactStats = useMemo(() => {
    if (impactSettings?.useCustomStats) {
      return {
        totalKgFromTransactions: String(impactSettings.customResidueKg),
        verifiedOrderCount: orders.filter(
          (o) =>
            o.status === 'PROCESSING' ||
            o.status === 'SHIPPED' ||
            o.status === 'COMPLETED'
        ).length,
        totalResidueUtilizedKg: String(impactSettings.customResidueKg),
        totalFlourProducedKg: String(impactSettings.customFlourKg),
        supplierCount: impactSettings.customSuppliersCount,
        totalProductsMarketed: impactSettings.customProductsMarketed,
      };
    }

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

    const completedPickupKg = pickupRequests
      .filter((req) => req.status === 'COMPLETED')
      .reduce((sum, req) => sum + req.estimatedKg, 0);

    const totalResidueUtilizedKg = (
      completedPickupKg +
      totalGramsFromOrders / 1000
    ).toFixed(1);

    const totalFlourProducedKg = (
      (completedPickupKg + totalGramsFromOrders / 1000) *
      0.45
    ).toFixed(1);

    const totalProductsMarketed = verifiedOrders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.qty, 0),
      0
    );

    return {
      totalKgFromTransactions: (totalGramsFromOrders / 1000).toFixed(2),
      verifiedOrderCount: verifiedOrders.length,
      totalResidueUtilizedKg,
      totalFlourProducedKg,
      supplierCount: suppliers.length,
      totalProductsMarketed,
    };
  }, [orders, products, suppliers, pickupRequests, impactSettings]);

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
        {/* 1. HERO SECTION WITH NATURAL COCONUT BG & DARK GRADIENT OVERLAY */}
        <section className="relative overflow-hidden bg-[#121B13] text-[#FAF8F5]">
          <div className="pointer-events-none absolute inset-0 z-0 select-none transform-gpu">
            <Image
              src="/images/hero/hero.jpg"
              alt="Natural raw coconut background"
              fill
              priority
              className="object-cover object-center brightness-35 contrast-100"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/25"
            aria-hidden="true"
          />

          <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-12 lg:px-16 xl:px-20 pt-16 pb-24 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
              <div className="w-full lg:col-span-6 space-y-6">
                <div
                  className="animate-cora-fade-up flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#86C975]"
                  style={{ animationDelay: '0ms' }}
                >
                  <span className="h-[2px] w-7 bg-[#86C975]" />
                  <span>From Coconut Residue To A Brighter Tomorrow</span>
                </div>

                <h1
                  className="animate-cora-fade-up font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[#FAF8F5] sm:text-5xl lg:text-[52px] xl:text-[56px] drop-shadow-sm"
                  style={{ animationDelay: '90ms' }}
                >
                  Turning Coconut Residues into New Possibilities
                </h1>

                <p
                  className="animate-cora-fade-up max-w-xl text-base leading-relaxed text-[#E2DACF] sm:text-[17px]"
                  style={{ animationDelay: '170ms' }}
                >
                  Upcycling coconut milk residue into nutrient-rich coconut flour,
                  artisanal cookies, and brownies that power a circular economy
                  for local coconut suppliers.
                </p>

                <div
                  className="animate-cora-fade-up flex flex-wrap items-center gap-4 pt-2"
                  style={{ animationDelay: '240ms' }}
                >
                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-[#4E9A34] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-transform duration-300 hover:bg-[#43882C] hover:shadow-md hover:-translate-y-0.5"
                  >
                    Explore Our Products
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/#impact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-6 py-3.5 text-sm font-semibold text-[#FAF8F5] transition-transform duration-300 hover:border-white/70 hover:bg-white/25 hover:-translate-y-0.5"
                  >
                    View Circular Impact
                  </Link>
                </div>
              </div>

              <div
                className="animate-cora-fade-up w-full lg:col-span-6 lg:pt-10 transform-gpu"
                style={{ animationDelay: '140ms' }}
              >
                <HeroProductShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* 2. 4 PILLARS FLOATING BAR (OVERLAPPING ON TOP OF HERO) */}
        <section
          aria-label="CORA Innovation Pillars"
          className="relative z-30 -mt-10 sm:-mt-14 lg:-mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transform-gpu"
        >
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-md transform-gpu">
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

        {/* 3. OUR JOURNEY: FROM WASTE TO VALUE & CIRCULAR IMPACT */}
        <section
          id="impact"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 space-y-16"
        >
          {/* A. Journey Diagram */}
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4 space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                  Our Journey
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold leading-[1.15] tracking-tight text-[#2C1E18] sm:text-4xl">
                  From Waste to Value
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-[#5C4B42] sm:text-[15px]">
                Coconut milk production generates large amounts of coconut
                residue that often goes to waste. CORA hygienically dries,
                mills, and crafts it into high-fiber flour and delicious snacks
                supported by a digital platform.
              </p>

              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#3B5B3D]">
                    <Leaf className="h-3.5 w-3.5" />
                    Residue Saved
                  </span>
                  <span className="text-xs font-medium tabular-nums text-[#6E5C52]">
                    {impactStats.verifiedOrderCount} verified orders
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="font-serif text-3xl font-semibold tracking-tight tabular-nums text-[#2C1E18]">
                    {impactStats.totalKgFromTransactions} kg
                  </span>
                  <span className="text-xs font-medium text-[#6E5C52]">
                    coconut residue upcycled
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#6E5C52]">
                  Calculated dynamically from verified transactions across the
                  CORA ecosystem.
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

          {/* B. THREE PILLARS OF OUR IMPACT */}
          <div className="border-t border-[#E5DEC9] pt-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                Our Commitment
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C1E18]">
                Three Pillars of CORA Impact
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5C52]">
                Menciptakan ekosistem berkelanjutan dari hulu ke hilir yang menyeimbangkan lingkungan, ekonomi lokal, dan kesejahteraan masyarakat.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Environmental Impact */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                      <Sprout className="h-5 w-5" />
                    </span>
                    <h4 className="text-base font-bold text-[#2C1E18]">
                      Environmental Impact
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#5C4B42]">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Mengurangi limbah ampas kelapa dari produksi santan harian.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Mengoptimalkan pemanfaatan hasil samping pengolahan kelapa menjadi produk bernilai pangan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Mendukung konsep zero waste dan ekonomi sirkular ramah bumi.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-[#F0EAE0] text-[11px] font-semibold text-[#3B5B3D]">
                  Zero Waste Food Solution
                </div>
              </div>

              {/* 2. Economic Impact */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4E9A34]/15 text-[#4E9A34]">
                      <TrendingUp className="h-5 w-5" />
                    </span>
                    <h4 className="text-base font-bold text-[#2C1E18]">
                      Economic Impact
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#5C4B42]">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Memberikan nilai tambah pada ampas kelapa yang semula tidak bernilai.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Membuka peluang usaha inovatif dari produk olahan kelapa (tepung, brownies, cookies).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Menciptakan nilai ekonomi dan pendapatan tambahan bagi pemasok kelapa lokal.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-[#F0EAE0] text-[11px] font-semibold text-[#3B5B3D]">
                  Residue to High-Value Asset
                </div>
              </div>

              {/* 3. Social Impact */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6E5C52]/15 text-[#6E5C52]">
                      <Handshake className="h-5 w-5" />
                    </span>
                    <h4 className="text-base font-bold text-[#2C1E18]">
                      Social Impact
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#5C4B42]">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Memberdayakan petani, UMKM, dan pedagang kelapa parut lokal.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Membuka peluang kemitraan penjemputan berkala yang teratur.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span>Mendorong keterlibatan aktif masyarakat dalam pengelolaan limbah pangan.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-[#F0EAE0] text-[11px] font-semibold text-[#3B5B3D]">
                  Community Empowerment
                </div>
              </div>
            </div>
          </div>

          {/* C. OUR IMPACT STATISTICS */}
          <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5DEC9]/80 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#3B5B3D]">
                  Real-time Indicators
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#2C1E18]">
                  Our Impact Statistics
                </h4>
              </div>
              <p className="text-[11px] text-[#8A776C] italic">
                {impactSettings?.impactNote || '*Catatan: angka menggunakan data aktual setelah operasional berjalan.'}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(impactSettings?.indicators && impactSettings.indicators.length > 0
                ? impactSettings.indicators
                : [
                    {
                      id: 'stat-residue',
                      label: 'Ampas Dimanfaatkan',
                      value: impactStats.totalResidueUtilizedKg,
                      unit: 'kg',
                      description: 'Total ampas kelapa berhasil dimanfaatkan',
                    },
                    {
                      id: 'stat-flour',
                      label: 'Tepung Diproduksi',
                      value: impactStats.totalFlourProducedKg,
                      unit: 'kg',
                      description: 'Total tepung kelapa yang diproduksi',
                    },
                    {
                      id: 'stat-supplier',
                      label: 'Mitra Pemasok',
                      value: String(impactStats.supplierCount),
                      unit: 'mitra',
                      description: 'Jumlah mitra pemasok kelapa',
                    },
                    {
                      id: 'stat-product',
                      label: 'Produk Dipasarkan',
                      value: String(impactStats.totalProductsMarketed),
                      unit: 'pcs',
                      description: 'Jumlah produk yang berhasil dipasarkan',
                    },
                  ]
              ).map((item) => {
                let displayVal = item.value;
                if (!impactSettings?.useCustomStats) {
                  if (item.id === 'stat-residue') displayVal = impactStats.totalResidueUtilizedKg;
                  else if (item.id === 'stat-flour') displayVal = impactStats.totalFlourProducedKg;
                  else if (item.id === 'stat-supplier') displayVal = String(impactStats.supplierCount);
                  else if (item.id === 'stat-product') displayVal = String(impactStats.totalProductsMarketed);
                }

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#FAF8F5] p-5 border border-[#E5DEC9]/80 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#3B5B3D]">
                      {item.id.includes('residue') || item.id.includes('ampas') ? (
                        <Scale className="h-4 w-4" />
                      ) : item.id.includes('flour') || item.id.includes('tepung') ? (
                        <Package className="h-4 w-4" />
                      ) : item.id.includes('supplier') || item.id.includes('mitra') ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <ShoppingBag className="h-4 w-4" />
                      )}
                      <span>{item.label}</span>
                    </div>
                    <p className="mt-3 font-serif text-3xl font-bold tabular-nums text-[#2C1E18]">
                      {displayVal}{' '}
                      <span className="text-sm font-sans font-medium text-[#6E5C52]">
                        {item.unit}
                      </span>
                    </p>
                    <p className="mt-1 text-[11px] text-[#8A776C]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* D. OUR SUSTAINABILITY GOALS (SDGs) */}
          <div className="rounded-3xl bg-[#1A261C] text-[#FAF8F5] p-6 sm:p-10">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#86C975]">
                <Globe2 className="h-3.5 w-3.5" />
                Global Sustainability Framework
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Our Sustainability Goals
              </h4>
              <p className="text-xs sm:text-sm text-[#D6CEBF] leading-relaxed">
                Inovasi produk dan operasional CORA secara nyata mendukung agenda Tujuan Pembangunan Berkelanjutan (SDGs):
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#BF8B2E] font-bold text-white text-sm">
                    12
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#EAD092]">SDGs 12</p>
                    <h5 className="text-sm font-bold text-white">Responsible Consumption &amp; Production</h5>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#D6CEBF]">
                  Mendukung efisiensi sumber daya dan pengurangan limbah pangan (food waste) melalui pengolahan ampas kelapa secara higienis menjadi tepung fungsional.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A21942] font-bold text-white text-sm">
                    8
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#F294AE]">SDGs 8</p>
                    <h5 className="text-sm font-bold text-white">Decent Work &amp; Economic Growth</h5>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#D6CEBF]">
                  Memberdayakan para pemasok kelapa lokal dan pelaku UMKM dengan membuka sumber pendapatan baru melalui kemitraan sirkular yang adil.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3F7E44] font-bold text-white text-sm">
                    13
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#98D89C]">SDGs 13</p>
                    <h5 className="text-sm font-bold text-white">Climate Action</h5>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#D6CEBF]">
                  Menurunkan jejak karbon dan gas rumah kaca metana yang umumnya dihasilkan dari pembusukan ampas kelapa basah di tempat pembuangan akhir (TPA).
                </p>
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
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#2C1E18] sm:text-4xl">
                    Featured CORA Products
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-[#6E5C52] sm:text-[15px]">
                    Every purchase directly reduces coconut residue waste while
                    empowering local coconut suppliers.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 self-start rounded-full border border-[#DDD4C1] bg-white px-5 py-2.5 text-xs font-semibold text-[#2C1E18] transition hover:border-[#3B5B3D] hover:text-[#3B5B3D] sm:self-auto"
                >
                  View All Products
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
                              {outOfStock ? 'Out of Stock' : `Stock ${product.stock}`}
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
                                  Added
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  Add to Cart
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
                                View
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
