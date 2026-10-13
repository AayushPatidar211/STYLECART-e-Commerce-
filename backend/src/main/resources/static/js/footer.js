/**
 * StyleCart - Reusable Footer Component
 * Vanilla JavaScript Module
 */

export function renderFooter() {
  const footerContainer = document.getElementById('site-footer');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h3 class="footer-title">StyleCart</h3>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.7; max-width: 320px; margin-bottom: 1.5rem;">
              Curated modern apparel, fine fabrics, and timeless wardrobe essentials engineered for comfort, luxury, and daily elegance.
            </p>
            <div style="display: flex; gap: 0.75rem;">
              <span style="font-size: 0.75rem; background: #27272a; padding: 0.35rem 0.65rem; border-radius: 4px; color: #d4d4d8;">Spring Boot 3</span>
              <span style="font-size: 0.75rem; background: #27272a; padding: 0.35rem 0.65rem; border-radius: 4px; color: #d4d4d8;">MySQL 8</span>
              <span style="font-size: 0.75rem; background: #27272a; padding: 0.35rem 0.65rem; border-radius: 4px; color: #d4d4d8;">Razorpay</span>
            </div>
          </div>

          <div>
            <h4 class="footer-title">Shop Collection</h4>
            <ul class="footer-links">
              <li><a href="products.html?category=Women">Women's Apparel</a></li>
              <li><a href="products.html?category=Men">Men's Apparel</a></li>
              <li><a href="products.html?category=Kids">Kids Collection</a></li>
              <li><a href="products.html?category=Shoes">Footwear & Boots</a></li>
              <li><a href="products.html?category=Accessories">Leather Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-title">Customer Care</h4>
            <ul class="footer-links">
              <li><a href="orders.html">Track Order Status</a></li>
              <li><a href="cart.html">Shopping Bag</a></li>
              <li><a href="wishlist.html">Saved Wishlist</a></li>
              <li><a href="about.html">Brand Heritage</a></li>
              <li><a href="contact.html">Help & Concierge</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-title">Newsletter & Perks</h4>
            <p style="font-size: 0.85rem; color: #a1a1aa; margin-bottom: 1rem;">
              Subscribe for exclusive seasonal lookbooks, early private drops, and private promotions.
            </p>
            <form onsubmit="event.preventDefault(); alert('Thank you for subscribing to StyleCart news!');" style="display: flex; gap: 0.5rem;">
              <input type="email" placeholder="Your email address" required style="flex: 1; padding: 0.6rem 0.85rem; font-size: 0.8rem; border-radius: var(--radius-md); border: 1px solid #3f3f46; background: #27272a; color: #fff;" />
              <button type="submit" class="btn btn-secondary btn-sm" style="background: #fff; color: #000;">Join</button>
            </form>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 StyleCart Fashion Co. All rights reserved. Built with HTML5, CSS3 & Vanilla JavaScript.</p>
          <div style="display: flex; gap: 1.5rem;">
            <a href="about.html" style="color: #71717a;">Privacy Policy</a>
            <a href="about.html" style="color: #71717a;">Terms of Service</a>
            <a href="admin.html" style="color: #60a5fa; font-weight: 600;">Admin Dashboard</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
