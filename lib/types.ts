/* ---------------------------- PRODUK ---------------------------- */
export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
  category_name: string; // Nama kategori dari DB
  category?: string; // Alias opsional
  category_display?: string;
  description?: string;
  image_url?: string; // URL gambar produk
  is_popular?: boolean;
  is_new?: boolean;
}

/* ---------------------------- ORDER ITEM ---------------------------- */
export interface ApiOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: string; // karena backend kirim string
  customizations?: any[];

  product_name: string;
  image_url?: string;
}

/* ---------------------------- ORDER ---------------------------- */
export interface ApiOrder {
  id: number;
  user_id?: number;
  status: string;
  total_amount: string;
  created_at: string;
  updated_at?: string;
  invoice_number?: string;
  payment_method: string;
  delivery_fee?: number;
  subtotal?: number;
  order_type: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  delivery_address?: string;
  table_no?: string;
  customer_notes?: string;

  /** Format lama: relasi order_items */
  items: ApiOrderItem[];

  /** Format baru: hasil query dengan JSON_AGG */
  products?: {
    product_name: string;
    image_type: string;
    image_preview: string;
    quantity: number;
    price: string;
  }[];
}

/* ---------------------------- FRONTEND MENU ---------------------------- */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // URL gambar
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
  allergens?: string[];
  nutrition?: NutritionInfo;
  modifiers?: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  multiple: boolean;
  required: boolean;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

/* ---------------------------- CART ---------------------------- */
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: Record<string, string[]>;
  totalPrice: number;
  customizations?: {
    // Tambahkan ini jika needed
    modifierId: string;
    optionId: string;
  }[];
}

/* ---------------------------- ORDER (FRONTEND) ---------------------------- */
export interface Order {
  id: string;
  items: CartItem[];
  status: "received" | "in-progress" | "ready" | "completed";
  orderType: "dine-in" | "takeaway" | "delivery";
  tableNumber?: string;
  customerNotes?: string;
  totalAmount: number;
  createdAt: Date;
  estimatedTime?: number;
}

/* ---------------------------- LOYALTY PROGRAM ---------------------------- */
export interface LoyaltyProgram {
  points: number;
  tier: "bronze" | "silver" | "gold";
  vouchers: Voucher[];
}

export interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: number;
  expiryDate: Date;
  minSpend?: number;
}

/* ---------------------------- NUTRITION ---------------------------- */
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caffeine?: number;
}

/* ---------------------------- ORDER REQUEST ---------------------------- */
export interface OrderItemInput {
  product_id: number;
  quantity: number;
  price: number;
  modifiers: {
    modifier_id: number;
    option_id: number;
  }[];
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  orderType: "dine-in" | "takeaway" | "delivery";
  tableNumber?: string;
  deliveryAddress?: string;
  customerNotes?: string;
  paymentMethod?: "cash" | "qris" | "ewallet" | "bank";
  subtotal: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}

/* ---------------------------- ORDER HISTORY ---------------------------- */
export interface ApiOrderHistory {
  history_id: number;
  status: string;
  notes?: string;
  created_at: string;
}
