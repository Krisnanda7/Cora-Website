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
  Sparkles,
  Sprout,
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
    <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/50 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-md transition-all duration-500 hover:border-white/35 hover:shadow-[0_25px_65px_rgba(0,0,0,0.6)]">
      {/* Real product photograph */}
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
        <Image
          src="/images/hero/hero.jpg"
          alt="CORA Circular Food Product Showcase - Coconut Flour, Brownies, and Cookies"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/20" />

        {/* Floating Product Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#3B5B3D] shadow-sm backdrop-blur-xs">
            <Sparkles className="h-3 w-3" />
            100% Upcycled Flour
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/95 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs">
            Residue to Value
          </span>
        </div>

        {/* Bottom Bar on photo */}
        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-2.5 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white">
              <Leaf className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-[#2C1E18]">
                CORA Signature Collection
              </p>
              <p className="text-[10px] font-medium text-[#6E5C52]">
                Flour • Brownies • Cookies
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#2F4A31]"
          >
            Explore
            <ArrowRight className="h-3 w-3" />
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
      <div className="relative h-full w-full overflow-hidden rounded-full bg-[#EDE9DF] p-0.5 ring-2 ring-[#3B5B3D]/25 shadow-inner">
        <Image
          src="/images/ingredients/coconut-flour.jpg"
          alt="Drying Process"
          fill
          sizes="96px"
          className="rounded-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-full bg-[#EDE9DF] p-0.5 ring-2 ring-[#3B5B3D]/25 shadow-inner">
        <Image
          src="/images/products/coconut.jpg"
          alt="CORA Coconut Flour"
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
          alt="CORA Food Products"
          fill
          sizes="96px"
          className="rounded-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
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
        {/* 1. HERO SECTION WITH NATURAL COCONUT BG & DARK GRADIENT OVERLAY */}
        <section className="relative overflow-hidden bg-[#121B13] text-[#FAF8F5]">
          {/* z-0: Minimalist & Natural Raw Coconut Background Image */}
          <div className="pointer-events-none absolute inset-0 z-0 select-none">
            <Image
              src="/images/hero/hero.jpg"
              alt="Natural raw coconut background"
              fill
              priority
              className="object-cover object-center brightness-35 contrast-100"
            />
          </div>

          {/* z-10: Dark gradient overlay on the left for maximum text contrast */}
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/25"
            aria-hidden="true"
          />

          {/* z-20: Content with generous responsive padding */}
          <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-16 lg:px-24 pt-16 pb-24 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-36">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Left Grid: 50%+ on desktop (lg:col-span-7), 100% on mobile */}
              <div className="w-full lg:col-span-7 space-y-6">
                <div
                  className="animate-cora-fade-up flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#86C975]"
                  style={{ animationDelay: '0ms' }}
                >
                  <span className="h-[2px] w-7 bg-[#86C975]" />
                  <span>From Coconut Residue To A Brighter Tomorrow</span>
                </div>

                <h1
                  className="animate-cora-fade-up font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-[#FAF8F5] sm:text-5xl lg:text-[56px] drop-shadow-sm"
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
                    className="group inline-flex items-center gap-2.5 rounded-full bg-[#4E9A34] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4E9A34]/30 transition-all duration-300 hover:bg-[#43882C] hover:shadow-xl hover:shadow-[#4E9A34]/40 hover:-translate-y-0.5"
                  >
                    Explore Our Products
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/#impact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-[#FAF8F5] backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/20 hover:-translate-y-0.5"
                  >
                    View Circular Impact
                  </Link>
                </div>
              </div>

              {/* Right Grid: Transparent Card "CORA Signature Collection" */}
              <div
                className="animate-cora-fade-up w-full lg:col-span-5"
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
          className="relative z-30 -mt-10 sm:-mt-14 lg:-mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-[0_16px_40px_-6px_rgba(0,0,0,0.14)]">
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
                Coconut milk production generates large amounts of coconut
                residue that often goes to waste. CORA hygienically dries,
                mills, and crafts it into high-fiber flour and delicious snacks
                supported by a digital platform.
              </p>

              {/* Dynamic Residue Saved Metric */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5">
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
