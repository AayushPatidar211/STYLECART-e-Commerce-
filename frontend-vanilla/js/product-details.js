/**
 * StyleCart - Product Details Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { apiRequest } from './api.js';
import { cart } from './cart.js';
import { wishlist } from './wishlist.js';

let currentProduct = null;
let selectedSize = '';
let selectedColor = '';
let quantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar('products');
  renderFooter();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;

  // DOM Elements
  const breadcrumbName = document.getElementById('breadcrumb-product-name');
  const mainImg = document.getElementById('main-product-img');
  const discountTag = document.getElementById('detail-discount-tag');
  const thumbnailsContainer = document.getElementById('product-thumbnails');
  const brandEl = document.getElementById('detail-brand');
  const titleEl = document.getElementById('detail-title');
  const ratingEl = document.getElementById('detail-rating');
  const reviewsEl = document.getElementById('detail-reviews');
  const currentPriceEl = document.getElementById('detail-current-price');
  const originalPriceEl = document.getElementById('detail-original-price');
  const descEl = document.getElementById('detail-description');
  const colorContainer = document.getElementById('color-options-container');
  const sizeContainer = document.getElementById('size-options-container');
  const selectedColorLabel = document.getElementById('selected-color-label');
  const selectedSizeLabel = document.getElementById('selected-size-label');
  const qtyDisplay = document.getElementById('selected-qty-display');
  const btnQtyMinus = document.getElementById('btn-qty-minus');
  const btnQtyPlus = document.getElementById('btn-qty-plus');
  const btnAddBag = document.getElementById('btn-add-to-bag');
  const btnBuyNow = document.getElementById('btn-buy-now');
  const btnWishlist = document.getElementById('btn-toggle-wishlist');

  // Size Guide Modal
  const sizeGuideModal = document.getElementById('size-guide-modal');
  const btnSizeGuide = document.getElementById('btn-size-guide');
  const sizeGuideClose = document.getElementById('size-guide-close');

  if (btnSizeGuide) btnSizeGuide.addEventListener('click', () => sizeGuideModal.classList.add('open'));
  if (sizeGuideClose) sizeGuideClose.addEventListener('click', () => sizeGuideModal.classList.remove('open'));
  if (sizeGuideModal) {
    sizeGuideModal.addEventListener('click', (e) => {
      if (e.target === sizeGuideModal) sizeGuideModal.classList.remove('open');
    });
  }

  // Load Product Data
  try {
    currentProduct = await apiRequest(`/products/${productId}`);
    document.title = `${currentProduct.name} — StyleCart`;

    selectedSize = currentProduct.availableSizes[0] || 'M';
    selectedColor = currentProduct.availableColors[0] || 'Standard';

    // Populate UI
    if (breadcrumbName) breadcrumbName.textContent = currentProduct.name;
    if (mainImg) mainImg.src = currentProduct.images[0];
    if (brandEl) brandEl.textContent = currentProduct.brand;
    if (titleEl) titleEl.textContent = currentProduct.name;
    if (ratingEl) ratingEl.textContent = currentProduct.rating.toFixed(1);
    if (reviewsEl) reviewsEl.textContent = `${currentProduct.reviewCount} verified reviews`;
    if (descEl) descEl.textContent = currentProduct.description;

    const effPrice = currentProduct.discountPrice || currentProduct.price;
    if (currentPriceEl) currentPriceEl.textContent = `$${effPrice.toFixed(2)}`;
    if (originalPriceEl) {
      if (currentProduct.discountPrice) {
        originalPriceEl.textContent = `$${currentProduct.price.toFixed(2)}`;
        originalPriceEl.style.display = 'inline';
      } else {
        originalPriceEl.style.display = 'none';
      }
    }
    if (discountTag && currentProduct.discountPercentage) {
      discountTag.textContent = `-${currentProduct.discountPercentage}%`;
      discountTag.style.display = 'block';
    }

    // Thumbnails
    if (thumbnailsContainer && currentProduct.images.length > 1) {
      thumbnailsContainer.innerHTML = currentProduct.images.map((imgUrl, idx) => `
        <button class="thumb-btn" data-url="${imgUrl}" style="width: 64px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid ${idx === 0 ? 'var(--primary)' : 'transparent'}; cursor: pointer; padding: 0;">
          <img src="${imgUrl}" alt="Thumbnail" style="width: 100%; height: 100%; object-fit: cover;" />
        </button>
      `).join('');

      thumbnailsContainer.querySelectorAll('.thumb-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          mainImg.src = btn.dataset.url;
          thumbnailsContainer.querySelectorAll('.thumb-btn').forEach(b => b.style.borderColor = 'transparent');
          btn.style.borderColor = 'var(--primary)';
        });
      });
    }

    // Color options
    if (colorContainer) {
      colorContainer.innerHTML = currentProduct.availableColors.map((c, idx) => `
        <button class="color-chip ${idx === 0 ? 'active' : ''}" data-color="${c}" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); border: 1px solid var(--border); background: ${idx === 0 ? 'var(--primary)' : '#fff'}; color: ${idx === 0 ? '#fff' : 'var(--text-main)'}; font-size: 0.8rem; font-weight: 500; cursor: pointer;">
          ${c}
        </button>
      `).join('');

      colorContainer.querySelectorAll('.color-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          selectedColor = chip.dataset.color;
          if (selectedColorLabel) selectedColorLabel.textContent = selectedColor;
          colorContainer.querySelectorAll('.color-chip').forEach(ch => {
            ch.style.background = '#fff';
            ch.style.color = 'var(--text-main)';
          });
          chip.style.background = 'var(--primary)';
          chip.style.color = '#fff';
        });
      });
    }

    // Size options
    if (sizeContainer) {
      sizeContainer.innerHTML = currentProduct.availableSizes.map((s, idx) => `
        <button class="size-chip ${idx === 0 ? 'active' : ''}" data-size="${s}" style="min-width: 48px; padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border); background: ${idx === 0 ? 'var(--primary)' : '#fff'}; color: ${idx === 0 ? '#fff' : 'var(--text-main)'}; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
          ${s}
        </button>
      `).join('');

      sizeContainer.querySelectorAll('.size-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          selectedSize = chip.dataset.size;
          if (selectedSizeLabel) selectedSizeLabel.textContent = selectedSize;
          sizeContainer.querySelectorAll('.size-chip').forEach(ch => {
            ch.style.background = '#fff';
            ch.style.color = 'var(--text-main)';
          });
          chip.style.background = 'var(--primary)';
          chip.style.color = '#fff';
        });
      });
    }

    // Wishlist Initial State
    if (btnWishlist) {
      const isFav = wishlist.isInWishlist(currentProduct.id);
      const svg = btnWishlist.querySelector('svg');
      if (svg) svg.setAttribute('fill', isFav ? 'currentColor' : 'none');
      if (isFav) btnWishlist.style.color = 'var(--rose)';

      btnWishlist.addEventListener('click', async () => {
        const added = await wishlist.toggleWishlist(currentProduct);
        if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
        btnWishlist.style.color = added ? 'var(--rose)' : 'inherit';
      });
    }

    // Quantity Handlers
    if (btnQtyMinus) {
      btnQtyMinus.addEventListener('click', () => {
        if (quantity > 1) {
          quantity--;
          qtyDisplay.textContent = quantity;
        }
      });
    }
    if (btnQtyPlus) {
      btnQtyPlus.addEventListener('click', () => {
        quantity++;
        qtyDisplay.textContent = quantity;
      });
    }

    // Add to Cart
    if (btnAddBag) {
      btnAddBag.addEventListener('click', async () => {
        await cart.addItem(currentProduct, selectedSize, selectedColor, quantity);
      });
    }

    // Buy Now
    if (btnBuyNow) {
      btnBuyNow.addEventListener('click', async () => {
        await cart.addItem(currentProduct, selectedSize, selectedColor, quantity);
        window.location.href = 'checkout.html';
      });
    }

    // Load Related Products
    loadRelatedProducts(currentProduct.categoryId, currentProduct.id);
  } catch (err) {
    console.error('Failed to load product details:', err);
  }

  async function loadRelatedProducts(catId, currentId) {
    const grid = document.getElementById('related-products-grid');
    if (!grid) return;
    try {
      const res = await apiRequest(`/products?categoryId=${catId}&size=4`);
      const related = (res.content || []).filter(p => p.id !== currentId).slice(0, 4);
      grid.innerHTML = related.map(prod => `
        <div class="product-card">
          <div class="product-img-wrap">
            <a href="product-details.html?id=${prod.id}">
              <img class="product-img" src="${prod.images[0]}" alt="${prod.name}" />
            </a>
          </div>
          <div class="product-info">
            <span class="product-brand">${prod.brand}</span>
            <a href="product-details.html?id=${prod.id}">
              <h3 class="product-title">${prod.name}</h3>
            </a>
            <div class="product-prices" style="margin-bottom: 0;">
              <span class="current-price">$${(prod.discountPrice || prod.price).toFixed(2)}</span>
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to load related:', err);
    }
  }
});
