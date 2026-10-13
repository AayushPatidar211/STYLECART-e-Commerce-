/**
 * StyleCart - Wishlist Manager
 * Vanilla JavaScript Module
 */

import { apiRequest, STORAGE_KEYS, showToast } from './api.js';
import { cart } from './cart.js';

export const wishlist = {
  getWishlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.some(item => item.id === productId);
  },

  async toggleWishlist(product) {
    const list = this.getWishlist();
    const existingIndex = list.findIndex(item => item.id === product.id);
    let added = false;

    if (existingIndex > -1) {
      list.splice(existingIndex, 1);
      showToast(`Removed ${product.name} from wishlist.`, 'info');
      try {
        await apiRequest(`/wishlist/${product.id}`, { method: 'DELETE' });
      } catch (e) {}
    } else {
      list.push(product);
      added = true;
      showToast(`Saved ${product.name} to wishlist!`, 'success');
      try {
        await apiRequest(`/wishlist/${product.id}`, { method: 'POST' });
      } catch (e) {}
    }

    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    this.updateBadges();
    return added;
  },

  async removeFromWishlist(productId) {
    const list = this.getWishlist().filter(item => item.id !== productId);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    try {
      await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' });
    } catch (e) {}
    this.updateBadges();
  },

  async moveToCart(product, size, color) {
    const selectedSize = size || (product.availableSizes && product.availableSizes[0]) || 'M';
    const selectedColor = color || (product.availableColors && product.availableColors[0]) || 'Standard';
    
    await cart.addItem(product, selectedSize, selectedColor, 1);
    await this.removeFromWishlist(product.id);
  },

  updateBadges() {
    const list = this.getWishlist();
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(b => {
      b.textContent = list.length;
      b.style.display = list.length > 0 ? 'flex' : 'none';
    });
  }
};
