import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_USER,
  INITIAL_ADMIN,
} from '../data/initialData';
import {
  Product,
  Category,
  Cart,
  CartItem,
  Order,
  User,
  DashboardStats,
  AuthResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create Centralized Axios Client
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to inject JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('stylecart_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================================
// HIGH-FIDELITY EMBEDDED SPRING BOOT SIMULATION REPOSITORY
// Keeps the preview 100% functional with real persistence in localStorage!
// ==========================================================

const STORAGE_KEYS = {
  PRODUCTS: 'stylecart_products_v1',
  CATEGORIES: 'stylecart_categories_v1',
  CART: 'stylecart_cart_v1',
  WISHLIST: 'stylecart_wishlist_v1',
  ORDERS: 'stylecart_orders_v1',
  USERS: 'stylecart_users_v1',
  CURRENT_USER: 'stylecart_current_user_v1',
  BACKEND_MODE: 'stylecart_backend_mode', // 'simulated' | 'live'
};

// Seed LocalStorage if absent
export function initSimulatedDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([INITIAL_ADMIN, INITIAL_USER]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[3]]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    const sampleCart: Cart = {
      id: 1,
      items: [
        {
          id: 101,
          productId: INITIAL_PRODUCTS[1].id,
          productName: INITIAL_PRODUCTS[1].name,
          brand: INITIAL_PRODUCTS[1].brand,
          productImage: INITIAL_PRODUCTS[1].images[0],
          selectedSize: 'M',
          selectedColor: 'Heather Grey',
          quantity: 1,
          unitPrice: 75.0,
          itemTotal: 75.0,
          availableStock: INITIAL_PRODUCTS[1].stockQuantity,
        },
      ],
      totalItems: 1,
      subtotal: 75.0,
      deliveryCharge: 0.0,
      discountAmount: 0.0,
      finalTotal: 75.0,
    };
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(sampleCart));
  }
}

initSimulatedDatabase();

// Helpers for Simulated DB
export const simDb = {
  getProducts(): Product[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]') as Product[];
    } catch {
      return INITIAL_PRODUCTS;
    }
  },
  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
  getCategories(): Category[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]') as Category[];
    } catch {
      return INITIAL_CATEGORIES;
    }
  },
  saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
  getCart(): Cart {
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || 'null') || {
          id: 1,
          items: [],
          totalItems: 0,
          subtotal: 0,
          deliveryCharge: 0,
          discountAmount: 0,
          finalTotal: 0,
        }
      );
    } catch {
      return {
        id: 1,
        items: [],
        totalItems: 0,
        subtotal: 0,
        deliveryCharge: 0,
        discountAmount: 0,
        finalTotal: 0,
      };
    }
  },
  saveCart(cart: Cart) {
    // Recalculate totals
    let subtotal = 0;
    let totalItems = 0;
    cart.items.forEach((item) => {
      subtotal += item.unitPrice * item.quantity;
      totalItems += item.quantity;
    });
    const deliveryCharge = subtotal >= 50 || totalItems === 0 ? 0 : 5.99;
    cart.subtotal = parseFloat(subtotal.toFixed(2));
    cart.totalItems = totalItems;
    cart.deliveryCharge = parseFloat(deliveryCharge.toFixed(2));
    cart.finalTotal = parseFloat((cart.subtotal + cart.deliveryCharge - (cart.discountAmount || 0)).toFixed(2));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  },
  getWishlist(): Product[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]') as Product[];
    } catch {
      return [];
    }
  },
  saveWishlist(list: Product[]) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
  },
  getOrders(): Order[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as Order[];
    } catch {
      return INITIAL_ORDERS;
    }
  },
  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },
  getUsers(): User[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
    } catch {
      return [INITIAL_ADMIN, INITIAL_USER];
    }
  },
  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
};

// Simulated delay helper
export const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));
