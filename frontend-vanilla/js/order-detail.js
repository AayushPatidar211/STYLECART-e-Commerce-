/**
 * StyleCart - Order Details & Lifecycle Timeline Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { apiRequest, STORAGE_KEYS, showToast } from './api.js';

let currentOrder = null;

const TIMELINE_STEPS = [
  { key: 'PLACED', label: 'Order Placed', icon: '1' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: '2' },
  { key: 'PROCESSING', label: 'Processing', icon: '3' },
  { key: 'SHIPPED', label: 'Shipped', icon: '4' },
  { key: 'DELIVERED', label: 'Delivered', icon: '✓' }
];

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('orders');
  renderFooter();

  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('orderNumber') || 'SC-20260915-1042';

  // Elements
  const orderNumEl = document.getElementById('det-order-number');
  const orderDateEl = document.getElementById('det-order-date');
  const statusBadge = document.getElementById('det-status-badge');
  const trackingNumberEl = document.getElementById('det-tracking-number');
  const timelineContainer = document.getElementById('lifecycle-timeline');
  const itemsContainer = document.getElementById('det-items-list');
  const addressContainer = document.getElementById('det-shipping-address');
  const subtotalEl = document.getElementById('det-subtotal');
  const shippingEl = document.getElementById('det-shipping');
  const totalEl = document.getElementById('det-total');
  const payMethodEl = document.getElementById('det-payment-method');
  const txnIdEl = document.getElementById('det-transaction-id');
  const cancelBtn = document.getElementById('btn-cancel-order');

  try {
    currentOrder = await apiRequest(`/orders/${orderNumber}`);
    renderOrderView();
  } catch (err) {
    console.error('Failed to load order details:', err);
  }

  function renderOrderView() {
    if (!currentOrder) return;

    if (orderNumEl) orderNumEl.textContent = currentOrder.orderNumber;
    if (orderDateEl) {
      orderDateEl.textContent = `Placed on ${new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }

    if (statusBadge) {
      statusBadge.textContent = currentOrder.status;
      statusBadge.className = `badge badge-${currentOrder.status.toLowerCase()}`;
    }

    if (trackingNumberEl) {
      trackingNumberEl.textContent = currentOrder.trackingNumber || 'PENDING DISPATCH';
    }

    // Render Timeline
    if (timelineContainer) {
      if (currentOrder.status === 'CANCELLED') {
        timelineContainer.innerHTML = `
          <div style="width: 100%; padding: 1.5rem; background: var(--rose-light); color: var(--rose); border-radius: var(--radius-md); text-align: center; font-weight: 700;">
            ✕ This order has been cancelled and inventory was returned to stock.
          </div>
        `;
      } else {
        const statusOrder = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const currentIdx = statusOrder.indexOf(currentOrder.status);

        timelineContainer.innerHTML = TIMELINE_STEPS.map((st, idx) => {
          const isReached = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return `
            <div class="order-timeline-step ${isReached ? 'step-active' : 'step-pending'}">
              <div class="step-icon" style="${isCurrent ? 'box-shadow: 0 0 0 4px rgba(5,150,105,0.2);' : ''}">
                ${st.icon}
              </div>
              <span class="step-label">${st.label}</span>
            </div>
          `;
        }).join('');
      }
    }

    // Items
    if (itemsContainer && currentOrder.items) {
      itemsContainer.innerHTML = currentOrder.items.map(item => `
        <div style="display: flex; gap: 1.25rem; padding: 1rem 0; align-items: center; border-bottom: 1px solid var(--border);">
          <img src="${item.productImage}" alt="${item.productName}" style="width: 60px; height: 75px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-size: 0.95rem; font-weight: 700;">${item.productName}</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              Size: <strong>${item.selectedSize}</strong> &nbsp;·&nbsp; Color: <strong>${item.selectedColor}</strong> &nbsp;·&nbsp; Qty ${item.quantity}
            </p>
          </div>
          <span style="font-size: 1rem; font-weight: 800; font-family: var(--font-mono);">$${(item.totalPrice || item.unitPrice * item.quantity).toFixed(2)}</span>
        </div>
      `).join('');
    }

    // Address
    if (addressContainer && currentOrder.shippingAddress) {
      const a = currentOrder.shippingAddress;
      addressContainer.innerHTML = `
        <strong>${a.fullName}</strong><br>
        ${a.streetAddress}${a.apartment ? ', ' + a.apartment : ''}<br>
        ${a.city}, ${a.state} ${a.postalCode}<br>
        ${a.country}<br>
        <span style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem; display: block;">📞 ${a.phone}</span>
      `;
    }

    // Breakdown
    if (subtotalEl) subtotalEl.textContent = `$${currentOrder.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = currentOrder.deliveryCharge === 0 ? 'FREE' : `$${currentOrder.deliveryCharge.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${currentOrder.totalAmount.toFixed(2)} USD`;
    if (payMethodEl) payMethodEl.textContent = currentOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay Gateway';
    if (txnIdEl) txnIdEl.textContent = currentOrder.transactionId || currentOrder.razorpayPaymentId || 'N/A';

    // Cancel Button visibility
    if (cancelBtn) {
      const canCancel = ['PLACED', 'CONFIRMED'].includes(currentOrder.status);
      cancelBtn.style.display = canCancel ? 'inline-block' : 'none';
    }
  }

  // Cancel Handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', async () => {
      if (!confirm(`Are you sure you want to cancel order ${currentOrder.orderNumber}?`)) {
        return;
      }

      try {
        try {
          currentOrder = await apiRequest(`/orders/${currentOrder.orderNumber}/cancel`, { method: 'PUT' });
        } catch (e) {
          // Local simulation
          const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
          const idx = orders.findIndex(o => o.orderNumber === currentOrder.orderNumber);
          if (idx > -1) {
            orders[idx].status = 'CANCELLED';
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            currentOrder = orders[idx];
          }
        }
        showToast('Order successfully cancelled.', 'info');
        renderOrderView();
      } catch (err) {
        showToast(err.message || 'Could not cancel order', 'error');
      }
    });
  }
});
