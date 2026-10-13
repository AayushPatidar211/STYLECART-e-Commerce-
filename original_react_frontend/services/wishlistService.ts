import { apiClient, simDb, delay } from './api';
import { Product } from '../types';
import { cartService } from './cartService';

export const wishlistService = {
  async getWishlist(): Promise<Product[]> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<Product[]>('/wishlist');
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }
    await delay(80);
    return simDb.getWishlist();
  },

  async toggleWishlist(product: Product): Promise<boolean> {
    const list = simDb.getWishlist();
    const index = list.findIndex((p) => p.id === product.id);
    let isAdded = false;

    if (index > -1) {
      list.splice(index, 1);
      isAdded = false;
      if (import.meta.env.VITE_API_URL) {
        try {
          await apiClient.delete(`/wishlist/${product.id}`);
        } catch {}
      }
    } else {
      list.push(product);
      isAdded = true;
      if (import.meta.env.VITE_API_URL) {
        try {
          await apiClient.post(`/wishlist/${product.id}`);
        } catch {}
      }
    }

    simDb.saveWishlist(list);
    return isAdded;
  },

  async removeFromWishlist(productId: number): Promise<void> {
    const list = simDb.getWishlist().filter((p) => p.id !== productId);
    simDb.saveWishlist(list);
    if (import.meta.env.VITE_API_URL) {
      try {
        await apiClient.delete(`/wishlist/${productId}`);
      } catch {}
    }
  },

  async moveToCart(product: Product, size?: string, color?: string): Promise<void> {
    const selectedSize = size || product.availableSizes[0] || 'M';
    const selectedColor = color || product.availableColors[0] || 'Standard';

    await cartService.addItem(product, selectedSize, selectedColor, 1);
    await this.removeFromWishlist(product.id);
  },
};
