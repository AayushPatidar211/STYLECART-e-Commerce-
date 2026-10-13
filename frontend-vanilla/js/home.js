/**
 * StyleCart - Home Page Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { apiRequest } from './api.js';
import { wishlist } from './wishlist.js';
import { cart } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('home');
  renderFooter();

  // 1. Load Categories
  try {
    const categories = await apiRequest('/categories');
    const categoryGrid = document.getElementById('category-cards-grid');
    if (categoryGrid) {
      categoryGrid.innerHTML = categories.map(cat => `
        <a href="products.html?categoryId=${cat.id}" style="display: block; position: relative; border-radius: var(--radius-lg); overflow: hidden; height: 180px; box-shadow: var(--shadow-sm); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <img src="${cat.imageUrl}" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.25rem; color: #fff;">
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;">${cat.name}</h3>
            <span style="font-size: 0.75rem; color: #d4d4d8;">Shop Department &rarr;</span>
          </div>
        </a>
      `).join('');
    }
  } catch (err) {
    console.error('Failed to load categories:', err);
  }

  // 2. Load Featured Products
  try {
    const productsRes = await apiRequest('/products?sortBy=rating&size=8');
    const products = productsRes.content || [];
    const productsGrid = document.getElementById('featured-products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = products.map(prod => {
        const isFav = wishlist.isInWishlist(prod.id);
        const effectivePrice = prod.discountPrice || prod.price;
        return `
          <div class="product-card">
            <div class="product-img-wrap">
              <a href="product-details.html?id=${prod.id}">
                <img class="product-img" src="${prod.images[0]}" alt="${prod.name}" />
              </a>
              ${prod.discountPercentage ? `<span class="product-discount-tag">-${prod.discountPercentage}%</span>` : ''}
              <button class="product-wishlist-btn ${isFav ? 'active' : ''}" data-id="${prod.id}" title="Save to wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>
            <div class="product-info">
              <span class="product-brand">${prod.brand}</span>
              <a href="product-details.html?id=${prod.id}">
                <h3 class="product-title">${prod.name}</h3>
              </a>
              <div class="product-rating">
                <span class="stars">★</span>
                <span>${prod.rating.toFixed(1)}</span>
                <span style="color: var(--text-light);">(${prod.reviewCount})</span>
              </div>
              <div class="product-prices">
                <span class="current-price">$${effectivePrice.toFixed(2)}</span>
                ${prod.discountPrice ? `<span class="original-price">$${prod.price.toFixed(2)}</span>` : ''}
              </div>
              <button class="btn btn-primary btn-sm btn-quick-add" data-id="${prod.id}" style="width: 100%;">
                Quick Add to Bag
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Bind Wishlist buttons
      productsGrid.querySelectorAll('.product-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const pid = parseInt(btn.dataset.id);
          const p = products.find(x => x.id === pid);
          if (p) {
            const added = await wishlist.toggleWishlist(p);
            btn.classList.toggle('active', added);
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
          }
        });
      });

      // Bind Quick Add buttons
      productsGrid.querySelectorAll('.btn-quick-add').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pid = parseInt(btn.dataset.id);
          const p = products.find(x => x.id === pid);
          if (p) {
            const defaultSize = p.availableSizes[0] || 'M';
            const defaultColor = p.availableColors[0] || 'Standard';
            await cart.addItem(p, defaultSize, defaultColor, 1);
          }
        });
      });
    }
  } catch (err) {
    console.error('Failed to load featured products:', err);
  }
});
