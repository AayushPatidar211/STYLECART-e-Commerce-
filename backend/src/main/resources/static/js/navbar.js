/**
 * StyleCart - Reusable Navigation Bar & Header Component
 * Vanilla JavaScript Module
 */

import { auth } from './auth.js';
import { cart } from './cart.js';
import { wishlist } from './wishlist.js';
import { apiRequest } from './api.js';

export function renderNavbar(activePage = 'home') {
  const headerContainer = document.getElementById('site-header');
  if (!headerContainer) return;

  const user = auth.getUser();
  const isAdmin = auth.isAdmin();

  headerContainer.innerHTML = `
    <!-- Top Announcement Banner -->
    <div class="announcement-bar">
      <span>Seasonal Drop 2026: Enjoy complimentary shipping on all orders over $50. Use code <strong>STYLE40</strong> for 40% off.</span>
      <a href="products.html">Shop Catalog &rarr;</a>
    </div>

    <!-- Main Navigation Bar -->
    <nav class="navbar">
      <div class="container navbar-inner">
        <!-- Logo -->
        <a href="index.html" class="brand-logo">
          StyleCart <span>EST. 2026</span>
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="nav-links">
          <li><a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="products.html" class="nav-link ${activePage === 'products' ? 'active' : ''}">Shop</a></li>
          <li><a href="products.html?category=Women" class="nav-link">Women</a></li>
          <li><a href="products.html?category=Men" class="nav-link">Men</a></li>
          <li><a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">About</a></li>
          <li><a href="contact.html" class="nav-link ${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
          ${isAdmin ? `<li><a href="admin.html" class="nav-link" style="color: #2563eb; font-weight: 700;">★ Admin Hub</a></li>` : ''}
        </ul>

        <!-- Action Buttons -->
        <div class="nav-actions">
          <!-- Search Button -->
          <button id="search-modal-trigger" class="nav-btn" title="Search catalog" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          <!-- Wishlist Button -->
          <a href="wishlist.html" class="nav-btn" title="Saved Wishlist" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            <span class="nav-badge wishlist-count-badge" style="display: none;">0</span>
          </a>

          <!-- Cart Slide Drawer Trigger -->
          <button id="cart-drawer-trigger" class="nav-btn" title="Shopping Bag" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span class="nav-badge cart-count-badge" style="display: none;">0</span>
          </button>

          <!-- Account / User Menu -->
          ${user ? `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: 0.5rem;">
              <a href="profile.html" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>${user.firstName}</span>
              </a>
              <button id="btn-logout" class="nav-btn" title="Sign Out" aria-label="Sign Out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          ` : `
            <a href="login.html" class="btn btn-primary btn-sm" style="margin-left: 0.5rem;">Sign In</a>
          `}
        </div>
      </div>
    </nav>

    <!-- Slide-over Cart Drawer Backdrop -->
    <div id="cart-drawer-backdrop" class="drawer-backdrop">
      <div class="drawer">
        <div class="drawer-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <h3 style="font-size: 1.1rem; font-family: var(--font-serif); font-weight: 700;">Shopping Bag (<span id="drawer-count">0</span>)</h3>
          </div>
          <button id="cart-drawer-close" class="modal-close-btn" style="position: static;">✕</button>
        </div>
        <div class="drawer-body" id="drawer-items-list">
          <!-- Populated dynamically via cart.js -->
        </div>
        <div class="drawer-footer">
          <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem;">
            <span>Subtotal</span>
            <span id="drawer-subtotal" style="font-family: var(--font-mono);">$0.00</span>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a href="cart.html" class="btn btn-secondary btn-block">View Full Bag</a>
            <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Modal Backdrop -->
    <div id="search-modal-backdrop" class="modal-backdrop">
      <div class="modal-content" style="max-width: 640px;">
        <button id="search-modal-close" class="modal-close-btn">✕</button>
        <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Search Product Catalog</h3>
        <div style="position: relative; margin-bottom: 1.25rem;">
          <input type="text" id="catalog-search-input" class="form-control" placeholder="Search by name, brand (e.g. Zara, Levi's), material..." autofocus />
        </div>
        <div id="search-live-results" style="max-height: 320px; overflow-y: auto;">
          <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 2rem;">Type keyword to see matching apparel...</p>
        </div>
      </div>
    </div>
  `;

  // Bind Listeners
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => auth.logout());
  }

  // Cart Drawer bindings
  const drawerTrigger = document.getElementById('cart-drawer-trigger');
  const drawerClose = document.getElementById('cart-drawer-close');
  const drawerBackdrop = document.getElementById('cart-drawer-backdrop');

  if (drawerTrigger) drawerTrigger.addEventListener('click', () => cart.openDrawer());
  if (drawerClose) drawerClose.addEventListener('click', () => cart.closeDrawer());
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) cart.closeDrawer();
    });
  }

  // Search Modal bindings
  const searchTrigger = document.getElementById('search-modal-trigger');
  const searchClose = document.getElementById('search-modal-close');
  const searchBackdrop = document.getElementById('search-modal-backdrop');
  const searchInput = document.getElementById('catalog-search-input');
  const searchResults = document.getElementById('search-live-results');

  const openSearch = () => {
    searchBackdrop.classList.add('open');
    setTimeout(() => searchInput.focus(), 100);
  };
  const closeSearch = () => searchBackdrop.classList.remove('open');

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', (e) => {
      if (e.target === searchBackdrop) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      const q = e.target.value.trim();
      if (!q) {
        searchResults.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 2rem;">Type keyword to see matching apparel...</p>';
        return;
      }

      try {
        const res = await apiRequest(`/products/search?keyword=${encodeURIComponent(q)}`);
        const items = res.content || [];
        if (!items.length) {
          searchResults.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 2rem;">No items found matching "${q}".</p>`;
          return;
        }

        searchResults.innerHTML = items.slice(0, 6).map(item => `
          <a href="product-details.html?id=${item.id}" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-radius: var(--radius-md); text-decoration: none; color: inherit; transition: background 0.15s ease;" onmouseover="this.style.background='#f4f4f5'" onmouseout="this.style.background='transparent'">
            <img src="${item.images[0]}" alt="${item.name}" style="width: 44px; height: 56px; object-fit: cover; border-radius: 4px;" />
            <div style="flex: 1; min-width: 0;">
              <h4 style="font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h4>
              <p style="font-size: 0.75rem; color: var(--text-muted);">${item.brand} · ${item.categoryName || ''}</p>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; font-family: var(--font-mono);">$${(item.discountPrice || item.price).toFixed(2)}</span>
          </a>
        `).join('') + `
          <div style="padding-top: 1rem; border-top: 1px solid var(--border); text-align: center;">
            <a href="products.html?keyword=${encodeURIComponent(q)}" class="btn btn-secondary btn-sm" style="width: 100%;">View all ${items.length} results &rarr;</a>
          </div>
        `;
      } catch (err) {
        searchResults.innerHTML = `<p style="font-size: 0.85rem; color: var(--rose); text-align: center; padding: 1rem;">Search failed: ${err.message}</p>`;
      }
    });
  }

  // Update badge counters immediately
  cart.updateBadges();
  wishlist.updateBadges();
}
