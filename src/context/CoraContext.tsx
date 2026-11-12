'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  AddExpenseInput,
  BankAccount,
  CartItem,
  CreateOrderInput,
  FinancialRecord,
  Order,
  OrderStatus,
  PickupRequest,
  PickupRequestStatus,
  Product,
  SaveBankAccountInput,
  SaveProductInput,
  SubmitPickupInput,
} from '@/types/cora';

const STORAGE_KEY = 'cora_circular_store_v3';

interface CoraStoreState {
  products: Product[];
  bankAccounts: BankAccount[];
  orders: Order[];
  financialRecords: FinancialRecord[];
  pickupRequests: PickupRequest[];
  cart: CartItem[];
}

interface CoraContextValue extends CoraStoreState {
  isHydrated: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, qty?: number) => void;
  updateCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (input: CreateOrderInput) => Order;
  verifyOrderPayment: (
    orderId: string,
    action: 'APPROVE' | 'REJECT',
    trackingNumber?: string
  ) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) => void;
  saveProduct: (product: SaveProductInput) => Product;
  deleteProduct: (productId: string) => void;
  saveBankAccount: (account: SaveBankAccountInput) => BankAccount;
  addManualExpense: (expense: AddExpenseInput) => FinancialRecord;
  submitPickupRequest: (request: SubmitPickupInput) => PickupRequest;
  updatePickupStatus: (requestId: string, status: PickupRequestStatus) => void;
  resetDemoData: () => void;
}

function encodeBase64Ascii(input: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(input);
  }
  return Buffer.from(input, 'utf8').toString('base64');
}

function createDummyReceiptDataUrl(params: {
  bankName: string;
  accountNumber: string;
  amountFormatted: string;
  senderName: string;
  dateText: string;
  refNo: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="520" viewBox="0 0 420 520">
  <rect width="420" height="520" rx="20" fill="#FAF8F5"/>
  <rect x="20" y="20" width="380" height="480" rx="16" fill="#FFFFFF" stroke="#E2D9CE" stroke-width="2"/>
  <rect x="20" y="20" width="380" height="78" rx="16" fill="#4A5D3F"/>
  <rect x="20" y="76" width="380" height="22" fill="#4A5D3F"/>
  <text x="210" y="55" text-anchor="middle" fill="#FAF8F5" font-family="sans-serif" font-size="18" font-weight="bold">TRANSFER RECEIPT CONFIRMED</text>
  <text x="210" y="79" text-anchor="middle" fill="#DCE5D5" font-family="sans-serif" font-size="12">${params.bankName} Mobile Banking</text>
  <circle cx="210" cy="138" r="24" fill="#E8F0E3"/>
  <path d="M198 138 L206 146 L223 129" stroke="#4A5D3F" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="210" y="184" text-anchor="middle" fill="#6F5E55" font-family="sans-serif" font-size="12">TOTAL TRANSFER</text>
  <text x="210" y="214" text-anchor="middle" fill="#2C1E18" font-family="sans-serif" font-size="26" font-weight="bold">${params.amountFormatted}</text>
  <line x1="44" y1="238" x2="376" y2="238" stroke="#EAE2D7" stroke-dasharray="5 5" stroke-width="1.5"/>
  <text x="44" y="270" fill="#7B6A61" font-family="sans-serif" font-size="12">Date</text>
  <text x="376" y="270" text-anchor="end" fill="#2C1E18" font-family="sans-serif" font-size="12" font-weight="bold">${params.dateText}</text>
  <text x="44" y="302" fill="#7B6A61" font-family="sans-serif" font-size="12">Reference No.</text>
  <text x="376" y="302" text-anchor="end" fill="#2C1E18" font-family="sans-serif" font-size="12" font-weight="bold">${params.refNo}</text>
  <text x="44" y="334" fill="#7B6A61" font-family="sans-serif" font-size="12">Sender</text>
  <text x="376" y="334" text-anchor="end" fill="#2C1E18" font-family="sans-serif" font-size="12" font-weight="bold">${params.senderName}</text>
  <text x="44" y="366" fill="#7B6A61" font-family="sans-serif" font-size="12">Destination Account</text>
  <text x="376" y="366" text-anchor="end" fill="#2C1E18" font-family="sans-serif" font-size="12" font-weight="bold">${params.bankName} ${params.accountNumber}</text>
  <text x="44" y="398" fill="#7B6A61" font-family="sans-serif" font-size="12">Recipient</text>
  <text x="376" y="398" text-anchor="end" fill="#2C1E18" font-family="sans-serif" font-size="12" font-weight="bold">PT CORA Circular Innovation</text>
  <rect x="44" y="426" width="332" height="50" rx="10" fill="#FAF8F5" stroke="#E6DDD0"/>
  <text x="210" y="456" text-anchor="middle" fill="#4A5D3F" font-family="sans-serif" font-size="12" font-weight="bold">Bank System Verified Transaction (Demo)</text>
</svg>`;

  return `data:image/svg+xml;base64,${encodeBase64Ascii(svg)}`;
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const suffix = String(Math.floor(100 + Math.random() * 900));
  return `CORA-${y}${m}${d}-${suffix}`;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-brownies',
    name: 'CORA Brownies',
    subtitle: 'Coconut Based Brownies',
    category: 'Brownies',
    price: 38000,
    stock: 40,
    weightGram: 200,
    residueSavedGram: 250,
    image: '/images/products/brownies.jpg',
    description:
      'Rich fudgy dark-chocolate brownies crafted with upcycled coconut flour from rescued coconut milk residue. Naturally moist, fiber-rich, and guilt-free.',
  },
  {
    id: 'prod-cookies',
    name: 'CORA Cookies',
    subtitle: 'Coconut Based Cookies',
    category: 'Cookies',
    price: 32000,
    stock: 55,
    weightGram: 150,
    residueSavedGram: 180,
    image: '/images/products/cookies.jpg',
    description:
      'Crisp artisanal cookies baked with toasted upcycled coconut flour, coconut nectar, and dark chocolate chunks for a warm, nutty crunch.',
  },
  {
    id: 'prod-flour-500',
    name: 'CORA Coconut Flour (500g)',
    subtitle: '100% Natural Flour',
    category: 'Flour',
    price: 25000,
    stock: 80,
    weightGram: 500,
    residueSavedGram: 500,
    image: '/images/products/coconut.jpg',
    description:
      'Hygienically dried and finely milled from fresh coconut residue. High in dietary fiber, naturally low-glycemic, and ideal for everyday circular baking.',
  },
  {
    id: 'prod-brownies-twin',
    name: 'CORA Trio Bundle Pack',
    subtitle: 'Flour + Brownies + Cookies',
    category: 'Brownies',
    price: 72000,
    stock: 25,
    weightGram: 400,
    residueSavedGram: 500,
    image: '/images/hero/hero.jpg',
    description:
      'Value bundle containing the full CORA upcycled trio: Coconut Flour, Brownies, and Cookies. Perfect for gifting or sharing while maximizing your circular food impact.',
  },
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-bca',
    bankName: 'Bank BCA',
    accountNumber: '8820192831',
    accountHolder: 'PT CORA Circular Innovation',
    isActive: true,
  },
  {
    id: 'bank-mandiri',
    bankName: 'Bank Mandiri',
    accountNumber: '1450029381920',
    accountHolder: 'PT CORA Circular Innovation',
    isActive: true,
  },
];

const RECEIPT_ORD_001 = createDummyReceiptDataUrl({
  bankName: 'Bank BCA',
  accountNumber: '8820192831',
  amountFormatted: 'Rp 108.000',
  senderName: 'Nadia Kusuma',
  dateText: '12 Nov 2026, 09:12 WIB',
  refNo: 'TRX-BCA-992014',
});

const RECEIPT_ORD_002 = createDummyReceiptDataUrl({
  bankName: 'Bank Mandiri',
  accountNumber: '1450029381920',
  amountFormatted: 'Rp 75.000',
  senderName: 'Raka Pratama',
  dateText: '11 Nov 2026, 14:25 WIB',
  refNo: 'TRX-MDR-441820',
});

const RECEIPT_ORD_003 = createDummyReceiptDataUrl({
  bankName: 'Bank BCA',
  accountNumber: '8820192831',
  amountFormatted: 'Rp 136.000',
  senderName: 'Sinta Wijaya',
  dateText: '08 Nov 2026, 10:01 WIB',
  refNo: 'TRX-BCA-773105',
});

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'CORA-20261112-001',
    customerName: 'Nadia Kusuma',
    customerPhone: '081234567890',
    shippingAddress: 'Jl. Kemang Raya No. 45, Jakarta Selatan 12730',
    items: [
      {
        productId: 'prod-brownies',
        productName: 'CORA Brownies',
        price: 38000,
        qty: 2,
        image: '/images/products/brownies.jpg',
      },
      {
        productId: 'prod-cookies',
        productName: 'CORA Cookies',
        price: 32000,
        qty: 1,
        image: '/images/products/cookies.jpg',
      },
    ],
    totalAmount: 108000,
    bankAccountUsed: 'Bank BCA - 8820192831',
    proofImage: RECEIPT_ORD_001,
    status: 'WAITING_VERIFICATION',
    notes: 'Please pack securely with protective wrap.',
    createdAt: '2026-11-12T09:15:00.000Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'CORA-20261111-002',
    customerName: 'Raka Pratama',
    customerPhone: '081398765432',
    shippingAddress: 'Jl. Dago Pakar Barat No. 12, Bandung 40191',
    items: [
      {
        productId: 'prod-flour-500',
        productName: 'CORA Coconut Flour (500g)',
        price: 25000,
        qty: 3,
        image: '/images/products/coconut.jpg',
      },
    ],
    totalAmount: 75000,
    bankAccountUsed: 'Bank Mandiri - 1450029381920',
    proofImage: RECEIPT_ORD_002,
    status: 'PROCESSING',
    notes: 'For weekend baking stock.',
    createdAt: '2026-11-11T14:30:00.000Z',
  },
  {
    id: 'ord-003',
    orderNumber: 'CORA-20261108-003',
    customerName: 'Sinta Wijaya',
    customerPhone: '085611223344',
    shippingAddress: 'Perum Graha Famili Blok K-8, Surabaya 60226',
    items: [
      {
        productId: 'prod-brownies-twin',
        productName: 'CORA Trio Bundle Pack',
        price: 72000,
        qty: 1,
        image: '/images/hero/hero.jpg',
      },
      {
        productId: 'prod-cookies',
        productName: 'CORA Cookies',
        price: 32000,
        qty: 2,
        image: '/images/products/cookies.jpg',
      },
    ],
    totalAmount: 136000,
    bankAccountUsed: 'Bank BCA - 8820192831',
    proofImage: RECEIPT_ORD_003,
    status: 'COMPLETED',
    trackingNumber: 'JNE-CORA88291044',
    notes: 'Leave with security if nobody is home.',
    createdAt: '2026-11-08T10:05:00.000Z',
  },
];

export const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [
  {
    id: 'fin-001',
    date: '2026-11-11T15:00:00.000Z',
    orderNumber: 'CORA-20261111-002',
    description: 'Payment for Order #CORA-20261111-002 (Raka Pratama)',
    type: 'INCOME',
    amount: 75000,
    category: 'Product Sales',
  },
  {
    id: 'fin-002',
    date: '2026-11-08T11:00:00.000Z',
    orderNumber: 'CORA-20261108-003',
    description: 'Payment for Order #CORA-20261108-003 (Sinta Wijaya)',
    type: 'INCOME',
    amount: 136000,
    category: 'Product Sales',
  },
];

export const INITIAL_PICKUP_REQUESTS: PickupRequest[] = [
  {
    id: 'pick-001',
    supplierName: 'Koperasi Kelapa Makmur Jaya',
    phone: '081288990011',
    location: 'Pasar Induk Kramat Jati, Jakarta Timur',
    estimatedKg: 120,
    preferredDate: '2026-11-15',
    status: 'SCHEDULED',
  },
  {
    id: 'pick-002',
    supplierName: 'Santan Segar Ibu Sari',
    phone: '085777889900',
    location: 'Jl. Margonda Raya No. 210, Depok',
    estimatedKg: 65,
    preferredDate: '2026-11-16',
    status: 'PENDING',
  },
];

function getInitialStoreState(): CoraStoreState {
  return {
    products: INITIAL_PRODUCTS.map((p) => ({ ...p })),
    bankAccounts: INITIAL_BANK_ACCOUNTS.map((b) => ({ ...b })),
    orders: INITIAL_ORDERS.map((o) => ({
      ...o,
      items: o.items.map((item) => ({ ...item })),
    })),
    financialRecords: INITIAL_FINANCIAL_RECORDS.map((f) => ({ ...f })),
    pickupRequests: INITIAL_PICKUP_REQUESTS.map((r) => ({ ...r })),
    cart: [],
  };
}

function migrateProductImage(img: string): string {
  if (!img) return '/images/products/brownies.jpg';
  if (img.includes('cora-brownies.svg')) return '/images/products/brownies.jpg';
  if (img.includes('cora-cookies.svg')) return '/images/products/cookies.jpg';
  if (img.includes('cora-flour.svg')) return '/images/products/coconut.jpg';
  if (img.includes('cora-brownies-twin.svg')) return '/images/hero/hero.jpg';
  return img;
}

function parseStoredState(raw: string | null): CoraStoreState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CoraStoreState>;
    if (
      !parsed ||
      !Array.isArray(parsed.products) ||
      !Array.isArray(parsed.bankAccounts) ||
      !Array.isArray(parsed.orders) ||
      !Array.isArray(parsed.financialRecords) ||
      !Array.isArray(parsed.pickupRequests) ||
      !Array.isArray(parsed.cart)
    ) {
      return null;
    }
    return {
      products: parsed.products.map((p) => ({
        ...p,
        image: migrateProductImage(p.image),
      })),
      bankAccounts: parsed.bankAccounts,
      orders: parsed.orders.map((o) => ({
        ...o,
        items: o.items.map((i) => ({
          ...i,
          image: migrateProductImage(i.image),
        })),
      })),
      financialRecords: parsed.financialRecords,
      pickupRequests: parsed.pickupRequests,
      cart: parsed.cart.map((c) => ({
        ...c,
        image: migrateProductImage(c.image),
      })),
    };
  } catch {
    return null;
  }
}

const CoraContext = createContext<CoraContextValue | undefined>(undefined);

export function CoraProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CoraStoreState>(() => getInitialStoreState());
  const [isHydrated, setIsHydrated] = useState(false);

  const persistState = useCallback((nextState: CoraStoreState) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Ignore storage quota or private mode errors safely
    }
  }, []);

  useEffect(() => {
    const stored = parseStoredState(window.localStorage.getItem(STORAGE_KEY));
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(stored);
    } else {
      persistState(getInitialStoreState());
    }
    setIsHydrated(true);
  }, [persistState]);

  const updateStore = useCallback(
    (updater: (prev: CoraStoreState) => CoraStoreState) => {
      setState((prev) => {
        const next = updater(prev);
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      if (qty <= 0 || product.stock <= 0) return;
      updateStore((prev) => {
        const liveProduct =
          prev.products.find((p) => p.id === product.id) ?? product;
        const maxStock = Math.max(0, liveProduct.stock);
        if (maxStock <= 0) return prev;

        const existingIndex = prev.cart.findIndex(
          (item) => item.productId === liveProduct.id
        );

        if (existingIndex >= 0) {
          const updatedCart = prev.cart.map((item, idx) =>
            idx === existingIndex
              ? {
                  ...item,
                  qty: Math.min(maxStock, item.qty + qty),
                  price: liveProduct.price,
                  productName: liveProduct.name,
                  image: liveProduct.image,
                  weightGram: liveProduct.weightGram,
                  residueSavedGram: liveProduct.residueSavedGram,
                }
              : item
          );
          return { ...prev, cart: updatedCart };
        }

        const newItem: CartItem = {
          productId: liveProduct.id,
          productName: liveProduct.name,
          price: liveProduct.price,
          qty: Math.min(maxStock, qty),
          image: liveProduct.image,
          weightGram: liveProduct.weightGram,
          residueSavedGram: liveProduct.residueSavedGram,
        };

        return { ...prev, cart: [...prev.cart, newItem] };
      });
    },
    [updateStore]
  );

  const updateCartQty = useCallback(
    (productId: string, qty: number) => {
      updateStore((prev) => {
        if (qty <= 0) {
          return {
            ...prev,
            cart: prev.cart.filter((item) => item.productId !== productId),
          };
        }

        const matchedProduct = prev.products.find((p) => p.id === productId);
        const cappedQty = matchedProduct
          ? Math.min(Math.max(1, matchedProduct.stock), qty)
          : qty;

        return {
          ...prev,
          cart: prev.cart.map((item) =>
            item.productId === productId ? { ...item, qty: cappedQty } : item
          ),
        };
      });
    },
    [updateStore]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      updateStore((prev) => ({
        ...prev,
        cart: prev.cart.filter((item) => item.productId !== productId),
      }));
    },
    [updateStore]
  );

  const clearCart = useCallback(() => {
    updateStore((prev) => ({ ...prev, cart: [] }));
  }, [updateStore]);

  const createOrder = useCallback(
    (input: CreateOrderInput): Order => {
      const orderItems =
        input.items && input.items.length > 0
          ? input.items.map((item) => ({ ...item }))
          : state.cart.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              price: item.price,
              qty: item.qty,
              image: item.image,
            }));

      const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      const newOrder: Order = {
        id: generateId('ord'),
        orderNumber: generateOrderNumber(),
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone.trim(),
        shippingAddress: input.shippingAddress.trim(),
        items: orderItems,
        totalAmount,
        bankAccountUsed: input.bankAccountUsed,
        proofImage: input.proofImage,
        status: 'WAITING_VERIFICATION',
        notes: input.notes?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      updateStore((prev) => ({
        ...prev,
        orders: [newOrder, ...prev.orders],
        cart: input.items && input.items.length > 0 ? prev.cart : [],
      }));

      return newOrder;
    },
    [state.cart, updateStore]
  );

  const verifyOrderPayment = useCallback(
    (
      orderId: string,
      action: 'APPROVE' | 'REJECT',
      trackingNumber?: string
    ) => {
      updateStore((prev) => {
        const targetOrder = prev.orders.find((o) => o.id === orderId);
        if (!targetOrder) return prev;

        if (action === 'REJECT') {
          return {
            ...prev,
            orders: prev.orders.map((order) =>
              order.id === orderId ? { ...order, status: 'REJECTED' } : order
            ),
          };
        }

        // Guard against double-deducting stock or duplicating INCOME records
        const alreadyApproved =
          targetOrder.status === 'PROCESSING' ||
          targetOrder.status === 'SHIPPED' ||
          targetOrder.status === 'COMPLETED';

        const trimmedTracking = trackingNumber?.trim();
        const nextStatus: OrderStatus = trimmedTracking
          ? 'SHIPPED'
          : 'PROCESSING';

        const nextOrders = prev.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: nextStatus,
                trackingNumber: trimmedTracking || order.trackingNumber,
              }
            : order
        );

        if (alreadyApproved) {
          return { ...prev, orders: nextOrders };
        }

        const nextProducts = prev.products.map((product) => {
          const orderedQty = targetOrder.items
            .filter((item) => item.productId === product.id)
            .reduce((sum, item) => sum + item.qty, 0);
          if (orderedQty <= 0) return product;
          return {
            ...product,
            stock: Math.max(0, product.stock - orderedQty),
          };
        });

        const hasExistingIncome = prev.financialRecords.some(
          (rec) =>
            rec.type === 'INCOME' &&
            rec.orderNumber === targetOrder.orderNumber
        );

        const nextFinancialRecords = hasExistingIncome
          ? prev.financialRecords
          : [
              {
                id: generateId('fin'),
                date: new Date().toISOString(),
                orderNumber: targetOrder.orderNumber,
                description: `Payment for Order #${targetOrder.orderNumber} (${targetOrder.customerName})`,
                type: 'INCOME' as const,
                amount: targetOrder.totalAmount,
                category: 'Product Sales',
              },
              ...prev.financialRecords,
            ];

        return {
          ...prev,
          products: nextProducts,
          orders: nextOrders,
          financialRecords: nextFinancialRecords,
        };
      });
    },
    [updateStore]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus, trackingNumber?: string) => {
      updateStore((prev) => ({
        ...prev,
        orders: prev.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
                trackingNumber:
                  trackingNumber !== undefined
                    ? trackingNumber.trim() || undefined
                    : order.trackingNumber,
              }
            : order
        ),
      }));
    },
    [updateStore]
  );

  const saveProduct = useCallback(
    (productInput: SaveProductInput): Product => {
      const existing = productInput.id
        ? state.products.find((p) => p.id === productInput.id)
        : undefined;

      const savedProduct: Product = {
        id: existing ? existing.id : productInput.id || generateId('prod'),
        name: productInput.name.trim(),
        subtitle: productInput.subtitle.trim(),
        category: productInput.category,
        price: Number(productInput.price),
        stock: Math.max(0, Number(productInput.stock)),
        weightGram: Math.max(0, Number(productInput.weightGram)),
        residueSavedGram: Math.max(0, Number(productInput.residueSavedGram)),
        image: productInput.image,
        description: productInput.description.trim(),
      };

      updateStore((prev) => {
        const exists = prev.products.some((p) => p.id === savedProduct.id);
        const nextProducts = exists
          ? prev.products.map((p) =>
              p.id === savedProduct.id ? savedProduct : p
            )
          : [savedProduct, ...prev.products];

        const nextCart = prev.cart.map((item) =>
          item.productId === savedProduct.id
            ? {
                ...item,
                productName: savedProduct.name,
                price: savedProduct.price,
                image: savedProduct.image,
                weightGram: savedProduct.weightGram,
                residueSavedGram: savedProduct.residueSavedGram,
              }
            : item
        );

        return {
          ...prev,
          products: nextProducts,
          cart: nextCart,
        };
      });

      return savedProduct;
    },
    [state.products, updateStore]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      updateStore((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
        cart: prev.cart.filter((item) => item.productId !== productId),
      }));
    },
    [updateStore]
  );

  const saveBankAccount = useCallback(
    (accountInput: SaveBankAccountInput): BankAccount => {
      const existing = accountInput.id
        ? state.bankAccounts.find((b) => b.id === accountInput.id)
        : undefined;

      const savedAccount: BankAccount = {
        id: existing ? existing.id : accountInput.id || generateId('bank'),
        bankName: accountInput.bankName.trim(),
        accountNumber: accountInput.accountNumber.trim(),
        accountHolder: accountInput.accountHolder.trim(),
        isActive: Boolean(accountInput.isActive),
      };

      updateStore((prev) => {
        const exists = prev.bankAccounts.some((b) => b.id === savedAccount.id);
        const nextAccounts = exists
          ? prev.bankAccounts.map((b) =>
              b.id === savedAccount.id ? savedAccount : b
            )
          : [...prev.bankAccounts, savedAccount];

        return {
          ...prev,
          bankAccounts: nextAccounts,
        };
      });

      return savedAccount;
    },
    [state.bankAccounts, updateStore]
  );

  const addManualExpense = useCallback(
    (expense: AddExpenseInput): FinancialRecord => {
      const newRecord: FinancialRecord = {
        id: generateId('fin'),
        date: expense.date || new Date().toISOString(),
        orderNumber: expense.orderNumber?.trim() || undefined,
        description: expense.description.trim(),
        type: 'EXPENSE',
        amount: Math.max(0, Number(expense.amount)),
        category: expense.category.trim(),
      };

      updateStore((prev) => ({
        ...prev,
        financialRecords: [newRecord, ...prev.financialRecords],
      }));

      return newRecord;
    },
    [updateStore]
  );

  const submitPickupRequest = useCallback(
    (request: SubmitPickupInput): PickupRequest => {
      const newRequest: PickupRequest = {
        id: generateId('pick'),
        supplierName: request.supplierName.trim(),
        phone: request.phone.trim(),
        location: request.location.trim(),
        estimatedKg: Math.max(0, Number(request.estimatedKg)),
        preferredDate: request.preferredDate,
        status: 'PENDING',
      };

      updateStore((prev) => ({
        ...prev,
        pickupRequests: [newRequest, ...prev.pickupRequests],
      }));

      return newRequest;
    },
    [updateStore]
  );

  const updatePickupStatus = useCallback(
    (requestId: string, status: PickupRequestStatus) => {
      updateStore((prev) => ({
        ...prev,
        pickupRequests: prev.pickupRequests.map((req) =>
          req.id === requestId ? { ...req, status } : req
        ),
      }));
    },
    [updateStore]
  );

  const resetDemoData = useCallback(() => {
    const fresh = getInitialStoreState();
    setState(fresh);
    persistState(fresh);
  }, [persistState]);

  const cartCount = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.qty, 0),
    [state.cart]
  );

  const cartTotal = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [state.cart]
  );

  const value = useMemo<CoraContextValue>(
    () => ({
      ...state,
      isHydrated,
      cartCount,
      cartTotal,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      createOrder,
      verifyOrderPayment,
      updateOrderStatus,
      saveProduct,
      deleteProduct,
      saveBankAccount,
      addManualExpense,
      submitPickupRequest,
      updatePickupStatus,
      resetDemoData,
    }),
    [
      state,
      isHydrated,
      cartCount,
      cartTotal,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      createOrder,
      verifyOrderPayment,
      updateOrderStatus,
      saveProduct,
      deleteProduct,
      saveBankAccount,
      addManualExpense,
      submitPickupRequest,
      updatePickupStatus,
      resetDemoData,
    ]
  );

  return <CoraContext.Provider value={value}>{children}</CoraContext.Provider>;
}

export function useCora(): CoraContextValue {
  const context = useContext(CoraContext);
  if (!context) {
    throw new Error('useCora must be used within a CoraProvider');
  }
  return context;
}

