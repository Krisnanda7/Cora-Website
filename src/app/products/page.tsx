'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  Info,
  Leaf,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
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

  // Product Details Modal State
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [activeVariant, setActiveVariant] = useState<string>('');
  const [modalQty, setModalQty] = useState<number>(1);
  const [modalAddedFeedback, setModalAddedFeedback] = useState(false);

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

  const handleOpenDetailModal = (product: Product) => {
    setDetailProduct(product);
    setActiveVariant(product.variants?.[0] || 'Original');
    setModalQty(1);
    setModalAddedFeedback(false);
  };

  const handleAddToCart = (product: Product, variant?: string, qty = 1) => {
    addToCart(product, qty, variant);
    setAddedId(product.id);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === product.id ? null : curr));
    }, 1500);
  };

  const handleModalAddToCart = () => {
    if (!detailProduct || detailProduct.stock <= 0) return;
    addToCart(detailProduct, modalQty, activeVariant);
    setModalAddedFeedback(true);
    window.setTimeout(() => {
      setModalAddedFeedback(false);
    }, 1800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#121B13] text-[#FAF8F5]">
          <div className="pointer-events-none absolute inset-0 z-0 select-none">
            <Image
              src="/images/hero/hero.jpg"
              alt="Natural raw coconut background"
              fill
              priority
              className="object-cover object-center brightness-35 contrast-100"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/35"
            aria-hidden="true"
          />

          <div className="relative z-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="animate-cora-fade-up flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl space-y-2.5">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#86C975]">
                  <Leaf className="h-3.5 w-3.5" />
                  Circular F&amp;B Collection
                </span>
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#FAF8F5] sm:text-4xl lg:text-5xl drop-shadow-sm">
                  CORA Product Catalog
                </h1>
                <p className="text-sm leading-relaxed text-[#E2DACF] sm:text-base">
                  Discover artisanal chocolate treats and nutrient-rich upcycled
                  coconut flour crafted from rescued coconut residue.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold text-[#FAF8F5] backdrop-blur-md transition hover:bg-white/20"
                >
                  <Truck className="h-4 w-4 text-[#86C975]" />
                  <span>Lacak Pesanan</span>
                </Link>

                {cartCount > 0 && (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 shadow-md backdrop-blur-md">
                    <div>
                      <p className="text-[11px] font-medium tabular-nums text-[#E2DACF]">
                        {cartCount} item di keranjang
                      </p>
                      <p
                        suppressHydrationWarning
                        className="text-xs font-bold tabular-nums text-[#FAF8F5]"
                      >
                        {formatRupiah(cartTotal)}
                      </p>
                    </div>
                    <Link
                      href="/checkout"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#4E9A34] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3F8129]"
                    >
                      Checkout
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter & Search Controls */}
            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                          ? 'bg-[#4E9A34] text-white shadow-sm font-semibold'
                          : 'border border-white/25 bg-white/10 text-[#FAF8F5] backdrop-blur-xs hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#D2C8BC]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brownies, cookies, flour..."
                  aria-label="Search CORA products"
                  className="w-full rounded-full border border-white/25 bg-white/15 py-2.5 pr-9 pl-10 text-sm text-[#FAF8F5] placeholder-[#D2C8BC] shadow-xs backdrop-blur-md transition focus:border-white/60 focus:bg-white/25 focus:ring-2 focus:ring-[#86C975] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[#D2C8BC] hover:bg-white/20 hover:text-white"
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
                Tidak ada produk ditemukan
              </h2>
              <p className="mt-1.5 text-sm text-[#6E5C52]">
                Coba sesuaikan kata kunci pencarian atau pilih kategori lain.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="mt-5 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2F4A31]"
              >
                Reset Filter
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
                      {/* Packaging Image with Click to Detail */}
                      <div
                        onClick={() => handleOpenDetailModal(product)}
                        className="relative aspect-[4/3] overflow-hidden border-b border-[#F0EAE0] bg-[#F5F1EA] p-5 cursor-pointer"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                        <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
                          <Leaf className="h-3 w-3" />
                          Saves {product.residueSavedGram}g Residue
                        </span>

                        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-1.5 text-[#3B5B3D] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          <Eye className="h-4 w-4" />
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
                              {product.netWeight || `${product.weightGram}g`}
                            </span>
                          </div>

                          <h2
                            onClick={() => handleOpenDetailModal(product)}
                            className="mt-1.5 text-lg font-bold leading-snug text-[#2C1E18] cursor-pointer hover:text-[#3B5B3D] transition-colors"
                          >
                            {product.name}
                          </h2>
                          <p className="mt-0.5 text-xs font-medium text-[#7A675D]">
                            {product.subtitle}
                          </p>
                          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#6E5C52]">
                            {product.description}
                          </p>

                          {/* Quick Benefit Badge */}
                          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#3B5B3D] font-medium">
                            <Sparkles className="h-3 w-3 shrink-0" />
                            <span>100% Upcycled • Zero Waste</span>
                          </div>
                        </div>

                        <div className="mt-6 border-t border-[#F0EAE0] pt-4">
                          <div className="flex items-baseline justify-between gap-2">
                            <span
                              suppressHydrationWarning
                              className="text-xl font-bold tabular-nums text-[#2C1E18]"
                            >
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
                                ? 'Habis'
                                : `Stok: ${product.stock}`}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenDetailModal(product)}
                              className="rounded-full border border-[#D6CCBA] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#5C4B42] hover:bg-[#FAF8F5] transition"
                            >
                              Detail
                            </button>

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
                                  Ditambahkan!
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-4 w-4" />
                                  + Keranjang
                                </>
                              )}
                            </button>
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

        {/* PRODUCT BENEFITS CALLOUT SECTION */}
        <section className="border-t border-[#E5DEC9] bg-[#EFECE3]/60 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                Why Choose CORA
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E18]">
                Product Benefits &amp; Nutrition Values
              </h2>
              <p className="text-xs sm:text-sm text-[#6E5C52]">
                Setiap gigitan dan olahan produk CORA memberikan kebaikan untuk tubuh sekaligus menyelamatkan bumi.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white p-6 border border-[#E5DEC9] shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                  <Leaf className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-[#2C1E18] text-base">
                  Tepung Berbahan Ampas Kelapa
                </h3>
                <p className="mt-1.5 text-xs text-[#6E5C52] leading-relaxed">
                  Kaya serat pangan alami (dietary fiber), bebas gluten (gluten-free), dan memiliki indeks glikemik rendah yang aman untuk diet sehat.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 border border-[#E5DEC9] shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4E9A34]/15 text-[#4E9A34]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-[#2C1E18] text-base">
                  Optimalkan Hasil Samping Santan
                </h3>
                <p className="mt-1.5 text-xs text-[#6E5C52] leading-relaxed">
                  Mengubah residu parutan kelapa yang kerap dibuang menjadi bahan pangan premium higienis dengan proses pengeringan terkontrol.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 border border-[#E5DEC9] shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#86C975]/20 text-[#3B5B3D]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-[#2C1E18] text-base">
                  Alternatif Pangan Inovatif
                </h3>
                <p className="mt-1.5 text-xs text-[#6E5C52] leading-relaxed">
                  Menghadirkan solusi substitusi tepung terigu impor melalui diversifikasi pangan lokal berkelanjutan berdaya saing tinggi.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* RICH PRODUCT DETAILS MODAL */}
      {detailProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-cora-fade-in"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#FAF8F5] p-6 sm:p-8 shadow-2xl border border-[#E5DEC9]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDetailProduct(null)}
              aria-label="Tutup detail produk"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#E5DEC9] text-[#2C1E18] hover:bg-[#EAE4D6] transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white p-4">
                <Image
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  fill
                  unoptimized
                  className="object-contain p-4"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#3B5B3D] px-2.5 py-1 text-[10px] font-bold text-white">
                  Saves {detailProduct.residueSavedGram}g Residue
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B5B3D]">
                    {detailProduct.category} • {detailProduct.netWeight || `${detailProduct.weightGram}g`}
                  </span>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-[#2C1E18]">
                    {detailProduct.name}
                  </h2>
                  <p className="text-xs font-semibold text-[#8C7A6B]">
                    {detailProduct.subtitle}
                  </p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#2C1E18]">
                    {formatRupiah(detailProduct.price)}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      detailProduct.stock > 0
                        ? 'text-[#3B5B3D]'
                        : 'text-red-600'
                    }`}
                  >
                    {detailProduct.stock > 0
                      ? `Tersedia (${detailProduct.stock} stok)`
                      : 'Stok Habis'}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#5C4B42]">
                  {detailProduct.description}
                </p>

                {/* Variant Selector */}
                {detailProduct.variants && detailProduct.variants.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Pilihan Varian:
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {detailProduct.variants.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setActiveVariant(v)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            activeVariant === v
                              ? 'bg-[#3B5B3D] text-white'
                              : 'bg-white border border-[#D6CCBA] text-[#5C4B42] hover:bg-[#EAE4D6]'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qty Selector & Add to Cart */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-[#D6CCBA] bg-white px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                      className="p-1 text-[#5C4B42] hover:text-[#2C1E18]"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold tabular-nums">
                      {modalQty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setModalQty((q) =>
                          Math.min(detailProduct.stock, q + 1)
                        )
                      }
                      className="p-1 text-[#5C4B42] hover:text-[#2C1E18]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={detailProduct.stock <= 0}
                    onClick={handleModalAddToCart}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition ${
                      modalAddedFeedback
                        ? 'bg-[#4E9A34] text-white'
                        : 'bg-[#3B5B3D] text-white hover:bg-[#2F4A31] disabled:bg-[#D5CCC0]'
                    }`}
                  >
                    {modalAddedFeedback ? (
                      <>
                        <Check className="h-4 w-4" />
                        Ditambahkan!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        + Keranjang
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients, Storage, & Benefits Tabs / Columns */}
            <div className="mt-8 border-t border-[#E5DEC9] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#5C4B42]">
              {/* Komposisi / Bahan Baku */}
              <div className="rounded-2xl bg-white p-4 border border-[#E5DEC9]">
                <h3 className="font-bold text-[#2C1E18] text-xs flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-[#3B5B3D]" />
                  Komposisi &amp; Bahan Baku
                </h3>
                <ul className="mt-2.5 space-y-1 text-xs">
                  {detailProduct.ingredients?.map((ing) => (
                    <li key={ing} className="flex items-start gap-1.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4E9A34]" />
                      <span>{ing}</span>
                    </li>
                  )) || (
                    <li>Tepung ampas kelapa pilihan, bahan alami lokal.</li>
                  )}
                </ul>
              </div>

              {/* Informasi Penyimpanan & Masa Simpan */}
              <div className="rounded-2xl bg-white p-4 border border-[#E5DEC9]">
                <h3 className="font-bold text-[#2C1E18] text-xs flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#3B5B3D]" />
                  Penyimpanan &amp; Masa Simpan
                </h3>
                <div className="mt-2.5 space-y-2 text-xs">
                  <div>
                    <strong className="text-[#2C1E18]">Masa Simpan:</strong>{' '}
                    <span>{detailProduct.shelfLife || '30 hari dalam wadah tertutup.'}</span>
                  </div>
                  <div>
                    <strong className="text-[#2C1E18]">Cara Penyimpanan:</strong>{' '}
                    <span>{detailProduct.storageInfo || 'Simpan di tempat sejuk dan kering.'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
