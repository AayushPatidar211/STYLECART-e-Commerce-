/**
 * StyleCart - Checkout Controller
 * Vanilla JavaScript Module
 */

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { cart } from './cart.js';
import { auth } from './auth.js';
import { razorpayService } from './razorpay.js';
import { apiRequest, STORAGE_KEYS, showToast } from './api.js';

let shippingAddressData = null;

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('checkout');
  renderFooter();

  const currentCart = cart.getCart();
  if (!currentCart.items || !currentCart.items.length) {
    showToast('Your bag is empty. Please add items first.', 'info');
    setTimeout(() => { window.location.href = 'cart.html'; }, 300);
    return;
  }

  // Pre-fill user details if logged in
  const currentUser = auth.getUser();
  if (currentUser) {
    const fullNameInput = document.getElementById('addr-fullname');
    const phoneInput = document.getElementById('addr-phone');
    if (fullNameInput) fullNameInput.value = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
    if (phoneInput && currentUser.phoneNumber) phoneInput.value = currentUser.phoneNumber;

    if (currentUser.defaultAddress) {
      const addr = currentUser.defaultAddress;
      const streetInput = document.getElementById('addr-street');
      const aptInput = document.getElementById('addr-apartment');
      const cityInput = document.getElementById('addr-city');
      const stateInput = document.getElementById('addr-state');
      const postalInput = document.getElementById('addr-postal');
      const countryInput = document.getElementById('addr-country');

      if (streetInput) streetInput.value = addr.streetAddress || '';
      if (aptInput) aptInput.value = addr.apartment || '';
      if (cityInput) cityInput.value = addr.city || '';
      if (stateInput) stateInput.value = addr.state || '';
      if (postalInput) postalInput.value = addr.postalCode || '';
      if (countryInput && addr.country) countryInput.value = addr.country;
    }
  }

  // Render Order Summary Sidebar
  renderOrderSummary(currentCart);

  // Stepper Elements
  const step1 = document.getElementById('checkout-step-1');
  const step2 = document.getElementById('checkout-step-2');
  const step1Ind = document.getElementById('step-1-indicator');
  const step2Ind = document.getElementById('step-2-indicator');
  const addressForm = document.getElementById('address-form');
  const backToStep1Btn = document.getElementById('btn-back-to-step-1');
  const confirmOrderBtn = document.getElementById('btn-confirm-order');
  const paymentCards = document.querySelectorAll('input[name="payment-method"]');
  const notesInput = document.getElementById('order-notes');

  // Key Modal Elements
  const keyModal = document.getElementById('razorpay-key-modal');
  const configKeyBtn = document.getElementById('btn-configure-key');
  const keyModalClose = document.getElementById('key-modal-close');
  const keyCancelBtn = document.getElementById('btn-cancel-key');
  const keyConfigForm = document.getElementById('key-config-form');
  const customKeyInput = document.getElementById('custom-key-input');
  const resetKeyBtn = document.getElementById('btn-reset-key');

  // Address Form Submission (Step 1 -> Step 2)
  if (addressForm) {
    addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      shippingAddressData = {
        fullName: document.getElementById('addr-fullname').value.trim(),
        phone: document.getElementById('addr-phone').value.trim(),
        streetAddress: document.getElementById('addr-street').value.trim(),
        apartment: document.getElementById('addr-apartment').value.trim(),
        city: document.getElementById('addr-city').value.trim(),
        state: document.getElementById('addr-state').value.trim(),
        postalCode: document.getElementById('addr-postal').value.trim(),
        country: document.getElementById('addr-country').value.trim()
      };

      step1.style.display = 'none';
      step2.style.display = 'block';
      step1Ind.style.color = 'var(--text-muted)';
      step2Ind.style.color = 'var(--primary)';
      const step2Badge = step2Ind.querySelector('span');
      if (step2Badge) {
        step2Badge.style.background = 'var(--primary)';
        step2Badge.style.color = '#fff';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Back to Step 1
  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      step2.style.display = 'none';
      step1.style.display = 'block';
      step1Ind.style.color = 'var(--primary)';
      step2Ind.style.color = 'var(--text-muted)';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Payment Method Selection changes
  paymentCards.forEach(radio => {
    radio.addEventListener('change', () => {
      const isRzp = radio.value === 'RAZORPAY';
      const rzpCard = document.getElementById('payment-card-razorpay');
      const codCard = document.getElementById('payment-card-cod');
      if (rzpCard && codCard) {
        rzpCard.style.borderColor = isRzp ? 'var(--primary)' : 'var(--border)';
        codCard.style.borderColor = !isRzp ? 'var(--primary)' : 'var(--border)';
      }
      if (confirmOrderBtn) {
        confirmOrderBtn.textContent = isRzp
          ? `Open Razorpay & Pay ₹${razorpayService.usdToInr(currentCart.finalTotal).toLocaleString('en-IN')}`
          : `Confirm Cash on Delivery ($${currentCart.finalTotal.toFixed(2)})`;
      }
    });
  });

  // Final Order Confirmation Button
  if (confirmOrderBtn) {
    const inrVal = razorpayService.usdToInr(currentCart.finalTotal);
    confirmOrderBtn.textContent = `Open Razorpay & Pay ₹${inrVal.toLocaleString('en-IN')}`;

    confirmOrderBtn.addEventListener('click', async () => {
      const selectedMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'RAZORPAY';
      const orderNotes = notesInput ? notesInput.value.trim() : '';

      confirmOrderBtn.disabled = true;
      confirmOrderBtn.textContent = 'Processing Order...';

      if (selectedMethod === 'RAZORPAY') {
        // Open Official Razorpay Checkout Popup
        razorpayService.openCheckout({
          amountInRupees: inrVal,
          customerName: shippingAddressData.fullName,
          customerEmail: currentUser?.email || 'customer@stylecart.com',
          customerPhone: shippingAddressData.phone,
          orderNotes: orderNotes,
          onSuccess: async (rzpResponse) => {
            console.log('Razorpay payment verified:', rzpResponse);
            await createFinalOrder({
              shippingAddress: shippingAddressData,
              paymentMethod: 'RAZORPAY',
              orderNotes: orderNotes,
              razorpayPaymentId: rzpResponse.razorpay_payment_id,
              razorpayOrderId: rzpResponse.razorpay_order_id,
              razorpaySignature: rzpResponse.razorpay_signature
            });
          },
          onError: (errMsg) => {
            showToast(errMsg, 'error');
            confirmOrderBtn.disabled = false;
            confirmOrderBtn.textContent = `Open Razorpay & Pay ₹${inrVal.toLocaleString('en-IN')}`;
          },
          onDismiss: () => {
            showToast('Razorpay payment was cancelled.', 'info');
            confirmOrderBtn.disabled = false;
            confirmOrderBtn.textContent = `Open Razorpay & Pay ₹${inrVal.toLocaleString('en-IN')}`;
          }
        });
      } else {
        // Cash on delivery
        await createFinalOrder({
          shippingAddress: shippingAddressData,
          paymentMethod: 'COD',
          orderNotes: orderNotes
        });
      }
    });
  }

  // Create Backend Order Helper
  async function createFinalOrder(orderPayload) {
    try {
      let createdOrder = null;
      try {
        createdOrder = await apiRequest('/orders', {
          method: 'POST',
          body: JSON.stringify(orderPayload)
        });
      } catch (e) {
        // Local simulation fallback
        const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `SC-${datePrefix}-${randomSuffix}`;
        const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        createdOrder = {
          id: Date.now(),
          orderNumber,
          trackingNumber,
          userId: currentUser?.id || 2,
          userEmail: currentUser?.email || 'customer@stylecart.com',
          userName: orderPayload.shippingAddress.fullName,
          items: currentCart.items.map(i => ({
            id: Date.now() + Math.floor(Math.random() * 1000),
            productId: i.productId,
            productName: i.productName,
            productImage: i.productImage,
            selectedSize: i.selectedSize,
            selectedColor: i.selectedColor,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.itemTotal
          })),
          shippingAddress: orderPayload.shippingAddress,
          subtotal: currentCart.subtotal,
          discountAmount: currentCart.discountAmount || 0,
          deliveryCharge: currentCart.deliveryCharge,
          totalAmount: currentCart.finalTotal,
          status: 'PLACED',
          paymentMethod: orderPayload.paymentMethod,
          paymentStatus: orderPayload.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          transactionId: orderPayload.razorpayPaymentId || `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
          razorpayPaymentId: orderPayload.razorpayPaymentId,
          orderNotes: orderPayload.orderNotes,
          createdAt: new Date().toISOString()
        };

        orders.unshift(createdOrder);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      }

      // Empty shopping bag
      await cart.clearCart();
      showToast('Order placed successfully!', 'success');

      // Redirect to Order Confirmation
      setTimeout(() => {
        window.location.href = `order-success.html?orderNumber=${createdOrder.orderNumber}`;
      }, 350);
    } catch (err) {
      showToast(err.message || 'Failed to finalize order', 'error');
      confirmOrderBtn.disabled = false;
      confirmOrderBtn.textContent = 'Retry Order Placement';
    }
  }

  // Key Modal Handlers
  if (configKeyBtn) {
    configKeyBtn.addEventListener('click', () => {
      if (customKeyInput) customKeyInput.value = razorpayService.getKey();
      keyModal.classList.add('open');
    });
  }
  const closeKeyModal = () => keyModal.classList.remove('open');
  if (keyModalClose) keyModalClose.addEventListener('click', closeKeyModal);
  if (keyCancelBtn) keyCancelBtn.addEventListener('click', closeKeyModal);

  if (keyConfigForm) {
    keyConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      razorpayService.setKey(customKeyInput.value);
      closeKeyModal();
    });
  }

  if (resetKeyBtn) {
    resetKeyBtn.addEventListener('click', () => {
      razorpayService.setKey('');
      if (customKeyInput) customKeyInput.value = razorpayService.getKey();
      closeKeyModal();
    });
  }

  function renderOrderSummary(cartData) {
    const countEl = document.getElementById('summary-items-count');
    const itemsList = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('chk-subtotal');
    const discountRow = document.getElementById('chk-discount-row');
    const discountEl = document.getElementById('chk-discount');
    const shippingEl = document.getElementById('chk-shipping');
    const totalUsdEl = document.getElementById('chk-total-usd');
    const totalInrEl = document.getElementById('chk-total-inr');

    if (countEl) countEl.textContent = cartData.totalItems;
    if (itemsList) {
      itemsList.innerHTML = cartData.items.map(item => `
        <div style="display: flex; gap: 0.75rem; padding: 0.75rem 0; align-items: center;">
          <img src="${item.productImage}" alt="${item.productName}" style="width: 48px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.productName}</h4>
            <p style="font-size: 0.7rem; color: var(--text-muted);">${item.selectedSize} · ${item.selectedColor} · Qty ${item.quantity}</p>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; font-family: var(--font-mono);">$${item.itemTotal.toFixed(2)}</span>
        </div>
      `).join('');
    }

    if (subtotalEl) subtotalEl.textContent = `$${cartData.subtotal.toFixed(2)}`;
    if (cartData.discountAmount > 0) {
      if (discountRow) discountRow.style.display = 'flex';
      if (discountEl) discountEl.textContent = `-$${cartData.discountAmount.toFixed(2)}`;
    }
    if (shippingEl) shippingEl.textContent = cartData.deliveryCharge === 0 ? 'FREE' : `$${cartData.deliveryCharge.toFixed(2)}`;
    if (totalUsdEl) totalUsdEl.textContent = `$${cartData.finalTotal.toFixed(2)} USD`;
    if (totalInrEl) totalInrEl.textContent = `≈ ₹${razorpayService.usdToInr(cartData.finalTotal).toLocaleString('en-IN')} INR`;
  }
});
