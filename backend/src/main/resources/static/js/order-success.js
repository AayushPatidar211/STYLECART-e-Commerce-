/**
 * StyleCart - Order Success Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { apiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('');
  renderFooter();

  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('orderNumber');

  const orderNumEl = document.getElementById('succ-order-number');
  const trackingEl = document.getElementById('succ-tracking');
  const paymentStatusEl = document.getElementById('succ-payment-status');
  const rzpBox = document.getElementById('succ-rzp-box');
  const rzpIdEl = document.getElementById('succ-rzp-id');
  const itemsContainer = document.getElementById('succ-items-container');
  const addrText = document.getElementById('succ-address-text');
  const subtotalEl = document.getElementById('succ-subtotal');
  const shippingEl = document.getElementById('succ-shipping');
  const totalEl = document.getElementById('succ-total');
  const trackBtn = document.getElementById('btn-track-order');

  if (!orderNumber) {
    if (orderNumEl) orderNumEl.textContent = 'SC-2026-DEMO';
    return;
  }

  try {
    const order = await apiRequest(`/orders/${orderNumber}`);

    if (orderNumEl) orderNumEl.textContent = order.orderNumber;
    if (trackingEl) trackingEl.textContent = order.trackingNumber || 'TRK-PENDING';
    if (trackBtn) trackBtn.href = `order-detail.html?orderNumber=${order.orderNumber}`;

    if (paymentStatusEl) {
      paymentStatusEl.textContent = order.paymentStatus === 'PAID' ? 'PAID (Captured)' : 'PENDING (COD)';
      paymentStatusEl.className = order.paymentStatus === 'PAID' ? 'badge badge-paid' : 'badge badge-pending';
    }

    if (order.razorpayPaymentId) {
      if (rzpBox) rzpBox.style.display = 'block';
      if (rzpIdEl) rzpIdEl.textContent = order.razorpayPaymentId;
    } else {
      if (rzpBox) rzpBox.style.display = 'none';
    }

    if (itemsContainer && order.items) {
      itemsContainer.innerHTML = order.items.map(i => `
        <div style="display: flex; gap: 1rem; padding: 0.75rem 0; align-items: center; border-bottom: 1px solid var(--border);">
          <img src="${i.productImage}" alt="${i.productName}" style="width: 48px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-size: 0.85rem; font-weight: 700;">${i.productName}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted);">${i.selectedSize} · ${i.selectedColor} · Qty ${i.quantity}</p>
          </div>
          <span style="font-size: 0.9rem; font-weight: 700; font-family: var(--font-mono);">$${(i.totalPrice || i.unitPrice * i.quantity).toFixed(2)}</span>
        </div>
      `).join('');
    }

    if (addrText && order.shippingAddress) {
      const a = order.shippingAddress;
      addrText.innerHTML = `
        <strong>${a.fullName}</strong><br>
        ${a.streetAddress}${a.apartment ? ', ' + a.apartment : ''}<br>
        ${a.city}, ${a.state} ${a.postalCode}<br>
        ${a.country}<br>
        <span style="color: var(--text-muted); font-size: 0.8rem;">Contact: ${a.phone}</span>
      `;
    }

    if (subtotalEl) subtotalEl.textContent = `$${order.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = order.deliveryCharge === 0 ? 'FREE' : `$${order.deliveryCharge.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${order.totalAmount.toFixed(2)} USD`;
  } catch (err) {
    console.error('Failed to load order receipt:', err);
  }
});
