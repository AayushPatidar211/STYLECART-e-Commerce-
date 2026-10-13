import { apiClient, simDb, delay } from './api';
import { DashboardStats, Category, User } from '../types';

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<DashboardStats>('/admin/dashboard');
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(150);

    const users = simDb.getUsers();
    const products = simDb.getProducts();
    const orders = simDb.getOrders();

    let totalRevenue = 0;
    let pendingCount = 0;
    let deliveredCount = 0;
    const ordersByStatus: Record<string, number> = {};

    orders.forEach((o) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
      if (o.status !== 'CANCELLED') {
        totalRevenue += o.totalAmount;
      }
      if (['PLACED', 'CONFIRMED', 'PROCESSING'].includes(o.status)) {
        pendingCount++;
      }
      if (o.status === 'DELIVERED') {
        deliveredCount++;
      }
    });

    const lowStock = products.filter((p) => p.stockQuantity < 15).length;

    const monthlyRevenue = [
      { month: 'Apr', revenue: 6400, orders: 42 },
      { month: 'May', revenue: 7800, orders: 58 },
      { month: 'Jun', revenue: 9200, orders: 66 },
      { month: 'Jul', revenue: 11400, orders: 85 },
      { month: 'Aug', revenue: 13800, orders: 104 },
      { month: 'Sep', revenue: parseFloat(totalRevenue.toFixed(2)) || 15600, orders: orders.length || 120 },
    ];

    return {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      pendingOrders: pendingCount,
      deliveredOrders: deliveredCount,
      lowStockProducts: lowStock,
      recentOrders: orders.slice(0, 8),
      ordersByStatus,
      monthlyRevenue,
    };
  },

  async getCategories(): Promise<Category[]> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<Category[]>('/categories');
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }
    await delay(60);
    return simDb.getCategories();
  },

  async createCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.post<Category>('/categories', cat);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(120);
    const categories = simDb.getCategories();
    const newCat: Category = {
      ...cat,
      id: Date.now(),
      productCount: 0,
    };
    categories.push(newCat);
    simDb.saveCategories(categories);
    return newCat;
  },

  async updateCategory(id: number, cat: Partial<Category>): Promise<Category> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.put<Category>(`/categories/${id}`, cat);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(120);
    const categories = simDb.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories[index] = { ...categories[index], ...cat };
    simDb.saveCategories(categories);
    return categories[index];
  },

  async deleteCategory(id: number): Promise<void> {
    if (import.meta.env.VITE_API_URL) {
      try {
        await apiClient.delete(`/categories/${id}`);
        return;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(100);
    const categories = simDb.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories[index].active = false;
      simDb.saveCategories(categories);
    }
  },

  async getUsers(): Promise<User[]> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<User[]>('/admin/users');
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }
    await delay(80);
    return simDb.getUsers();
  },
};
