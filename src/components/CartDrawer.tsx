'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useCora } from '@/context/CoraContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cart,
    products,
    cartCount,
    cartTotal,
    updateCartQty,
    removeFromCart,
    clearCart,
  } = useCora();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totalResidueSavedGram = cart.reduce(
    (sum, item) => sum + item.residueSavedGram * item.qty,
    0
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja CORA"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup keranjang"
        onClick={onClose}
        className="animate-cora-fade-in fixed inset-0 bg-[#2C1E18]/35 backdrop-blur-[2px]"
      />

      {/* Drawer Panel */}
      <aside className="animate-cora-drawer relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#E5DEC9] bg-[#FAF8F5] text-[#2C1E18] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DEC9] bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#2C1E18]">
                Keranjang Belanja
              </h2>
              <p className="text-xs text-[#6E5C52] tabular-nums">
                {cartCount} item dipilih
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6E5C52] transition hover:bg-[#E6E3D8]/60 hover:text-[#2C1E18]"
            aria-label="Tutup panel keranjang"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6E3D8] text-[#3B5B3D]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="font-serif text-lg font-semibold text-[#2C1E18]">
                Keranjang masih kosong
              </p>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#6E5C52]">
                Jelajahi olahan kelapa sirkular CORA untuk menikmati rasa
                artisan sambil menyelamatkan ampas kelapa.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
              >
                Lihat Katalog Produk
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {cart.map((item) => {
                const liveProduct = products.find(
                  (p) => p.id === item.productId
                );
                const maxStock = liveProduct ? liveProduct.stock : 99;
                const itemResidueKg = (
                  (item.residueSavedGram * item.qty) /
                  1000
                ).toFixed(2);

                return (
                  <div
                    key={item.productId}
                    className="flex gap-3.5 rounded-2xl border border-[#E5DEC9] bg-white p-3.5 transition hover:border-[#CFC5B1]"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9]/80 bg-[#FAF8F5]">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        unoptimized
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-[#2C1E18] leading-snug">
                            {item.productName}
                          </h3>
                          <p className="mt-0.5 text-xs font-medium tabular-nums text-[#3B5B3D]">
                            {formatRupiah(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="rounded-lg p-1.5 text-[#8A776C] transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Hapus ${item.productName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium tabular-nums text-[#3B5B3D]">
                          <Leaf className="h-3 w-3" />
                          {itemResidueKg} kg residu
                        </span>

                        <div className="flex items-center rounded-full border border-[#E5DEC9] bg-[#FAF8F5]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(item.productId, item.qty - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-l-full text-[#2C1E18] transition hover:bg-[#E6E3D8]"
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[26px] text-center text-xs font-semibold tabular-nums text-[#2C1E18]">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty(item.productId, item.qty + 1)
                            }
                            disabled={item.qty >= maxStock}
                            className="flex h-7 w-7 items-center justify-center rounded-r-full text-[#2C1E18] transition hover:bg-[#E6E3D8] disabled:opacity-40"
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-[#7A675D] underline-offset-4 hover:text-[#2C1E18] hover:underline"
                >
                  Kosongkan keranjang
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#E5DEC9] bg-white px-6 py-5 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-[#3B5B3D]/8 px-3.5 py-2.5 text-xs text-[#3B5B3D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Leaf className="h-3.5 w-3.5" />
                Estimasi Residu Terselamatkan
              </span>
              <span className="font-bold tabular-nums">
                {(totalResidueSavedGram / 1000).toFixed(2)} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#6E5C52]">
                Subtotal Pembayaran
              </span>
              <span className="text-lg font-bold tabular-nums text-[#2C1E18]">
                {formatRupiah(cartTotal)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2F4A31]"
            >
              Lanjut ke Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
