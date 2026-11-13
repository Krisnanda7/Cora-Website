export type ProductCategory = 'Cookies' | 'Brownies' | 'Flour';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  stock: number;
  weightGram: number;
  residueSavedGram: number;
  image: string;
  description: string;
  // Enhanced Product Details
  ingredients?: string[];
  netWeight?: string;
  variants?: string[];
  storageInfo?: string;
  shelfLife?: string;
  benefits?: string[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  qty: number;
  image: string;
  variant?: string;
}

export interface CartItem extends OrderItem {
  weightGram: number;
  residueSavedGram: number;
}

export type OrderStatus =
  | 'WAITING_VERIFICATION'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'REJECTED';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  bankAccountUsed: string;
  proofImage: string;
  status: OrderStatus;
  courier?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export type FinancialRecordType = 'INCOME' | 'EXPENSE';

export interface FinancialRecord {
  id: string;
  date: string;
  orderNumber?: string;
  description: string;
  type: FinancialRecordType;
  amount: number;
  category: string;
}

export type PickupRequestStatus =
  | 'REQUEST_SUBMITTED'
  | 'REQUEST_CONFIRMED'
  | 'ON_THE_WAY'
  | 'PICKED_UP'
  | 'COMPLETED'
  // Legacy aliases for backward compatibility
  | 'PENDING'
  | 'SCHEDULED';

export interface PickupRequest {
  id: string;
  supplierName: string;
  phone: string;
  location: string;
  estimatedKg: number;
  preferredDate: string;
  preferredTime?: string;
  notes?: string;
  status: PickupRequestStatus;
  createdAt?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  businessLocation: string;
  businessType: string;
  estimatedKg: number;
  productionFrequency: string;
  createdAt: string;
}

export type RecipeCategory =
  | 'Cookies and Biscuits'
  | 'Cakes and Brownies'
  | 'Healthy Snacks'
  | 'Creative Recipes';

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  prepTime: string;
  cookTime: string;
  servings: string;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Creative';
  coconutFlourUsed: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  image?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  favoriteRecipeIds: string[];
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items?: OrderItem[];
  bankAccountUsed: string;
  proofImage: string;
  courier?: string;
  notes?: string;
}

export interface SaveProductInput extends Omit<Product, 'id'> {
  id?: string;
}

export interface SaveBankAccountInput extends Omit<BankAccount, 'id'> {
  id?: string;
}

export interface AddExpenseInput {
  date?: string;
  orderNumber?: string;
  description: string;
  amount: number;
  category: string;
}

export interface SubmitPickupInput {
  supplierName: string;
  phone: string;
  location: string;
  estimatedKg: number;
  preferredDate: string;
  preferredTime?: string;
  notes?: string;
}

export interface RegisterSupplierInput {
  id?: string;
  name: string;
  phone: string;
  businessLocation: string;
  businessType: string;
  estimatedKg: number;
  productionFrequency: string;
}

export interface ImpactStatItem {
  id: string;
  label: string;
  value: string;
  unit: string;
  description: string;
}

export interface ImpactSettings {
  useCustomStats: boolean;
  customResidueKg: number;
  customFlourKg: number;
  customSuppliersCount: number;
  customProductsMarketed: number;
  customCo2AvoidedKg: number;
  impactNote: string;
  indicators: ImpactStatItem[];
}
