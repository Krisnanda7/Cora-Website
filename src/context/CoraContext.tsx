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
  Recipe,
  RegisterSupplierInput,
  SaveBankAccountInput,
  SaveProductInput,
  SubmitPickupInput,
  Supplier,
  UserProfile,
} from '@/types/cora';

const STORAGE_KEY = 'cora_circular_store_v4';

interface CoraStoreState {
  products: Product[];
  bankAccounts: BankAccount[];
  orders: Order[];
  financialRecords: FinancialRecord[];
  pickupRequests: PickupRequest[];
  suppliers: Supplier[];
  recipes: Recipe[];
  userProfile: UserProfile;
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
  'Menggunakan tepung berbahan dasar ampas kelapa',
  'Mengoptimalkan pemanfaatan hasil samping produksi santan',
  'Menghadirkan alternatif bahan pangan yang inovatif',
];

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
    ingredients: [
      'Tepung Ampas Kelapa CORA',
      '70% Belgian Dark Chocolate',
      'Telur Ayam Kampung',
      'Gula Aren Organik',
      'Minyak Kelapa Murni (VCO)',
      'Ekstrak Vanila',
      'Sea Salt',
    ],
    netWeight: '200g (isi 6 potong)',
    variants: ['Classic Fudgy Dark', 'Roasted Almond Topping'],
    storageInfo:
      'Simpan di tempat sejuk dan kering dalam wadah tertutup. Untuk tekstur fudgy maksimal, simpan di dalam kulkas.',
    shelfLife: '14 hari pada suhu ruang, hingga 30 hari di dalam chiller kulkas.',
    benefits: COMMON_BENEFITS,
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
    ingredients: [
      'Tepung Ampas Kelapa Sangrai CORA',
      'Nektar Kelapa Alami',
      'Dark Chocolate Chunks',
      'Telur Organik',
      'Minyak Kelapa Murni',
      'Sea Salt Bali',
    ],
    netWeight: '150g (isi 12 keping)',
    variants: ['Dark Choco Nibs', 'Toasted Coconut Flakes'],
    storageInfo:
      'Tutup rapat zipper pouch kedap udara setelah dibuka. Hindari paparan panas langsung.',
    shelfLife: '60 hari dalam kemasan tersegel rapat.',
    benefits: COMMON_BENEFITS,
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
    ingredients: [
      '100% Ampas Kelapa Segar Terpilih (Hasil Upcycling Higienis Bebas Pengawet)',
    ],
    netWeight: '500g',
    variants: ['Pouch 500g', 'Pouch 1000g (Value Pack)'],
    storageInfo:
      'Simpan di dalam toples kaca kedap udara di tempat sejuk, kering, dan terlindung dari kelembapan.',
    shelfLife: '6 bulan dalam kondisi kemasan tertutup rapat.',
    benefits: COMMON_BENEFITS,
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
    ingredients: [
      'Kombinasi lengkap Tepung Kelapa 500g, Brownies 200g, dan Cookies 150g',
    ],
    netWeight: '850g Total',
    variants: ['Gift Box Edition', 'Eco Kraft Box'],
    storageInfo: 'Simpan sesuai panduan masing-masing produk di dalam box.',
    shelfLife: 'Mengikuti tanggal kedaluwarsa masing-masing item bundle.',
    benefits: COMMON_BENEFITS,
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-cookies',
    title: 'Coconut Flour Cookies',
    category: 'Cookies and Biscuits',
    prepTime: '15 mins',
    cookTime: '12 mins',
    servings: '12 cookies',
    calories: 110,
    difficulty: 'Easy',
    coconutFlourUsed: '60g CORA Coconut Flour',
    summary:
      'Kue kering renyah di luar dan lembut di dalam dengan wangi kelapa sangrai alami dan lelehan cokelat.',
    ingredients: [
      '60g Tepung Ampas Kelapa CORA',
      '2 butir Telur ayam',
      '50g Gula aren atau gula kelapa',
      '45g Minyak kelapa / mentega cair',
      '50g Dark chocolate chips',
      '1/2 sdt Baking soda & sejumput garam',
    ],
    steps: [
      'Kocok telur, minyak kelapa, dan gula aren hingga larut dan sedikit berbusa.',
      'Ayak tepung kelapa CORA, baking soda, dan garam ke dalam adonan basah.',
      'Aduk merata dan diamkan 3 menit agar tepung kelapa menyerap cairan dengan sempurna.',
      'Masukkan chocolate chips, bentuk bulatan pipih di atas loyang berlapis kertas roti.',
      'Panggang pada suhu 175°C selama 10–12 menit hingga tepi kecokelatan.',
    ],
    image: '/images/products/cookies.jpg',
  },
  {
    id: 'rec-brownies',
    title: 'Coconut Brownies',
    category: 'Cakes and Brownies',
    prepTime: '20 mins',
    cookTime: '25 mins',
    servings: '9 squares',
    calories: 165,
    difficulty: 'Medium',
    coconutFlourUsed: '65g CORA Coconut Flour',
    summary:
      'Brownies cokelat hitam fudgy tanpa tepung terigu yang moist alami berkat serat halus tepung kelapa CORA.',
    ingredients: [
      '65g Tepung Ampas Kelapa CORA',
      '120g Dark Chocolate 70%, lelehkan',
      '3 butir Telur suhu ruang',
      '75g Gula aren bubuk',
      '60ml Minyak kelapa / butter leleh',
      '1 sdt Ekstrak vanila & 1/4 sdt garam laut',
    ],
    steps: [
      'Panaskan oven ke suhu 175°C. Siapkan loyang 18x18 cm beroles margarin.',
      'Kocok telur dan gula aren dengan whisk selama 2 menit sampai mengembang ringan.',
      'Tuangkan cokelat leleh dan minyak kelapa ke dalam adonan telur, aduk balik perlahan.',
      'Masukkan tepung ampas kelapa CORA dan garam, aduk hingga adonan mengkilap dan rata.',
      'Panggang selama 22-25 menit. Dinginkan sebelum dipotong agar tekstur fudgy kokoh.',
    ],
    image: '/images/products/brownies.jpg',
  },
  {
    id: 'rec-pancakes',
    title: 'Coconut Pancakes',
    category: 'Healthy Snacks',
    prepTime: '10 mins',
    cookTime: '10 mins',
    servings: '6 pancakes',
    calories: 135,
    difficulty: 'Easy',
    coconutFlourUsed: '45g CORA Coconut Flour',
    summary:
      'Pancake sarapan tinggi serat yang mengenyangkan lebih lama, dipadukan dengan pisang manis alami.',
    ingredients: [
      '45g Tepung Ampas Kelapa CORA',
      '1 buah Pisang matang, haluskan',
      '2 butir Telur ayam',
      '80ml Susu nabati (oat milk atau almond milk)',
      '1 sdt Baking powder',
      '1/2 sdt Kayu manis bubuk (opsional)',
    ],
    steps: [
      'Haluskan pisang dalam mangkuk, tambahkan telur dan susu nabati, kocok merata.',
      'Campurkan tepung ampas kelapa CORA dan baking powder, aduk hingga menjadi adonan kental.',
      'Diamkan adonan selama 3 menit agar tepung kelapa terhidrasi sempurna.',
      'Panaskan teflon anti lengket dengan api kecil, tuang 1 sendok sayur adonan.',
      'Masak 2 menit per sisi hingga matang keemasan. Sajikan hangat dengan madu atau buah segar.',
    ],
    image: '/images/journey/brownies.jpg',
  },
  {
    id: 'rec-muffins',
    title: 'Coconut Muffins',
    category: 'Cakes and Brownies',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: '6 muffins',
    calories: 145,
    difficulty: 'Medium',
    coconutFlourUsed: '50g CORA Coconut Flour',
    summary:
      'Muffin kelapa empuk beraroma vanila dan kayu manis, pilihan camilan sehat teman kopi atau teh sore.',
    ingredients: [
      '50g Tepung Ampas Kelapa CORA',
      '3 butir Telur',
      '60ml Madu murni / sirup kelapa',
      '50ml Santan encer atau susu',
      '40ml Minyak kelapa',
      '1 sdt Baking powder & 1/2 sdt vanila bubuk',
    ],
    steps: [
      'Panaskan oven ke 180°C dan siapkan 6 cetakan muffin dengan cup kertas.',
      'Campurkan telur, madu, santan encer, dan minyak kelapa dalam satu wadah.',
      'Masukkan tepung ampas kelapa CORA, baking powder, dan vanila secara bertahap.',
      'Bagi adonan merata ke dalam 6 cetakan muffin.',
      'Panggang selama 18–20 menit hingga bagian atas mengembang keemasan.',
    ],
    image: '/images/products/cookies.jpg',
  },
  {
    id: 'rec-banana-cake',
    title: 'Coconut Flour Banana Cake',
    category: 'Creative Recipes',
    prepTime: '20 mins',
    cookTime: '35 mins',
    servings: '8 slices',
    calories: 155,
    difficulty: 'Creative',
    coconutFlourUsed: '70g CORA Coconut Flour',
    summary:
      'Bolu pisang lembut gluten-free yang kaya aroma tropis berkat kombinasi pisang raja dan tepung ampas kelapa.',
    ingredients: [
      '70g Tepung Ampas Kelapa CORA',
      '3 buah Pisang raja matang, lumatkan',
      '4 butir Telur',
      '60g Gula kelapa / gula aren',
      '50g Margarin leleh atau minyak kelapa',
      '1 sdt Baking powder & 1/2 sdt soda kue',
      'Topping: Irisan pisang dan kelapa parut panggang',
    ],
    steps: [
      'Lumatkan pisang sampai lembut, tambahkan telur, gula aren, dan margarin cair.',
      'Masukkan tepung kelapa CORA, baking powder, dan soda kue. Aduk perlahan hingga rata.',
      'Tuangkan ke dalam loyang loaf yang sudah dialasi baking paper.',
      'Beri hiasan irisan pisang di atasnya, lalu panggang pada suhu 170°C selama 30–35 menit.',
      'Tusuk dengan lidi untuk memeriksa kematangan. Angkat dan dinginkan sebelum diiris.',
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
    businessType: 'Pengolahan Santan Harian',
    estimatedKg: 120,
    productionFrequency: 'Setiap Hari',
    createdAt: '2026-10-15T08:00:00.000Z',
  },
  {
    id: 'sup-002',
    name: 'Santan Segar Sari',
    phone: '085777889900',
    businessLocation: 'Kuta Utara, Badung',
    businessType: 'Usaha Santan Murni & Parut',
    estimatedKg: 65,
    productionFrequency: '3x Seminggu',
    createdAt: '2026-10-22T10:30:00.000Z',
  },
  {
    id: 'sup-003',
    name: 'Berkah Kelapa Nusantara',
    phone: '081399887766',
    businessLocation: 'Sanur Kauh, Denpasar Selatan',
    businessType: 'Kios Kelapa & Santan Tradisional',
    estimatedKg: 95,
    productionFrequency: 'Setiap Hari',
    createdAt: '2026-11-01T09:15:00.000Z',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-demo-01',
  name: 'Krisna Pratama',
  email: 'krisna@cora.id',
  phone: '081234567890',
  address: 'Jl. Tukad Balian No. 88, Renon, Denpasar, Bali 80226',
  favoriteRecipeIds: ['rec-brownies', 'rec-cookies'],
};

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
        variant: 'Classic Fudgy Dark',
      },
      {
        productId: 'prod-cookies',
        productName: 'CORA Cookies',
        price: 32000,
        qty: 1,
        image: '/images/products/cookies.jpg',
        variant: 'Dark Choco Nibs',
      },
    ],
    totalAmount: 108000,
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
        productId: 'prod-flour-500',
        productName: 'CORA Coconut Flour (500g)',
        price: 25000,
        qty: 3,
        image: '/images/products/coconut.jpg',
        variant: 'Pouch 500g',
      },
    ],
    totalAmount: 75000,
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
        productId: 'prod-brownies-twin',
        productName: 'CORA Trio Bundle Pack',
        price: 72000,
        qty: 1,
        image: '/images/hero/hero.jpg',
        variant: 'Gift Box Edition',
      },
      {
        productId: 'prod-cookies',
        productName: 'CORA Cookies',
        price: 32000,
        qty: 2,
        image: '/images/products/cookies.jpg',
        variant: 'Dark Choco Nibs',
      },
    ],
    totalAmount: 136000,
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
        return {
          ...found,
          ...p,
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
      const newSupplier: Supplier = {
        id: generateId('sup'),
        name: input.name.trim(),
        phone: input.phone.trim(),
        businessLocation: input.businessLocation.trim(),
        businessType: input.businessType.trim(),
        estimatedKg: Math.max(0, Number(input.estimatedKg)),
        productionFrequency: input.productionFrequency.trim(),
        createdAt: new Date().toISOString(),
      };

      updateStore((prev) => ({
        ...prev,
        suppliers: [newSupplier, ...prev.suppliers],
      }));

      return newSupplier;
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
