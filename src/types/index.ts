export type ProductCategory = 'shoes' | 'apparel' | 'balls' | 'accessories';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  stock: number;
  initialStock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  badge?: string;
  specs: ProductSpec[];
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'user' | 'staff' | 'admin';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  paymentMethod: 'cod' | 'banking';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface DiscountCode {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
  description: string;
}

export interface AttendanceRecord {
  id: string;
  staffName: string;
  role: string;
  checkInTime: string;
  checkOutTime?: string;
  shift: 'Ca Sáng (08:00 - 12:00)' | 'Ca Chiều (13:00 - 17:00)' | 'Ca Tối (17:30 - 21:30)';
  status: 'Đang làm việc' | 'Hoàn thành ca';
  hoursWorked?: number;
  notes?: string;
}

