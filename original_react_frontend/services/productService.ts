import { apiClient, simDb, delay } from './api';
import { Product, ProductFilterState } from '../types';

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export const productService = {
  async getProducts(filters: Partial<ProductFilterState>): Promise<PaginatedResponse<Product>> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const params: Record<string, string | number | undefined> = {
          categoryId: filters.categoryId,
          brand: filters.brand,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating,
          page: filters.page ?? 0,
          size: filters.sizePerPage ?? 12,
        };
        const res = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(120);

    let list = simDb.getProducts().filter((p) => p.active);

    if (filters.categoryId) {
      list = list.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters.categoryName) {
      list = list.filter(
        (p) => p.categoryName?.toLowerCase() === filters.categoryName?.toLowerCase()
      );
    }
    if (filters.brand) {
      list = list.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
    }
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => (p.discountPrice || p.price) >= (filters.minPrice ?? 0));
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => (p.discountPrice || p.price) <= (filters.maxPrice ?? 999999));
    }
    if (filters.minRating !== undefined) {
      list = list.filter((p) => p.rating >= (filters.minRating ?? 0));
    }
    if (filters.size) {
      list = list.filter((p) => p.availableSizes.includes(filters.size!));
    }
    if (filters.color) {
      list = list.filter((p) =>
        p.availableColors.some((c) => c.toLowerCase() === filters.color?.toLowerCase())
      );
    }
    if (filters.keyword) {
      const q = filters.keyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const page = filters.page || 0;
    const size = filters.sizePerPage || 12;
    const totalElements = list.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const start = page * size;
    const content = list.slice(start, start + size);

    return {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      last: page >= totalPages - 1,
    };
  },

  async getProductById(id: number): Promise<Product> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<Product>(`/products/${id}`);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(100);
    const product = simDb.getProducts().find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product not found with id: ${id}`);
    }
    return product;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const res = await this.getProducts({ sortBy: 'rating', sizePerPage: 8, page: 0 });
    return res.content;
  },

  async getNewArrivals(): Promise<Product[]> {
    const res = await this.getProducts({ sortBy: 'newest', sizePerPage: 8, page: 0 });
    return res.content;
  },

  async getBrands(): Promise<string[]> {
    const products = simDb.getProducts();
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set).sort();
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'reviewCount'>): Promise<Product> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.post<Product>('/products', data);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(200);
    const products = simDb.getProducts();
    const newProduct: Product = {
      ...data,
      id: Date.now(),
      reviewCount: 0,
      rating: data.rating || 5.0,
      active: true,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    simDb.saveProducts(products);
    return newProduct;
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.put<Product>(`/products/${id}`, data);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(200);
    const products = simDb.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...data };
    simDb.saveProducts(products);
    return products[index];
  },

  async deleteProduct(id: number): Promise<void> {
    if (import.meta.env.VITE_API_URL) {
      try {
        await apiClient.delete(`/products/${id}`);
        return;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(150);
    const products = simDb.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index].active = false; // soft delete
      simDb.saveProducts(products);
    }
  },

  async updateStock(id: number, quantity: number): Promise<Product> {
    return this.updateProduct(id, { stockQuantity: quantity });
  },
};
