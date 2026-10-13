/**
 * StyleCart - Admin Operations Controller
 * Vanilla JavaScript Module
 */

import { auth } from './auth.js';
import { apiRequest, STORAGE_KEYS, showToast } from './api.js';

let adminCategories = [];
let adminProducts = [];
let adminOrders = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Check Admin Role
  if (!auth.isAdmin()) {
    // Quick upgrade for demo exploration
    auth.quickLogin('admin');
  }

  // Bind Sidebar Tabs
  const tabButtons = document.querySelectorAll('.admin-nav-item[data-tab]');
  const tabSections = document.querySelectorAll('.admin-tab-content');
  const viewTitle = document.getElementById('admin-view-title');
  const viewDesc = document.getElementById('admin-view-desc');
  const logoutBtn = document.getElementById('btn-admin-logout');

  if (logoutBtn) logoutBtn.addEventListener('click', () => auth.logout());

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      tabSections.forEach(sec => {
        sec.style.display = sec.id === `tab-${targetTab}` ? 'block' : 'none';
      });

      if (targetTab === 'dashboard') {
        viewTitle.textContent = 'Executive Store Analytics';
        viewDesc.textContent = 'Real-time revenue, order fulfillment, and apparel inventory status';
        loadDashboard();
      } else if (targetTab === 'products') {
        viewTitle.textContent = 'Apparel Catalog Management';
        viewDesc.textContent = 'Create, update garment prices, edit descriptions, or deactivate styles';
        loadProducts();
      } else if (targetTab === 'categories') {
        viewTitle.textContent = 'Clothing Categories';
        viewDesc.textContent = 'Department definitions and storefront collection banners';
        loadCategories();
      } else if (targetTab === 'orders') {
        viewTitle.textContent = 'Customer Orders & Shipments';
        viewDesc.textContent = 'Fulfill customer orders, assign courier tracking numbers, and update delivery milestones';
        loadOrders();
      } else if (targetTab === 'inventory') {
        viewTitle.textContent = 'Inventory Stock Monitoring';
        viewDesc.textContent = 'Monitor stock levels and apply instant unit adjustments';
        loadInventory();
      } else if (targetTab === 'users') {
        viewTitle.textContent = 'Registered Platform Users';
        viewDesc.textContent = 'Customer accounts, security roles, and order records';
        loadUsers();
      }
    });
  });

  // Modal Elements
  const prodModal = document.getElementById('product-modal');
  const prodModalClose = document.getElementById('product-modal-close');
  const btnCancelProd = document.getElementById('btn-cancel-prod');
  const openAddProdBtn = document.getElementById('btn-open-add-product');
  const prodForm = document.getElementById('product-form');

  const catModal = document.getElementById('category-modal');
  const catModalClose = document.getElementById('category-modal-close');
  const btnCancelCat = document.getElementById('btn-cancel-cat');
  const openAddCatBtn = document.getElementById('btn-open-add-category');
  const catForm = document.getElementById('category-form');

  const closeModals = () => {
    if (prodModal) prodModal.classList.remove('open');
    if (catModal) catModal.classList.remove('open');
  };

  if (prodModalClose) prodModalClose.addEventListener('click', closeModals);
  if (btnCancelProd) btnCancelProd.addEventListener('click', closeModals);
  if (catModalClose) catModalClose.addEventListener('click', closeModals);
  if (btnCancelCat) btnCancelCat.addEventListener('click', closeModals);

  // Open Add Product Modal
  if (openAddProdBtn) {
    openAddProdBtn.addEventListener('click', () => {
      document.getElementById('product-modal-title').textContent = 'Add New Apparel';
      prodForm.reset();
      document.getElementById('prod-id').value = '';
      populateCategoryDropdown();
      prodModal.classList.add('open');
    });
  }

  // Open Add Category Modal
  if (openAddCatBtn) {
    openAddCatBtn.addEventListener('click', () => {
      catForm.reset();
      catModal.classList.add('open');
    });
  }

  // Save Product
  if (prodForm) {
    prodForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pid = document.getElementById('prod-id').value;
      const catSelect = document.getElementById('prod-cat');
      const selectedCatId = parseInt(catSelect.value);
      const selectedCatName = catSelect.options[catSelect.selectedIndex]?.text || 'Apparel';

      const prodPayload = {
        name: document.getElementById('prod-name').value.trim(),
        brand: document.getElementById('prod-brand').value.trim(),
        categoryId: selectedCatId,
        categoryName: selectedCatName,
        price: parseFloat(document.getElementById('prod-price').value),
        discountPrice: document.getElementById('prod-discount').value ? parseFloat(document.getElementById('prod-discount').value) : null,
        stockQuantity: parseInt(document.getElementById('prod-stock').value),
        images: [document.getElementById('prod-image').value.trim()],
        description: document.getElementById('prod-desc').value.trim(),
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
        availableColors: ['Standard', 'Black'],
        rating: 4.8,
        active: true
      };

      try {
        if (pid) {
          // Update
          await apiRequest(`/products/${pid}`, {
            method: 'PUT',
            body: JSON.stringify(prodPayload)
          });
          showToast('Garment updated successfully!', 'success');
        } else {
          // Create
          await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(prodPayload)
          });
          showToast('New garment added to catalog!', 'success');
        }

        closeModals();
        loadProducts();
      } catch (err) {
        showToast(err.message || 'Operation failed', 'error');
      }
    });
  }

  // Save Category
  if (catForm) {
    catForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catPayload = {
        name: document.getElementById('cat-name').value.trim(),
        imageUrl: document.getElementById('cat-image').value.trim(),
        description: document.getElementById('cat-desc').value.trim(),
        active: true
      };

      try {
        await apiRequest('/categories', {
          method: 'POST',
          body: JSON.stringify(catPayload)
        });
        showToast('Category created successfully!', 'success');
        closeModals();
        loadCategories();
      } catch (err) {
        showToast(err.message || 'Failed to create category', 'error');
      }
    });
  }

  function populateCategoryDropdown(selectedId = null) {
    const sel = document.getElementById('prod-cat');
    if (!sel) return;
    sel.innerHTML = adminCategories.map(c => `
      <option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name}</option>
    `).join('');
  }

  // 1. DASHBOARD LOADER
  async function loadDashboard() {
    try {
      const stats = await apiRequest('/admin/dashboard');
      const revEl = document.getElementById('stat-revenue');
      const ordEl = document.getElementById('stat-orders');
      const penEl = document.getElementById('stat-pending');
      const lowEl = document.getElementById('stat-low-stock');
      const chartEl = document.getElementById('dashboard-bar-chart');
      const recentTbody = document.getElementById('dash-recent-orders-tbody');

      if (revEl) revEl.textContent = `$${(stats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (ordEl) ordEl.textContent = stats.totalOrders || 0;
      if (penEl) penEl.textContent = stats.pendingOrders || 0;
      if (lowEl) lowEl.textContent = stats.lowStockProducts || 0;

      // Render Bar Chart
      if (chartEl && stats.monthlyRevenue) {
        const maxRev = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 16000);
        chartEl.innerHTML = stats.monthlyRevenue.map(m => {
          const pct = Math.round((m.revenue / maxRev) * 100);
          return `
            <div class="chart-bar-col">
              <span style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">$${m.revenue.toLocaleString()}</span>
              <div class="chart-bar-fill" style="height: ${Math.max(15, pct)}%;"></div>
              <span class="chart-bar-label">${m.month}</span>
            </div>
          `;
        }).join('');
      }

      // Render Recent Orders
      if (recentTbody && stats.recentOrders) {
        recentTbody.innerHTML = stats.recentOrders.map(o => `
          <tr>
            <td style="font-family: var(--font-mono); font-weight: 700;">${o.orderNumber}</td>
            <td><strong>${o.userName || o.shippingAddress?.fullName}</strong></td>
            <td style="font-family: var(--font-mono); font-weight: 700;">$${o.totalAmount.toFixed(2)}</td>
            <td>${o.paymentMethod}</td>
            <td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td>
            <td style="color: var(--text-muted); font-size: 0.75rem;">${new Date(o.createdAt).toLocaleDateString()}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  }

  // 2. PRODUCTS LOADER
  async function loadProducts() {
    try {
      const res = await apiRequest('/products?size=50');
      adminProducts = res.content || [];
      const tbody = document.getElementById('admin-products-tbody');
      if (tbody) {
        tbody.innerHTML = adminProducts.map(p => `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${p.images[0]}" alt="${p.name}" style="width: 40px; height: 50px; object-fit: cover; border-radius: 4px;" />
                <div>
                  <h4 style="font-weight: 700; font-size: 0.85rem;">${p.name}</h4>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${p.brand}</span>
                </div>
              </div>
            </td>
            <td>${p.categoryName || 'Apparel'}</td>
            <td style="font-family: var(--font-mono); font-weight: 700;">
              $${(p.discountPrice || p.price).toFixed(2)}
              ${p.discountPrice ? `<span style="text-decoration: line-through; font-size: 0.75rem; color: var(--text-light); margin-left: 0.25rem;">$${p.price.toFixed(2)}</span>` : ''}
            </td>
            <td>
              <span class="badge ${p.stockQuantity < 15 ? 'badge-cancelled' : 'badge-delivered'}">${p.stockQuantity} units</span>
            </td>
            <td>★ ${p.rating.toFixed(1)}</td>
            <td><span class="badge ${p.active ? 'badge-delivered' : 'badge-cancelled'}">${p.active ? 'Active' : 'Deactivated'}</span></td>
            <td>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm btn-edit-prod" data-id="${p.id}">Edit</button>
                <button class="btn btn-outline btn-sm btn-del-prod" data-id="${p.id}" style="color: var(--rose); border-color: var(--rose);">Deactivate</button>
              </div>
            </td>
          </tr>
        `).join('');

        // Bind Edit buttons
        tbody.querySelectorAll('.btn-edit-prod').forEach(b => {
          b.addEventListener('click', () => {
            const pid = parseInt(b.dataset.id);
            const p = adminProducts.find(x => x.id === pid);
            if (p) {
              document.getElementById('product-modal-title').textContent = 'Edit Garment Details';
              document.getElementById('prod-id').value = p.id;
              document.getElementById('prod-name').value = p.name;
              document.getElementById('prod-brand').value = p.brand;
              document.getElementById('prod-price').value = p.price;
              document.getElementById('prod-discount').value = p.discountPrice || '';
              document.getElementById('prod-stock').value = p.stockQuantity;
              document.getElementById('prod-image').value = p.images[0] || '';
              document.getElementById('prod-desc').value = p.description;
              populateCategoryDropdown(p.categoryId);
              prodModal.classList.add('open');
            }
          });
        });

        // Bind Deactivate buttons
        tbody.querySelectorAll('.btn-del-prod').forEach(b => {
          b.addEventListener('click', async () => {
            const pid = parseInt(b.dataset.id);
            if (confirm('Deactivate this garment from the store catalog?')) {
              await apiRequest(`/products/${pid}`, { method: 'DELETE' });
              showToast('Garment deactivated.', 'info');
              loadProducts();
            }
          });
        });
      }
    } catch (err) {
      console.error('Failed to load admin products:', err);
    }
  }

  // 3. CATEGORIES LOADER
  async function loadCategories() {
    try {
      adminCategories = await apiRequest('/categories');
      const container = document.getElementById('admin-categories-cards');
      if (container) {
        container.innerHTML = adminCategories.map(c => `
          <div class="card" style="overflow: hidden;">
            <div style="height: 120px; overflow: hidden;">
              <img src="${c.imageUrl}" alt="${c.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700;">${c.name}</h3>
                <span class="badge ${c.active ? 'badge-delivered' : 'badge-cancelled'}">${c.active ? 'Active' : 'Inactive'}</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">${c.description || 'Apparel department'}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 0.75rem; font-size: 0.75rem;">
                <span style="color: var(--text-muted);">${c.productCount || 0} styles mapped</span>
                <a href="products.html?categoryId=${c.id}" style="color: var(--primary); font-weight: 600; text-decoration: underline;">View &rarr;</a>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }

  // 4. ORDERS LOADER & LIFECYCLE UPDATER
  async function loadOrders() {
    try {
      adminOrders = await apiRequest('/orders');
      const tbody = document.getElementById('admin-orders-tbody');
      if (tbody) {
        tbody.innerHTML = adminOrders.map(o => `
          <tr>
            <td style="font-family: var(--font-mono); font-weight: 700;">
              <a href="order-detail.html?orderNumber=${o.orderNumber}" style="color: #2563eb; text-decoration: underline;">${o.orderNumber}</a>
            </td>
            <td>
              <strong>${o.userName || o.shippingAddress?.fullName}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${o.shippingAddress?.city}, ${o.shippingAddress?.country}</div>
            </td>
            <td style="font-family: var(--font-mono); font-weight: 700;">$${o.totalAmount.toFixed(2)}</td>
            <td>
              <span style="font-size: 0.8rem;">${o.paymentMethod}</span>
              <span class="badge ${o.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-pending'}" style="margin-left: 0.35rem; font-size: 0.65rem;">${o.paymentStatus}</span>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 0.35rem;">
                <input type="text" class="form-control tracking-input" data-id="${o.id}" value="${o.trackingNumber || ''}" placeholder="TRK-..." style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: var(--font-mono); width: 120px;" />
                <button class="btn btn-secondary btn-sm btn-save-trk" data-id="${o.id}" style="padding: 0.25rem 0.45rem;" title="Save Tracking">💾</button>
              </div>
            </td>
            <td>
              <select class="form-control status-select" data-id="${o.id}" data-num="${o.orderNumber}" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 600;">
                <option value="PLACED" ${o.status === 'PLACED' ? 'selected' : ''}>PLACED</option>
                <option value="CONFIRMED" ${o.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                <option value="PROCESSING" ${o.status === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
                <option value="SHIPPED" ${o.status === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
                <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
              </select>
            </td>
          </tr>
        `).join('');

        // Status select event handler
        tbody.querySelectorAll('.status-select').forEach(sel => {
          sel.addEventListener('change', async () => {
            const oid = parseInt(sel.dataset.id);
            const num = sel.dataset.num;
            const newStatus = sel.value;

            try {
              try {
                await apiRequest(`/orders/${oid}/status`, {
                  method: 'PUT',
                  body: JSON.stringify({ status: newStatus })
                });
              } catch (e) {
                // Local simulation
                const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
                const idx = orders.findIndex(o => o.orderNumber === num || o.id === oid);
                if (idx > -1) {
                  orders[idx].status = newStatus;
                  if (newStatus === 'DELIVERED' && orders[idx].paymentMethod === 'COD') {
                    orders[idx].paymentStatus = 'PAID';
                  }
                  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
                }
              }

              showToast(`Order status updated to ${newStatus}!`, 'success');
            } catch (err) {
              showToast(err.message || 'Status update failed', 'error');
            }
          });
        });

        // Tracking save event handler
        tbody.querySelectorAll('.btn-save-trk').forEach(btn => {
          btn.addEventListener('click', async () => {
            const oid = parseInt(btn.dataset.id);
            const input = tbody.querySelector(`.tracking-input[data-id="${oid}"]`);
            const trkVal = input ? input.value.trim() : '';

            const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
            const idx = orders.findIndex(o => o.id === oid);
            if (idx > -1) {
              orders[idx].trackingNumber = trkVal;
              localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            }
            showToast('Tracking number assigned!', 'success');
          });
        });
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    }
  }

  // 5. INVENTORY LOADER & INSTANT QUANTITY ADJUSTER
  async function loadInventory() {
    try {
      const res = await apiRequest('/products?size=50');
      const products = res.content || [];
      const tbody = document.getElementById('admin-inventory-tbody');
      if (tbody) {
        tbody.innerHTML = products.map(p => `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${p.images[0]}" alt="${p.name}" style="width: 36px; height: 46px; object-fit: cover; border-radius: 4px;" />
                <span style="font-weight: 700;">${p.name}</span>
              </div>
            </td>
            <td>${p.brand}</td>
            <td style="font-family: var(--font-mono); font-weight: 700; font-size: 1rem;">
              <span class="stock-display-${p.id}">${p.stockQuantity}</span>
            </td>
            <td>
              ${p.stockQuantity === 0
                ? '<span class="badge badge-cancelled">Out of Stock</span>'
                : p.stockQuantity < 15
                ? '<span class="badge badge-processing">Critical Low Stock</span>'
                : '<span class="badge badge-delivered">Healthy Stock</span>'}
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="number" class="form-control stock-unit-input" data-id="${p.id}" value="${p.stockQuantity}" style="width: 85px; padding: 0.35rem 0.5rem; font-family: var(--font-mono);" min="0" />
                <button class="btn btn-secondary btn-sm btn-update-stock" data-id="${p.id}">Save Stock</button>
              </div>
            </td>
          </tr>
        `).join('');

        tbody.querySelectorAll('.btn-update-stock').forEach(b => {
          b.addEventListener('click', async () => {
            const pid = parseInt(b.dataset.id);
            const input = tbody.querySelector(`.stock-unit-input[data-id="${pid}"]`);
            const newUnits = input ? parseInt(input.value) : 0;

            try {
              try {
                await apiRequest(`/products/${pid}/stock?quantity=${newUnits}`, { method: 'PUT' });
              } catch (e) {
                // Local simulation
                const prods = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
                const idx = prods.findIndex(p => p.id === pid);
                if (idx > -1) {
                  prods[idx].stockQuantity = newUnits;
                  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
                }
              }

              showToast(`Updated stock units to ${newUnits}!`, 'success');
              const display = tbody.querySelector(`.stock-display-${pid}`);
              if (display) display.textContent = newUnits;
            } catch (err) {
              showToast(err.message || 'Failed to update stock', 'error');
            }
          });
        });
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    }
  }

  // 6. USERS LOADER
  async function loadUsers() {
    try {
      const users = await apiRequest('/admin/users').catch(() => [
        { id: 1, firstName: 'Alexander', lastName: 'Vance', email: 'admin@stylecart.com', role: 'ROLE_ADMIN', defaultAddress: { city: 'New York' } },
        { id: 2, firstName: 'Sarah', lastName: 'Jenkins', email: 'user@stylecart.com', role: 'ROLE_USER', defaultAddress: { city: 'Springfield' } },
        { id: 3, firstName: 'Marcus', lastName: 'Thorne', email: 'marcus@example.com', role: 'ROLE_USER', defaultAddress: { city: 'London' } },
        { id: 4, firstName: 'Priya', lastName: 'Sharma', email: 'priya@example.com', role: 'ROLE_USER', defaultAddress: { city: 'Mumbai' } }
      ]);

      const tbody = document.getElementById('admin-users-tbody');
      if (tbody) {
        tbody.innerHTML = users.map(u => `
          <tr>
            <td style="font-family: var(--font-mono); font-weight: 600;">#${u.id}</td>
            <td><strong>${u.firstName} ${u.lastName}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge ${u.role === 'ROLE_ADMIN' ? 'badge-confirmed' : 'badge-placed'}">${u.role}</span></td>
            <td>${u.defaultAddress?.city || 'Default'}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }

  // Initial Load
  await loadCategories();
  await loadDashboard();
});
