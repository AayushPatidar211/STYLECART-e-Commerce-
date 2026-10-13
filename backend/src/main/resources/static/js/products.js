/**
 * StyleCart - Product Catalog Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { apiRequest } from './api.js';
import { wishlist } from './wishlist.js';
import { cart } from './cart.js';

let allProducts = [];
let allCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('products');
  renderFooter();

  // Read initial URL query parameters
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get('category');
  const initialCategoryId = params.get('categoryId');
  const initialKeyword = params.get('keyword');
  const initialSort = params.get('sortBy') || 'newest';

  // Elements
  const sortSelect = document.getElementById('sort-select');
  const priceRange = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  const brandSelect = document.getElementById('filter-brand');
  const categoriesContainer = document.getElementById('filter-categories');
  const resetBtn = document.getElementById('btn-reset-filters');
  const clearEmptyBtn = document.getElementById('btn-clear-empty-state');

  if (initialSort && sortSelect) sortSelect.value = initialSort;

  // 1. Fetch Categories & Brands
  try {
    allCategories = await apiRequest('/categories');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = `
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="radio" name="cat-filter" value="" ${(!initialCategory && !initialCategoryId) ? 'checked' : ''}>
          <span>All Departments</span>
        </label>
        ${allCategories.map(cat => `
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <input type="radio" name="cat-filter" value="${cat.id}" data-name="${cat.name}" ${(initialCategoryId == cat.id || initialCategory?.toLowerCase() === cat.name.toLowerCase()) ? 'checked' : ''}>
            <span>${cat.name}</span>
          </label>
        `).join('')}
      `;
    }

    // Load Brands
    const brands = await apiRequest('/products/brands').catch(() => [
      'Zara Studio', 'Essentials Co.', 'Calvin Klein', 'Mango Selection', "Levi's Premium", 'COS', 'Nordstrom Atelier', 'Ralph Lauren', 'Tommy Hilfiger', 'Fabindia Luxe', 'Mini Boden', 'Sternglas'
    ]);
    if (brandSelect && Array.isArray(brands)) {
      brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        brandSelect.appendChild(opt);
      });
    }
  } catch (err) {
    console.error('Failed to load categories/brands:', err);
  }

  // 2. Load Products & Apply Filters
  async function loadAndFilter() {
    try {
      const selectedCatRadio = document.querySelector('input[name="cat-filter"]:checked');
      const selectedCatId = selectedCatRadio ? selectedCatRadio.value : '';
      const maxPrice = priceRange ? parseFloat(priceRange.value) : 400;
      const selectedBrand = brandSelect ? brandSelect.value : '';
      const selectedRatingRadio = document.querySelector('input[name="rating-filter"]:checked');
      const minRating = selectedRatingRadio && selectedRatingRadio.value ? parseFloat(selectedRatingRadio.value) : 0;
      const sortBy = sortSelect ? sortSelect.value : 'newest';

      let query = `/products?sortBy=${sortBy}&maxPrice=${maxPrice}`;
      if (selectedCatId) query += `&categoryId=${selectedCatId}`;
      if (selectedBrand) query += `&brand=${encodeURIComponent(selectedBrand)}`;
      if (minRating) query += `&minRating=${minRating}`;

      const res = await apiRequest(query);
      allProducts = res.content || [];

      // Keyword filter from query param
      if (initialKeyword) {
        const kw = initialKeyword.toLowerCase();
        allProducts = allProducts.filter(p =>
          p.name.toLowerCase().includes(kw) ||
          p.brand.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw)
        );
        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.textContent = `Search results for "${initialKeyword}"`;
      }

      renderProductGrid(allProducts);
    } catch (err) {
      console.error('Failed to filter products:', err);
    }
  }

  function renderProductGrid(products) {
    const grid = document.getElementById('catalog-products-grid');
    const emptyMsg = document.getElementById('no-products-msg');
    const countEl = document.getElementById('results-count');

    if (countEl) countEl.textContent = `Showing ${products.length} garment${products.length === 1 ? '' : 's'}`;

    if (!products.length) {
      if (grid) grid.style.display = 'none';
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (grid) {
      grid.style.display = 'grid';
      grid.innerHTML = products.map(prod => {
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

      // Bind events
      grid.querySelectorAll('.product-wishlist-btn').forEach(btn => {
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

      grid.querySelectorAll('.btn-quick-add').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pid = parseInt(btn.dataset.id);
          const p = products.find(x => x.id === pid);
          if (p) {
            const size = p.availableSizes[0] || 'M';
            const color = p.availableColors[0] || 'Standard';
            await cart.addItem(p, size, color, 1);
          }
        });
      });
    }
  }

  // Bind Filter Events
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      if (priceDisplay) priceDisplay.textContent = `$${e.target.value}`;
      loadAndFilter();
    });
  }

  if (sortSelect) sortSelect.addEventListener('change', loadAndFilter);
  if (brandSelect) brandSelect.addEventListener('change', loadAndFilter);
  document.addEventListener('change', (e) => {
    if (e.target.name === 'cat-filter' || e.target.name === 'rating-filter') {
      loadAndFilter();
    }
  });

  const resetAllFilters = () => {
    if (priceRange) {
      priceRange.value = 400;
      if (priceDisplay) priceDisplay.textContent = '$400';
    }
    if (brandSelect) brandSelect.value = '';
    if (sortSelect) sortSelect.value = 'newest';
    const allCatRadio = document.querySelector('input[name="cat-filter"][value=""]');
    if (allCatRadio) allCatRadio.checked = true;
    const allRatingRadio = document.querySelector('input[name="rating-filter"][value=""]');
    if (allRatingRadio) allRatingRadio.checked = true;
    loadAndFilter();
  };

  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
  if (clearEmptyBtn) clearEmptyBtn.addEventListener('click', resetAllFilters);

  // Initial load
  loadAndFilter();
});
