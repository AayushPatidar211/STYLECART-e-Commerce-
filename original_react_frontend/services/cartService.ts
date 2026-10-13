import { apiClient, simDb, delay } from './api';
import { Cart, CartItem, Product } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<Cart>('/cart');
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }
    await delay(80);
    return simDb.getCart();
  },

  async addItem(product: Product, selectedSize: string, selectedColor: string, quantity = 1): Promise<Cart> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.post<Cart>('/cart/items', {
          productId: product.id,
          selectedSize,
          selectedColor,
          quantity,
        });
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(120);
    const cart = simDb.getCart();
    const effectivePrice = product.discountPrice ?? product.price;

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].itemTotal = parseFloat(
        (cart.items[existingIndex].quantity * effectivePrice).toFixed(2)
      );
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        productImage: product.images[0] || '',
        selectedSize,
        selectedColor,
        quantity,
        unitPrice: effectivePrice,
        itemTotal: parseFloat((effectivePrice * quantity).toFixed(2)),
        availableStock: product.stockQuantity,
      };
      cart.items.push(newItem);
    }

    return simDb.saveCart(cart);
  },

  async updateQuantity(itemId: number, quantity: number): Promise<Cart> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.put<Cart>(`/cart/items/${itemId}?quantity=${quantity}`);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(100);
    const cart = simDb.getCart();
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].itemTotal = parseFloat(
          (cart.items[itemIndex].unitPrice * quantity).toFixed(2)
        );
      }
    }

    return simDb.saveCart(cart);
  },

  async removeItem(itemId: number): Promise<Cart> {
    return this.updateQuantity(itemId, 0);
  },

  async clearCart(): Promise<Cart> {
    if (import.meta.env.VITE_API_URL) {
      try {
        await apiClient.delete('/cart');
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    const emptyCart: Cart = {
      id: 1,
      items: [],
      totalItems: 0,
      subtotal: 0,
      deliveryCharge: 0,
      discountAmount: 0,
      finalTotal: 0,
    };
    return simDb.saveCart(emptyCart);
  },

  applyCoupon(couponCode: string, cart: Cart): { valid: boolean; message: string; cart: Cart } {
    const code = couponCode.trim().toUpperCase();
    if (code === 'STYLE40') {
      const discount = parseFloat((cart.subtotal * 0.4).toFixed(2));
      cart.discountAmount = discount;
      simDb.saveCart(cart);
      return { valid: true, message: 'Coupon applied! Flat 40% discount deducted.', cart };
    }
    if (code === 'WELCOME10') {
      const discount = parseFloat((cart.subtotal * 0.1).toFixed(2));
      cart.discountAmount = discount;
      simDb.saveCart(cart);
      return { valid: true, message: 'Coupon applied! 10% welcome discount deducted.', cart };
    }
    return { valid: false, message: 'Invalid or expired promo code.', cart };
  },
};
