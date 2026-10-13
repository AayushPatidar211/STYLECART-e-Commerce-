export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Address {
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  defaultAddress?: Address;
  createdAt: string;
  totalOrders?: number;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber?: string;
  defaultAddress?: Address;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  productCount?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: string[];
  availableSizes: string[];
  availableColors: string[];
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  productImage: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  availableStock: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  finalTotal: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  trackingNumber?: string;
  userId: number;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
}

export interface ProductFilterState {
  categoryId?: number;
  categoryName?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  minRating?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';
  keyword?: string;
  page: number;
  sizePerPage: number;
}
