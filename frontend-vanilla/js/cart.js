/**
 * StyleCart - Shopping Cart Manager
 * Vanilla JavaScript Module
 */

import { apiRequest, STORAGE_KEYS, showToast } from './api.js';

export const cart = {
  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : {
        id: 1,
        items: [],
        totalItems: 0,
        subtotal: 0,
        deliveryCharge: 0,
        discountAmount: 0,
        finalTotal: 0
      };
    } catch {
      return { id: 1, items: [], totalItems: 0, subtotal: 0, deliveryCharge: 0, discountAmount: 0, finalTotal: 0 };
    }
  },

  saveCart(cartData) {
    let subtotal = 0;
    let totalItems = 0;

    cartData.items.forEach(item => {
      subtotal += item.unitPrice * item.quantity;
      totalItems += item.quantity;
    });

    const deliveryCharge = (subtotal >= 50 || totalItems === 0) ? 0 : 5.99;
    cartData.subtotal = parseFloat(subtotal.toFixed(2));
    cartData.totalItems = totalItems;
    cartData.deliveryCharge = parseFloat(deliveryCharge.toFixed(2));
    cartData.discountAmount = cartData.discountAmount || 0;
    cartData.finalTotal = parseFloat(Math.max(0, cartData.subtotal + cartData.deliveryCharge - cartData.discountAmount).toFixed(2));

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartData));
    this.updateBadges();
    return cartData;
  },

  async addItem(product, size, color, qty = 1) {
    // Attempt backend sync
    try {
      await apiRequest('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          selectedSize: size,
          selectedColor: color,
          quantity: qty
        })
      });
    } catch (e) {
      // Handled via local sync
    }

    const currentCart = this.getCart();
    const unitPrice = product.discountPrice || product.price;

    const existingIdx = currentCart.items.findIndex(
      item => item.productId === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIdx > -1) {
      currentCart.items[existingIdx].quantity += qty;
      currentCart.items[existingIdx].itemTotal = parseFloat(
        (currentCart.items[existingIdx].quantity * unitPrice).toFixed(2)
      );
    } else {
      currentCart.items.push({
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        productImage: (product.images && product.images[0]) || '',
        selectedSize: size,
        selectedColor: color,
        quantity: qty,
        unitPrice: unitPrice,
        itemTotal: parseFloat((unitPrice * qty).toFixed(2)),
        availableStock: product.stockQuantity || 50
      });
    }

    this.saveCart(currentCart);
    showToast(`Added ${product.name} (${size}) to bag!`, 'success');
    this.openDrawer();
  },

  async updateQuantity(itemId, quantity) {
    try {
      await apiRequest(`/cart/items/${itemId}?quantity=${quantity}`, { method: 'PUT' });
    } catch (e) {}

    const currentCart = this.getCart();
    const idx = currentCart.items.findIndex(i => i.id === itemId);

    if (idx > -1) {
      if (quantity <= 0) {
        currentCart.items.splice(idx, 1);
        showToast('Item removed from shopping bag.', 'info');
      } else {
        currentCart.items[idx].quantity = quantity;
        currentCart.items[idx].itemTotal = parseFloat(
          (currentCart.items[idx].unitPrice * quantity).toFixed(2)
        );
      }
    }

    this.saveCart(currentCart);
  },

  async removeItem(itemId) {
    return this.updateQuantity(itemId, 0);
  },

  async clearCart() {
    try {
      await apiRequest('/cart', { method: 'DELETE' });
    } catch (e) {}

    const empty = {
      id: 1,
      items: [],
      totalItems: 0,
      subtotal: 0,
      deliveryCharge: 0,
      discountAmount: 0,
      finalTotal: 0
    };
    this.saveCart(empty);
  },

  applyCoupon(code) {
    const clean = (code || '').trim().toUpperCase();
    const currentCart = this.getCart();

    if (clean === 'STYLE40') {
      const discount = parseFloat((currentCart.subtotal * 0.4).toFixed(2));
      currentCart.discountAmount = discount;
      this.saveCart(currentCart);
      showToast('Coupon STYLE40 applied! 40% discount applied.', 'success');
      return { success: true, discount };
    }

    if (clean === 'WELCOME10') {
      const discount = parseFloat((currentCart.subtotal * 0.1).toFixed(2));
      currentCart.discountAmount = discount;
      this.saveCart(currentCart);
      showToast('Coupon WELCOME10 applied! 10% discount applied.', 'success');
      return { success: true, discount };
    }

    showToast('Invalid promo code. Try STYLE40 or WELCOME10.', 'error');
    return { success: false };
  },

  updateBadges() {
    const currentCart = this.getCart();
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
      b.textContent = currentCart.totalItems || 0;
      b.style.display = currentCart.totalItems > 0 ? 'flex' : 'none';
    });
  },

  openDrawer() {
    const drawerBackdrop = document.getElementById('cart-drawer-backdrop');
    if (drawerBackdrop) {
      this.renderDrawerItems();
      drawerBackdrop.classList.add('open');
    }
  },

  closeDrawer() {
    const drawerBackdrop = document.getElementById('cart-drawer-backdrop');
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('open');
    }
  },

  renderDrawerItems() {
    const currentCart = this.getCart();
    const listEl = document.getElementById('drawer-items-list');
    const subtotalEl = document.getElementById('drawer-subtotal');
    const countEl = document.getElementById('drawer-count');

    if (countEl) countEl.textContent = currentCart.totalItems;
    if (subtotalEl) subtotalEl.textContent = `$${currentCart.subtotal.toFixed(2)}`;

    if (!listEl) return;

    if (!currentCart.items.length) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🛍️</div>
          <p style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">Your bag is empty</p>
          <p style="font-size: 0.8rem; margin-bottom: 1.5rem;">Discover new styles and add them to your cart.</p>
          <a href="products.html" class="btn btn-primary btn-sm">Explore Products</a>
        </div>
      `;
      return;
    }

    listEl.innerHTML = currentCart.items.map(item => `
      <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border);">
        <img src="${item.productImage}" alt="${item.productName}" style="width: 64px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0;" />
        <div style="flex: 1; min-width: 0;">
          <h4 style="font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.productName}</h4>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${item.selectedSize} · ${item.selectedColor}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem;">
            <div style="display: inline-flex; align-items: center; border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <button class="drawer-qty-btn" data-action="dec" data-id="${item.id}" style="padding: 0.2rem 0.5rem; background: none; border: none; cursor: pointer; font-size: 0.8rem;">-</button>
              <span style="font-size: 0.8rem; font-weight: 600; padding: 0 0.5rem;">${item.quantity}</span>
              <button class="drawer-qty-btn" data-action="inc" data-id="${item.id}" style="padding: 0.2rem 0.5rem; background: none; border: none; cursor: pointer; font-size: 0.8rem;">+</button>
            </div>
            <span style="font-size: 0.9rem; font-weight: 700;">$${item.itemTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Attach quantity event listeners
    listEl.querySelectorAll('.drawer-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        const itm = currentCart.items.find(i => i.id === id);
        if (itm) {
          const newQty = action === 'inc' ? itm.quantity + 1 : itm.quantity - 1;
          this.updateQuantity(id, newQty);
          this.renderDrawerItems();
        }
      });
    });
  }
};
