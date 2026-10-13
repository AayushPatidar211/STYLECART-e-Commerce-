/**
 * StyleCart - Order History Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { apiRequest } from './api.js';

let rawOrders = [];
let currentFilter = 'ALL';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('orders');
  renderFooter();

  const container = document.getElementById('orders-list-container');
  const emptyMsg = document.getElementById('no-orders-msg');
  const countDesc = document.getElementById('orders-count-desc');
  const tabButtons = document.querySelectorAll('#order-status-tabs button');

  try {
    rawOrders = await apiRequest('/orders');
    renderOrders();
  } catch (err) {
    console.error('Failed to load orders:', err);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.style.background = '#fff';
        b.style.color = 'var(--text-main)';
        b.style.borderColor = 'var(--border)';
      });
      btn.style.background = 'var(--primary)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--primary)';

      currentFilter = btn.dataset.status;
      renderOrders();
    });
  });

  function renderOrders() {
    let filtered = rawOrders;
    if (currentFilter !== 'ALL') {
      filtered = rawOrders.filter(o => o.status === currentFilter);
    }

    if (countDesc) countDesc.textContent = `Showing ${filtered.length} order${filtered.length === 1 ? '' : 's'}`;

    if (!filtered.length) {
      if (container) container.style.display = 'none';
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (container) {
      container.style.display = 'flex';
      container.innerHTML = filtered.map(order => {
        const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        const statusClass = `badge-${order.status.toLowerCase()}`;

        return `
          <div class="card" style="padding: 1.5rem;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: baseline; gap: 1rem;">
                <span style="font-family: var(--font-mono); font-weight: 700; font-size: 0.95rem;">${order.orderNumber}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${dateStr}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="badge ${statusClass}">${order.status}</span>
                <a href="order-detail.html?orderNumber=${order.orderNumber}" class="btn btn-secondary btn-sm">
                  View Timeline &rarr;
                </a>
              </div>
            </div>

            <!-- Items summary & thumbnails -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; gap: 0.75rem; align-items: center; overflow-x: auto;">
                ${order.items.map(item => `
                  <div style="position: relative; width: 54px; height: 68px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border);" title="${item.productName}">
                    <img src="${item.productImage}" alt="${item.productName}" style="width: 100%; height: 100%; object-fit: cover;" />
                    <span style="position: absolute; bottom: 0; right: 0; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.65rem; padding: 0.1rem 0.3rem; border-top-left-radius: 4px;">x${item.quantity}</span>
                  </div>
                `).join('')}
                <div style="margin-left: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
                  ${order.items.length} unique item${order.items.length === 1 ? '' : 's'}
                </div>
              </div>

              <!-- Payment & Total -->
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay Gateway'} ·
                  <strong style="color: ${order.paymentStatus === 'PAID' ? 'var(--emerald)' : 'var(--amber)'};">${order.paymentStatus}</strong>
                </div>
                <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); margin-top: 0.25rem;">
                  $${order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
});
