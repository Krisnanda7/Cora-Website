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
  ImpactSettings,
  ImpactStatItem,
  Order,
  OrderStatus,
  PickupRequest,
  PickupRequestStatus,
  Product,
  Recipe,
  RegisterSupplierInput,
  SaveBankAccountInput,
  SaveProductInput,
  SubmitPickupInput,
  Supplier,
  UserProfile,
} from '@/types/cora';

const STORAGE_KEY = 'cora_circular_store_v9';

interface CoraStoreState {
  products: Product[];
  bankAccounts: BankAccount[];
  orders: Order[];
  financialRecords: FinancialRecord[];
  pickupRequests: PickupRequest[];
  suppliers: Supplier[];
  recipes: Recipe[];
  userProfile: UserProfile;
  impactSettings: ImpactSettings;
  cart: CartItem[];
}

interface CoraContextValue extends CoraStoreState {
  isHydrated: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, qty?: number, variant?: string) => void;
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
  registerSupplier: (input: RegisterSupplierInput) => Supplier;
  saveSupplier: (supplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;
  updateImpactSettings: (settings: Partial<ImpactSettings>) => void;
  saveImpactIndicator: (indicator: ImpactStatItem) => void;
  deleteImpactIndicator: (id: string) => void;
  toggleFavoriteRecipe: (recipeId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  saveRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipeId: string) => void;
  findOrderByNumber: (orderNumber: string) => Order | undefined;
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

const COMMON_BENEFITS = [
  'Crafted from upcycled coconut milk residue',
  'Optimizing coconut byproducts into high-value food',
  'Innovative, fiber-rich alternative culinary ingredient',
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-flour-100',
    name: 'CORA Pure Coconut Flour (100g)',
    subtitle: '100% Upcycled Natural Flour',
    category: 'Flour',
    price: 18000,
    stock: 95,
    weightGram: 100,
    residueSavedGram: 150,
    image: '/images/products/halaman1.jpg',
    imageBack: '/images/products/halamanBelakang.jpg',
    images: [
      '/images/products/halaman1.jpg',
      '/images/products/halamanBelakang.jpg',
    ],
    description:
      'Hygienically dehydrated and finely milled from fresh upcycled coconut milk residue. Rich in natural dietary fiber, low glycemic index, and ideal for everyday circular baking and culinary creations.',
    ingredients: [
      '100% Upcycled Pure Coconut Pulp (Food-Grade Dehydrated, Preservative-Free)',
    ],
    netWeight: '100g',
    variants: ['Pouch 100g', 'Twin Pack (2 x 100g)'],
    storageInfo:
      'Store in an airtight glass jar or pouch in a cool, dry place protected from humidity.',
    shelfLife: '6 months in sealed packaging.',
    benefits: COMMON_BENEFITS,
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-waffles',
    title: 'Coconut Flour Golden Waffles',
    category: 'Pancakes and Waffles',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: '4 waffles',
    calories: 140,
    difficulty: 'Easy',
    coconutFlourUsed: '50g CORA Coconut Flour',
    summary:
      'Golden crisp exterior with fluffy center, subtly sweet and aromatic from pure upcycled coconut flour.',
    ingredients: [
      '50g CORA Upcycled Coconut Flour',
      '3 Farm Fresh Eggs',
      '60ml Coconut Milk or Almond Milk',
      '30g Melted Coconut Oil or Grass-fed Butter',
      '1 tbsp Honey or Maple Syrup',
      '1/2 tsp Baking Powder & pinch of sea salt',
    ],
    steps: [
      'Preheat your waffle iron and lightly coat with coconut oil spray.',
      'Whisk eggs, milk, melted coconut oil, and honey until smooth and lightly frothy.',
      'Sift CORA Coconut Flour, baking powder, and sea salt into the wet mixture.',
      'Whisk well and let rest for 3 minutes so the coconut flour absorbs the liquids.',
      'Pour batter into the preheated waffle iron and cook for 4-5 minutes until steam subsides and waffles are crisp and golden.',
    ],
    image: '/images/ingredients/coconut-flour.jpg',
  },
  {
    id: 'rec-flatbread',
    title: 'Savory Coconut Flatbread',
    category: 'Creative Recipes',
    prepTime: '10 mins',
    cookTime: '10 mins',
    servings: '4 flatbreads',
    calories: 125,
    difficulty: 'Easy',
    coconutFlourUsed: '60g CORA Coconut Flour',
    summary:
      'Pliable, wholesome savory flatbreads infused with herbs and garlic, perfect for healthy wraps and dips.',
    ingredients: [
      '60g CORA Upcycled Coconut Flour',
      '2 tbsp Psyllium Husk or Tapioca Flour',
      '120ml Warm Water',
      '2 tbsp Extra Virgin Olive Oil or Coconut Oil',
      '1/2 tsp Garlic Powder & Dried Italian Herbs',
      '1/2 tsp Sea Salt',
    ],
    steps: [
      'Combine CORA Coconut Flour, psyllium/tapioca, garlic powder, herbs, and salt in a bowl.',
      'Add warm water and olive oil, stirring until a workable dough forms.',
      'Let dough sit for 5 minutes to fully hydrate, then divide into 4 balls.',
      'Roll each ball between parchment paper into 2mm thick rounds.',
      'Cook on a dry non-stick skillet over medium heat for 2-3 minutes per side until lightly blistered.',
    ],
    image: '/images/ingredients/coconut-flour.jpg',
  },
  {
    id: 'rec-pancakes',
    title: 'Fluffy Coconut Pancakes',
    category: 'Pancakes and Waffles',
    prepTime: '10 mins',
    cookTime: '10 mins',
    servings: '6 pancakes',
    calories: 135,
    difficulty: 'Easy',
    coconutFlourUsed: '45g CORA Coconut Flour',
    summary:
      'High-fiber wholesome breakfast pancakes that keep you full longer, naturally sweetened with ripe bananas.',
    ingredients: [
      '45g CORA Upcycled Coconut Flour',
      '1 Ripe Banana, mashed',
      '2 Farm Fresh Eggs',
      '80ml Plant Milk (oat or almond milk)',
      '1 tsp Baking Powder',
      '1/2 tsp Cinnamon Powder (optional)',
    ],
    steps: [
      'Mash ripe banana in a bowl, add eggs and plant milk, whisking smoothly.',
      'Add CORA Coconut Flour and baking powder, stirring into a thick batter.',
      'Rest batter for 3 minutes to allow coconut flour to hydrate.',
      'Heat a non-stick skillet over low heat, ladle 1 scoop of batter onto the pan.',
      'Cook 2 minutes per side until golden. Serve warm with honey or fresh fruit.',
    ],
    image: '/images/ingredients/coconut-flour.jpg',
  },
  {
    id: 'rec-muffins',
    title: 'Coconut Vanilla Muffins',
    category: 'Breads and Muffins',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: '6 muffins',
    calories: 145,
    difficulty: 'Medium',
    coconutFlourUsed: '50g CORA Coconut Flour',
    summary:
      'Tender coconut muffins scented with vanilla and cinnamon, the perfect wholesome snack for tea or coffee time.',
    ingredients: [
      '50g CORA Upcycled Coconut Flour',
      '3 Eggs',
      '60ml Raw Honey / Coconut Nectar',
      '50ml Light Coconut Milk or Dairy Milk',
      '40ml Coconut Oil',
      '1 tsp Baking Powder & 1/2 tsp Vanilla Extract',
    ],
    steps: [
      'Preheat oven to 180°C and line 6 muffin tins with paper liners.',
      'Whisk eggs, honey, coconut milk, and coconut oil together in a bowl.',
      'Gradually fold in CORA Coconut Flour, baking powder, and vanilla extract.',
      'Divide batter evenly into the 6 muffin cups.',
      'Bake for 18–20 minutes until golden on top and a toothpick comes out clean.',
    ],
    image: '/images/ingredients/coconut-flour.jpg',
  },
  {
    id: 'rec-banana-cake',
    title: 'Coconut Flour Banana Loaf',
    category: 'Breads and Muffins',
    prepTime: '20 mins',
    cookTime: '35 mins',
    servings: '8 slices',
    calories: 155,
    difficulty: 'Creative',
    coconutFlourUsed: '70g CORA Coconut Flour',
    summary:
      'Moist banana loaf rich in tropical aromas, blending sweet ripe bananas with delicate upcycled coconut flour.',
    ingredients: [
      '70g CORA Upcycled Coconut Flour',
      '3 Ripe Bananas, mashed',
      '4 Eggs',
      '60g Coconut Sugar / Palm Sugar',
      '50g Melted Butter or Coconut Oil',
      '1 tsp Baking Powder & 1/2 tsp Baking Soda',
      'Topping: Sliced banana and toasted coconut flakes',
    ],
    steps: [
      'Mash bananas until smooth, whisk in eggs, coconut sugar, and melted coconut oil.',
      'Fold in CORA Coconut Flour, baking powder, and baking soda. Mix gently until combined.',
      'Pour into a parchment-lined loaf pan.',
      'Garnish top with banana slices, bake at 170°C for 30–35 minutes.',
      'Check with a wooden skewer. Remove and let cool before slicing.',
    ],
    image: '/images/hero/hero.jpg',
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    name: 'Kelapa Makmur Jaya',
    phone: '081288990011',
    businessLocation: 'Pasar Badung, Jl. Sulawesi No. 14, Denpasar',
    businessType: 'Daily Coconut Milk Pressing',
    estimatedKg: 120,
    productionFrequency: 'Daily',
    createdAt: '2026-10-15T08:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'sup-002',
    name: 'Santan Segar Sari',
    phone: '085777889900',
    businessLocation: 'Kuta Utara, Badung',
    businessType: 'Pure Coconut Milk & Shred Stalls',
    estimatedKg: 65,
    productionFrequency: '3x / Week',
    createdAt: '2026-10-22T10:30:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'sup-003',
    name: 'Berkah Kelapa Nusantara',
    phone: '081399887766',
    businessLocation: 'Sanur Kauh, Denpasar Selatan',
    businessType: 'Traditional Coconut & Milk Stall',
    estimatedKg: 95,
    productionFrequency: 'Daily',
    createdAt: '2026-11-01T09:15:00.000Z',
    status: 'ACTIVE',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-demo-01',
  name: 'Usertesting',
  email: 'user@gmail.com',
  phone: '081234567890',
  address: 'Jl. Tukad Balian No. 88, Renon, Denpasar, Bali 80226',
  favoriteRecipeIds: ['rec-waffles', 'rec-pancakes'],
};

export const INITIAL_IMPACT_INDICATORS: ImpactStatItem[] = [
  {
    id: 'stat-residue',
    label: 'Residue Upcycled',
    value: '2.36',
    unit: 'kg',
    description: 'Total coconut residue rescued & upcycled',
  },
  {
    id: 'stat-flour',
    label: 'Flour Produced',
    value: '1.06',
    unit: 'kg',
    description: 'Total nutritious coconut flour produced',
  },
  {
    id: 'stat-supplier',
    label: 'Partner Suppliers',
    value: '3',
    unit: 'partners',
    description: 'Active coconut supply partner network',
  },
  {
    id: 'stat-product',
    label: 'Products Sold',
    value: '3',
    unit: 'pcs',
    description: 'Total circular food products distributed',
  },
];

export const INITIAL_IMPACT_SETTINGS: ImpactSettings = {
  useCustomStats: false,
  customResidueKg: 485.4,
  customFlourKg: 203.8,
  customSuppliersCount: 3,
  customProductsMarketed: 24,
  customCo2AvoidedKg: 1155.2,
  impactNote: '*Note: Figures reflect actual operational data and live platform activities.',
  indicators: INITIAL_IMPACT_INDICATORS,
};

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-bca',
    bankName: 'Bank BCA',
    accountNumber: '8820192831',
    accountHolder: 'CORA Circular Innovation',
    isActive: true,
  },
  {
    id: 'bank-mandiri',
    bankName: 'Bank Mandiri',
    accountNumber: '1450029381920',
    accountHolder: 'CORA Circular Innovation',
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
  senderName: 'User',
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
        productId: 'prod-flour-100',
        productName: 'CORA Pure Coconut Flour (100g)',
        price: 18000,
        qty: 2,
        image: '/images/products/halaman1.jpg',
        variant: 'Pouch 100g',
      },
    ],
    totalAmount: 36000,
    bankAccountUsed: 'Bank BCA - 8820192831',
    proofImage: RECEIPT_ORD_001,
    status: 'WAITING_VERIFICATION',
    courier: 'JNE Regular',
    notes: 'Mohon dibungkus bubble wrap tebal ya Kak.',
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
        productId: 'prod-flour-100',
        productName: 'CORA Pure Coconut Flour (100g)',
        price: 18000,
        qty: 3,
        image: '/images/products/halaman1.jpg',
        variant: 'Pouch 100g',
      },
    ],
    totalAmount: 54000,
    bankAccountUsed: 'Bank Mandiri - 1450029381920',
    proofImage: RECEIPT_ORD_002,
    status: 'PROCESSING',
    courier: 'SiCepat Best',
    notes: 'Untuk stok baking akhir pekan.',
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
        productId: 'prod-flour-100',
        productName: 'CORA Pure Coconut Flour (100g)',
        price: 18000,
        qty: 4,
        image: '/images/products/halaman1.jpg',
        variant: 'Twin Pack (2 x 100g)',
      },
    ],
    totalAmount: 72000,
    bankAccountUsed: 'Bank BCA - 8820192831',
    proofImage: RECEIPT_ORD_003,
    status: 'COMPLETED',
    courier: 'JNE Express',
    trackingNumber: 'JNE-CORA88291044',
    notes: 'Bisa titip satpam jika rumah sedang kosong.',
    createdAt: '2026-11-08T10:05:00.000Z',
  },
];

export const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [
  {
    id: 'fin-001',
    date: '2026-11-11T15:00:00.000Z',
    orderNumber: 'CORA-20261111-002',
    description: 'Payment for Order #CORA-20261111-002 (user)',
    type: 'INCOME',
    amount: 54000,
    category: 'Product Sales',
  },
  {
    id: 'fin-002',
    date: '2026-11-08T11:00:00.000Z',
    orderNumber: 'CORA-20261108-003',
    description: 'Payment for Order #CORA-20261108-003 (Sinta Wijaya)',
    type: 'INCOME',
    amount: 72000,
    category: 'Product Sales',
  },
];

export const INITIAL_PICKUP_REQUESTS: PickupRequest[] = [
  {
    id: 'pick-001',
    supplierName: 'Kelapa Makmur Jaya',
    phone: '081288990011',
    location: 'Pasar Badung, Jl. Sulawesi No. 14, Denpasar',
    estimatedKg: 120,
    preferredDate: '2026-11-15',
    preferredTime: '08:00 - 10:00 WITA',
    notes: 'Ampas kelapa dari parutan pagi hari, disimpan di tong bersih tertutup.',
    status: 'REQUEST_CONFIRMED',
    createdAt: '2026-11-12T07:30:00.000Z',
  },
  {
    id: 'pick-002',
    supplierName: 'Santan Segar Sari',
    phone: '085777889900',
    location: 'Jl. Raya Kerobokan No. 42, Badung',
    estimatedKg: 65,
    preferredDate: '2026-11-16',
    preferredTime: '13:00 - 15:00 WITA',
    notes: 'Kondisi kering tiris santan murni.',
    status: 'REQUEST_SUBMITTED',
    createdAt: '2026-11-12T11:00:00.000Z',
  },
  {
    id: 'pick-003',
    supplierName: 'Berkah Kelapa Sanur',
    phone: '081399887766',
    location: 'Jl. Danau Tamblingan No. 108, Sanur',
    estimatedKg: 95,
    preferredDate: '2026-11-10',
    preferredTime: '09:00 - 11:00 WITA',
    notes: 'Penjemputan rutin mingguan.',
    status: 'COMPLETED',
    createdAt: '2026-11-10T08:00:00.000Z',
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
    suppliers: INITIAL_SUPPLIERS.map((s) => ({ ...s })),
    recipes: INITIAL_RECIPES.map((r) => ({ ...r })),
    userProfile: { ...INITIAL_USER_PROFILE },
    impactSettings: { ...INITIAL_IMPACT_SETTINGS },
    cart: [],
  };
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
      products: parsed.products.map((p) => {
        const found = INITIAL_PRODUCTS.find((init) => init.id === p.id);
        const isDefaultFlour = p.id === 'prod-flour-100';
        const resolvedImage =
          isDefaultFlour ||
          !p.image ||
          p.image === '/images/products/coconut.jpg' ||
          p.image === '/images/products/halamanBelakang.jpg' ||
          p.image === '/images/products/halaman2.jpg'
            ? found?.image || '/images/products/halaman1.jpg'
            : p.image;
        const resolvedImageBack =
          isDefaultFlour ||
          !p.imageBack ||
          p.imageBack === '/images/products/coconut.jpg' ||
          p.imageBack === '/images/products/halaman1.jpg'
            ? found?.imageBack || '/images/products/halamanBelakang.jpg'
            : p.imageBack;
        const rawImages = isDefaultFlour
          ? found?.images ?? [resolvedImage, resolvedImageBack]
          : Array.isArray(p.images) && p.images.length > 0
          ? p.images.map((img) =>
              img === '/images/products/coconut.jpg'
                ? '/images/products/halaman1.jpg'
                : img
            )
          : found?.images ?? [resolvedImage, resolvedImageBack];
        return {
          ...found,
          ...p,
          image: resolvedImage,
          imageBack: resolvedImageBack,
          images: rawImages,
          benefits: p.benefits ?? found?.benefits ?? COMMON_BENEFITS,
          ingredients: p.ingredients ?? found?.ingredients,
          variants: p.variants ?? found?.variants,
          netWeight: p.netWeight ?? found?.netWeight,
          storageInfo: p.storageInfo ?? found?.storageInfo,
          shelfLife: p.shelfLife ?? found?.shelfLife,
        };
      }),
      bankAccounts: parsed.bankAccounts,
      orders: parsed.orders,
      financialRecords: parsed.financialRecords,
      pickupRequests: parsed.pickupRequests,
      suppliers: Array.isArray(parsed.suppliers)
        ? parsed.suppliers
        : INITIAL_SUPPLIERS,
      recipes: Array.isArray(parsed.recipes) && parsed.recipes.length > 0
        ? parsed.recipes
        : INITIAL_RECIPES,
      userProfile: parsed.userProfile ?? INITIAL_USER_PROFILE,
      impactSettings: parsed.impactSettings
        ? {
            ...INITIAL_IMPACT_SETTINGS,
            ...parsed.impactSettings,
            indicators:
              Array.isArray(parsed.impactSettings.indicators) &&
              parsed.impactSettings.indicators.length > 0
                ? parsed.impactSettings.indicators
                : INITIAL_IMPACT_INDICATORS,
          }
        : INITIAL_IMPACT_SETTINGS,
      cart: parsed.cart,
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
    (product: Product, qty = 1, variant?: string) => {
      if (qty <= 0 || product.stock <= 0) return;
      updateStore((prev) => {
        const liveProduct =
          prev.products.find((p) => p.id === product.id) ?? product;
        const maxStock = Math.max(0, liveProduct.stock);
        if (maxStock <= 0) return prev;

        const effectiveVariant = variant ?? liveProduct.variants?.[0];
        const existingIndex = prev.cart.findIndex(
          (item) =>
            item.productId === liveProduct.id &&
            item.variant === effectiveVariant
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
          variant: effectiveVariant,
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
              variant: item.variant,
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
        courier: input.courier ?? 'JNE Regular',
        notes: input.notes?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      updateStore((prev) => {
        const itemQtyMap = new Map<string, number>();
        for (const item of orderItems) {
          itemQtyMap.set(
            item.productId,
            (itemQtyMap.get(item.productId) ?? 0) + item.qty
          );
        }

        const updatedProducts = prev.products.map((prod) => {
          const orderedQty = itemQtyMap.get(prod.id);
          if (!orderedQty) return prod;
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedQty),
          };
        });

        return {
          ...prev,
          orders: [newOrder, ...prev.orders],
          products: updatedProducts,
          cart: [],
        };
      });

      return newOrder;
    },
    [state.cart, updateStore]
  );

  const verifyOrderPayment = useCallback(
    (orderId: string, action: 'APPROVE' | 'REJECT', trackingNumber?: string) => {
      updateStore((prev) => {
        const targetOrder = prev.orders.find((o) => o.id === orderId);
        if (!targetOrder) return prev;

        const nextStatus: OrderStatus =
          action === 'APPROVE' ? 'PROCESSING' : 'REJECTED';

        const updatedOrders = prev.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: nextStatus,
                trackingNumber:
                  trackingNumber?.trim() || o.trackingNumber,
              }
            : o
        );

        let nextFinance = prev.financialRecords;
        let nextProducts = prev.products;

        if (action === 'APPROVE') {
          const alreadyRecorded = prev.financialRecords.some(
            (rec) => rec.orderNumber === targetOrder.orderNumber
          );
          if (!alreadyRecorded) {
            const incomeRecord: FinancialRecord = {
              id: generateId('fin'),
              date: new Date().toISOString(),
              orderNumber: targetOrder.orderNumber,
              description: `Payment for Order #${targetOrder.orderNumber} (${targetOrder.customerName})`,
              type: 'INCOME',
              amount: targetOrder.totalAmount,
              category: 'Product Sales',
            };
            nextFinance = [incomeRecord, ...prev.financialRecords];
          }
        } else {
          const restoreQtyMap = new Map<string, number>();
          for (const item of targetOrder.items) {
            restoreQtyMap.set(
              item.productId,
              (restoreQtyMap.get(item.productId) ?? 0) + item.qty
            );
          }

          nextProducts = prev.products.map((prod) => {
            const restoredQty = restoreQtyMap.get(prod.id);
            if (!restoredQty) return prod;
            return {
              ...prod,
              stock: prod.stock + restoredQty,
            };
          });
        }

        return {
          ...prev,
          orders: updatedOrders,
          financialRecords: nextFinance,
          products: nextProducts,
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
                trackingNumber: trackingNumber?.trim() || order.trackingNumber,
              }
            : order
        ),
      }));
    },
    [updateStore]
  );

  const saveProduct = useCallback(
    (input: SaveProductInput): Product => {
      let savedProduct: Product;

      updateStore((prev) => {
        if (input.id) {
          const existing = prev.products.find((p) => p.id === input.id);
          const imagesList =
            Array.isArray(input.images) && input.images.length > 0
              ? input.images
              : [
                  input.image.trim(),
                  input.imageBack?.trim() ?? existing?.imageBack,
                ].filter(Boolean) as string[];

          savedProduct = {
            id: input.id,
            name: input.name.trim(),
            subtitle: input.subtitle.trim(),
            category: input.category,
            price: Math.max(0, Number(input.price)),
            stock: Math.max(0, Number(input.stock)),
            weightGram: Math.max(0, Number(input.weightGram)),
            residueSavedGram: Math.max(0, Number(input.residueSavedGram)),
            image: input.image.trim(),
            imageBack: input.imageBack?.trim() ?? existing?.imageBack,
            images: imagesList,
            description: input.description.trim(),
            ingredients: input.ingredients ?? existing?.ingredients,
            netWeight: input.netWeight ?? existing?.netWeight,
            variants: input.variants ?? existing?.variants,
            storageInfo: input.storageInfo ?? existing?.storageInfo,
            shelfLife: input.shelfLife ?? existing?.shelfLife,
            benefits: input.benefits ?? existing?.benefits ?? COMMON_BENEFITS,
          };
          return {
            ...prev,
            products: prev.products.map((p) =>
              p.id === input.id ? savedProduct : p
            ),
          };
        }

        const imagesList =
          Array.isArray(input.images) && input.images.length > 0
            ? input.images
            : [input.image.trim(), input.imageBack?.trim()].filter(
                Boolean
              ) as string[];

        savedProduct = {
          id: generateId('prod'),
          name: input.name.trim(),
          subtitle: input.subtitle.trim(),
          category: input.category,
          price: Math.max(0, Number(input.price)),
          stock: Math.max(0, Number(input.stock)),
          weightGram: Math.max(0, Number(input.weightGram)),
          residueSavedGram: Math.max(0, Number(input.residueSavedGram)),
          image: input.image.trim(),
          imageBack: input.imageBack?.trim(),
          images: imagesList,
          description: input.description.trim(),
          ingredients: input.ingredients,
          netWeight: input.netWeight,
          variants: input.variants ?? ['Standard'],
          storageInfo: input.storageInfo,
          shelfLife: input.shelfLife,
          benefits: input.benefits ?? COMMON_BENEFITS,
        };
        return {
          ...prev,
          products: [savedProduct, ...prev.products],
        };
      });

      return savedProduct!;
    },
    [updateStore]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      updateStore((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
        cart: prev.cart.filter((c) => c.productId !== productId),
      }));
    },
    [updateStore]
  );

  const saveBankAccount = useCallback(
    (input: SaveBankAccountInput): BankAccount => {
      let savedBank: BankAccount;

      updateStore((prev) => {
        if (input.id) {
          savedBank = {
            id: input.id,
            bankName: input.bankName.trim(),
            accountNumber: input.accountNumber.trim(),
            accountHolder: input.accountHolder.trim(),
            isActive: Boolean(input.isActive),
          };
          return {
            ...prev,
            bankAccounts: prev.bankAccounts.map((b) =>
              b.id === input.id ? savedBank : b
            ),
          };
        }

        savedBank = {
          id: generateId('bank'),
          bankName: input.bankName.trim(),
          accountNumber: input.accountNumber.trim(),
          accountHolder: input.accountHolder.trim(),
          isActive: Boolean(input.isActive),
        };
        return {
          ...prev,
          bankAccounts: [...prev.bankAccounts, savedBank],
        };
      });

      return savedBank!;
    },
    [updateStore]
  );

  const addManualExpense = useCallback(
    (input: AddExpenseInput): FinancialRecord => {
      const newRecord: FinancialRecord = {
        id: generateId('fin'),
        date: input.date || new Date().toISOString(),
        orderNumber: input.orderNumber?.trim() || undefined,
        description: input.description.trim(),
        type: 'EXPENSE',
        amount: Math.max(0, Number(input.amount)),
        category: input.category.trim() || 'General Expense',
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
        preferredTime: request.preferredTime || '09:00 - 12:00 WITA',
        notes: request.notes?.trim() || undefined,
        status: 'REQUEST_SUBMITTED',
        createdAt: new Date().toISOString(),
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

  const registerSupplier = useCallback(
    (input: RegisterSupplierInput): Supplier => {
      let savedSupplier: Supplier;

      updateStore((prev) => {
        if (input.id) {
          savedSupplier = {
            id: input.id,
            name: input.name.trim(),
            phone: input.phone.trim(),
            businessLocation: input.businessLocation.trim(),
            businessType: input.businessType.trim(),
            estimatedKg: Math.max(0, Number(input.estimatedKg)),
            productionFrequency: input.productionFrequency.trim(),
            createdAt:
              prev.suppliers.find((s) => s.id === input.id)?.createdAt ||
              new Date().toISOString(),
            status:
              input.status ??
              prev.suppliers.find((s) => s.id === input.id)?.status ??
              'ACTIVE',
          };
          return {
            ...prev,
            suppliers: prev.suppliers.map((s) =>
              s.id === input.id ? savedSupplier : s
            ),
          };
        }

        savedSupplier = {
          id: generateId('sup'),
          name: input.name.trim(),
          phone: input.phone.trim(),
          businessLocation: input.businessLocation.trim(),
          businessType: input.businessType.trim(),
          estimatedKg: Math.max(0, Number(input.estimatedKg)),
          productionFrequency: input.productionFrequency.trim(),
          createdAt: new Date().toISOString(),
          status: input.status ?? 'ACTIVE',
        };

        return {
          ...prev,
          suppliers: [savedSupplier, ...prev.suppliers],
        };
      });

      return savedSupplier!;
    },
    [updateStore]
  );

  const saveSupplier = useCallback(
    (supplier: Supplier) => {
      updateStore((prev) => {
        const exists = prev.suppliers.some((s) => s.id === supplier.id);
        const updated = exists
          ? prev.suppliers.map((s) => (s.id === supplier.id ? supplier : s))
          : [supplier, ...prev.suppliers];
        return { ...prev, suppliers: updated };
      });
    },
    [updateStore]
  );

  const deleteSupplier = useCallback(
    (supplierId: string) => {
      updateStore((prev) => ({
        ...prev,
        suppliers: prev.suppliers.filter((s) => s.id !== supplierId),
      }));
    },
    [updateStore]
  );

  const updateImpactSettings = useCallback(
    (settings: Partial<ImpactSettings>) => {
      updateStore((prev) => ({
        ...prev,
        impactSettings: {
          ...prev.impactSettings,
          ...settings,
        },
      }));
    },
    [updateStore]
  );

  const saveImpactIndicator = useCallback(
    (indicator: ImpactStatItem) => {
      updateStore((prev) => {
        const exists = prev.impactSettings.indicators.some(
          (i) => i.id === indicator.id
        );
        const nextIndicators = exists
          ? prev.impactSettings.indicators.map((i) =>
              i.id === indicator.id ? indicator : i
            )
          : [...prev.impactSettings.indicators, indicator];
        return {
          ...prev,
          impactSettings: {
            ...prev.impactSettings,
            indicators: nextIndicators,
          },
        };
      });
    },
    [updateStore]
  );

  const deleteImpactIndicator = useCallback(
    (indicatorId: string) => {
      updateStore((prev) => ({
        ...prev,
        impactSettings: {
          ...prev.impactSettings,
          indicators: prev.impactSettings.indicators.filter(
            (i) => i.id !== indicatorId
          ),
        },
      }));
    },
    [updateStore]
  );

  const toggleFavoriteRecipe = useCallback(
    (recipeId: string) => {
      updateStore((prev) => {
        const favorites = prev.userProfile.favoriteRecipeIds;
        const exists = favorites.includes(recipeId);
        const nextFavorites = exists
          ? favorites.filter((id) => id !== recipeId)
          : [...favorites, recipeId];

        return {
          ...prev,
          userProfile: {
            ...prev.userProfile,
            favoriteRecipeIds: nextFavorites,
          },
        };
      });
    },
    [updateStore]
  );

  const updateUserProfile = useCallback(
    (profile: Partial<UserProfile>) => {
      updateStore((prev) => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          ...profile,
        },
      }));
    },
    [updateStore]
  );

  const saveRecipe = useCallback(
    (recipe: Recipe) => {
      updateStore((prev) => {
        const exists = prev.recipes.some((r) => r.id === recipe.id);
        const nextRecipes = exists
          ? prev.recipes.map((r) => (r.id === recipe.id ? recipe : r))
          : [recipe, ...prev.recipes];
        return { ...prev, recipes: nextRecipes };
      });
    },
    [updateStore]
  );

  const deleteRecipe = useCallback(
    (recipeId: string) => {
      updateStore((prev) => ({
        ...prev,
        recipes: prev.recipes.filter((r) => r.id !== recipeId),
      }));
    },
    [updateStore]
  );

  const findOrderByNumber = useCallback(
    (orderNumber: string): Order | undefined => {
      const normalized = orderNumber.trim().toUpperCase();
      return state.orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === normalized ||
          o.id.toUpperCase() === normalized
      );
    },
    [state.orders]
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
      registerSupplier,
      saveSupplier,
      deleteSupplier,
      updateImpactSettings,
      saveImpactIndicator,
      deleteImpactIndicator,
      toggleFavoriteRecipe,
      updateUserProfile,
      saveRecipe,
      deleteRecipe,
      findOrderByNumber,
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
      registerSupplier,
      saveSupplier,
      deleteSupplier,
      updateImpactSettings,
      saveImpactIndicator,
      deleteImpactIndicator,
      toggleFavoriteRecipe,
      updateUserProfile,
      saveRecipe,
      deleteRecipe,
      findOrderByNumber,
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
