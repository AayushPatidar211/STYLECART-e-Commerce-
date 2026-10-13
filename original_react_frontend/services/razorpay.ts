/**
 * Official Razorpay Standard Checkout SDK Integration for FashionHub
 */

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise (e.g. 1000 = Rs 10.00)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

export const RAZORPAY_STORAGE_KEY = 'fashionhub_razorpay_key';
// Default public test key provided for immediate testing out of the box
export const DEFAULT_RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag';

/**
 * Returns current Razorpay Key ID (custom key from localStorage if set, else env or default)
 */
export const getRazorpayKey = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(RAZORPAY_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
  if (envKey && !envKey.includes('your_key_id')) return envKey;
  return DEFAULT_RAZORPAY_KEY;
};

export const setRazorpayKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(RAZORPAY_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(RAZORPAY_STORAGE_KEY);
    }
  }
};

/**
 * Dynamically loads the official Razorpay Checkout SDK script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Opens the official Razorpay Checkout Popup
 */
export const openRazorpayPayment = async (config: {
  amountInRupees: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderNotes?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onError: (error: string) => void;
  onDismiss?: () => void;
}): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    config.onError('Razorpay SDK failed to load. Please check your internet connection or adblocker.');
    return;
  }

  const key = getRazorpayKey();
  const amountInPaise = Math.round(config.amountInRupees * 100);

  const options: RazorpayOptions = {
    key,
    amount: amountInPaise,
    currency: 'INR',
    name: 'FashionHub',
    description: `Apparel Order Checkout · ₹${config.amountInRupees.toFixed(2)}`,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=128&q=80',
    handler: (response: RazorpayResponse) => {
      console.log('✅ Razorpay payment completed:', response);
      config.onSuccess(response);
    },
    prefill: {
      name: config.customerName || 'Customer',
      email: config.customerEmail || 'user@stylecart.com',
      contact: config.customerPhone || '9876543210',
    },
    notes: {
      merchant: 'FashionHub Apparel Store',
      orderNotes: config.orderNotes || '',
    },
    theme: {
      color: '#0f172a', // Navy / slate primary brand color
    },
    modal: {
      ondismiss: () => {
        console.log('Razorpay popup closed by customer');
        if (config.onDismiss) config.onDismiss();
      },
    },
  };

  try {
    const razorpayInstance = new (window as any).Razorpay(options);

    razorpayInstance.on('payment.failed', (response: any) => {
      console.error('❌ Razorpay Payment Failed:', response);
      const errorMsg =
        response?.error?.description ||
        response?.error?.reason ||
        'Payment was unsuccessful. Please retry with a valid payment method.';
      config.onError(errorMsg);
    });

    // OPEN THE OFFICIAL RAZORPAY POPUP
    razorpayInstance.open();
  } catch (err: any) {
    console.error('Failed to open Razorpay instance:', err);
    config.onError(err?.message || 'Could not launch Razorpay popup.');
  }
};
