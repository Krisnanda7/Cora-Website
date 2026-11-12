'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Leaf,
  PackageCheck,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { useCora } from '@/context/CoraContext';
import type { Product, ProductCategory } from '@/types/cora';

type FilterCategory = 'ALL' | ProductCategory;

const CATEGORY_TABS: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Brownies', value: 'Brownies' },
  { label: 'Cookies', value: 'Cookies' },
  { label: 'Coconut Flour', value: 'Flour' },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductsPage() {
  const { products, cartCount, cartTotal, addToCart } = useCora();
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;
      return (
        product.name.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === product.id ? null : curr));
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1">
        {/* Top Minimalist Store Header */}
        <section className="border-b border-[#E5DEC9]/80 bg-[#EFECE3]/60">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="animate-cora-fade-up flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl space-y-2.5">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#3B5B3D]">
                  <Leaf className="h-3.5 w-3.5" />
                  Circular F&amp;B Collection
                </span>
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2C1E18] sm:text-4xl lg:text-5xl">
                  CORA Product Catalog
                </h1>
                <p className="text-sm leading-relaxed text-[#6E5C52] sm:text-base">
                  Discover artisanal chocolate treats and nutrient-rich upcycled
                  coconut flour crafted from rescued coconut residue.
                </p>
              </div>

              {cartCount > 0 && (
                <div className="flex items-center gap-3 self-start rounded-2xl border border-[#E5DEC9] bg-white px-4 py-3 shadow-2xs md:self-auto">
                  <div>
                    <p className="text-[11px] font-medium tabular-nums text-[#6E5C52]">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
                    </p>
                    <p className="text-sm font-bold tabular-nums text-[#2C1E18]">
                      {formatRupiah(cartTotal)}
                    </p>
                  </div>
                  <Link
                    href="/checkout"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                  >
                    Checkout
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Category Filter & Search Controls */}
            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Category Tabs */}
              <div
                className="flex flex-wrap items-center gap-2"
                role="tablist"
                aria-label="Filter product category"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = selectedCategory === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(tab.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-[#2C1E18] text-[#FAF8F5] shadow-xs'
                          : 'bg-white text-[#5C4B42] shadow-2xs hover:bg-[#E6E3D8]/70 hover:text-[#2C1E18]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A776C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brownies, cookies, flour..."
                  aria-label="Search CORA products"
                  className="w-full rounded-full bg-white py-2.5 pr-9 pl-10 text-sm text-[#2C1E18] placeholder-[#8A776C] shadow-xs ring-1 ring-[#E5DEC9]/80 transition focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[#8A776C] hover:bg-[#E6E3D8] hover:text-[#2C1E18]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-[#E5DEC9] bg-white px-6 py-16 text-center shadow-2xs">
              <PackageCheck className="mx-auto h-10 w-10 text-[#3B5B3D]/60" />
              <h2 className="mt-4 font-serif text-xl font-bold text-[#2C1E18]">
                No products found
              </h2>
              <p className="mt-1.5 text-sm text-[#6E5C52]">
                Try adjusting your search keywords or selecting a different
                category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="mt-5 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2F4A31]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, idx) => {
                const isAdded = addedId === product.id;
                const isOutOfStock = product.stock <= 0;

                return (
                  <Reveal key={product.id} delayMs={idx * 60}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5DEC9]/80 bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#CFC5B1] hover:shadow-md">
                      {/* Packaging Image */}
                      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#F0EAE0] bg-[#F5F1EA] p-5">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                        <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
                          <Leaf className="h-3 w-3" />
                          Saves {product.residueSavedGram}g Coconut Residue
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#3B5B3D]">
                            <span>
                              {product.category === 'Flour'
                                ? 'Coconut Flour'
                                : product.category}
                            </span>
                            <span className="text-[#8A776C]">
                              {product.weightGram}g
                            </span>
                          </div>

                          <h2 className="mt-1.5 text-lg font-bold leading-snug text-[#2C1E18]">
                            {product.name}
                          </h2>
                          <p className="mt-0.5 text-xs font-medium text-[#7A675D]">
                            {product.subtitle}
                          </p>
                          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#6E5C52]">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-6 border-t border-[#F0EAE0] pt-4">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xl font-bold tabular-nums text-[#2C1E18]">
                              {formatRupiah(product.price)}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                                isOutOfStock
                                  ? 'bg-red-50 text-red-600'
                                  : product.stock <= 10
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-[#3B5B3D]/10 text-[#3B5B3D]'
                              }`}
                            >
                              {isOutOfStock
                                ? 'Out of Stock'
                                : `Stock left: ${product.stock}`}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isOutOfStock}
                              onClick={() => handleAddToCart(product)}
                              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                                isAdded
                                  ? 'bg-[#4E9A34] text-white'
                                  : 'bg-[#3B5B3D] text-white hover:bg-[#2F4A31] disabled:cursor-not-allowed disabled:bg-[#D5CCC0]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Added!
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-4 w-4" />
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
                                className="rounded-full bg-[#E6E3D8] px-3.5 py-2.5 text-xs font-semibold text-[#2C1E18] transition hover:bg-[#D8D3C4]"
                              >
                                Cart
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
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
