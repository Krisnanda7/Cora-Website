'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  Copy,
  ImagePlus,
  Leaf,
  Lock,
  ShoppingBag,
  Trash2,
  Truck,
  UploadCloud,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCora } from '@/context/CoraContext';

type CourierOption = 'Regular' | 'Next Day';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function fileToBase64DataUrl(file: File): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  if (file.size <= 350 * 1024 || file.type === 'image/svg+xml') {
    return rawDataUrl;
  }

  return new Promise<string>((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const maxDim = 1080;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, bankAccounts, createOrder, isHydrated } = useCora();

  const activeBanks = useMemo(
    () => bankAccounts.filter((bank) => bank.isActive),
    [bankAccounts]
  );

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [courier, setCourier] = useState<CourierOption>('Regular');
  const [notes, setNotes] = useState('');

  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const effectiveBankId = useMemo(() => {
    if (selectedBankId && activeBanks.some((b) => b.id === selectedBankId)) {
      return selectedBankId;
    }
    return activeBanks[0]?.id ?? '';
  }, [activeBanks, selectedBankId]);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [proofImage, setProofImage] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalResidueSavedKg = useMemo(() => {
    const grams = cart.reduce(
      (sum, item) => sum + item.residueSavedGram * item.qty,
      0
    );
    return (grams / 1000).toFixed(2);
  }, [cart]);

  const handleCopyAccount = async (bankId: string, accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
    } catch {
      // Visual confirmation fallback
    }
    setCopiedBankId(bankId);
    window.setTimeout(() => {
      setCopiedBankId((curr) => (curr === bankId ? null : curr));
    }, 1800);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please upload a valid image file (PNG, JPG, JPEG, or WebP).');
      return;
    }

    setFormError(null);
    try {
      const base64 = await fileToBase64DataUrl(file);
      setProofImage(base64);
      setProofFileName(file.name);
    } catch {
      setFormError('Failed to process transfer proof image. Please try another file.');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Your shopping cart is empty.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!customerPhone.trim()) {
      setFormError('WhatsApp number is required.');
      return;
    }
    if (!shippingAddress.trim()) {
      setFormError('Complete shipping address is required.');
      return;
    }

    const chosenBank =
      activeBanks.find((b) => b.id === effectiveBankId) ?? activeBanks[0];
    if (!chosenBank) {
      setFormError('Please select a destination bank account.');
      return;
    }
    if (!proofImage) {
      setFormError('Please upload a photo or screenshot of your transfer proof.');
      return;
    }

    setIsSubmitting(true);

    const combinedNotes = [
      `Courier: ${courier}`,
      notes.trim() ? notes.trim() : null,
    ]
      .filter(Boolean)
      .join(' • ');

    const createdOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      bankAccountUsed: `${chosenBank.bankName} - ${chosenBank.accountNumber}`,
      proofImage,
      notes: combinedNotes,
    });

    router.push(
      `/orders?created=${encodeURIComponent(createdOrder.orderNumber)}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {/* Header */}
          <div className="animate-cora-fade-up mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B5B3D] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Product Catalog
              </Link>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.015em] text-[#2C1E18] sm:text-4xl">
                Checkout &amp; Payment
              </h1>
              <p className="mt-1 text-sm text-[#6E5C52]">
                Complete your shipping details and upload your transfer proof to
                an official CORA bank account.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#3B5B3D]/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3B5B3D]">
              <Lock className="h-3.5 w-3.5" />
              Official CORA Manual Verification
            </div>
          </div>

          {/* Empty Cart State */}
          {isHydrated && cart.length === 0 && !isSubmitting ? (
            <div className="rounded-2xl border border-[#E5DEC9] bg-white px-6 py-16 text-center shadow-2xs">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6E3D8] text-[#3B5B3D]">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold text-[#2C1E18]">
                Your Cart Is Empty
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#6E5C52]">
                Add CORA coconut products to your cart before proceeding to
                checkout.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2F4A31]"
              >
                Browse CORA Products
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitOrder}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start"
            >
              {/* LEFT COLUMN: Shipping Form */}
              <div
                className="animate-cora-fade-up space-y-6 lg:col-span-7"
                style={{ animationDelay: '60ms' }}
              >
                <section className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xs sm:p-8">
                  <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B5B3D] text-xs font-bold text-white">
                      1
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-[#2C1E18]">
                        Shipping Information
                      </h2>
                      <p className="text-xs text-[#6E5C52]">
                        Make sure your address and WhatsApp number are active
                        for delivery updates.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="customerName"
                          className="block text-xs font-semibold text-[#2C1E18]"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="customerName"
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Nadia Kusuma"
                          className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] transition focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="customerPhone"
                          className="block text-xs font-semibold text-[#2C1E18]"
                        >
                          WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="customerPhone"
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 081234567890"
                          className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] transition focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="shippingAddress"
                        className="block text-xs font-semibold text-[#2C1E18]"
                      >
                        Full Shipping Address{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="shippingAddress"
                        required
                        rows={3}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Street name, house number, district, city, and postal code"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] transition focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    {/* Courier Selection */}
                    <div>
                      <span className="block text-xs font-semibold text-[#2C1E18]">
                        Courier Option <span className="text-red-500">*</span>
                      </span>
                      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {(
                          [
                            {
                              id: 'Regular' as const,
                              title: 'Regular Courier',
                              eta: 'Estimated 2–3 business days',
                              badge: 'Free Shipping',
                            },
                            {
                              id: 'Next Day' as const,
                              title: 'Next Day Courier',
                              eta: 'Estimated 1 business day (Priority)',
                              badge: 'CORA Promo Rp 0',
                            },
                          ] as const
                        ).map((option) => {
                          const selected = courier === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setCourier(option.id)}
                              className={`flex items-start gap-3 rounded-2xl p-4 text-left transition ${
                                selected
                                  ? 'bg-[#3B5B3D]/8 ring-2 ring-[#3B5B3D]'
                                  : 'bg-[#FAF8F5] ring-1 ring-[#E5DEC9] hover:bg-[#F3EFE6]'
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                  selected
                                    ? 'bg-[#3B5B3D] text-white'
                                    : 'bg-white text-[#6E5C52]'
                                }`}
                              >
                                <Truck className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-bold text-[#2C1E18]">
                                    {option.title}
                                  </span>
                                  <span className="rounded-full bg-[#3B5B3D]/12 px-2 py-0.5 text-[10px] font-semibold text-[#3B5B3D]">
                                    {option.badge}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[#6E5C52]">
                                  {option.eta}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-xs font-semibold text-[#2C1E18]"
                      >
                        Order Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Extra protective packaging or leave with receptionist"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] transition focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Order Summary & Manual Bank Transfer */}
              <div
                className="animate-cora-fade-up space-y-6 lg:col-span-5"
                style={{ animationDelay: '130ms' }}
              >
                {/* a) Order Summary */}
                <section className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xs">
                  <h2 className="text-base font-bold text-[#2C1E18]">
                    Order Summary
                  </h2>

                  <div className="mt-4 divide-y divide-[#F0EAE0]">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FAF8F5] ring-1 ring-[#E5DEC9]/70">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            unoptimized
                            className="object-contain p-1.5"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-[#2C1E18]">
                            {item.productName}
                          </p>
                          <p className="text-xs tabular-nums text-[#6E5C52]">
                            {item.qty} × {formatRupiah(item.price)}
                          </p>
                        </div>
                        <span className="text-sm font-bold tabular-nums text-[#2C1E18]">
                          {formatRupiah(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-2.5 border-t border-[#F0EAE0] pt-4 text-sm">
                    <div className="flex items-center justify-between text-[#6E5C52]">
                      <span>Shipping ({courier})</span>
                      <span className="font-semibold text-[#3B5B3D]">Free</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[#3B5B3D]/8 px-3 py-2 text-xs text-[#3B5B3D]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Leaf className="h-3.5 w-3.5" />
                        Coconut Residue Saved
                      </span>
                      <span className="font-bold tabular-nums">
                        {totalResidueSavedKg} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-bold text-[#2C1E18]">
                        Total Amount
                      </span>
                      <span className="text-2xl font-extrabold tabular-nums text-[#2C1E18]">
                        {formatRupiah(cartTotal)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* b) Official CORA Bank Accounts */}
                <section className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#2C1E18]">
                        Transfer to Official CORA Account
                      </h2>
                      <p className="text-xs text-[#6E5C52]">
                        Transfer the exact total amount to one of our active
                        accounts below.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {activeBanks.map((bank) => {
                      const isCopied = copiedBankId === bank.id;
                      const isSelected = effectiveBankId === bank.id;
                      return (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedBankId(bank.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedBankId(bank.id);
                            }
                          }}
                          className={`cursor-pointer rounded-2xl p-4 transition ${
                            isSelected
                              ? 'bg-[#FAF8F5] ring-2 ring-[#3B5B3D]'
                              : 'bg-[#FAF8F5]/70 ring-1 ring-[#E5DEC9] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="inline-block rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#3B5B3D]">
                                {bank.bankName}
                              </span>
                              <p className="mt-2 font-mono text-lg font-extrabold tracking-wide tabular-nums text-[#2C1E18]">
                                {bank.accountNumber}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-[#6E5C52]">
                                Account Holder: {bank.accountHolder}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyAccount(bank.id, bank.accountNumber);
                              }}
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                isCopied
                                  ? 'bg-[#4E9A34] text-white'
                                  : 'bg-white text-[#2C1E18] ring-1 ring-[#E5DEC9] hover:bg-[#E6E3D8]'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy Account No.
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* c) Upload Transfer Proof */}
                <section className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-[#2C1E18]">
                    Upload Transfer Proof
                  </h2>

                  <div>
                    <label
                      htmlFor="bankTarget"
                      className="block text-xs font-semibold text-[#2C1E18]"
                    >
                      Destination Bank Account
                    </label>
                    <select
                      id="bankTarget"
                      value={effectiveBankId}
                      onChange={(e) => setSelectedBankId(e.target.value)}
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    >
                      {activeBanks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.bankName} — {bank.accountNumber} (
                          {bank.accountHolder})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#2C1E18]">
                      Transfer Receipt Photo / Screenshot{' '}
                      <span className="text-red-500">*</span>
                    </span>

                    {!proofImage ? (
                      <label
                        htmlFor="proofUpload"
                        className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D6CCBA] bg-[#FAF8F5] px-4 py-8 text-center transition hover:border-[#3B5B3D] hover:bg-[#3B5B3D]/5"
                      >
                        <UploadCloud className="h-8 w-8 text-[#3B5B3D]" />
                        <span className="mt-2 text-sm font-semibold text-[#2C1E18]">
                          Choose transfer receipt image
                        </span>
                        <span className="mt-1 text-xs text-[#6E5C52]">
                          Supports PNG, JPG, or WebP
                        </span>
                        <input
                          id="proofUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    ) : (
                      <div className="mt-2 overflow-hidden rounded-2xl bg-[#FAF8F5] p-3 ring-1 ring-[#E5DEC9]">
                        <div className="relative h-52 w-full overflow-hidden rounded-xl bg-white">
                          <Image
                            src={proofImage}
                            alt="Transfer proof preview"
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2 px-1">
                          <span className="truncate text-xs font-medium text-[#5C4B42]">
                            {proofFileName || 'transfer-receipt.png'}
                          </span>
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="proofReupload"
                              className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#3B5B3D] ring-1 ring-[#E5DEC9] hover:bg-[#E6E3D8]"
                            >
                              <ImagePlus className="h-3.5 w-3.5" />
                              Change
                              <input
                                id="proofReupload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="sr-only"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setProofImage('');
                                setProofFileName('');
                              }}
                              className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-2xl bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F4A31] disabled:opacity-60"
                  >
                    {isSubmitting
                      ? 'Processing Order...'
                      : 'Submit Order & Transfer Proof'}
                  </button>
                </section>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
