/**
 * StyleCart - Cart Page Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { cart } from './cart.js';
import { razorpayService } from './razorpay.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('cart');
  renderFooter();

  const emptyView = document.getElementById('cart-empty-view');
  const contentView = document.getElementById('cart-content-view');
  const itemsContainer = document.getElementById('cart-items-table');
  const pageCountEl = document.getElementById('cart-page-count');
  const subtotalEl = document.getElementById('summary-subtotal');
  const discountRow = document.getElementById('summary-discount-row');
  const discountEl = document.getElementById('summary-discount');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');
  const inrEl = document.getElementById('summary-inr');
  const couponForm = document.getElementById('coupon-form');
  const couponInput = document.getElementById('coupon-input');
  const clearCartBtn = document.getElementById('btn-clear-cart');

  function renderPage() {
    const currentCart = cart.getCart();
    if (pageCountEl) pageCountEl.textContent = currentCart.totalItems;

    if (!currentCart.items.length) {
      if (contentView) contentView.style.display = 'none';
      if (emptyView) emptyView.style.display = 'block';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (contentView) contentView.style.display = 'grid';

    if (itemsContainer) {
      itemsContainer.innerHTML = currentCart.items.map(item => `
        <div style="display: flex; gap: 1.5rem; padding: 1.5rem; align-items: center; border-bottom: 1px solid var(--border);">
          <img src="${item.productImage}" alt="${item.productName}" style="width: 80px; height: 100px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0;" />
          <div style="flex: 1; min-width: 0;">
            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">${item.brand}</span>
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">${item.productName}</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Size: <strong>${item.selectedSize}</strong> &nbsp;·&nbsp; Color: <strong>${item.selectedColor}</strong></p>
            <div style="font-size: 0.85rem; font-family: var(--font-mono); margin-top: 0.5rem; font-weight: 600;">
              $${item.unitPrice.toFixed(2)} each
            </div>
          </div>
          <div style="display: flex; align-items: center; border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden;">
            <button class="cart-qty-btn" data-action="dec" data-id="${item.id}" style="padding: 0.4rem 0.75rem; background: #fff; border: none; cursor: pointer;">-</button>
            <span style="padding: 0.4rem 0.85rem; font-weight: 700; font-family: var(--font-mono);">${item.quantity}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${item.id}" style="padding: 0.4rem 0.75rem; background: #fff; border: none; cursor: pointer;">+</button>
          </div>
          <div style="width: 100px; text-align: right;">
            <span style="font-size: 1.1rem; font-weight: 800; font-family: var(--font-mono);">$${item.itemTotal.toFixed(2)}</span>
          </div>
          <button class="cart-remove-btn" data-id="${item.id}" style="background: none; border: none; cursor: pointer; color: var(--text-light); padding: 0.5rem;" title="Remove Item">
            ✕
          </button>
        </div>
      `).join('');

      // Quantity buttons
      itemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = parseInt(btn.dataset.id);
          const action = btn.dataset.action;
          const itm = currentCart.items.find(i => i.id === id);
          if (itm) {
            const nextQty = action === 'inc' ? itm.quantity + 1 : itm.quantity - 1;
            await cart.updateQuantity(id, nextQty);
            renderPage();
          }
        });
      });

      // Remove buttons
      itemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = parseInt(btn.dataset.id);
          await cart.removeItem(id);
          renderPage();
        });
      });
    }

    // Totals
    if (subtotalEl) subtotalEl.textContent = `$${currentCart.subtotal.toFixed(2)}`;
    if (currentCart.discountAmount > 0) {
      if (discountRow) discountRow.style.display = 'flex';
      if (discountEl) discountEl.textContent = `-$${currentCart.discountAmount.toFixed(2)}`;
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }
    if (shippingEl) {
      shippingEl.textContent = currentCart.deliveryCharge === 0 ? 'FREE' : `$${currentCart.deliveryCharge.toFixed(2)}`;
    }
    if (totalEl) totalEl.textContent = `$${currentCart.finalTotal.toFixed(2)} USD`;
    if (inrEl) inrEl.textContent = `≈ ₹${razorpayService.usdToInr(currentCart.finalTotal).toLocaleString('en-IN')} INR`;
  }

  // Coupon submission
  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = couponInput.value;
      cart.applyCoupon(code);
      renderPage();
    });
  }

  // Empty cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to clear your shopping bag?')) {
        await cart.clearCart();
        renderPage();
      }
    });
  }

  renderPage();
});
