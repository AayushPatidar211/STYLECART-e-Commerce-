/**
 * StyleCart - Wishlist Page Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { wishlist } from './wishlist.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('wishlist');
  renderFooter();

  const grid = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty-state');
  const countDesc = document.getElementById('wishlist-count-desc');

  function renderPage() {
    const items = wishlist.getWishlist();
    if (countDesc) countDesc.textContent = `${items.length} piece${items.length === 1 ? '' : 's'} saved`;

    if (!items.length) {
      if (grid) grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (grid) {
      grid.style.display = 'grid';
      grid.innerHTML = items.map(prod => `
        <div class="product-card">
          <div class="product-img-wrap">
            <a href="product-details.html?id=${prod.id}">
              <img class="product-img" src="${prod.images[0]}" alt="${prod.name}" />
            </a>
            <button class="product-wishlist-btn active" data-id="${prod.id}" title="Remove from wishlist" style="color: var(--rose);">
              ✕
            </button>
          </div>
          <div class="product-info">
            <span class="product-brand">${prod.brand}</span>
            <a href="product-details.html?id=${prod.id}">
              <h3 class="product-title">${prod.name}</h3>
            </a>
            <div class="product-prices">
              <span class="current-price">$${(prod.discountPrice || prod.price).toFixed(2)}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: auto;">
              <button class="btn btn-primary btn-sm btn-move-cart" data-id="${prod.id}" style="flex: 1;">
                Move to Bag
              </button>
            </div>
          </div>
        </div>
      `).join('');

      // Remove handler
      grid.querySelectorAll('.product-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const pid = parseInt(btn.dataset.id);
          await wishlist.removeFromWishlist(pid);
          renderPage();
        });
      });

      // Move to Cart handler
      grid.querySelectorAll('.btn-move-cart').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pid = parseInt(btn.dataset.id);
          const p = items.find(x => x.id === pid);
          if (p) {
            await wishlist.moveToCart(p);
            renderPage();
          }
        });
      });
    }
  }

  renderPage();
});
