/**
 * StyleCart - Official Razorpay Checkout Integration
 * Vanilla JavaScript Module
 */

import { STORAGE_KEYS, showToast } from './api.js';

export const DEFAULT_RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag';

export const razorpayService = {
  getKey() {
    const saved = localStorage.getItem(STORAGE_KEYS.RAZORPAY_KEY);
    return (saved && saved.trim()) ? saved.trim() : DEFAULT_RAZORPAY_KEY;
  },

  setKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEYS.RAZORPAY_KEY, key.trim());
      showToast('Razorpay Key updated successfully!', 'success');
    } else {
      localStorage.removeItem(STORAGE_KEYS.RAZORPAY_KEY);
      showToast('Reset to default Razorpay Test Key', 'info');
    }
  },

  usdToInr(usdAmount) {
    return Math.round(usdAmount * 83);
  },

  loadScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  async openCheckout(config) {
    const loaded = await this.loadScript();
    if (!loaded || !window.Razorpay) {
      if (config.onError) {
        config.onError('Razorpay SDK failed to load. Please check internet connection or disable adblocker.');
      }
      return;
    }

    const key = this.getKey();
    const amountInPaise = Math.round(config.amountInRupees * 100);

    const options = {
      key: key,
      amount: amountInPaise,
      currency: 'INR',
      name: 'StyleCart Apparel',
      description: `Order Checkout · ₹${config.amountInRupees.toLocaleString('en-IN')}`,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=128&q=80',
      handler: function(response) {
        console.log('✅ Razorpay payment completed:', response);
        if (config.onSuccess) {
          config.onSuccess(response);
        }
      },
      prefill: {
        name: config.customerName || 'Customer',
        email: config.customerEmail || 'user@stylecart.com',
        contact: config.customerPhone || '9876543210'
      },
      notes: {
        merchant: 'StyleCart Store',
        orderNotes: config.orderNotes || ''
      },
      theme: {
        color: '#171717'
      },
      modal: {
        ondismiss: function() {
          console.log('Razorpay modal dismissed by user');
          if (config.onDismiss) config.onDismiss();
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(resp) {
        console.error('❌ Razorpay Payment Failed:', resp);
        const msg = resp?.error?.description || 'Payment was unsuccessful. Please retry with a valid payment method.';
        if (config.onError) config.onError(msg);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay invocation error:', err);
      if (config.onError) config.onError(err.message || 'Could not launch Razorpay popup.');
    }
  }
};
