'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  PackageCheck,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCora } from '@/context/CoraContext';
import type { OrderStatus } from '@/types/cora';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const ORDER_STAGES: {
  key: string;
  label: string;
  description: string;
  orderStatus: OrderStatus[];
}[] = [
  {
    key: 'received',
    label: 'Order Received',
    description: 'Order logged into system & awaiting payment verification.',
    orderStatus: ['WAITING_VERIFICATION'],
  },
  {
    key: 'processing',
    label: 'Order Processing',
    description: 'Payment verified. Items are being hygienically prepared and packaged.',
    orderStatus: ['PROCESSING'],
  },
  {
    key: 'shipped',
    label: 'Order Shipped',
    description: 'Package handed over to partner courier with tracking code.',
    orderStatus: ['SHIPPED'],
  },
  {
    key: 'completed',
    label: 'Order Completed',
    description: 'Package successfully delivered to destination address.',
    orderStatus: ['COMPLETED'],
  },
];

export default function TrackOrderPage() {
  const { orders } = useCora();
  const [searchQuery, setSearchQuery] = useState(
    orders[0]?.orderNumber ?? 'CORA-20261112-001'
  );
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>(
    orders[0]?.orderNumber ?? 'CORA-20261112-001'
  );

  const matchedOrder = useMemo(() => {
    if (!selectedOrderNumber.trim()) return null;
    const query = selectedOrderNumber.trim().toUpperCase();
    return (
      orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === query ||
          o.id.toUpperCase() === query
      ) ?? null
    );
  }, [orders, selectedOrderNumber]);

  const getStageIndex = (status: OrderStatus): number => {
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
      default:
        return 0;
    }
  };

  const currentStageIdx = matchedOrder ? getStageIndex(matchedOrder.status) : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedOrderNumber(searchQuery.trim());
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3B5B3D]">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Product Catalog
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-xs font-semibold text-[#3B5B3D]">
              <Truck className="h-3.5 w-3.5" />
              Live Order Tracking
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2C1E18] sm:text-4xl">
              Track Your CORA Order
            </h1>
            <p className="text-sm leading-relaxed text-[#6E5C52]">
              Track the journey of your circular coconut treats from payment confirmation and hygienic packaging to courier transit and doorstep delivery.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8C7A6B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order Number (e.g., CORA-20261112-001)"
                className="w-full rounded-2xl border border-[#D6CCBA] bg-white py-3 pr-4 pl-10 text-sm text-[#2C1E18] placeholder-[#9C8A7B] shadow-2xs focus:border-[#3B5B3D] focus:ring-2 focus:ring-[#3B5B3D]/20 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B5B3D] px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#2F4A31]"
            >
              <Search className="h-4 w-4" />
              <span>Track Order</span>
            </button>
          </form>

          {/* Quick Order Sample Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#6E5C52]">Sample Demo Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery(o.orderNumber);
                  setSelectedOrderNumber(o.orderNumber);
                }}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  selectedOrderNumber === o.orderNumber
                    ? 'bg-[#3B5B3D] text-white'
                    : 'bg-[#EAE4D6] text-[#2C1E18] hover:bg-[#DDD5C3]'
                }`}
              >
                #{o.orderNumber} ({o.customerName})
              </button>
            ))}
          </div>

          {/* Result Card */}
          {matchedOrder ? (
            <div className="mt-8 space-y-6">
              {/* Status Stepper */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE0] pb-5">
                  <div>
                    <span className="text-xs font-semibold text-[#8C7A6B]">
                      Order Number
                    </span>
                    <h2 className="text-lg font-bold text-[#2C1E18]">
                      #{matchedOrder.orderNumber}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        matchedOrder.status === 'COMPLETED'
                          ? 'bg-[#3B5B3D]/12 text-[#3B5B3D]'
                          : matchedOrder.status === 'REJECTED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {matchedOrder.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : matchedOrder.status === 'REJECTED' ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {matchedOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* 4-Step Visual Timeline */}
                <div className="mt-8">
                  <div className="relative">
                    {/* Connecting Line */}
                    <div
                      className="absolute top-5 left-5 right-5 h-0.5 bg-[#E5DEC9] hidden sm:block"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full bg-[#3B5B3D] transition-all duration-500"
                        style={{
                          width: `${
                            currentStageIdx < 0
                              ? 0
                              : (currentStageIdx / (ORDER_STAGES.length - 1)) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                      {ORDER_STAGES.map((stage, idx) => {
                        const isDone = currentStageIdx >= idx;
                        const isCurrent = currentStageIdx === idx;

                        return (
                          <div
                            key={stage.key}
                            className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2"
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                isDone
                                  ? 'bg-[#3B5B3D] text-white shadow-sm ring-4 ring-[#FAF8F5]'
                                  : 'bg-[#EFECE4] text-[#8C7A6B] ring-4 ring-[#FAF8F5]'
                              }`}
                            >
                              {isDone ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-xs sm:text-sm font-bold ${
                                  isCurrent
                                    ? 'text-[#3B5B3D]'
                                    : isDone
                                    ? 'text-[#2C1E18]'
                                    : 'text-[#8C7A6B]'
                                }`}
                              >
                                {stage.label}
                              </p>
                              <p className="mt-0.5 text-[11px] text-[#6E5C52] leading-tight">
                                {stage.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Shipping info banner if shipped */}
                {matchedOrder.trackingNumber && (
                  <div className="mt-8 rounded-2xl bg-[#FAF8F5] p-4 border border-[#E5DEC9] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-[#3B5B3D]" />
                      <div>
                        <p className="text-xs font-bold text-[#2C1E18]">
                          Courier: {matchedOrder.courier || 'JNE Regular'}
                        </p>
                        <p className="text-[11px] text-[#6E5C52]">
                          Tracking Number: <strong className="text-[#3B5B3D]">{matchedOrder.trackingNumber}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#3B5B3D] bg-[#3B5B3D]/10 px-2.5 py-1 rounded-full">
                      In Transit
                    </span>
                  </div>
                )}
              </div>

              {/* Order Detail Summary */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#2C1E18]">
                  Order Summary
                </h3>

                <div className="divide-y divide-[#F0EAE0]">
                  {matchedOrder.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="flex items-center justify-between py-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF8F5]">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2C1E18]">
                            {item.productName}
                          </p>
                          <p className="text-xs text-[#6E5C52]">
                            {item.qty} × {formatRupiah(item.price)}
                            {item.variant ? ` • Variant: ${item.variant}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#2C1E18]">
                        {formatRupiah(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E5DEC9] pt-4 space-y-2 text-xs text-[#5C4B42]">
                  <div className="flex justify-between">
                    <span>Recipient</span>
                    <span className="font-semibold text-[#2C1E18]">{matchedOrder.customerName} ({matchedOrder.customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Address</span>
                    <span className="font-semibold text-[#2C1E18] max-w-xs text-right">{matchedOrder.shippingAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-semibold text-[#2C1E18]">{matchedOrder.bankAccountUsed}</span>
                  </div>
                  {matchedOrder.notes && (
                    <div className="flex justify-between">
                      <span>Order Notes</span>
                      <span className="italic text-[#6E5C52]">{matchedOrder.notes}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#F0EAE0] pt-3 text-sm font-bold text-[#2C1E18]">
                    <span>Total Amount</span>
                    <span className="text-base text-[#3B5B3D]">{formatRupiah(matchedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-[#E5DEC9] bg-white p-10 text-center shadow-xs">
              <PackageCheck className="mx-auto h-12 w-12 text-[#8C7A6B]/50" />
              <h3 className="mt-4 font-serif text-xl font-bold text-[#2C1E18]">
                Order Not Found
              </h3>
              <p className="mt-1 text-sm text-[#6E5C52]">
                Please verify that your order number is correct (e.g., <code>CORA-20261112-001</code>).
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
