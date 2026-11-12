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
  ImagePlus,
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
  UploadCloud,
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
        label: 'Awaiting Verification',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'PROCESSING':
      return {
        label: 'Processing',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'SHIPPED':
      return {
        label: 'Shipped',
        className: 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
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
        label: 'Scheduled',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
  }
}

const IMAGE_PRESETS: { label: string; value: string }[] = [
  { label: 'CORA Brownies Box', value: '/images/products/brownies.jpg' },
  { label: 'CORA Cookies Pouch', value: '/images/products/cookies.jpg' },
  { label: 'CORA Coconut Flour', value: '/images/products/coconut.jpg' },
  { label: 'CORA Hero Trio', value: '/images/hero/hero.jpg' },
  { label: 'Brownies Cubes', value: '/images/journey/brownies.jpg' },
  { label: 'Cookies Stack', value: '/images/journey/cookies.jpg' },
  { label: 'Raw Coconut', value: '/images/ingredients/coconut.jpg' },
  { label: 'Flour Bowl', value: '/images/ingredients/coconut-flour.jpg' },
];

async function productImageFileToDataUrl(file: File): Promise<string> {
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

  if (file.size <= 250 * 1024 || file.type === 'image/svg+xml') {
    return rawDataUrl;
  }

  return new Promise<string>((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const maxDim = 800;
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
      const outputMime =
        file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      resolve(canvas.toDataURL(outputMime, 0.82));
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

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
  const [expCategory, setExpCategory] = useState('Raw Materials');
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
    showToast('All demo data in LocalStorage has been restored to default.');
  };

  // --- Tab 1 Handlers ---
  const handleApproveOrder = (order: Order) => {
    const draftResi = trackingDrafts[order.id]?.trim();
    verifyOrderPayment(order.id, 'APPROVE', draftResi || undefined);
    setProofModalOrder(null);
    showToast(
      `Payment for #${order.orderNumber} approved. Inventory deducted & revenue recorded.`
    );
  };

  const handleRejectOrder = (order: Order) => {
    verifyOrderPayment(order.id, 'REJECT');
    setProofModalOrder(null);
    showToast(`Order #${order.orderNumber} rejected.`);
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
      `Status for #${order.orderNumber} updated to ${
        nextStatus === 'SHIPPED' ? 'SHIPPED' : 'COMPLETED'
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
    showToast('Operational expense recorded in the cash book.');
  };

  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Order No.',
      'Description',
      'Category',
      'Type',
      'Amount (IDR)',
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
      escapeCsv(rec.type === 'INCOME' ? 'Income' : 'Expense'),
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
    showToast('Financial report downloaded successfully as CSV.');
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
        'Nutritious circular food product handcrafted from CORA coconut residue.',
    });
    setShowProductForm(false);
    showToast(
      editingProductId
        ? 'Product updated successfully.'
        : 'New product added to catalog.'
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
    showToast(`Price & inventory for ${product.name} updated.`);
  };

  const handleQuickPhotoUpload = async (
    product: Product,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    try {
      const dataUrl = await productImageFileToDataUrl(file);
      saveProduct({ ...product, image: dataUrl });
      showToast(`Product photo for ${product.name} updated.`);
    } catch {
      showToast('Failed to process product photo.');
    }
  };

  const handleModalPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    try {
      const dataUrl = await productImageFileToDataUrl(file);
      setProdImage(dataUrl);
    } catch {
      showToast('Failed to process product photo.');
    }
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
    showToast('CORA bank account settings saved successfully.');
  };

  const NAV_TABS: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'orders',
      label: 'Order Verification',
      icon: ClipboardCheck,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'finance',
      label: 'Financial Reports',
      icon: Wallet,
    },
    {
      id: 'cms',
      label: 'Product CMS & Bank Accounts',
      icon: Package,
    },
    {
      id: 'pickup',
      label: 'Coconut Pickup Schedule',
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
              aria-label="Admin Dashboard Menu"
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
              Return to CORA Storefront
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
                <h1 className="font-serif text-xl font-bold tracking-tight text-[#2C1E18] sm:text-2xl">
                  {activeTabTitle}
                </h1>
                <p className="text-xs text-[#6E5C52]">
                  Manage transactions, financial cash flow, product catalog,
                  bank accounts, and coconut residue pickups.
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
                Reset Demo Data
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
          {/* TAB 1: ORDER VERIFICATION & SHIPPING                           */}
          {/* ============================================================== */}
          {activeTab === 'orders' && (
            <section className="animate-cora-fade-in space-y-6">
              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { label: 'All', value: 'ALL' },
                    {
                      label: 'Awaiting Verification',
                      value: 'WAITING_VERIFICATION',
                    },
                    { label: 'Processing', value: 'PROCESSING' },
                    { label: 'Shipped', value: 'SHIPPED' },
                    { label: 'Completed', value: 'COMPLETED' },
                    { label: 'Rejected', value: 'REJECTED' },
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
                        <th className="px-5 py-4">Order No. &amp; Date</th>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Items &amp; Total</th>
                        <th className="px-5 py-4">Transfer Proof</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Tracking &amp; Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-sm text-[#6E5C52]"
                          >
                            No orders found for this status filter.
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
                                <p className="mt-2 text-sm font-extrabold tabular-nums text-[#2C1E18]">
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
                                  View Transfer Proof
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
                                    Tracking: {order.trackingNumber}
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
                                      Approve Payment
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectOrder(order)}
                                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-100"
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                      Reject
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
                                      placeholder="Tracking / Waybill No. (optional)"
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
                                          SHIPPED
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
                                        COMPLETED
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {(order.status === 'COMPLETED' ||
                                  order.status === 'REJECTED') && (
                                  <span className="text-[11px] text-[#8A776C]">
                                    Final transaction
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
            <section className="animate-cora-fade-in space-y-8">
              {/* 4 Summary KPI Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Gross Revenue
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold tabular-nums tracking-tight text-[#2C1E18]">
                    {formatRupiah(financeStats.grossRevenue)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#3B5B3D]">
                    Verified gross receipts
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Total Expenses
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <TrendingDown className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold tabular-nums tracking-tight text-[#2C1E18]">
                    {formatRupiah(financeStats.totalExpense)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Operations &amp; raw materials
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Estimated Net Profit
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4E9A34]/12 text-[#4E9A34]">
                      <Wallet className="h-4 w-4" />
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-2xl font-extrabold tabular-nums tracking-tight ${
                      financeStats.netProfit >= 0
                        ? 'text-[#3B5B3D]'
                        : 'text-red-600'
                    }`}
                  >
                    {formatRupiah(financeStats.netProfit)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Current net profit
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6E5C52]">
                      Verified Orders
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-[#2C1E18]">
                    {financeStats.verifiedOrders}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Processing / Shipped / Completed
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
                        Cash Flow Comparison
                      </h2>
                      <p className="text-xs text-[#6E5C52]">
                        Actual income vs. expenses recorded in the CORA cash book.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export Report (CSV)
                    </button>
                  </div>

                  {/* Proportional Comparison Bars */}
                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#3B5B3D]">
                          Total Income (INCOME)
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
                          Total Expense (EXPENSE)
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
                      Category Breakdown
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
                      Record Operational Expense
                    </h2>
                    <p className="text-xs text-[#6E5C52]">
                      Log coconut residue raw material purchases, packaging, or
                      logistics expenses manually.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="expDesc"
                      className="block text-xs font-semibold text-[#2C1E18]"
                    >
                      Expense Description
                    </label>
                    <input
                      id="expDesc"
                      type="text"
                      required
                      value={expDescription}
                      onChange={(e) => setExpDescription(e.target.value)}
                      placeholder="e.g. Purchased 200kg Coconut Residue"
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="expCat"
                        className="block text-xs font-semibold text-[#2C1E18]"
                      >
                        Category
                      </label>
                      <select
                        id="expCat"
                        value={expCategory}
                        onChange={(e) => setExpCategory(e.target.value)}
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      >
                        <option value="Raw Materials">Raw Materials</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Pickup Logistics">Pickup Logistics</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="expAmount"
                        className="block text-xs font-semibold text-[#2C1E18]"
                      >
                        Amount (IDR)
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
                    Add Expense to Cash Book
                  </button>
                </form>
              </div>

              {/* Cash Book Table */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="border-b border-[#E5DEC9] px-6 py-4">
                  <h2 className="font-serif text-lg font-bold text-[#2C1E18]">
                    Cash Book (Financial Records)
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-5 py-3.5">Date</th>
                        <th className="px-5 py-3.5">Order No.</th>
                        <th className="px-5 py-3.5">Description</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Type</th>
                        <th className="px-5 py-3.5 text-right">Amount</th>
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
                                {isIncome ? 'Income' : 'Expense'}
                              </span>
                            </td>
                            <td
                              className={`px-5 py-3.5 text-right font-bold tabular-nums whitespace-nowrap ${
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
          {/* TAB 3: PRODUCT CMS & BANK ACCOUNTS                             */}
          {/* ============================================================== */}
          {activeTab === 'cms' && (
            <section className="animate-cora-fade-in space-y-8">
              {/* Product Management */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#2C1E18]">
                      CORA Product Catalog Management
                    </h2>
                    <p className="text-xs text-[#6E5C52]">
                      Add new products, edit details &amp; replace packaging photos,
                      adjust quick pricing &amp; inventory, or delete items.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewProductForm}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </button>
                </div>

                {/* Product Table with Quick Price, Stock & Photo Edit */}
                <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                          <th className="px-5 py-3.5">Product</th>
                          <th className="px-5 py-3.5">Category &amp; Impact</th>
                          <th className="px-5 py-3.5">Quick Price (IDR)</th>
                          <th className="px-5 py-3.5">Quick Stock</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
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
                                  <label
                                    title="Click to replace product photo"
                                    className="group/img relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#FAF8F5] ring-1 ring-[#E5DEC9]"
                                  >
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      unoptimized
                                      className="object-contain p-1 transition group-hover/img:opacity-65"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center bg-[#2C1E18]/45 text-white opacity-0 transition group-hover/img:opacity-100">
                                      <ImagePlus className="h-4 w-4" />
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleQuickPhotoUpload(product, e)
                                      }
                                      className="sr-only"
                                    />
                                  </label>
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
                                  Saves {product.residueSavedGram}g residue
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
                                      Save
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
                                        `Product ${product.name} deleted.`
                                      );
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
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
                        Official CORA Bank Accounts
                      </h2>
                      <p className="text-xs text-[#6E5C52]">
                        Active bank accounts automatically appear on the customer
                        checkout page.
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
                              {bank.isActive ? 'Active' : 'Inactive'}
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
                                `Account status for ${bank.bankName} updated.`
                              );
                            }}
                            className="rounded-full border border-[#E5DEC9] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C1E18] hover:bg-[#F0ECE1]"
                          >
                            {bank.isActive ? 'Deactivate' : 'Activate'}
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
                        ? 'Edit Bank Account'
                        : 'Add Bank Account'}
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
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Bank Central Asia (BCA)"
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 8820192831"
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2.5 font-mono text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Account Holder Name
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
                    Display on customer Checkout page
                  </label>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                  >
                    <Save className="h-4 w-4" />
                    {editingBankId
                      ? 'Save Account Changes'
                      : 'Save New Bank Account'}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 4: COCONUT PICKUP SCHEDULE                                 */}
          {/* ============================================================== */}
          {activeTab === 'pickup' && (
            <section className="animate-cora-fade-in space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Total Partner Requests
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    {pickupRequests.length}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Awaiting Schedule (Pending)
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-amber-700">
                    {pendingPickupsCount}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Total Estimated Coconut Residue
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
                        <th className="px-5 py-4">Partner / Supplier</th>
                        <th className="px-5 py-4">Pickup Location</th>
                        <th className="px-5 py-4">Estimated Weight</th>
                        <th className="px-5 py-4">Preferred Date</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Update Status</th>
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
                                        `Pickup for ${req.supplierName} scheduled.`
                                      );
                                    }}
                                    className="rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-700"
                                  >
                                    Schedule
                                  </button>
                                )}
                                {req.status !== 'COMPLETED' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updatePickupStatus(req.id, 'COMPLETED');
                                      showToast(
                                        `Pickup for ${req.supplierName} marked as completed.`
                                      );
                                    }}
                                    className="rounded-full bg-[#3B5B3D] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#2F4A31]"
                                  >
                                    Mark as Picked Up
                                  </button>
                                )}
                                {req.status === 'COMPLETED' && (
                                  <span className="text-[11px] font-semibold text-[#3B5B3D]">
                                    Completed ✓
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

      {/* MODAL: ADD / EDIT PRODUCT & PHOTO */}
      {showProductForm && (
        <div
          className="animate-cora-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={
            editingProductId ? 'Edit Product Details' : 'Add New Product'
          }
        >
          <form
            onSubmit={handleSaveProductForm}
            className="animate-cora-modal max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E5DEC9] bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F0EAE0] bg-white px-6 py-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                  {editingProductId
                    ? 'Edit Product & Packaging Photo'
                    : 'Add New Product'}
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  Change product photo by uploading from your device, entering
                  an image URL, or selecting a CORA preset.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                aria-label="Close product modal"
                className="rounded-full p-1.5 text-[#6E5C52] hover:bg-[#F0ECE1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Photo Editor Section */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                  Product Photo
                </span>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white">
                    <Image
                      src={prodImage || IMAGE_PRESETS[0].value}
                      alt={prodName || 'Product preview'}
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2F4A31]">
                        <UploadCloud className="h-3.5 w-3.5" />
                        Upload Photo from Device
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleModalPhotoUpload}
                          className="sr-only"
                        />
                      </label>
                      <span className="text-[11px] text-[#6E5C52]">
                        PNG, JPG, WebP, or SVG
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5C4B42]">
                        Or enter Image URL / Path
                      </label>
                      <input
                        type="text"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="/images/products/brownies.jpg or https://..."
                        className="mt-1 w-full rounded-xl bg-white px-3 py-1.5 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-[#6E5C52]">
                        Presets:
                      </span>
                      {IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setProdImage(preset.value)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                            prodImage === preset.value
                              ? 'bg-[#2C1E18] text-white'
                              : 'bg-white text-[#5C4B42] ring-1 ring-[#E5DEC9] hover:bg-[#E6E3D8]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#2C1E18]">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="CORA Brownies"
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
                    placeholder="Coconut Based Brownies"
                    className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C1E18]">
                    Category
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
                    Price (IDR) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="38000"
                    className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C1E18]">
                    Stock *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="40"
                    className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Weight (g)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={prodWeight}
                      onChange={(e) => setProdWeight(e.target.value)}
                      placeholder="200"
                      className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Residue Saved (g)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={prodResidue}
                      onChange={(e) => setProdResidue(e.target.value)}
                      placeholder="250"
                      className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Brief summary of circular product benefits..."
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#F0EAE0] pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="rounded-full border border-[#E5DEC9] px-4 py-2 text-xs font-semibold text-[#5C4B42] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Product
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: VERIFY TRANSFER PROOF */}
      {proofModalOrder && (
        <div
          className="animate-cora-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Transfer Proof Verification Modal"
        >
          <div className="animate-cora-modal w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] px-6 py-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                  Verify Transfer Proof
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  Order #{proofModalOrder.orderNumber} •{' '}
                  {proofModalOrder.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProofModalOrder(null)}
                aria-label="Close modal"
                className="rounded-full p-1.5 text-[#6E5C52] hover:bg-[#F0ECE1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#FAF8F5] p-4 text-xs ring-1 ring-[#E5DEC9]">
                <div>
                  <p className="text-[#6E5C52]">Billed Amount</p>
                  <p className="mt-0.5 text-base font-extrabold text-[#2C1E18]">
                    {formatRupiah(proofModalOrder.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[#6E5C52]">Destination Account</p>
                  <p className="mt-0.5 font-bold text-[#3B5B3D]">
                    {proofModalOrder.bankAccountUsed}
                  </p>
                </div>
              </div>

              <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-[#FAF8F5] ring-1 ring-[#E5DEC9]">
                <Image
                  src={proofModalOrder.proofImage}
                  alt={`Transfer proof #${proofModalOrder.orderNumber}`}
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
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveOrder(proofModalOrder)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                  >
                    <Check className="h-4 w-4" />
                    Approve Payment
                  </button>
                </div>
              ) : (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setProofModalOrder(null)}
                    className="rounded-full bg-[#F0ECE1] px-5 py-2 text-xs font-semibold text-[#2C1E18] hover:bg-[#E5DEC9]"
                  >
                    Close
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

