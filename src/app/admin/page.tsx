'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Edit3,
  Eye,
  LayoutDashboard,
  Leaf,
  Package,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useCora } from '@/context/CoraContext';
import type {
  BankAccount,
  Order,
  OrderStatus,
  PickupRequestStatus,
  Product,
  ProductCategory,
} from '@/types/cora';

type AdminTab = 'orders' | 'finance' | 'cms' | 'pickup';
type OrderFilter = 'ALL' | OrderStatus;

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function getOrderBadge(status: OrderStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'WAITING_VERIFICATION':
      return {
        label: 'Menunggu Verifikasi',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'PROCESSING':
      return {
        label: 'Diproses',
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

function getPickupBadge(status: PickupRequestStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'SCHEDULED':
      return {
        label: 'Dijadwalkan',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'COMPLETED':
      return {
        label: 'Selesai Dijemput',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
  }
}

const IMAGE_PRESETS: { label: string; value: string }[] = [
  { label: 'CORA Brownies', value: '/images/products/cora-brownies.svg' },
  { label: 'CORA Cookies', value: '/images/products/cora-cookies.svg' },
  { label: 'CORA Coconut Flour', value: '/images/products/cora-flour.svg' },
  {
    label: 'CORA Brownies Twin',
    value: '/images/products/cora-brownies-twin.svg',
  },
];

export default function AdminDashboardPage() {
  const {
    products,
    bankAccounts,
    orders,
    financialRecords,
    pickupRequests,
    verifyOrderPayment,
    updateOrderStatus,
    saveProduct,
    deleteProduct,
    saveBankAccount,
    addManualExpense,
    updatePickupStatus,
    resetDemoData,
  } = useCora();

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab 1: Orders State
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('ALL');
  const [proofModalOrder, setProofModalOrder] = useState<Order | null>(null);
  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, string>>(
    {}
  );

  // Tab 2: Finance State
  const [expDescription, setExpDescription] = useState('');
  const [expCategory, setExpCategory] = useState('Bahan Baku');
  const [expAmount, setExpAmount] = useState('');

  // Tab 3: CMS Products & Bank State
  const [quickEdits, setQuickEdits] = useState<
    Record<string, { price: string; stock: string }>
  >({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodSubtitle, setProdSubtitle] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Brownies');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodWeight, setProdWeight] = useState('');
  const [prodResidue, setProdResidue] = useState('');
  const [prodImage, setProdImage] = useState(IMAGE_PRESETS[0].value);
  const [prodDescription, setProdDescription] = useState('');

  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(
    'PT CORA Circular Innovation'
  );
  const [bankIsActive, setBankIsActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Pending badges for sidebar
  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'WAITING_VERIFICATION').length,
    [orders]
  );
  const pendingPickupsCount = useMemo(
    () => pickupRequests.filter((p) => p.status === 'PENDING').length,
    [pickupRequests]
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  // Financial KPIs
  const financeStats = useMemo(() => {
    const grossRevenue = financialRecords
      .filter((r) => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = financialRecords
      .filter((r) => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);
    const netProfit = grossRevenue - totalExpense;
    const verifiedOrders = orders.filter(
      (o) =>
        o.status === 'PROCESSING' ||
        o.status === 'SHIPPED' ||
        o.status === 'COMPLETED'
    ).length;

    const maxBar = Math.max(grossRevenue, totalExpense, 1);
    const incomePct = Math.round((grossRevenue / maxBar) * 100);
    const expensePct = Math.round((totalExpense / maxBar) * 100);

    // Category breakdown
    const categoryTotals = financialRecords.reduce<
      Record<string, { income: number; expense: number }>
    >((acc, rec) => {
      if (!acc[rec.category]) {
        acc[rec.category] = { income: 0, expense: 0 };
      }
      if (rec.type === 'INCOME') acc[rec.category].income += rec.amount;
      else acc[rec.category].expense += rec.amount;
      return acc;
    }, {});

    return {
      grossRevenue,
      totalExpense,
      netProfit,
      verifiedOrders,
      incomePct,
      expensePct,
      categoryTotals: Object.entries(categoryTotals),
    };
  }, [financialRecords, orders]);

  const handleResetDemo = () => {
    resetDemoData();
    setTrackingDrafts({});
    setQuickEdits({});
    setProofModalOrder(null);
    showToast('Seluruh data LocalStorage berhasil dikembalikan ke kondisi awal.');
  };

  // --- Tab 1 Handlers ---
  const handleApproveOrder = (order: Order) => {
    const draftResi = trackingDrafts[order.id]?.trim();
    verifyOrderPayment(order.id, 'APPROVE', draftResi || undefined);
    setProofModalOrder(null);
    showToast(
      `Pembayaran #${order.orderNumber} disetujui. Stok dikurangi & pemasukan dicatat.`
    );
  };

  const handleRejectOrder = (order: Order) => {
    verifyOrderPayment(order.id, 'REJECT');
    setProofModalOrder(null);
    showToast(`Pesanan #${order.orderNumber} ditolak.`);
  };

  const handleUpdateShippingStatus = (
    order: Order,
    nextStatus: 'SHIPPED' | 'COMPLETED'
  ) => {
    const resi =
      trackingDrafts[order.id] !== undefined
        ? trackingDrafts[order.id]
        : order.trackingNumber ?? '';
    updateOrderStatus(order.id, nextStatus, resi);
    showToast(
      `Status #${order.orderNumber} diperbarui menjadi ${
        nextStatus === 'SHIPPED' ? 'SHIPPED (Dikirim)' : 'COMPLETED (Selesai)'
      }.`
    );
  };

  // --- Tab 2 Handlers ---
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(expAmount);
    if (!expDescription.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }
    addManualExpense({
      description: expDescription.trim(),
      category: expCategory,
      amount: numericAmount,
    });
    setExpDescription('');
    setExpAmount('');
    showToast('Pengeluaran operasional berhasil dicatat ke buku kas.');
  };

  const handleExportCsv = () => {
    const headers = [
      'Tanggal',
      'No. Order',
      'Keterangan',
      'Kategori',
      'Tipe',
      'Nominal (IDR)',
    ];
    const escapeCsv = (val: string | number) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };
    const rows = financialRecords.map((rec) => [
      escapeCsv(formatDateTime(rec.date)),
      escapeCsv(rec.orderNumber || '-'),
      escapeCsv(rec.description),
      escapeCsv(rec.category),
      escapeCsv(rec.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'),
      escapeCsv(rec.amount),
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `cora-financial-report-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Laporan keuangan berhasil diunduh dalam format CSV.');
  };

  // --- Tab 3 Handlers ---
  const openNewProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdSubtitle('');
    setProdCategory('Brownies');
    setProdPrice('');
    setProdStock('');
    setProdWeight('200');
    setProdResidue('250');
    setProdImage(IMAGE_PRESETS[0].value);
    setProdDescription('');
    setShowProductForm(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdSubtitle(product.subtitle);
    setProdCategory(product.category);
    setProdPrice(String(product.price));
    setProdStock(String(product.stock));
    setProdWeight(String(product.weightGram));
    setProdResidue(String(product.residueSavedGram));
    setProdImage(product.image);
    setProdDescription(product.description);
    setShowProductForm(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice || !prodStock) return;
    saveProduct({
      id: editingProductId ?? undefined,
      name: prodName.trim(),
      subtitle: prodSubtitle.trim() || 'CORA Circular Product',
      category: prodCategory,
      price: Number(prodPrice),
      stock: Number(prodStock),
      weightGram: Number(prodWeight) || 200,
      residueSavedGram: Number(prodResidue) || 200,
      image: prodImage.trim() || IMAGE_PRESETS[0].value,
      description:
        prodDescription.trim() ||
        'Produk pangan sirkular bernutrisi tinggi dari residu kelapa CORA.',
    });
    setShowProductForm(false);
    showToast(
      editingProductId
        ? 'Produk berhasil diperbarui.'
        : 'Produk baru berhasil ditambahkan ke katalog.'
    );
  };

  const handleQuickSaveProduct = (product: Product) => {
    const draft = quickEdits[product.id];
    if (!draft) return;
    saveProduct({
      ...product,
      price: Math.max(0, Number(draft.price) || product.price),
      stock: Math.max(0, Number(draft.stock) || 0),
    });
    setQuickEdits((prev) => {
      const copy = { ...prev };
      delete copy[product.id];
      return copy;
    });
    showToast(`Harga & stok ${product.name} diperbarui.`);
  };

  const handleEditBank = (bank: BankAccount) => {
    setEditingBankId(bank.id);
    setBankName(bank.bankName);
    setAccountNumber(bank.accountNumber);
    setAccountHolder(bank.accountHolder);
    setBankIsActive(bank.isActive);
  };

  const handleSaveBankForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      return;
    }
    saveBankAccount({
      id: editingBankId ?? undefined,
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
      isActive: bankIsActive,
    });
    setEditingBankId(null);
    setBankName('');
    setAccountNumber('');
    setAccountHolder('PT CORA Circular Innovation');
    setBankIsActive(true);
    showToast('Pengaturan rekening bank CORA berhasil disimpan.');
  };

  const NAV_TABS: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'orders',
      label: 'Verifikasi Pesanan & Pengiriman',
      icon: ClipboardCheck,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'finance',
      label: 'Laporan Keuangan',
      icon: Wallet,
    },
    {
      id: 'cms',
      label: 'CMS Produk & Rekening',
      icon: Package,
    },
    {
      id: 'pickup',
      label: 'Jadwal Coconut Pickup',
      icon: Truck,
      badge: pendingPickupsCount > 0 ? pendingPickupsCount : undefined,
    },
  ];

  const activeTabTitle =
    NAV_TABS.find((t) => t.id === activeTab)?.label ?? 'Admin Dashboard';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1E18] flex flex-col lg:flex-row">
      {/* CLEAN LIGHT MODE SIDEBAR (#F0ECE1) */}
      <aside className="w-full shrink-0 border-b border-[#E5DEC9] bg-[#F0ECE1] lg:w-72 lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col justify-between p-5">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between gap-2 pb-5 border-b border-[#E0D8C6]">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D] text-white">
                  <Leaf className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-serif text-lg font-bold leading-none text-[#2C1E18]">
                    CORA Admin
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#6E5C52]">
                    Circular Operations
                  </p>
                </div>
              </Link>
              <span className="rounded-full bg-[#3B5B3D]/12 px-2.5 py-0.5 text-[10px] font-bold text-[#3B5B3D]">
                Light
              </span>
            </div>

            {/* Sidebar Navigation */}
            <nav
              aria-label="Menu Admin Dashboard"
              className="mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1"
            >
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between gap-2.5 rounded-2xl px-4 py-3 text-left text-xs font-semibold transition sm:text-sm ${
                      active
                        ? 'bg-[#3B5B3D] text-white shadow-sm'
                        : 'text-[#2C1E18]/85 hover:bg-[#E6E0D0] hover:text-[#2C1E18]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </span>
                    {tab.badge !== undefined && (
                      <span
                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                          active
                            ? 'bg-white text-[#3B5B3D]'
                            : 'bg-[#3B5B3D] text-white'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 hidden border-t border-[#E0D8C6] pt-4 lg:block">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#3B5B3D] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Storefront CORA
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 min-w-0">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-30 border-b border-[#E5DEC9] bg-[#FAF8F5]/95 px-4 py-4 backdrop-blur-md sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <div>
                <h1 className="font-serif text-xl font-bold text-[#2C1E18] sm:text-2xl">
                  {activeTabTitle}
                </h1>
                <p className="text-xs text-[#6E5C52]">
                  Kelola transaksi, laporan keuangan, produk, rekening, dan
                  penjemputan ampas kelapa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DEC9] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C1E18] transition hover:bg-[#F0ECE1] lg:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Storefront
              </Link>
              <button
                type="button"
                onClick={handleResetDemo}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#3B5B3D]/30 bg-white px-4 py-2 text-xs font-semibold text-[#3B5B3D] shadow-2xs transition hover:bg-[#3B5B3D] hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Data Demo
              </button>
            </div>
          </div>

          {toastMessage && (
            <div
              role="status"
              className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#3B5B3D] px-4 py-2.5 text-xs font-medium text-white shadow-sm"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B8E3A6]" />
                {toastMessage}
              </span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="rounded-full p-0.5 hover:bg-white/15"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </header>

        {/* Tab Content */}
        <main className="p-4 sm:p-8 space-y-8">
          {/* ============================================================== */}
          {/* TAB 1: VERIFIKASI PESANAN & PENGIRIMAN                         */}
          {/* ============================================================== */}
          {activeTab === 'orders' && (
            <section className="space-y-6">
              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { label: 'Semua', value: 'ALL' },
                    {
                      label: 'Menunggu Verifikasi',
                      value: 'WAITING_VERIFICATION',
                    },
                    { label: 'Diproses', value: 'PROCESSING' },
                    { label: 'Dikirim', value: 'SHIPPED' },
                    { label: 'Selesai', value: 'COMPLETED' },
                    { label: 'Ditolak', value: 'REJECTED' },
                  ] as { label: string; value: OrderFilter }[]
                ).map((tab) => {
                  const active = orderFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setOrderFilter(tab.value)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        active
                          ? 'bg-[#3B5B3D] text-white'
                          : 'border border-[#E5DEC9] bg-white text-[#5C4B42] hover:bg-[#F0ECE1]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Orders Table */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-5 py-4">No. Order &amp; Tanggal</th>
                        <th className="px-5 py-4">Pelanggan</th>
                        <th className="px-5 py-4">Produk &amp; Total</th>
                        <th className="px-5 py-4">Bukti Transfer</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Resi &amp; Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-sm text-[#6E5C52]"
                          >
                            Tidak ada pesanan pada filter status ini.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const badge = getOrderBadge(order.status);
                          const currentResi =
                            trackingDrafts[order.id] ??
                            order.trackingNumber ??
                            '';

                          return (
                            <tr
                              key={order.id}
                              className="align-top transition hover:bg-[#FAF8F5]/60"
                            >
                              <td className="px-5 py-4">
                                <p className="font-mono font-bold text-[#2C1E18]">
                                  #{order.orderNumber}
                                </p>
                                <p className="mt-1 text-[11px] text-[#6E5C52]">
                                  {formatDateTime(order.createdAt)}
                                </p>
                                <p className="mt-1 text-[11px] font-medium text-[#3B5B3D]">
                                  {order.bankAccountUsed}
                                </p>
                              </td>

                              <td className="px-5 py-4 max-w-[210px]">
                                <p className="font-bold text-[#2C1E18]">
                                  {order.customerName}
                                </p>
                                <p className="text-[11px] text-[#6E5C52]">
                                  {order.customerPhone}
                                </p>
                                <p className="mt-1 line-clamp-2 text-[11px] text-[#6E5C52]">
                                  {order.shippingAddress}
                                </p>
                              </td>

                              <td className="px-5 py-4">
                                <ul className="space-y-0.5 text-[11px] text-[#5C4B42]">
                                  {order.items.map((item) => (
                                    <li key={item.productId}>
                                      {item.qty}× {item.productName}
                                    </li>
                                  ))}
                                </ul>
                                <p className="mt-2 text-sm font-extrabold text-[#2C1E18]">
                                  {formatRupiah(order.totalAmount)}
                                </p>
                              </td>

                              <td className="px-5 py-4">
                                <button
                                  type="button"
                                  onClick={() => setProofModalOrder(order)}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-[#3B5B3D]/30 bg-[#3B5B3D]/8 px-3 py-1.5 text-[11px] font-semibold text-[#3B5B3D] transition hover:bg-[#3B5B3D] hover:text-white"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Cek Bukti Transfer
                                </button>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${badge.className}`}
                                >
                                  {badge.label}
                                </span>
                                {order.trackingNumber && (
                                  <p className="mt-1.5 font-mono text-[11px] font-semibold text-[#3B5B3D]">
                                    Resi: {order.trackingNumber}
                                  </p>
                                )}
                              </td>

                              <td className="px-5 py-4 space-y-2.5 min-w-[230px]">
                                {order.status === 'WAITING_VERIFICATION' && (
                                  <div className="flex flex-wrap gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleApproveOrder(order)}
                                      className="inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#2F4A31]"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      Terima Pembayaran
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectOrder(order)}
                                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-100"
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                      Tolak
                                    </button>
                                  </div>
                                )}

                                {(order.status === 'PROCESSING' ||
                                  order.status === 'SHIPPED') && (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={currentResi}
                                      onChange={(e) =>
                                        setTrackingDrafts((prev) => ({
                                          ...prev,
                                          [order.id]: e.target.value,
                                        }))
                                      }
                                      placeholder="Input Nomor Resi (opsional)"
                                      className="w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] px-3 py-1.5 text-[11px] text-[#2C1E18] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                                    />
                                    <div className="flex flex-wrap gap-1.5">
                                      {order.status === 'PROCESSING' && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateShippingStatus(
                                              order,
                                              'SHIPPED'
                                            )
                                          }
                                          className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                          <Truck className="h-3 w-3" />
                                          SHIPPED (Dikirim)
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateShippingStatus(
                                            order,
                                            'COMPLETED'
                                          )
                                        }
                                        className="inline-flex items-center gap-1 rounded-full bg-[#4E9A34] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#3F8129]"
                                      >
                                        <BadgeCheck className="h-3 w-3" />
                                        COMPLETED (Selesai)
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {(order.status === 'COMPLETED' ||
                                  order.status === 'REJECTED') && (
                                  <span className="text-[11px] text-[#8A776C]">
                                    Transaksi final
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 2: LAPORAN KEUANGAN (FINANCIAL REPORT)                     */}
          {/* ============================================================== */}
          {activeTab === 'finance' && (
            <section className="space-y-8">
              {/* 4 Summary KPI Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Total Pendapatan Lunas
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-[#2C1E18]">
                    {formatRupiah(financeStats.grossRevenue)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#3B5B3D]">
                    Gross Revenue terverifikasi
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Total Pengeluaran
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <TrendingDown className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-[#2C1E18]">
                    {formatRupiah(financeStats.totalExpense)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Operasional &amp; bahan baku
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Estimasi Laba Bersih
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4E9A34]/12 text-[#4E9A34]">
                      <Wallet className="h-4 w-4" />
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-2xl font-extrabold ${
                      financeStats.netProfit >= 0
                        ? 'text-[#3B5B3D]'
                        : 'text-red-600'
                    }`}
                  >
                    {formatRupiah(financeStats.netProfit)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Net Profit berjalan
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Total Pesanan Terverifikasi
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-[#2C1E18]">
                    {financeStats.verifiedOrders}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Order status Diproses / Dikirim / Selesai
                  </p>
                </div>
              </div>

              {/* Visual Chart + Manual Expense Form */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Visual Comparison Chart */}
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs lg:col-span-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#2C1E18]">
                        Perbandingan Pemasukan &amp; Pengeluaran
                      </h2>
                      <p className="text-xs text-[#6E5C52]">
                        Ringkasan arus kas aktual berdasarkan buku kas CORA.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export Laporan (CSV)
                    </button>
                  </div>

                  {/* Proportional Comparison Bars */}
                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#3B5B3D]">
                          Total Pemasukan (INCOME)
                        </span>
                        <span className="font-bold text-[#2C1E18]">
                          {formatRupiah(financeStats.grossRevenue)}
                        </span>
                      </div>
                      <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-[#FAF8F5] ring-1 ring-[#E5DEC9]">
                        <div
                          className="h-full rounded-full bg-[#3B5B3D] transition-all duration-500"
                          style={{ width: `${financeStats.incomePct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-rose-700">
                          Total Pengeluaran (EXPENSE)
                        </span>
                        <span className="font-bold text-[#2C1E18]">
                          {formatRupiah(financeStats.totalExpense)}
                        </span>
                      </div>
                      <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-[#FAF8F5] ring-1 ring-[#E5DEC9]">
                        <div
                          className="h-full rounded-full bg-rose-500 transition-all duration-500"
                          style={{ width: `${financeStats.expensePct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="mt-7 border-t border-[#F0EAE0] pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6E5C52]">
                      Ringkasan per Kategori
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {financeStats.categoryTotals.map(([cat, totals]) => (
                        <div
                          key={cat}
                          className="flex items-center justify-between rounded-2xl bg-[#FAF8F5] px-3.5 py-2.5 text-xs ring-1 ring-[#E5DEC9]/70"
                        >
                          <span className="font-semibold text-[#2C1E18]">
                            {cat}
                          </span>
                          <span
                            className={`font-bold ${
                              totals.income >= totals.expense
                                ? 'text-[#3B5B3D]'
                                : 'text-rose-600'
                            }`}
                          >
                            {totals.income > 0 &&
                              `+${formatRupiah(totals.income)}`}
                            {totals.expense > 0 &&
                              ` -${formatRupiah(totals.expense)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Manual Operational Expense Form */}
                <form
                  onSubmit={handleAddExpense}
                  className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs lg:col-span-5 space-y-4"
                >
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#2C1E18]">
                      Catat Pengeluaran Operasional
                    </h2>
                    <p className="text-xs text-[#6E5C52]">
                      Tambahkan biaya bahan baku ampas kelapa, kemasan, atau
                      logistik secara manual.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="expDesc"
                      className="block text-xs font-semibold text-[#2C1E18]"
                    >
                      Keterangan Pengeluaran
                    </label>
                    <input
                      id="expDesc"
                      type="text"
                      required
                      value={expDescription}
                      onChange={(e) => setExpDescription(e.target.value)}
                      placeholder="Contoh: Beli Bahan Baku Ampas Kelapa"
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="expCat"
                        className="block text-xs font-semibold text-[#2C1E18]"
                      >
                        Kategori
                      </label>
                      <select
                        id="expCat"
                        value={expCategory}
                        onChange={(e) => setExpCategory(e.target.value)}
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      >
                        <option value="Bahan Baku">Bahan Baku</option>
                        <option value="Biaya Kemasan">Biaya Kemasan</option>
                        <option value="Logistik Pickup">Logistik Pickup</option>
                        <option value="Operasional">Operasional</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="expAmount"
                        className="block text-xs font-semibold text-[#2C1E18]"
                      >
                        Nominal (Rp)
                      </label>
                      <input
                        id="expAmount"
                        type="number"
                        min={1000}
                        step={500}
                        required
                        value={expAmount}
                        onChange={(e) => setExpAmount(e.target.value)}
                        placeholder="50000"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Pengeluaran ke Buku Kas
                  </button>
                </form>
              </div>

              {/* Cash Book Table */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="border-b border-[#E5DEC9] px-6 py-4">
                  <h2 className="font-serif text-lg font-bold text-[#2C1E18]">
                    Buku Kas (Financial Records)
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-5 py-3.5">Tanggal</th>
                        <th className="px-5 py-3.5">No. Order</th>
                        <th className="px-5 py-3.5">Keterangan</th>
                        <th className="px-5 py-3.5">Kategori</th>
                        <th className="px-5 py-3.5">Tipe</th>
                        <th className="px-5 py-3.5 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {financialRecords.map((rec) => {
                        const isIncome = rec.type === 'INCOME';
                        return (
                          <tr
                            key={rec.id}
                            className="transition hover:bg-[#FAF8F5]/60"
                          >
                            <td className="px-5 py-3.5 text-[#6E5C52] whitespace-nowrap">
                              {formatDateTime(rec.date)}
                            </td>
                            <td className="px-5 py-3.5 font-mono font-semibold text-[#2C1E18]">
                              {rec.orderNumber ? `#${rec.orderNumber}` : '—'}
                            </td>
                            <td className="px-5 py-3.5 font-medium text-[#2C1E18]">
                              {rec.description}
                            </td>
                            <td className="px-5 py-3.5 text-[#5C4B42]">
                              {rec.category}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                  isIncome
                                    ? 'bg-[#3B5B3D]/12 text-[#3B5B3D]'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                              </span>
                            </td>
                            <td
                              className={`px-5 py-3.5 text-right font-bold whitespace-nowrap ${
                                isIncome ? 'text-[#3B5B3D]' : 'text-rose-600'
                              }`}
                            >
                              {isIncome ? '+' : '-'}
                              {formatRupiah(rec.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 3: CMS PRODUK & NOMOR REKENING                             */}
          {/* ============================================================== */}
          {activeTab === 'cms' && (
            <section className="space-y-8">
              {/* Product Management */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#2C1E18]">
                      Manajemen Produk CORA
                    </h2>
                    <p className="text-xs text-[#6E5C52]">
                      Tambah produk baru, ubah harga &amp; stok cepat langsung di
                      tabel, atau hapus produk.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewProductForm}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Produk Baru
                  </button>
                </div>

                {showProductForm && (
                  <form
                    onSubmit={handleSaveProductForm}
                    className="rounded-3xl border border-[#3B5B3D]/25 bg-white p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
                      <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                        {editingProductId
                          ? 'Edit Detail Produk'
                          : 'Tambah Produk Baru'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="rounded-full p-1 text-[#6E5C52] hover:bg-[#F0ECE1]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Nama Produk *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="CORA Coconut Granola"
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={prodSubtitle}
                          onChange={(e) => setProdSubtitle(e.target.value)}
                          placeholder="Coconut Based Snack"
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Kategori
                        </label>
                        <select
                          value={prodCategory}
                          onChange={(e) =>
                            setProdCategory(e.target.value as ProductCategory)
                          }
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        >
                          <option value="Brownies">Brownies</option>
                          <option value="Cookies">Cookies</option>
                          <option value="Flour">Flour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Harga (Rp) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          placeholder="35000"
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Stok *
                        </label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={prodStock}
                          onChange={(e) => setProdStock(e.target.value)}
                          placeholder="30"
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Residu Kelapa Diselamatkan (g)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={prodResidue}
                          onChange={(e) => setProdResidue(e.target.value)}
                          placeholder="250"
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Berat Bersih (g)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={prodWeight}
                          onChange={(e) => setProdWeight(e.target.value)}
                          placeholder="200"
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#2C1E18]">
                          Preset Gambar Kemasan
                        </label>
                        <select
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                        >
                          {IMAGE_PRESETS.map((preset) => (
                            <option key={preset.value} value={preset.value}>
                              {preset.label} ({preset.value})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2C1E18]">
                        Deskripsi Singkat
                      </label>
                      <textarea
                        rows={2}
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        placeholder="Deskripsi keunggulan produk sirkular CORA..."
                        className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="rounded-full border border-[#E5DEC9] px-4 py-2 text-xs font-semibold text-[#5C4B42] hover:bg-[#FAF8F5]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Simpan Produk
                      </button>
                    </div>
                  </form>
                )}

                {/* Product Table with Quick Price & Stock Edit */}
                <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                          <th className="px-5 py-3.5">Produk</th>
                          <th className="px-5 py-3.5">Kategori &amp; Impact</th>
                          <th className="px-5 py-3.5">Edit Cepat Harga (Rp)</th>
                          <th className="px-5 py-3.5">Edit Cepat Stok</th>
                          <th className="px-5 py-3.5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE0]">
                        {products.map((product) => {
                          const draft = quickEdits[product.id];
                          const priceVal = draft
                            ? draft.price
                            : String(product.price);
                          const stockVal = draft
                            ? draft.stock
                            : String(product.stock);
                          const hasChanges = Boolean(draft);

                          return (
                            <tr
                              key={product.id}
                              className="transition hover:bg-[#FAF8F5]/60"
                            >
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#FAF8F5] ring-1 ring-[#E5DEC9]">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      unoptimized
                                      className="object-contain p-1"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#2C1E18]">
                                      {product.name}
                                    </p>
                                    <p className="text-[11px] text-[#6E5C52]">
                                      {product.subtitle} • {product.weightGram}g
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="inline-block rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#3B5B3D]">
                                  {product.category}
                                </span>
                                <p className="mt-1 text-[11px] text-[#6E5C52]">
                                  Hemat {product.residueSavedGram}g residu
                                </p>
                              </td>
                              <td className="px-5 py-3.5">
                                <input
                                  type="number"
                                  min={0}
                                  value={priceVal}
                                  onChange={(e) =>
                                    setQuickEdits((prev) => ({
                                      ...prev,
                                      [product.id]: {
                                        price: e.target.value,
                                        stock:
                                          prev[product.id]?.stock ??
                                          String(product.stock),
                                      },
                                    }))
                                  }
                                  className="w-28 rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#2C1E18] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                                />
                              </td>
                              <td className="px-5 py-3.5">
                                <input
                                  type="number"
                                  min={0}
                                  value={stockVal}
                                  onChange={(e) =>
                                    setQuickEdits((prev) => ({
                                      ...prev,
                                      [product.id]: {
                                        price:
                                          prev[product.id]?.price ??
                                          String(product.price),
                                        stock: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-20 rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#2C1E18] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                                />
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  {hasChanges && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleQuickSaveProduct(product)
                                      }
                                      className="inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#2F4A31]"
                                    >
                                      <Save className="h-3 w-3" />
                                      Simpan
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => openEditProductForm(product)}
                                    className="inline-flex items-center gap-1 rounded-full border border-[#E5DEC9] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#2C1E18] hover:bg-[#F0ECE1]"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      deleteProduct(product.id);
                                      showToast(
                                        `Produk ${product.name} dihapus.`
                                      );
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bank Account Settings */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#2C1E18]">
                        Daftar Rekening Bank Resmi CORA
                      </h2>
                      <p className="text-xs text-[#6E5C52]">
                        Rekening berstatus aktif otomatis tampil di halaman
                        Checkout pembeli.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {bankAccounts.map((bank) => (
                      <div
                        key={bank.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FAF8F5] p-4 ring-1 ring-[#E5DEC9]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#2C1E18]">
                              {bank.bankName}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                bank.isActive
                                  ? 'bg-[#3B5B3D]/12 text-[#3B5B3D]'
                                  : 'bg-zinc-200 text-zinc-600'
                              }`}
                            >
                              {bank.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                          <p className="mt-1 font-mono text-sm font-bold text-[#3B5B3D]">
                            {bank.accountNumber}
                          </p>
                          <p className="text-xs text-[#6E5C52]">
                            a.n. {bank.accountHolder}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              saveBankAccount({
                                ...bank,
                                isActive: !bank.isActive,
                              });
                              showToast(
                                `Status rekening ${bank.bankName} diperbarui.`
                              );
                            }}
                            className="rounded-full border border-[#E5DEC9] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C1E18] hover:bg-[#F0ECE1]"
                          >
                            {bank.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditBank(bank)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#3B5B3D]/10 px-3 py-1.5 text-xs font-semibold text-[#3B5B3D] hover:bg-[#3B5B3D] hover:text-white"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={handleSaveBankForm}
                  className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs lg:col-span-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-[#2C1E18]">
                      {editingBankId
                        ? 'Ubah Rekening Bank'
                        : 'Tambah Rekening Bank'}
                    </h2>
                    {editingBankId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBankId(null);
                          setBankName('');
                          setAccountNumber('');
                          setAccountHolder('PT CORA Circular Innovation');
                          setBankIsActive(true);
                        }}
                        className="text-xs font-semibold text-[#6E5C52] hover:underline"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Contoh: Bank BRI / Bank BNI"
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Contoh: 001239812391"
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 font-mono text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Nama Pemilik Rekening
                    </label>
                    <input
                      type="text"
                      required
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#2C1E18]">
                    <input
                      type="checkbox"
                      checked={bankIsActive}
                      onChange={(e) => setBankIsActive(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#3B5B3D]"
                    />
                    Tampilkan di halaman Checkout pembeli
                  </label>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                  >
                    <Save className="h-4 w-4" />
                    {editingBankId
                      ? 'Simpan Perubahan Rekening'
                      : 'Simpan Rekening Baru'}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 4: JADWAL COCONUT PICKUP                                   */}
          {/* ============================================================== */}
          {activeTab === 'pickup' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Total Permintaan Mitra
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    {pickupRequests.length}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Menunggu Dijadwalkan (Pending)
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-amber-700">
                    {pendingPickupsCount}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Total Estimasi Ampas Kelapa
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#3B5B3D]">
                    {pickupRequests.reduce((s, p) => s + p.estimatedKg, 0)} kg
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-5 py-4">Mitra / Supplier</th>
                        <th className="px-5 py-4">Lokasi Penjemputan</th>
                        <th className="px-5 py-4">Estimasi Berat</th>
                        <th className="px-5 py-4">Tanggal Jemput</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Ubah Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {pickupRequests.map((req) => {
                        const badge = getPickupBadge(req.status);
                        return (
                          <tr
                            key={req.id}
                            className="transition hover:bg-[#FAF8F5]/60"
                          >
                            <td className="px-5 py-4">
                              <p className="font-bold text-[#2C1E18]">
                                {req.supplierName}
                              </p>
                              <p className="mt-0.5 text-[11px] text-[#6E5C52]">
                                {req.phone}
                              </p>
                            </td>
                            <td className="px-5 py-4 max-w-xs text-[#5C4B42]">
                              {req.location}
                            </td>
                            <td className="px-5 py-4 font-bold text-[#2C1E18]">
                              {req.estimatedKg} kg
                            </td>
                            <td className="px-5 py-4 text-[#5C4B42]">
                              {req.preferredDate}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex flex-wrap justify-end gap-1.5">
                                {req.status === 'PENDING' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updatePickupStatus(req.id, 'SCHEDULED');
                                      showToast(
                                        `Penjemputan ${req.supplierName} dijadwalkan.`
                                      );
                                    }}
                                    className="rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-700"
                                  >
                                    Jadwalkan
                                  </button>
                                )}
                                {req.status !== 'COMPLETED' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updatePickupStatus(req.id, 'COMPLETED');
                                      showToast(
                                        `Penjemputan ${req.supplierName} ditandai Selesai Dijemput.`
                                      );
                                    }}
                                    className="rounded-full bg-[#3B5B3D] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#2F4A31]"
                                  >
                                    Selesai Dijemput
                                  </button>
                                )}
                                {req.status === 'COMPLETED' && (
                                  <span className="text-[11px] font-semibold text-[#3B5B3D]">
                                    Tuntas ✓
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODAL: CEK BUKTI TRANSFER */}
      {proofModalOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Modal Cek Bukti Transfer"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] px-6 py-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                  Verifikasi Bukti Transfer
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  Order #{proofModalOrder.orderNumber} •{' '}
                  {proofModalOrder.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProofModalOrder(null)}
                aria-label="Tutup modal"
                className="rounded-full p-1.5 text-[#6E5C52] hover:bg-[#F0ECE1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#FAF8F5] p-4 text-xs ring-1 ring-[#E5DEC9]">
                <div>
                  <p className="text-[#6E5C52]">Nominal Tagihan</p>
                  <p className="mt-0.5 text-base font-extrabold text-[#2C1E18]">
                    {formatRupiah(proofModalOrder.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[#6E5C52]">Rekening Tujuan</p>
                  <p className="mt-0.5 font-bold text-[#3B5B3D]">
                    {proofModalOrder.bankAccountUsed}
                  </p>
                </div>
              </div>

              <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-[#FAF8F5] ring-1 ring-[#E5DEC9]">
                <Image
                  src={proofModalOrder.proofImage}
                  alt={`Bukti transfer ${proofModalOrder.orderNumber}`}
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              {proofModalOrder.status === 'WAITING_VERIFICATION' ? (
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleRejectOrder(proofModalOrder)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    <XCircle className="h-4 w-4" />
                    Tolak
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveOrder(proofModalOrder)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                  >
                    <Check className="h-4 w-4" />
                    Terima Pembayaran (Approve)
                  </button>
                </div>
              ) : (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setProofModalOrder(null)}
                    className="rounded-full bg-[#F0ECE1] px-5 py-2 text-xs font-semibold text-[#2C1E18] hover:bg-[#E5DEC9]"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

