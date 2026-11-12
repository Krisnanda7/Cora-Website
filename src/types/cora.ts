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

export type PickupRequestStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED';

export interface PickupRequest {
  id: string;
  supplierName: string;
  phone: string;
  location: string;
  estimatedKg: number;
  preferredDate: string;
  status: PickupRequestStatus;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items?: OrderItem[];
  bankAccountUsed: string;
  proofImage: string;
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
}
