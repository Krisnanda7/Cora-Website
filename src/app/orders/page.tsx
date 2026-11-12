'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Package,
  Search,
  ShoppingBag,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCora } from '@/context/CoraContext';
import type { Order, OrderStatus } from '@/types/cora';

type StatusFilter = 'ALL' | OrderStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Menunggu Konfirmasi', value: 'WAITING_VERIFICATION' },
  { label: 'Sedang Dikemas', value: 'PROCESSING' },
  { label: 'Dikirim', value: 'SHIPPED' },
  { label: 'Selesai', value: 'COMPLETED' },
  { label: 'Ditolak', value: 'REJECTED' },
];

const TIMELINE_STEPS: {
  key: Exclude<OrderStatus, 'REJECTED'>;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: 'WAITING_VERIFICATION',
    label: 'Menunggu Konfirmasi Admin',
    description: 'Bukti transfer sedang diperiksa',
    icon: Clock,
  },
  {
    key: 'PROCESSING',
    label: 'Sedang Dikemas',
    description: 'Pesanan disiapkan tim CORA',
    icon: Package,
  },
  {
    key: 'SHIPPED',
    label: 'Dikirim',
    description: 'Dalam perjalanan ke alamat Anda',
    icon: Truck,
  },
  {
    key: 'COMPLETED',
    label: 'Selesai',
    description: 'Pesanan telah diterima',
    icon: CheckCircle2,
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(isoString: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

function getStatusBadge(status: OrderStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'WAITING_VERIFICATION':
      return {
        label: 'Menunggu Konfirmasi Admin',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'PROCESSING':
      return {
        label: 'Sedang Dikemas',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'SHIPPED':
      return {
        label: 'Dikirim',
        className: 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200',
      };
    case 'COMPLETED':
      return {
        label: 'Selesai',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
    case 'REJECTED':
      return {
        label: 'Ditolak',
        className: 'bg-red-50 text-red-700 ring-1 ring-red-200',
      };
  }
}

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'WAITING_VERIFICATION':
      return 0;
    case 'PROCESSING':
      return 1;
    case 'SHIPPED':
      return 2;
    case 'COMPLETED':
      return 3;
    case 'REJECTED':
      return -1;
  }
}

function OrderTimeline({
  order,
  copiedResiId,
  onCopyResi,
}: {
  order: Order;
  copiedResiId: string | null;
  onCopyResi: (orderId: string, tracking: string) => void;
}) {
  if (order.status === 'REJECTED') {
    return (
      <div className="rounded-2xl bg-red-50/70 p-4 ring-1 ring-red-200/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <XCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-red-800">
                Pesanan Ditolak oleh Admin
              </p>
              <p className="mt-0.5 text-xs text-red-700">
                Bukti transfer tidak sesuai atau pembayaran belum dapat
                diverifikasi. Silakan hubungi tim CORA atau lakukan pemesanan
                ulang.
              </p>
            </div>
          </div>
          <span className="self-start rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-700 sm:self-center">
            Status: Ditolak
          </span>
        </div>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="rounded-2xl bg-[#FAF8F5] p-4 sm:p-5 ring-1 ring-[#E5DEC9]/70">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-3">
        {TIMELINE_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIdx;
          const isCurrent = index === currentStepIdx;
          const isReached = index <= currentStepIdx;

          return (
            <div key={step.key} className="relative flex sm:flex-col gap-3 sm:gap-2">
              {/* Connector line on desktop */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`hidden sm:block absolute top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5 ${
                    index < currentStepIdx ? 'bg-[#3B5B3D]' : 'bg-[#DED6C6]'
                  }`}
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 flex sm:justify-center">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                    isCurrent
                      ? 'bg-[#3B5B3D] text-white ring-4 ring-[#3B5B3D]/15'
                      : isCompleted
                      ? 'bg-[#4E9A34] text-white'
                      : 'bg-white text-[#9B897E] ring-1 ring-[#DED6C6]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
              </div>

              <div className="sm:text-center">
                <p
                  className={`text-xs font-bold leading-snug ${
                    isReached ? 'text-[#2C1E18]' : 'text-[#8A776C]'
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-[11px] text-[#6E5C52]">
                  {step.description}
                </p>

                {/* Show Tracking Number under "Dikirim" step if filled by Admin */}
                {step.key === 'SHIPPED' && order.trackingNumber && (
                  <div className="mt-2 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#2C1E18] ring-1 ring-[#E5DEC9]">
                    <span className="text-[#6E5C52]">Resi:</span>
                    <span className="font-mono font-bold text-[#3B5B3D]">
                      {order.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onCopyResi(order.id, order.trackingNumber ?? '')
                      }
                      aria-label="Salin nomor resi"
                      className="rounded-full p-0.5 text-[#3B5B3D] hover:bg-[#3B5B3D]/10"
                    >
                      {copiedResiId === order.id ? (
                        <Check className="h-3 w-3 text-[#4E9A34]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const createdOrderNumber = searchParams.get('created');

  const { orders } = useCora();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [copiedResiId, setCopiedResiId] = useState<string | null>(null);
  const [previewProofOrder, setPreviewProofOrder] = useState<Order | null>(
    null
  );

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        (order.trackingNumber?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [orders, searchQuery, statusFilter]);

  const handleCopyResi = async (orderId: string, tracking: string) => {
    try {
      await navigator.clipboard.writeText(tracking);
    } catch {
      // Fallback still toggles visual confirmation
    }
    setCopiedResiId(orderId);
    window.setTimeout(() => {
      setCopiedResiId((curr) => (curr === orderId ? null : curr));
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3.5 py-1 text-xs font-semibold text-[#3B5B3D]">
            <Truck className="h-3.5 w-3.5" />
            Order Tracking
          </span>
          <h1 className="mt-2.5 font-serif text-3xl font-bold tracking-tight text-[#2C1E18] sm:text-4xl">
            Pelacakan Pesanan
          </h1>
          <p className="mt-1 text-sm text-[#6E5C52]">
            Pantau status verifikasi pembayaran, pengemasan, dan nomor resi
            pengiriman pesanan CORA Anda.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 self-start rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31] sm:self-auto"
        >
          <ShoppingBag className="h-4 w-4" />
          Belanja Produk Lagi
        </Link>
      </div>

      {/* Success Notification Banner after Checkout */}
      {createdOrderNumber && !dismissedBanner && (
        <div
          role="status"
          className="mt-6 flex items-start justify-between gap-4 rounded-2xl bg-[#3B5B3D] px-5 py-4 text-white shadow-sm"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#B8E3A6]" />
            <div>
              <p className="text-sm font-bold">
                Pesanan #{createdOrderNumber} Berhasil Dikirim!
              </p>
              <p className="mt-0.5 text-xs text-white/85">
                Terima kasih telah berbelanja di CORA. Bukti transfer Anda telah
                diterima dan sedang menunggu verifikasi admin.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissedBanner(true)}
            aria-label="Tutup notifikasi"
            className="rounded-full p-1 text-white/80 hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-[#2C1E18] text-[#FAF8F5]'
                    : 'bg-white text-[#5C4B42] shadow-2xs hover:bg-[#E6E3D8]/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A776C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no. order, nama, atau resi..."
            aria-label="Cari pesanan"
            className="w-full rounded-full bg-white py-2.5 pr-9 pl-10 text-sm text-[#2C1E18] placeholder-[#8A776C] shadow-xs ring-1 ring-[#E5DEC9]/80 focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Hapus pencarian"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[#8A776C] hover:bg-[#E6E3D8]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-xs">
            <Package className="mx-auto h-10 w-10 text-[#3B5B3D]/55" />
            <h2 className="mt-4 font-serif text-xl font-bold text-[#2C1E18]">
              Belum ada pesanan yang cocok
            </h2>
            <p className="mt-1 text-sm text-[#6E5C52]">
              Periksa kata kunci pencarian atau pilih status pesanan lain.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isHighlighted = createdOrderNumber === order.orderNumber;

            return (
              <article
                key={order.id}
                className={`overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition sm:p-7 ${
                  isHighlighted ? 'ring-2 ring-[#3B5B3D]' : ''
                }`}
              >
                {/* Order Card Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#F0EAE0] pb-5 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-extrabold text-[#2C1E18] sm:text-base">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E5C52]">
                      Dipesan pada {formatDate(order.createdAt)} • Transfer ke{' '}
                      <span className="font-semibold text-[#2C1E18]">
                        {order.bankAccountUsed}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.proofImage && (
                      <button
                        type="button"
                        onClick={() => setPreviewProofOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] px-3.5 py-2 text-xs font-semibold text-[#2C1E18] ring-1 ring-[#E5DEC9] transition hover:bg-[#E6E3D8]"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        Bukti Transfer
                      </button>
                    )}
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-[#6E5C52]">
                        Total Pembayaran
                      </p>
                      <p className="text-lg font-extrabold text-[#2C1E18]">
                        {formatRupiah(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual Timeline */}
                <div className="mt-5">
                  <OrderTimeline
                    order={order}
                    copiedResiId={copiedResiId}
                    onCopyResi={handleCopyResi}
                  />
                </div>

                {/* Tracking Number Banner if SHIPPED or COMPLETED */}
                {order.trackingNumber &&
                  (order.status === 'SHIPPED' ||
                    order.status === 'COMPLETED') && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#3B5B3D]/8 px-4 py-3 text-xs">
                      <div className="flex items-center gap-2 text-[#2C1E18]">
                        <Truck className="h-4 w-4 text-[#3B5B3D]" />
                        <span>
                          Nomor Resi Pengiriman:{' '}
                          <strong className="font-mono text-[#3B5B3D]">
                            {order.trackingNumber}
                          </strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyResi(order.id, order.trackingNumber ?? '')
                        }
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25 hover:bg-[#3B5B3D] hover:text-white"
                      >
                        {copiedResiId === order.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Resi Tersalin!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Salin Resi
                          </>
                        )}
                      </button>
                    </div>
                  )}

                {/* Items & Customer Info */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="space-y-3 lg:col-span-7">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6E5C52]">
                      Produk Dipesan
                    </h3>
                    <div className="divide-y divide-[#F0EAE0] rounded-2xl bg-[#FAF8F5] px-4 py-2">
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.productId}`}
                          className="flex items-center justify-between gap-3 py-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-[#E5DEC9]/70">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                unoptimized
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#2C1E18]">
                                {item.productName}
                              </p>
                              <p className="text-xs text-[#6E5C52]">
                                {item.qty} × {formatRupiah(item.price)}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-[#2C1E18]">
                            {formatRupiah(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 rounded-2xl bg-[#FAF8F5] p-4 text-xs lg:col-span-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6E5C52]">
                      Informasi Penerima
                    </h3>
                    <p className="text-sm font-bold text-[#2C1E18]">
                      {order.customerName}{' '}
                      <span className="font-normal text-[#6E5C52]">
                        ({order.customerPhone})
                      </span>
                    </p>
                    <p className="leading-relaxed text-[#5C4B42]">
                      {order.shippingAddress}
                    </p>
                    {order.notes && (
                      <p className="pt-1 text-[#6E5C52]">
                        <span className="font-semibold text-[#2C1E18]">
                          Catatan:
                        </span>{' '}
                        {order.notes}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Proof Image Modal */}
      {previewProofOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Preview Bukti Transfer"
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] px-5 py-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                  Bukti Transfer
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  #{previewProofOrder.orderNumber} •{' '}
                  {previewProofOrder.bankAccountUsed}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProofOrder(null)}
                aria-label="Tutup preview"
                className="rounded-full p-1.5 text-[#6E5C52] hover:bg-[#E6E3D8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-[#FAF8F5] p-5">
              <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-white ring-1 ring-[#E5DEC9]">
                <Image
                  src={previewProofOrder.proofImage}
                  alt={`Bukti transfer ${previewProofOrder.orderNumber}`}
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-[#6E5C52]">
              Memuat data pesanan...
            </div>
          }
        >
          <OrdersContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

