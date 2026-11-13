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
  ChefHat,
  ClipboardCheck,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  ImagePlus,
  LayoutDashboard,
  Leaf,
  Package,
  Plus,
  RotateCcw,
  Save,
  Scale,
  Search,
  Sliders,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  UploadCloud,
  Users,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useCora } from '@/context/CoraContext';
import type {
  BankAccount,
  ImpactStatItem,
  Order,
  OrderStatus,
  PickupRequest,
  PickupRequestStatus,
  Product,
  ProductCategory,
  Recipe,
  RecipeCategory,
  Supplier,
  SupplierStatus,
} from '@/types/cora';

type AdminTab =
  | 'orders'
  | 'cms'
  | 'suppliers'
  | 'pickup'
  | 'recipes'
  | 'impact'
  | 'finance';
type OrderFilter = 'ALL' | OrderStatus;
type PickupFilter = 'ALL' | PickupRequestStatus;

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

function getSupplierBadge(status?: SupplierStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending Review',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'INACTIVE':
      return {
        label: 'Inactive / On Hold',
        className: 'bg-stone-100 text-stone-600 ring-1 ring-stone-200',
      };
    case 'ACTIVE':
    default:
      return {
        label: 'Verified Active',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
  }
}

function getPickupBadge(status: PickupRequestStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'REQUEST_SUBMITTED':
    case 'PENDING':
      return {
        label: 'Request Submitted',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'REQUEST_CONFIRMED':
    case 'SCHEDULED':
      return {
        label: 'Request Confirmed',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'ON_THE_WAY':
      return {
        label: 'Driver Dispatched',
        className: 'bg-purple-50 text-purple-800 ring-1 ring-purple-200',
      };
    case 'PICKED_UP':
      return {
        label: 'Residue Picked Up',
        className: 'bg-teal-50 text-teal-800 ring-1 ring-teal-200',
      };
    case 'COMPLETED':
    default:
      return {
        label: 'Completed / Processed',
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

const RECIPE_IMAGE_PRESETS: { label: string; value: string }[] = [
  { label: 'Crispy Cookies', value: '/images/products/cookies.jpg' },
  { label: 'Fudgy Brownies', value: '/images/products/brownies.jpg' },
  { label: 'Fluffy Pancakes', value: '/images/journey/cookies.jpg' },
  { label: 'Banana Cake / Muffins', value: '/images/journey/brownies.jpg' },
  { label: 'Coconut Flour Pack', value: '/images/products/coconut.jpg' },
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
    recipes,
    suppliers,
    userProfile,
    impactSettings,
    verifyOrderPayment,
    updateOrderStatus,
    saveProduct,
    deleteProduct,
    saveBankAccount,
    addManualExpense,
    updatePickupStatus,
    registerSupplier,
    saveSupplier,
    deleteSupplier,
    saveRecipe,
    deleteRecipe,
    updateImpactSettings,
    saveImpactIndicator,
    deleteImpactIndicator,
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

  // Tab 2: CMS Products & Bank State (List View)
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');
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
    'CORA Circular Innovation'
  );
  const [bankIsActive, setBankIsActive] = useState(true);

  // Tab 3: Supplier Network State (Add, Edit, Delete)
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [supName, setSupName] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supLocation, setSupLocation] = useState('');
  const [supType, setSupType] = useState('Pabrik Pengolahan Santan');
  const [supKg, setSupKg] = useState('25');
  const [supFreq, setSupFreq] = useState('Setiap Hari');
  const [supStatus, setSupStatus] = useState<SupplierStatus>('ACTIVE');

  // Tab 4: Pickup State
  const [pickupFilter, setPickupFilter] = useState<PickupFilter>('ALL');

  // Tab 5: RecipeHub CMS State
  const [recipeFilterCategory, setRecipeFilterCategory] = useState<string>('ALL');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [recTitle, setRecTitle] = useState('');
  const [recCategory, setRecCategory] = useState<RecipeCategory>(
    'Cookies and Biscuits'
  );
  const [recPrepTime, setRecPrepTime] = useState('15 mins');
  const [recCookTime, setRecCookTime] = useState('20 mins');
  const [recServings, setRecServings] = useState('4-6 portions');
  const [recCalories, setRecCalories] = useState('180');
  const [recDifficulty, setRecDifficulty] = useState<
    'Easy' | 'Medium' | 'Creative'
  >('Easy');
  const [recCoconutFlour, setRecCoconutFlour] = useState('50g Upcycled Coconut Flour');
  const [recSummary, setRecSummary] = useState('');
  const [recIngredientsText, setRecIngredientsText] = useState('');
  const [recStepsText, setRecStepsText] = useState('');
  const [recImage, setRecImage] = useState(RECIPE_IMAGE_PRESETS[0].value);

  // Tab 6: Our Impact CMS State
  const [impactUseCustom, setImpactUseCustom] = useState(
    impactSettings?.useCustomStats ?? false
  );
  const [impactResidueKg, setImpactResidueKg] = useState(
    String(impactSettings?.customResidueKg ?? 485.4)
  );
  const [impactFlourKg, setImpactFlourKg] = useState(
    String(impactSettings?.customFlourKg ?? 203.8)
  );
  const [impactSuppliersCount, setImpactSuppliersCount] = useState(
    String(impactSettings?.customSuppliersCount ?? 3)
  );
  const [impactProductsMarketed, setImpactProductsMarketed] = useState(
    String(impactSettings?.customProductsMarketed ?? 24)
  );
  const [impactCo2Avoided, setImpactCo2Avoided] = useState(
    String(impactSettings?.customCo2AvoidedKg ?? 1155.2)
  );
  const [impactNoteText, setImpactNoteText] = useState(
    impactSettings?.impactNote ??
      '*Note: Figures reflect actual operational data and live platform activities.'
  );

  // Indicator Modal
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [editingIndicatorId, setEditingIndicatorId] = useState<string | null>(null);
  const [indLabel, setIndLabel] = useState('');
  const [indValue, setIndValue] = useState('');
  const [indUnit, setIndUnit] = useState('kg');
  const [indDesc, setIndDesc] = useState('');

  // Tab 7: Finance State
  const [expDescription, setExpDescription] = useState('');
  const [expCategory, setExpCategory] = useState('Raw Materials');
  const [expAmount, setExpAmount] = useState('');

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
    () =>
      pickupRequests.filter(
        (p) => p.status === 'REQUEST_SUBMITTED' || p.status === 'PENDING'
      ).length,
    [pickupRequests]
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  // Filtered Pickups
  const filteredPickups = useMemo(() => {
    if (pickupFilter === 'ALL') return pickupRequests;
    return pickupRequests.filter((p) => p.status === pickupFilter);
  }, [pickupRequests, pickupFilter]);

  // Filtered Products (List View)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
      const q = productSearch.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [products, productCategoryFilter, productSearch]);

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    const q = supplierSearch.toLowerCase().trim();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.businessLocation.toLowerCase().includes(q) ||
        s.businessType.toLowerCase().includes(q)
    );
  }, [suppliers, supplierSearch]);

  // Filtered Recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchCat =
        recipeFilterCategory === 'ALL' || r.category === recipeFilterCategory;
      const q = recipeSearch.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.coconutFlourUsed.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [recipes, recipeFilterCategory, recipeSearch]);

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

  // Environmental Impact Auto Analytics
  const environmentalStats = useMemo(() => {
    const totalResidueFromOrdersKg =
      orders
        .filter((o) => o.status !== 'REJECTED')
        .reduce((sum, o) => {
          return (
            sum +
            o.items.reduce((itemSum, item) => {
              const product = products.find((p) => p.id === item.productId);
              return itemSum + (product?.residueSavedGram ?? 200) * item.qty;
            }, 0)
          );
        }, 0) / 1000;

    const totalResidueFromPickupsKg = pickupRequests
      .filter((p) => p.status === 'COMPLETED' || p.status === 'PICKED_UP')
      .reduce((sum, p) => sum + p.estimatedKg, 0);

    const totalUpcycledKg =
      485.4 +
      totalResidueFromOrdersKg +
      totalResidueFromPickupsKg;

    const totalFlourProducedKg = totalUpcycledKg * 0.42;
    const co2SavedKg = totalUpcycledKg * 2.38;

    return {
      totalUpcycledKg: totalUpcycledKg.toFixed(1),
      totalFlourProducedKg: totalFlourProducedKg.toFixed(1),
      co2SavedKg: co2SavedKg.toFixed(1),
      partnerSuppliersCount: suppliers.length,
      activePickupsCount: pickupRequests.length,
    };
  }, [orders, products, pickupRequests, suppliers]);

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

  const handleDirectOrderStatusChange = (
    order: Order,
    newStatus: OrderStatus
  ) => {
    const resi =
      trackingDrafts[order.id] !== undefined
        ? trackingDrafts[order.id]
        : order.trackingNumber ?? '';
    updateOrderStatus(order.id, newStatus, resi);
    const badge = getOrderBadge(newStatus);
    showToast(`Order #${order.orderNumber} status changed to ${badge.label}.`);
    if (proofModalOrder && proofModalOrder.id === order.id) {
      setProofModalOrder({
        ...proofModalOrder,
        status: newStatus,
        trackingNumber: resi,
      });
    }
  };

  const handleSaveTrackingResi = (order: Order) => {
    const resi = trackingDrafts[order.id]?.trim() ?? '';
    updateOrderStatus(order.id, order.status, resi);
    showToast(`Tracking number for #${order.orderNumber} saved: ${resi || '(cleared)'}`);
  };

  const handleSupplierStatusChange = (
    sup: Supplier,
    newStatus: SupplierStatus
  ) => {
    saveSupplier({
      ...sup,
      status: newStatus,
    });
    showToast(`Partner "${sup.name}" status changed to ${getSupplierBadge(newStatus).label}.`);
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

  // --- Tab 2 Handlers (CMS Products & Bank) ---
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
    setAccountHolder('CORA Circular Innovation');
    setBankIsActive(true);
    showToast('CORA bank account settings saved successfully.');
  };

  // --- Tab 3 Handlers (Supplier Network: Add, Edit, Delete) ---
  const openAddSupplierModal = () => {
    setEditingSupplierId(null);
    setSupName('');
    setSupPhone('');
    setSupLocation('');
    setSupType('Pabrik Pengolahan Santan');
    setSupKg('25');
    setSupFreq('Setiap Hari');
    setSupStatus('ACTIVE');
    setShowSupplierModal(true);
  };

  const openEditSupplierModal = (sup: Supplier) => {
    setEditingSupplierId(sup.id);
    setSupName(sup.name);
    setSupPhone(sup.phone);
    setSupLocation(sup.businessLocation);
    setSupType(sup.businessType);
    setSupKg(String(sup.estimatedKg));
    setSupFreq(sup.productionFrequency);
    setSupStatus(sup.status ?? 'ACTIVE');
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim() || !supPhone.trim() || !supLocation.trim()) {
      showToast('Please complete all supplier partner fields.');
      return;
    }

    if (editingSupplierId) {
      saveSupplier({
        id: editingSupplierId,
        name: supName.trim(),
        phone: supPhone.trim(),
        businessLocation: supLocation.trim(),
        businessType: supType,
        estimatedKg: Number(supKg) || 20,
        productionFrequency: supFreq,
        status: supStatus,
        createdAt:
          suppliers.find((s) => s.id === editingSupplierId)?.createdAt ||
          new Date().toISOString(),
      });
      showToast(`Partner details for "${supName}" successfully updated.`);
    } else {
      registerSupplier({
        name: supName.trim(),
        phone: supPhone.trim(),
        businessLocation: supLocation.trim(),
        businessType: supType,
        estimatedKg: Number(supKg) || 20,
        productionFrequency: supFreq,
        status: supStatus,
      });
      showToast('New supplier partner successfully registered to the CORA network.');
    }

    setShowSupplierModal(false);
    setEditingSupplierId(null);
    setSupName('');
    setSupPhone('');
    setSupLocation('');
  };

  const handleDeleteSupplier = (sup: Supplier) => {
    if (confirm(`Remove supplier partner "${sup.name}" from the system?`)) {
      deleteSupplier(sup.id);
      showToast(`Partner "${sup.name}" successfully removed.`);
    }
  };

  // --- Tab 4 Handlers (Pickup Alur) ---
  const advancePickupStatus = (
    req: PickupRequest,
    next: PickupRequestStatus
  ) => {
    updatePickupStatus(req.id, next);
    const badge = getPickupBadge(next);
    showToast(`Pickup status for ${req.supplierName} updated to ${badge.label}.`);
  };

  // --- Tab 5 Handlers (RecipeHub CMS) ---
  const openNewRecipeForm = () => {
    setEditingRecipeId(null);
    setRecTitle('');
    setRecCategory('Cookies and Biscuits');
    setRecPrepTime('15 mins');
    setRecCookTime('20 mins');
    setRecServings('4-6 portions');
    setRecCalories('180');
    setRecDifficulty('Easy');
    setRecCoconutFlour('50g Upcycled Coconut Flour');
    setRecSummary('');
    setRecIngredientsText(
      '50g CORA upcycled coconut flour\n100g oat flour\n40ml coconut oil\n3 tbsp coconut sugar\n1 tsp vanilla extract\nPinch of sea salt'
    );
    setRecStepsText(
      'Preheat the oven to 175°C and line a baking sheet.\nMix coconut flour and oat flour in a dry bowl.\nFold in coconut oil and coconut sugar until dough forms.\nScoop into 12 balls and flatten lightly.\nBake for 14-16 minutes until edges are golden brown.'
    );
    setRecImage(RECIPE_IMAGE_PRESETS[0].value);
    setShowRecipeModal(true);
  };

  const openEditRecipeForm = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id);
    setRecTitle(recipe.title);
    setRecCategory(recipe.category);
    setRecPrepTime(recipe.prepTime);
    setRecCookTime(recipe.cookTime);
    setRecServings(recipe.servings);
    setRecCalories(String(recipe.calories));
    setRecDifficulty(recipe.difficulty);
    setRecCoconutFlour(recipe.coconutFlourUsed);
    setRecSummary(recipe.summary);
    setRecIngredientsText(recipe.ingredients.join('\n'));
    setRecStepsText(recipe.steps.join('\n'));
    setRecImage(recipe.image || RECIPE_IMAGE_PRESETS[0].value);
    setShowRecipeModal(true);
  };

  const handleSaveRecipeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !recIngredientsText.trim() || !recStepsText.trim()) {
      showToast('Please provide recipe title, ingredients, and steps.');
      return;
    }

    const ingredients = recIngredientsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const steps = recStepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const recipeData: Recipe = {
      id: editingRecipeId ?? `recipe-${Date.now()}`,
      title: recTitle.trim(),
      category: recCategory,
      prepTime: recPrepTime.trim(),
      cookTime: recCookTime.trim(),
      servings: recServings.trim(),
      calories: Number(recCalories) || 200,
      difficulty: recDifficulty,
      coconutFlourUsed: recCoconutFlour.trim(),
      summary:
        recSummary.trim() ||
        `Delicious, fiber-rich recipe made with CORA upcycled circular coconut flour.`,
      ingredients,
      steps,
      image: recImage.trim() || RECIPE_IMAGE_PRESETS[0].value,
    };

    saveRecipe(recipeData);
    setShowRecipeModal(false);
    showToast(
      editingRecipeId
        ? `Recipe "${recipeData.title}" successfully updated.`
        : `New recipe "${recipeData.title}" added to RecipeHub.`
    );
  };

  const handleDeleteRecipe = (id: string, title: string) => {
    if (confirm(`Remove recipe "${title}" from RecipeHub?`)) {
      deleteRecipe(id);
      showToast(`Recipe "${title}" has been removed.`);
    }
  };

  // --- Tab 6 Handlers (Our Impact & SDGs CMS) ---
  const handleSaveImpactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateImpactSettings({
      useCustomStats: impactUseCustom,
      customResidueKg: Number(impactResidueKg) || 0,
      customFlourKg: Number(impactFlourKg) || 0,
      customSuppliersCount: Number(impactSuppliersCount) || 0,
      customProductsMarketed: Number(impactProductsMarketed) || 0,
      customCo2AvoidedKg: Number(impactCo2Avoided) || 0,
      impactNote: impactNoteText.trim(),
    });
    showToast('Our Impact settings saved and synchronized with the storefront.');
  };

  const openNewIndicatorModal = () => {
    setEditingIndicatorId(null);
    setIndLabel('');
    setIndValue('');
    setIndUnit('kg');
    setIndDesc('');
    setShowIndicatorModal(true);
  };

  const openEditIndicatorModal = (item: ImpactStatItem) => {
    setEditingIndicatorId(item.id);
    setIndLabel(item.label);
    setIndValue(item.value);
    setIndUnit(item.unit);
    setIndDesc(item.description);
    setShowIndicatorModal(true);
  };

  const handleSaveIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indLabel.trim() || !indValue.trim()) {
      showToast('Indicator label and value are required.');
      return;
    }
    const indicator: ImpactStatItem = {
      id: editingIndicatorId ?? `stat-${Date.now()}`,
      label: indLabel.trim(),
      value: indValue.trim(),
      unit: indUnit.trim() || 'kg',
      description: indDesc.trim() || 'CORA circular impact indicator',
    };
    saveImpactIndicator(indicator);
    setShowIndicatorModal(false);
    showToast(
      editingIndicatorId
        ? `Indicator "${indicator.label}" updated.`
        : `New indicator "${indicator.label}" added.`
    );
  };

  const handleDeleteIndicator = (id: string, label: string) => {
    if (confirm(`Delete impact indicator "${label}"?`)) {
      deleteImpactIndicator(id);
      showToast(`Indicator "${label}" has been deleted.`);
    }
  };

  // --- Tab 7 Handlers (Finance) ---
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
      id: 'cms',
      label: 'Product Catalog (List View)',
      icon: Package,
      badge: products.length,
    },
    {
      id: 'suppliers',
      label: 'Supplier Network',
      icon: Building2,
      badge: suppliers.length > 0 ? suppliers.length : undefined,
    },
    {
      id: 'pickup',
      label: 'Coconut Pickup Workflow',
      icon: Truck,
      badge: pendingPickupsCount > 0 ? pendingPickupsCount : undefined,
    },
    {
      id: 'recipes',
      label: 'RecipeHub CMS',
      icon: ChefHat,
      badge: recipes.length > 0 ? recipes.length : undefined,
    },
    {
      id: 'impact',
      label: 'Our Impact & SDGs CMS',
      icon: Leaf,
    },
    {
      id: 'finance',
      label: 'Financial Cash Book & Reports',
      icon: Wallet,
    },
  ];

  const activeTabTitle =
    NAV_TABS.find((t) => t.id === activeTab)?.label ?? 'Admin Dashboard';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C1E18] flex flex-col lg:flex-row">
      {/* CLEAN LIGHT MODE SIDEBAR (#F0ECE1) - FIXED ON DESKTOP */}
      <aside className="w-full shrink-0 border-b border-[#E5DEC9] bg-[#F0ECE1] lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:h-screen lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex h-full min-h-screen flex-col justify-between p-5">
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
                    Circular Operations Console
                  </p>
                </div>
              </Link>
              <span className="rounded-full bg-[#3B5B3D]/12 px-2.5 py-0.5 text-[10px] font-bold text-[#3B5B3D]">
                Verified
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

      {/* MAIN WORKSPACE - OFFSET BY SIDEBAR ON DESKTOP */}
      <div className="flex-1 min-w-0 lg:ml-72">
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
                  Central command for orders, products list, suppliers, pickups,
                  recipes, impact metrics, and finance.
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
                                <div className="space-y-1.5 min-w-[180px]">
                                  <select
                                    value={order.status}
                                    onChange={(e) =>
                                      handleDirectOrderStatusChange(
                                        order,
                                        e.target.value as OrderStatus
                                      )
                                    }
                                    className={`w-full cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold ring-1 transition focus:outline-none focus:ring-2 ${badge.className}`}
                                    title="Click to change order status"
                                  >
                                    <option value="WAITING_VERIFICATION">Awaiting Verification</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped (In Transit)</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="REJECTED">Rejected</option>
                                  </select>
                                  {order.trackingNumber && (
                                    <p className="font-mono text-[11px] font-semibold text-[#3B5B3D]">
                                      Resi: {order.trackingNumber}
                                    </p>
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-4 space-y-2.5 min-w-[240px]">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={currentResi}
                                    onChange={(e) =>
                                      setTrackingDrafts((prev) => ({
                                        ...prev,
                                        [order.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Tracking / Waybill No."
                                    className="flex-1 rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] px-3 py-1.5 text-[11px] text-[#2C1E18] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveTrackingResi(order)}
                                    className="inline-flex items-center gap-1 rounded-xl border border-[#3B5B3D]/30 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#3B5B3D] hover:bg-[#3B5B3D] hover:text-white transition"
                                    title="Save tracking code"
                                  >
                                    <Save className="h-3 w-3" />
                                    Save
                                  </button>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {order.status === 'WAITING_VERIFICATION' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleApproveOrder(order)}
                                        className="inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#2F4A31]"
                                      >
                                        <Check className="h-3.5 w-3.5" />
                                        Approve
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRejectOrder(order)}
                                        className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-100"
                                      >
                                        <XCircle className="h-3.5 w-3.5" />
                                        Reject
                                      </button>
                                    </>
                                  )}

                                  {order.status === 'PROCESSING' && (
                                    <>
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
                                        Mark Shipped
                                      </button>
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
                                        Mark Completed
                                      </button>
                                    </>
                                  )}

                                  {order.status === 'SHIPPED' && (
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
                                      Mark Completed
                                    </button>
                                  )}

                                  {(order.status === 'COMPLETED' ||
                                    order.status === 'REJECTED') && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] text-[#8A776C]">
                                        {order.status === 'COMPLETED'
                                          ? 'Completed'
                                          : 'Rejected'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDirectOrderStatusChange(
                                            order,
                                            'PROCESSING'
                                          )
                                        }
                                        className="text-[11px] font-semibold text-[#3B5B3D] underline hover:text-[#2C1E18]"
                                      >
                                        Re-open
                                      </button>
                                    </div>
                                  )}
                                </div>
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
          {/* TAB 2: PRODUCT CATALOG (PERFORMANT COMPACT LIST VIEW)          */}
          {/* ============================================================== */}
          {activeTab === 'cms' && (
            <section className="animate-cora-fade-in space-y-8">
              {/* Top Bar: Search, Category Filter, and Add Product */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#2C1E18]">
                    Product Catalog Management (List View)
                  </h2>
                  <p className="text-xs text-[#6E5C52]">
                    Lightweight and rapid list view to manage pricing, inventory,
                    and packaging photos at scale.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openNewProductForm}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                >
                  <Plus className="h-4 w-4" />
                  Add New Product
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5DEC9] bg-white p-3.5 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {['ALL', 'Brownies', 'Cookies', 'Coconut Flour'].map((cat) => {
                    const active = productCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProductCategoryFilter(cat)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                          active
                            ? 'bg-[#3B5B3D] text-white'
                            : 'bg-[#FAF8F5] text-[#5C4B42] hover:bg-[#EAE5D5]'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Products' : cat}
                      </button>
                    );
                  })}
                </div>

                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A776C]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-full bg-[#FAF8F5] py-1.5 pl-8 pr-3 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  />
                </div>
              </div>

              {/* COMPACT PRODUCT LIST TABLE */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-4 py-3.5">Product &amp; Photo</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Unit Price (IDR)</th>
                        <th className="px-4 py-3.5">Live Stock</th>
                        <th className="px-4 py-3.5">Weight &amp; Residue Saved</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-sm text-[#6E5C52]"
                          >
                            No products match the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {
                          const draft = quickEdits[product.id] ?? {
                            price: String(product.price),
                            stock: String(product.stock),
                          };
                          const isDirty =
                            draft.price !== String(product.price) ||
                            draft.stock !== String(product.stock);

                          return (
                            <tr
                              key={product.id}
                              className="transition hover:bg-[#FAF8F5]/60"
                            >
                              {/* Product Thumbnail & Title */}
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF8F5]">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      unoptimized
                                      className="object-contain p-1"
                                    />
                                    <label
                                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                                      title="Change product image"
                                    >
                                      <ImagePlus className="h-4 w-4 text-white" />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleQuickPhotoUpload(product, e)
                                        }
                                        className="sr-only"
                                      />
                                    </label>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-[#2C1E18] truncate max-w-[220px]">
                                      {product.name}
                                    </p>
                                    <p className="text-[11px] text-[#6E5C52] truncate max-w-[220px]">
                                      {product.subtitle}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="px-4 py-3.5">
                                <span className="inline-flex rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#3B5B3D]">
                                  {product.category}
                                </span>
                              </td>

                              {/* Price Quick Edit */}
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[#8A776C] text-[11px]">
                                    Rp
                                  </span>
                                  <input
                                    type="number"
                                    value={draft.price}
                                    onChange={(e) =>
                                      setQuickEdits((prev) => ({
                                        ...prev,
                                        [product.id]: {
                                          price: e.target.value,
                                          stock: draft.stock,
                                        },
                                      }))
                                    }
                                    className="w-24 rounded-lg bg-[#FAF8F5] px-2 py-1 font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                                  />
                                </div>
                              </td>

                              {/* Stock Quick Edit */}
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={draft.stock}
                                    onChange={(e) =>
                                      setQuickEdits((prev) => ({
                                        ...prev,
                                        [product.id]: {
                                          price: draft.price,
                                          stock: e.target.value,
                                        },
                                      }))
                                    }
                                    className="w-16 rounded-lg bg-[#FAF8F5] px-2 py-1 font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                                  />
                                  <span
                                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                                      Number(draft.stock) > 20
                                        ? 'bg-emerald-500'
                                        : Number(draft.stock) > 0
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                    }`}
                                    title={
                                      Number(draft.stock) > 20
                                        ? 'In Stock'
                                        : Number(draft.stock) > 0
                                        ? 'Low Stock'
                                        : 'Out of Stock'
                                    }
                                  />
                                </div>
                              </td>

                              {/* Weight & Saved Residue */}
                              <td className="px-4 py-3.5 text-[#5C4B42]">
                                <p>{product.weightGram}g</p>
                                <p className="text-[11px] font-medium text-[#3B5B3D]">
                                  {product.residueSavedGram}g residue saved
                                </p>
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3.5 text-right">
                                <div className="inline-flex items-center gap-2">
                                  {isDirty && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleQuickSaveProduct(product)
                                      }
                                      className="inline-flex items-center gap-1 rounded-full bg-[#3B5B3D] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-[#2F4A31]"
                                      title="Save Price/Stock Changes"
                                    >
                                      <Save className="h-3 w-3" />
                                      Save
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditProductForm(product)
                                    }
                                    className="inline-flex items-center gap-1 rounded-full border border-[#3B5B3D]/30 bg-[#3B5B3D]/8 px-2.5 py-1 text-[11px] font-semibold text-[#3B5B3D] hover:bg-[#3B5B3D] hover:text-white"
                                    title="Edit Full Details"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `Delete product ${product.name}?`
                                        )
                                      ) {
                                        deleteProduct(product.id);
                                        showToast(
                                          `Product ${product.name} has been deleted.`
                                        );
                                      }
                                    }}
                                    className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Summary Footer */}
                <div className="flex flex-wrap items-center justify-between border-t border-[#E5DEC9] bg-[#FAF8F5] px-5 py-3 text-xs text-[#6E5C52]">
                  <span>
                    Total Products: <strong>{products.length} items</strong> (
                    {filteredProducts.length} displayed)
                  </span>
                  <span>
                    Total Stock Volume:{' '}
                    <strong>
                      {products.reduce((s, p) => s + p.stock, 0)} units
                    </strong>
                  </span>
                </div>
              </div>

              {/* Destination Bank Accounts */}
              <div className="space-y-5 border-t border-[#E5DEC9] pt-8">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#2C1E18]">
                    CORA Official Payment Bank Accounts
                  </h2>
                  <p className="text-xs text-[#6E5C52]">
                    Bank accounts displayed on checkout when customers choose manual
                    bank transfer verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {bankAccounts.map((bank) => (
                    <div
                      key={bank.id}
                      className="flex items-center justify-between rounded-2xl border border-[#E5DEC9] bg-white p-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                          <Building2 className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-bold text-[#2C1E18]">
                            {bank.bankName}
                          </p>
                          <p className="font-mono text-sm font-semibold text-[#3B5B3D]">
                            {bank.accountNumber}
                          </p>
                          <p className="text-[11px] text-[#6E5C52]">
                            Holder: {bank.accountHolder}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            saveBankAccount({ ...bank, isActive: !bank.isActive });
                            showToast(
                              `${bank.bankName} is now ${!bank.isActive ? 'Active' : 'Inactive'}.`
                            );
                          }}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                            bank.isActive
                              ? 'bg-[#3B5B3D]/12 text-[#3B5B3D] hover:bg-[#3B5B3D]/20 ring-1 ring-[#3B5B3D]/25'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200 ring-1 ring-stone-200'
                          }`}
                          title="Click to toggle activation"
                        >
                          {bank.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditBank(bank)}
                          className="rounded-full p-1.5 text-[#3B5B3D] hover:bg-[#3B5B3D]/10"
                          title="Edit account"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bank Account Edit / Add Form */}
                <form
                  onSubmit={handleSaveBankForm}
                  className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs space-y-4"
                >
                  <h3 className="font-serif text-base font-bold text-[#2C1E18]">
                    {editingBankId
                      ? 'Edit Bank Account'
                      : 'Add New Bank Account'}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1E18]">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Bank BCA / Mandiri / BNI"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
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
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1E18]">
                        Account Holder
                      </label>
                      <input
                        type="text"
                        required
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="CORA Circular Innovation"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#2C1E18]">
                      <input
                        type="checkbox"
                        checked={bankIsActive}
                        onChange={(e) => setBankIsActive(e.target.checked)}
                        className="h-4 w-4 rounded text-[#3B5B3D] focus:ring-[#3B5B3D]"
                      />
                      Enable account for checkout payments
                    </label>

                    <div className="flex items-center gap-2">
                      {editingBankId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBankId(null);
                            setBankName('');
                            setAccountNumber('');
                          }}
                          className="rounded-full border border-[#E5DEC9] px-4 py-2 text-xs font-semibold text-[#5C4B42]"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {editingBankId ? 'Save Account' : 'Add Account'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 3: SUPPLIER NETWORK (FULL CRUD: ADD, EDIT, DELETE)         */}
          {/* ============================================================== */}
          {activeTab === 'suppliers' && (
            <section className="animate-cora-fade-in space-y-6">
              {/* Supplier Network KPIs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#6E5C52]">
                      Registered Suppliers
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <Building2 className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    {suppliers.length} Partners
                  </p>
                  <p className="mt-1 text-[11px] text-[#3B5B3D]">
                    Active Coconut Vendors &amp; MSMEs
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#6E5C52]">
                      Daily Supply Potential
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <Scale className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    {suppliers.reduce((s, sup) => s + sup.estimatedKg, 0)} kg /
                    day
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Scheduled fresh residue capacity
                  </p>
                </div>

                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#6E5C52]">
                      Active Logistics Zones
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                      <Truck className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    Denpasar &amp; Badung
                  </p>
                  <p className="mt-1 text-[11px] text-sky-700">
                    Scheduled routine collection routes
                  </p>
                </div>
              </div>

              {/* Action Bar & Search */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#E5DEC9] bg-white p-4 shadow-xs">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A776C]" />
                  <input
                    type="text"
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    placeholder="Search by partner name, business type, or location..."
                    className="w-full rounded-full bg-[#FAF8F5] py-2 pl-10 pr-4 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={openAddSupplierModal}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                >
                  <Plus className="h-4 w-4" />
                  Register New Partner
                </button>
              </div>

              {/* Supplier Table */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-5 py-4">Business Name / Partner</th>
                        <th className="px-5 py-4">Business Type</th>
                        <th className="px-5 py-4">Address &amp; Contact</th>
                        <th className="px-5 py-4">Daily Estimate</th>
                        <th className="px-5 py-4">Production Frequency</th>
                        <th className="px-5 py-4">Status &amp; Joined</th>
                        <th className="px-5 py-4 text-right">Manage Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {filteredSuppliers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-sm text-[#6E5C52]"
                          >
                            No supplier partners match your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredSuppliers.map((sup) => (
                          <tr
                            key={sup.id}
                            className="transition hover:bg-[#FAF8F5]/60"
                          >
                            <td className="px-5 py-4">
                              <p className="font-bold text-[#2C1E18]">
                                {sup.name}
                              </p>
                              <p className="text-[11px] text-[#6E5C52]">
                                ID: {sup.id}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-medium text-[#5C4B42] ring-1 ring-[#E5DEC9]">
                                {sup.businessType}
                              </span>
                            </td>
                            <td className="px-5 py-4 max-w-xs">
                              <p className="text-[#2C1E18]">
                                {sup.businessLocation}
                              </p>
                              <a
                                href={`https://wa.me/${sup.phone.replace(
                                  /\D/g,
                                  ''
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#3B5B3D] hover:underline"
                              >
                                {sup.phone}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </td>
                            <td className="px-5 py-4 font-bold text-[#2C1E18]">
                              {sup.estimatedKg} kg / day
                            </td>
                            <td className="px-5 py-4 text-[#5C4B42]">
                              {sup.productionFrequency}
                            </td>
                            <td className="px-5 py-4">
                              <div className="space-y-1 min-w-[150px]">
                                <select
                                  value={sup.status ?? 'ACTIVE'}
                                  onChange={(e) =>
                                    handleSupplierStatusChange(
                                      sup,
                                      e.target.value as SupplierStatus
                                    )
                                  }
                                  className={`w-full cursor-pointer rounded-xl px-2.5 py-1 text-[11px] font-bold ring-1 transition focus:outline-none focus:ring-2 ${
                                    getSupplierBadge(sup.status).className
                                  }`}
                                  title="Click to change partner verification status"
                                >
                                  <option value="ACTIVE">Verified Active</option>
                                  <option value="PENDING">Pending Review</option>
                                  <option value="INACTIVE">Inactive / On Hold</option>
                                </select>
                                <p className="text-[10px] text-[#8A776C]">
                                  Joined: {formatDateTime(sup.createdAt)}
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <a
                                  href={`https://wa.me/${sup.phone.replace(
                                    /\D/g,
                                    ''
                                  )}?text=Hello%20${encodeURIComponent(
                                    sup.name
                                  )},%20CORA%20logistics%20team%20would%20like%20to%20confirm%20the%20coconut%20residue%20pickup%20schedule.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-[#3B5B3D]/10 px-2.5 py-1 text-[11px] font-semibold text-[#3B5B3D] transition hover:bg-[#3B5B3D] hover:text-white"
                                  title="Contact via WhatsApp"
                                >
                                  WA
                                </a>
                                <button
                                  type="button"
                                  onClick={() => openEditSupplierModal(sup)}
                                  className="inline-flex items-center gap-1 rounded-full border border-[#3B5B3D]/30 bg-[#3B5B3D]/8 px-2.5 py-1 text-[11px] font-semibold text-[#3B5B3D] hover:bg-[#3B5B3D] hover:text-white"
                                  title="Edit Partner Details"
                                >
                                  <Edit3 className="h-3 w-3" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSupplier(sup)}
                                  className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                                  title="Delete Partner"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 4: COCONUT PICKUP WORKFLOW (5-STAGE STATUS ALUR)           */}
          {/* ============================================================== */}
          {activeTab === 'pickup' && (
            <section className="animate-cora-fade-in space-y-6">
              {/* Pickup KPI Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Total Partner Requests
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    {pickupRequests.length}
                  </p>
                  <p className="mt-1 text-[11px] text-[#3B5B3D]">
                    Active pickup queue
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Request Submitted
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-amber-700">
                    {pendingPickupsCount}
                  </p>
                  <p className="mt-1 text-[11px] text-amber-800">
                    Needs dispatch confirmation
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    En Route / Picked Up
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-purple-700">
                    {
                      pickupRequests.filter(
                        (p) =>
                          p.status === 'ON_THE_WAY' || p.status === 'PICKED_UP'
                      ).length
                    }
                  </p>
                  <p className="mt-1 text-[11px] text-purple-800">
                    Logistics in progress
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Total Estimated Residue
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#3B5B3D]">
                    {pickupRequests.reduce((s, p) => s + p.estimatedKg, 0)} kg
                  </p>
                  <p className="mt-1 text-[11px] text-[#3B5B3D]">
                    Rescued from local partners
                  </p>
                </div>
              </div>

              {/* 5-Stage Status Workflow Legend & Filter */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2C1E18]">
                      5-Stage Pickup Workflow Stages
                    </h3>
                    <p className="text-xs text-[#6E5C52]">
                      1. Request Submitted → 2. Request Confirmed → 3. On the Way
                      → 4. Picked Up → 5. Completed
                    </p>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0EAE0]">
                  {(
                    [
                      { label: 'All Statuses', value: 'ALL' },
                      {
                        label: '1. Request Submitted',
                        value: 'REQUEST_SUBMITTED',
                      },
                      {
                        label: '2. Request Confirmed',
                        value: 'REQUEST_CONFIRMED',
                      },
                      { label: '3. On the Way', value: 'ON_THE_WAY' },
                      { label: '4. Picked Up', value: 'PICKED_UP' },
                      { label: '5. Completed', value: 'COMPLETED' },
                    ] as { label: string; value: PickupFilter }[]
                  ).map((item) => {
                    const active = pickupFilter === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setPickupFilter(item.value)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                          active
                            ? 'bg-[#3B5B3D] text-white'
                            : 'border border-[#E5DEC9] bg-[#FAF8F5] text-[#5C4B42] hover:bg-[#EAE5D5]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pickup Requests Table */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-5 py-4">Partner / Supplier</th>
                        <th className="px-5 py-4">Pickup Location</th>
                        <th className="px-5 py-4">Residue Amount</th>
                        <th className="px-5 py-4">Preferred Slot</th>
                        <th className="px-5 py-4">Current Stage</th>
                        <th className="px-5 py-4 text-right">Workflow Progression</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {filteredPickups.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-sm text-[#6E5C52]"
                          >
                            No pickup requests found for this filter.
                          </td>
                        </tr>
                      ) : (
                        filteredPickups.map((req) => {
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
                                <a
                                  href={`https://wa.me/${req.phone.replace(
                                    /\D/g,
                                    ''
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#3B5B3D] hover:underline"
                                >
                                  {req.phone}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </td>
                              <td className="px-5 py-4 max-w-xs text-[#5C4B42]">
                                <p>{req.location}</p>
                                {req.notes && (
                                  <p className="mt-1 text-[11px] italic text-[#8A776C]">
                                    Note: {req.notes}
                                  </p>
                                )}
                              </td>
                              <td className="px-5 py-4 font-bold text-[#2C1E18]">
                                {req.estimatedKg} kg
                              </td>
                              <td className="px-5 py-4 text-[#5C4B42]">
                                <p className="font-medium text-[#2C1E18]">
                                  {req.preferredDate}
                                </p>
                                <p className="text-[11px] text-[#6E5C52]">
                                  {req.preferredTime || '09:00 - 12:00 WITA'}
                                </p>
                              </td>
                              <td className="px-5 py-4">
                                <div className="space-y-1 min-w-[170px]">
                                  <select
                                    value={req.status}
                                    onChange={(e) =>
                                      advancePickupStatus(
                                        req,
                                        e.target.value as PickupRequestStatus
                                      )
                                    }
                                    className={`w-full cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold ring-1 transition focus:outline-none focus:ring-2 ${badge.className}`}
                                    title="Click to change pickup workflow stage"
                                  >
                                    <option value="REQUEST_SUBMITTED">1. Request Submitted</option>
                                    <option value="REQUEST_CONFIRMED">2. Request Confirmed</option>
                                    <option value="ON_THE_WAY">3. Driver Dispatched</option>
                                    <option value="PICKED_UP">4. Residue Picked Up</option>
                                    <option value="COMPLETED">5. Completed / Upcycled</option>
                                  </select>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <div className="inline-flex flex-wrap justify-end gap-1.5">
                                  {(req.status === 'REQUEST_SUBMITTED' ||
                                    req.status === 'PENDING') && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        advancePickupStatus(
                                          req,
                                          'REQUEST_CONFIRMED'
                                        )
                                      }
                                      className="rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-700"
                                    >
                                      Confirm Request
                                    </button>
                                  )}

                                  {(req.status === 'REQUEST_CONFIRMED' ||
                                    req.status === 'SCHEDULED') && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        advancePickupStatus(
                                          req,
                                          'ON_THE_WAY'
                                        )
                                      }
                                      className="rounded-full bg-purple-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-purple-700"
                                    >
                                      Dispatch Driver
                                    </button>
                                  )}

                                  {req.status === 'ON_THE_WAY' && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        advancePickupStatus(req, 'PICKED_UP')
                                      }
                                      className="rounded-full bg-teal-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-teal-700"
                                    >
                                      Mark Picked Up
                                    </button>
                                  )}

                                  {req.status === 'PICKED_UP' && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        advancePickupStatus(req, 'COMPLETED')
                                      }
                                      className="rounded-full bg-[#3B5B3D] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#2F4A31]"
                                    >
                                      Complete &amp; Process
                                    </button>
                                  )}

                                  {req.status === 'COMPLETED' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B5B3D]">
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Upcycled to Flour
                                    </span>
                                  )}
                                </div>
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
          {/* TAB 5: RECIPEHUB CMS (MANAJEMEN RESEP)                         */}
          {/* ============================================================== */}
          {activeTab === 'recipes' && (
            <section className="animate-cora-fade-in space-y-6">
              {/* RecipeHub Header Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Total Registered Recipes
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    {recipes.length} Recipes
                  </p>
                  <p className="mt-1 text-[11px] text-[#3B5B3D]">
                    CORA upcycled circular flour recipes
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    Menu Categories
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#2C1E18]">
                    4 Categories
                  </p>
                  <p className="mt-1 text-[11px] text-[#6E5C52]">
                    Cookies, Brownies, Healthy Snacks, Creative
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                  <p className="text-xs font-semibold text-[#6E5C52]">
                    User Saved Recipes
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#4E9A34]">
                    {userProfile.favoriteRecipeIds.length} Favorites
                  </p>
                  <p className="mt-1 text-[11px] text-[#4E9A34]">
                    Bookmarked by RecipeHub readers
                  </p>
                </div>
              </div>

              {/* Top Bar: Title, Subtitle, and Add Recipe */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#2C1E18]">
                    RecipeHub Catalog Management (List View)
                  </h2>
                  <p className="text-xs text-[#6E5C52]">
                    Lightweight, high-performance table view to manage recipes, ingredients, flour measures, and baking guides.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openNewRecipeForm}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                >
                  <Plus className="h-4 w-4" />
                  Add New Recipe
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5DEC9] bg-white p-3.5 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    'ALL',
                    'Cookies and Biscuits',
                    'Cakes and Brownies',
                    'Healthy Snacks',
                    'Creative Recipes',
                  ].map((cat) => {
                    const active = recipeFilterCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setRecipeFilterCategory(cat)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                          active
                            ? 'bg-[#3B5B3D] text-white'
                            : 'bg-[#FAF8F5] text-[#5C4B42] hover:bg-[#EAE5D5]'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Recipes' : cat}
                      </button>
                    );
                  })}
                </div>

                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A776C]" />
                  <input
                    type="text"
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    placeholder="Search recipes..."
                    className="w-full rounded-full bg-[#FAF8F5] py-1.5 pl-8 pr-3 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  />
                </div>
              </div>

              {/* COMPACT RECIPE LIST TABLE */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                        <th className="px-4 py-3.5">Recipe &amp; Photo</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Prep &amp; Cook Time</th>
                        <th className="px-4 py-3.5">Servings &amp; Calories</th>
                        <th className="px-4 py-3.5">Flour Measure</th>
                        <th className="px-4 py-3.5">Difficulty</th>
                        <th className="px-4 py-3.5">Ingredients &amp; Steps</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE0]">
                      {filteredRecipes.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-12 text-center text-sm text-[#6E5C52]"
                          >
                            No recipes match the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredRecipes.map((recipe) => (
                          <tr
                            key={recipe.id}
                            className="transition hover:bg-[#FAF8F5]/60"
                          >
                            {/* Recipe Thumbnail & Title */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF8F5]">
                                  <Image
                                    src={recipe.image || RECIPE_IMAGE_PRESETS[0].value}
                                    alt={recipe.title}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-[#2C1E18] truncate max-w-[220px]">
                                    {recipe.title}
                                  </p>
                                  <p className="text-[11px] text-[#6E5C52] truncate max-w-[220px]">
                                    {recipe.summary}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-3.5">
                              <span className="inline-flex rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#3B5B3D]">
                                {recipe.category}
                              </span>
                            </td>

                            {/* Prep & Cook Time */}
                            <td className="px-4 py-3.5 text-[#5C4B42]">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-[#3B5B3D]" />
                                <span>{recipe.prepTime} prep • {recipe.cookTime} cook</span>
                              </div>
                            </td>

                            {/* Servings & Calories */}
                            <td className="px-4 py-3.5 text-[#5C4B42]">
                              <div className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-[#3B5B3D]" />
                                <span>{recipe.servings} • {recipe.calories} kcal</span>
                              </div>
                            </td>

                            {/* Flour Measure */}
                            <td className="px-4 py-3.5">
                              <span className="inline-block rounded-lg bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-medium text-[#3B5B3D] ring-1 ring-[#E5DEC9]">
                                {recipe.coconutFlourUsed}
                              </span>
                            </td>

                            {/* Difficulty */}
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  recipe.difficulty === 'Easy'
                                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                    : recipe.difficulty === 'Medium'
                                    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                    : 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
                                }`}
                              >
                                {recipe.difficulty}
                              </span>
                            </td>

                            {/* Ingredients & Steps count */}
                            <td className="px-4 py-3.5 text-[11px] text-[#6E5C52]">
                              {recipe.ingredients.length} ing. • {recipe.steps.length} steps
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditRecipeForm(recipe)}
                                  className="inline-flex items-center gap-1 rounded-full border border-[#3B5B3D]/30 bg-[#3B5B3D]/8 px-2.5 py-1 text-[11px] font-semibold text-[#3B5B3D] hover:bg-[#3B5B3D] hover:text-white transition"
                                  title="Edit Full Details"
                                >
                                  <Edit3 className="h-3 w-3" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteRecipe(recipe.id, recipe.title)
                                  }
                                  className="rounded-full p-1.5 text-red-600 hover:bg-red-50 transition"
                                  title="Delete Recipe"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Summary Footer */}
                <div className="flex flex-wrap items-center justify-between border-t border-[#E5DEC9] bg-[#FAF8F5] px-5 py-3 text-xs text-[#6E5C52]">
                  <span>
                    Total Recipes: <strong>{recipes.length} recipes</strong> ({filteredRecipes.length} displayed)
                  </span>
                  <span>
                    Total Saved Bookmarks:{' '}
                    <strong>
                      {userProfile.favoriteRecipeIds.length} bookmarks
                    </strong>
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 6: OUR IMPACT & SDGS CMS (CRUD INDIKATOR & STATISTIK)       */}
          {/* ============================================================== */}
          {activeTab === 'impact' && (
            <section className="animate-cora-fade-in space-y-8">
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#2C1E18]">
                    Manage Our Impact &amp; Circular Statistics
                  </h2>
                  <p className="text-xs text-[#6E5C52]">
                    Configure real-time impact indicators, calculated figures, and
                    sustainability disclosures displayed to visitors.
                  </p>
                </div>
              </div>

              {/* Mode Kalkulasi & Custom Settings Card */}
              <form
                onSubmit={handleSaveImpactSettings}
                className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EAE0] pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3B5B3D]/12 text-[#3B5B3D]">
                      <Sliders className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#2C1E18]">
                        Impact Metrics Mode
                      </h3>
                      <p className="text-xs text-[#6E5C52]">
                        Choose whether figures are calculated dynamically from transactions or
                        specified via custom admin override.
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex rounded-full bg-[#FAF8F5] p-1 ring-1 ring-[#E5DEC9]">
                    <button
                      type="button"
                      onClick={() => setImpactUseCustom(false)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        !impactUseCustom
                          ? 'bg-[#3B5B3D] text-white shadow-2xs'
                          : 'text-[#5C4B42] hover:text-[#2C1E18]'
                      }`}
                    >
                      Automatic Live Calculation
                    </button>
                    <button
                      type="button"
                      onClick={() => setImpactUseCustom(true)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        impactUseCustom
                          ? 'bg-[#3B5B3D] text-white shadow-2xs'
                          : 'text-[#5C4B42] hover:text-[#2C1E18]'
                      }`}
                    >
                      Custom Manual Override
                    </button>
                  </div>
                </div>

                {/* Status Notice */}
                {!impactUseCustom ? (
                  <div className="rounded-2xl bg-[#3B5B3D]/8 border border-[#3B5B3D]/20 p-4 text-xs text-[#3B5B3D] flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Live Automatic Mode Active</p>
                      <p className="mt-0.5 text-[#5C4B42]">
                        Dynamic calculation: Total Residue Upcycled ={' '}
                        <strong>{environmentalStats.totalUpcycledKg} kg</strong>,
                        Flour Produced ={' '}
                        <strong>{environmentalStats.totalFlourProducedKg} kg</strong>,
                        Partner Suppliers = <strong>{suppliers.length} partners</strong>,
                        and Total Products Sold ={' '}
                        <strong>
                          {orders
                            .filter((o) => o.status !== 'REJECTED')
                            .reduce(
                              (s, o) =>
                                s +
                                o.items.reduce(
                                  (itemSum, item) => itemSum + item.qty,
                                  0
                                ),
                              0
                            )}{' '}
                          pcs
                        </strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-amber-700" />
                    <div>
                      <p className="font-bold">Manual Override Active</p>
                      <p className="mt-0.5 text-amber-800">
                        The storefront will display the custom manual figures you
                        enter into the fields below.
                      </p>
                    </div>
                  </div>
                )}

                {/* 5 Input Angka Utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Residue Upcycled (kg)
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={impactResidueKg}
                      onChange={(e) => setImpactResidueKg(e.target.value)}
                      disabled={!impactUseCustom}
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Flour Produced (kg)
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={impactFlourKg}
                      onChange={(e) => setImpactFlourKg(e.target.value)}
                      disabled={!impactUseCustom}
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Partner Suppliers Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={impactSuppliersCount}
                      onChange={(e) => setImpactSuppliersCount(e.target.value)}
                      disabled={!impactUseCustom}
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Products Marketed (pcs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={impactProductsMarketed}
                      onChange={(e) =>
                        setImpactProductsMarketed(e.target.value)
                      }
                      disabled={!impactUseCustom}
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Emissions Avoided (kg CO₂e)
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={impactCo2Avoided}
                      onChange={(e) => setImpactCo2Avoided(e.target.value)}
                      disabled={!impactUseCustom}
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1E18]">
                      Footnote (*Disclaimer)
                    </label>
                    <input
                      type="text"
                      value={impactNoteText}
                      onChange={(e) => setImpactNoteText(e.target.value)}
                      placeholder="*Note: Figures reflect actual operational data..."
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#2F4A31]"
                  >
                    <Save className="h-4 w-4" />
                    Save Impact Settings
                  </button>
                </div>
              </form>

              {/* CRUD TABLE: INDIKATOR REAL-TIME */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                      Real-time Impact Indicator Cards
                    </h3>
                    <p className="text-xs text-[#6E5C52]">
                      Manage statistical indicator cards featured on the
                      Home page under the Our Journey section.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openNewIndicatorModal}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add New Indicator
                  </button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E5DEC9] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6E5C52]">
                          <th className="px-5 py-3.5">Indicator Label</th>
                          <th className="px-5 py-3.5">Custom Value</th>
                          <th className="px-5 py-3.5">Unit</th>
                          <th className="px-5 py-3.5">Description</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE0]">
                        {(impactSettings?.indicators ?? []).map((ind) => (
                          <tr
                            key={ind.id}
                            className="transition hover:bg-[#FAF8F5]/60"
                          >
                            <td className="px-5 py-3.5 font-bold text-[#2C1E18]">
                              {ind.label}
                            </td>
                            <td className="px-5 py-3.5 font-mono font-bold text-[#3B5B3D]">
                              {ind.value}
                            </td>
                            <td className="px-5 py-3.5 text-[#5C4B42]">
                              <span className="rounded-md bg-[#FAF8F5] px-2 py-0.5 font-mono text-[11px] ring-1 ring-[#E5DEC9]">
                                {ind.unit}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-[#6E5C52] max-w-xs">
                              {ind.description}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditIndicatorModal(ind)}
                                  className="rounded-full border border-[#3B5B3D]/30 bg-[#3B5B3D]/8 px-2.5 py-1 text-[11px] font-semibold text-[#3B5B3D] hover:bg-[#3B5B3D] hover:text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteIndicator(ind.id, ind.label)
                                  }
                                  className="rounded-full p-1 text-red-600 hover:bg-red-50"
                                  title="Delete Indicator"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* TAB 7: LAPORAN KEUANGAN & DAMPAK SIRKULAR                      */}
          {/* ============================================================== */}
          {activeTab === 'finance' && (
            <section className="animate-cora-fade-in space-y-8">
              {/* 4 Financial KPI Cards */}
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

              {/* SPECIAL: ENVIRONMENTAL & CIRCULAR IMPACT REPORT */}
              <div className="rounded-3xl border border-[#3B5B3D]/30 bg-radial from-[#FAF8F5] to-[#F2EFE8] p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DEC9] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3B5B3D] text-white">
                      <Leaf className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#2C1E18]">
                        Environmental Impact &amp; Circular Economy Report
                      </h2>
                      <p className="text-xs text-[#6E5C52]">
                        Accounting for coconut residue upcycling, flour production yield,
                        and greenhouse gas emission mitigation.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#3B5B3D]/12 px-3 py-1 text-xs font-bold text-[#3B5B3D]">
                    SDGs Framework 12 • 8 • 13
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-2xs ring-1 ring-[#E5DEC9]">
                    <p className="text-xs font-semibold text-[#6E5C52]">
                      Total Residue Upcycled
                    </p>
                    <p className="mt-1 font-serif text-3xl font-extrabold text-[#3B5B3D]">
                      {impactSettings?.useCustomStats
                        ? impactSettings.customResidueKg
                        : environmentalStats.totalUpcycledKg}{' '}
                      kg
                    </p>
                    <p className="mt-1 text-[11px] text-[#6E5C52]">
                      Rescued from landfills &amp; decomposition
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-2xs ring-1 ring-[#E5DEC9]">
                    <p className="text-xs font-semibold text-[#6E5C52]">
                      Nutritious Flour Produced
                    </p>
                    <p className="mt-1 font-serif text-3xl font-extrabold text-[#2C1E18]">
                      {impactSettings?.useCustomStats
                        ? impactSettings.customFlourKg
                        : environmentalStats.totalFlourProducedKg}{' '}
                      kg
                    </p>
                    <p className="mt-1 text-[11px] text-[#6E5C52]">
                      Hygienic dry flour yield ~42%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-2xs ring-1 ring-[#E5DEC9]">
                    <p className="text-xs font-semibold text-[#6E5C52]">
                      Estimated Carbon (CO₂e) Avoided
                    </p>
                    <p className="mt-1 font-serif text-3xl font-extrabold text-[#4E9A34]">
                      {impactSettings?.useCustomStats
                        ? impactSettings.customCo2AvoidedKg
                        : environmentalStats.co2SavedKg}{' '}
                      kg CO₂e
                    </p>
                    <p className="mt-1 text-[11px] text-[#4E9A34]">
                      Prevents open methane gas generation
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                  <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-3.5 text-xs">
                    <p className="font-bold text-[#3B5B3D]">
                      SDG 12: Responsible Consumption
                    </p>
                    <p className="mt-1 text-[#6E5C52]">
                      Upcycling plant food byproducts into high-nutrition, gluten-free
                      superfood ingredients.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-3.5 text-xs">
                    <p className="font-bold text-[#3B5B3D]">
                      SDG 8: Decent Work &amp; Economic Growth
                    </p>
                    <p className="mt-1 text-[#6E5C52]">
                      Providing direct supplementary income to {suppliers.length}{' '}
                      partner coconut milk vendors and micro-enterprises.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-3.5 text-xs">
                    <p className="font-bold text-[#3B5B3D]">
                      SDG 13: Climate Action
                    </p>
                    <p className="mt-1 text-[#6E5C52]">
                      Mitigating transportation carbon footprints and organic landfill
                      decomposition in urban environments.
                    </p>
                  </div>
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
                    ? 'Edit Product Details & Packaging Image'
                    : 'Add New Product'}
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  Manage product name, price, stock, weight, and packaging image.
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
                  Product Packaging Image
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
                        Upload Image from Device
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleModalPhotoUpload}
                          className="sr-only"
                        />
                      </label>
                      <span className="text-[11px] text-[#6E5C52]">
                        PNG, JPG, WebP, SVG
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5C4B42]">
                        Or Enter Image URL / Path
                      </label>
                      <input
                        type="text"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="/images/products/brownies.jpg"
                        className="mt-1 w-full rounded-xl bg-white px-3 py-1.5 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-[#6E5C52]">
                        Quick Presets:
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
                    placeholder="e.g. CORA Artisan Cookies"
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
                    placeholder="e.g. Upcycled Coconut Bites"
                    className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C1E18]">
                    Category
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) =>
                      setProdCategory(e.target.value as ProductCategory)
                    }
                    className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-2 text-sm ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                  >
                    <option value="Brownies">Brownies</option>
                    <option value="Cookies">Cookies</option>
                    <option value="Coconut Flour">Coconut Flour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C1E18]">
                    Unit Price (IDR) *
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C1E18]">
                    Net Weight (grams)
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
                    Residue Saved (grams)
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

              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Summary of taste, profile, and circular benefits..."
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

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EAE0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5C4B42]">Change Status:</span>
                  <select
                    value={proofModalOrder.status}
                    onChange={(e) =>
                      handleDirectOrderStatusChange(
                        proofModalOrder,
                        e.target.value as OrderStatus
                      )
                    }
                    className="rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] px-3 py-1.5 text-xs font-bold text-[#2C1E18] focus:outline-none focus:ring-2 focus:ring-[#3B5B3D]"
                  >
                    <option value="WAITING_VERIFICATION">Awaiting Verification</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {proofModalOrder.status === 'WAITING_VERIFICATION' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRejectOrder(proofModalOrder)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveOrder(proofModalOrder)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                      >
                        <Check className="h-4 w-4" />
                        Approve Payment
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setProofModalOrder(null)}
                      className="rounded-full bg-[#F0ECE1] px-5 py-2 text-xs font-semibold text-[#2C1E18] hover:bg-[#E5DEC9]"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SUPPLIER */}
      {showSupplierModal && (
        <div
          className="animate-cora-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={
            editingSupplierId
              ? 'Edit Supplier Partner Details'
              : 'Register New Supplier Partner'
          }
        >
          <form
            onSubmit={handleSaveSupplier}
            className="animate-cora-modal max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                  {editingSupplierId
                    ? 'Edit Supplier Partner Details'
                    : 'Register New Supplier Partner'}
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  {editingSupplierId
                    ? 'Update business profile, contact, location, or supply capacity.'
                    : 'Add coconut milk vendors or micro-enterprises to the CORA network.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSupplierModal(false);
                  setEditingSupplierId(null);
                }}
                className="rounded-full p-1 text-[#6E5C52] hover:bg-[#F0ECE1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1E18]">
                Business Name / Partner *
              </label>
              <input
                type="text"
                required
                value={supName}
                onChange={(e) => setSupName(e.target.value)}
                placeholder="e.g. Sentra Santan Segar Renon"
                className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1E18]">
                WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                required
                value={supPhone}
                onChange={(e) => setSupPhone(e.target.value)}
                placeholder="081234567890"
                className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1E18]">
                Business Location Address *
              </label>
              <textarea
                required
                rows={2}
                value={supLocation}
                onChange={(e) => setSupLocation(e.target.value)}
                placeholder="Jl. Tukad Yeh Aya No. 42, Renon, Denpasar Selatan"
                className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Business Type
                </label>
                <select
                  value={supType}
                  onChange={(e) => setSupType(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                >
                  <option value="Pabrik Pengolahan Santan">Coconut Milk Facility</option>
                  <option value="Kedai Kopi / Kafe">Coffee Shop / Cafe</option>
                  <option value="Kios Kelapa Muda Tradisional">
                    Traditional Coconut Stall
                  </option>
                  <option value="Katering & Bakery">Catering &amp; Bakery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Daily Estimate (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={supKg}
                  onChange={(e) => setSupKg(e.target.value)}
                  placeholder="25"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Production Frequency
                </label>
                <select
                  value={supFreq}
                  onChange={(e) => setSupFreq(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                >
                  <option value="Setiap Hari">Daily</option>
                  <option value="3-4 Kali Seminggu">3-4 Times a Week</option>
                  <option value="1-2 Kali Seminggu">1-2 Times a Week</option>
                  <option value="Berdasarkan Pesanan">On-Demand / Per Order</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Partner Verification Status
                </label>
                <select
                  value={supStatus}
                  onChange={(e) => setSupStatus(e.target.value as SupplierStatus)}
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                >
                  <option value="ACTIVE">Verified Active</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="INACTIVE">Inactive / On Hold</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#F0EAE0] pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowSupplierModal(false);
                  setEditingSupplierId(null);
                }}
                className="rounded-full border border-[#E5DEC9] px-4 py-2 text-xs font-semibold text-[#5C4B42]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
              >
                <Save className="h-3.5 w-3.5" />
                {editingSupplierId ? 'Save Changes' : 'Register Partner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT RECIPE */}
      {showRecipeModal && (
        <div
          className="animate-cora-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={editingRecipeId ? 'Edit Recipe' : 'Add New Recipe'}
        >
          <form
            onSubmit={handleSaveRecipeForm}
            className="animate-cora-modal max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                  {editingRecipeId ? 'Edit RecipeHub Recipe' : 'Add New Recipe'}
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  The recipe will appear immediately on the RecipeHub page and sync
                  with CoraBlend AI.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRecipeModal(false)}
                className="rounded-full p-1 text-[#6E5C52] hover:bg-[#F0ECE1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  required
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  placeholder="e.g. CORA Choco Chunk Cookies"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Kategori
                </label>
                <select
                  value={recCategory}
                  onChange={(e) =>
                    setRecCategory(e.target.value as RecipeCategory)
                  }
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                >
                  <option value="Cookies and Biscuits">
                    Cookies and Biscuits
                  </option>
                  <option value="Cakes and Brownies">Cakes and Brownies</option>
                  <option value="Healthy Snacks">Healthy Snacks</option>
                  <option value="Creative Recipes">Creative Recipes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Prep Time
                </label>
                <input
                  type="text"
                  required
                  value={recPrepTime}
                  onChange={(e) => setRecPrepTime(e.target.value)}
                  placeholder="15 mins"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-1.5 text-xs ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Cook Time
                </label>
                <input
                  type="text"
                  required
                  value={recCookTime}
                  onChange={(e) => setRecCookTime(e.target.value)}
                  placeholder="20 mins"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-1.5 text-xs ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Servings
                </label>
                <input
                  type="text"
                  required
                  value={recServings}
                  onChange={(e) => setRecServings(e.target.value)}
                  placeholder="4-6 portions"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3 py-1.5 text-xs ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Difficulty Level
                </label>
                <select
                  value={recDifficulty}
                  onChange={(e) =>
                    setRecDifficulty(
                      e.target.value as 'Easy' | 'Medium' | 'Creative'
                    )
                  }
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-2.5 py-1.5 text-xs ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  CORA Coconut Flour Measure
                </label>
                <input
                  type="text"
                  required
                  value={recCoconutFlour}
                  onChange={(e) => setRecCoconutFlour(e.target.value)}
                  placeholder="e.g. 50g Upcycled Coconut Flour"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Calories per Serving (kcal)
                </label>
                <input
                  type="number"
                  value={recCalories}
                  onChange={(e) => setRecCalories(e.target.value)}
                  placeholder="180"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1E18]">
                Short Description / Summary
              </label>
              <textarea
                rows={2}
                value={recSummary}
                onChange={(e) => setRecSummary(e.target.value)}
                placeholder="Flavor profile and nutritional benefits of this upcycled recipe..."
                className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Ingredients (1 ingredient per line) *
                </label>
                <textarea
                  required
                  rows={5}
                  value={recIngredientsText}
                  onChange={(e) => setRecIngredientsText(e.target.value)}
                  placeholder="50g CORA coconut flour&#10;100g oat flour&#10;40ml coconut oil..."
                  className="mt-1 w-full font-mono rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Preparation Steps (1 step per line) *
                </label>
                <textarea
                  required
                  rows={5}
                  value={recStepsText}
                  onChange={(e) => setRecStepsText(e.target.value)}
                  placeholder="Preheat oven to 175°C.&#10;Mix dry ingredients together.&#10;Bake for 15 minutes..."
                  className="mt-1 w-full font-mono rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
            </div>

            {/* Recipe Image URL & Presets */}
            <div>
              <label className="block text-xs font-semibold text-[#2C1E18]">
                Recipe Image (URL / Preset)
              </label>
              <input
                type="text"
                value={recImage}
                onChange={(e) => setRecImage(e.target.value)}
                placeholder="/images/products/cookies.jpg"
                className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs ring-1 ring-[#E5DEC9] focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-[#6E5C52]">Quick Select:</span>
                {RECIPE_IMAGE_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setRecImage(p.value)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                      recImage === p.value
                        ? 'bg-[#3B5B3D] text-white'
                        : 'border border-[#E5DEC9] bg-white text-[#5C4B42]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#F0EAE0] pt-3">
              <button
                type="button"
                onClick={() => setShowRecipeModal(false)}
                className="rounded-full border border-[#E5DEC9] px-4 py-2 text-xs font-semibold text-[#5C4B42]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
              >
                <Save className="h-3.5 w-3.5" />
                Save Recipe
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT IMPACT INDICATOR */}
      {showIndicatorModal && (
        <div
          className="animate-cora-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={
            editingIndicatorId
              ? 'Edit Impact Indicator'
              : 'Add New Indicator'
          }
        >
          <form
            onSubmit={handleSaveIndicator}
            className="animate-cora-modal max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1E18]">
                  {editingIndicatorId
                    ? 'Edit Impact Indicator'
                    : 'Add New Impact Indicator'}
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  This indicator will appear immediately in the Our Impact statistics grid.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIndicatorModal(false)}
                className="rounded-full p-1 text-[#6E5C52] hover:bg-[#F0ECE1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1E18]">
                Indicator Label / Title *
              </label>
              <input
                type="text"
                required
                value={indLabel}
                onChange={(e) => setIndLabel(e.target.value)}
                placeholder="e.g. Residue Upcycled"
                className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Value *
                </label>
                <input
                  type="text"
                  required
                  value={indValue}
                  onChange={(e) => setIndValue(e.target.value)}
                  placeholder="e.g. 2.36"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C1E18]">
                  Unit *
                </label>
                <input
                  type="text"
                  required
                  value={indUnit}
                  onChange={(e) => setIndUnit(e.target.value)}
                  placeholder="kg / partners / pcs"
                  className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1E18]">
                Brief Description
              </label>
              <textarea
                rows={2}
                value={indDesc}
                onChange={(e) => setIndDesc(e.target.value)}
                placeholder="Brief explanation of the metric..."
                className="mt-1 w-full rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-[#F0EAE0] pt-3">
              <button
                type="button"
                onClick={() => setShowIndicatorModal(false)}
                className="rounded-full border border-[#E5DEC9] px-4 py-2 text-xs font-semibold text-[#5C4B42]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
              >
                <Save className="h-3.5 w-3.5" />
                Save Indicator
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
