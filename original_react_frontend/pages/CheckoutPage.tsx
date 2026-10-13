import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  Sparkles,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Address, Order } from '../types';
import {
  openRazorpayPayment,
  loadRazorpayScript,
  getRazorpayKey,
  setRazorpayKey,
  DEFAULT_RAZORPAY_KEY,
} from '../services/razorpay';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onNavigateBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onNavigateBack,
}) => {
  const { cart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [isOpeningRazorpay, setIsOpeningRazorpay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Razorpay Key Management
  const [currentKey, setCurrentKey] = useState(getRazorpayKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState(currentKey);

  // Address State
  const [address, setAddress] = useState<Address>({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Sarah Jenkins',
    phone: user?.phoneNumber || '+91-9876543210',
    streetAddress: user?.defaultAddress?.streetAddress || '742 Fashion Boulevard',
    apartment: user?.defaultAddress?.apartment || 'Suite 4B',
    city: user?.defaultAddress?.city || 'Mumbai',
    state: user?.defaultAddress?.state || 'Maharashtra',
    postalCode: user?.defaultAddress?.postalCode || '400001',
    country: user?.defaultAddress?.country || 'India',
  });

  // Payment Method State: RAZORPAY (default) or COD
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [orderNotes, setOrderNotes] = useState('');

  // Preload Razorpay script on mount
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setScriptLoaded(loaded);
      if (!loaded) {
        console.warn('Razorpay script could not be preloaded. Will retry on checkout.');
      }
    });
  }, []);

  // INR conversion (1 USD = ₹84)
  const inrTotal = Math.round(cart.finalTotal * 84);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setRazorpayKey(customKeyInput);
    setCurrentKey(getRazorpayKey());
    setShowKeyModal(false);
  };

  const handleResetKey = () => {
    setRazorpayKey(DEFAULT_RAZORPAY_KEY);
    setCustomKeyInput(DEFAULT_RAZORPAY_KEY);
    setCurrentKey(DEFAULT_RAZORPAY_KEY);
    setShowKeyModal(false);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.streetAddress || !address.city || !address.postalCode) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }
    setError(null);
    setStep(2);
  };

  /**
   * Finalizes order placement and navigates to success page
   */
  const finalizeOrderPlacement = async (paymentDetails?: {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => {
    setSubmitting(true);
    setError(null);

    try {
      const order = await orderService.placeOrder({
        shippingAddress: address,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
        orderNotes,
        razorpayPaymentId: paymentDetails?.razorpay_payment_id,
        razorpayOrderId: paymentDetails?.razorpay_order_id,
        razorpaySignature: paymentDetails?.razorpay_signature,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}

      onOrderSuccess(order);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please review your details.');
    } finally {
      setSubmitting(false);
      setIsOpeningRazorpay(false);
    }
  };

  /**
   * Main Checkout Trigger: Opens official Razorpay Popup or completes COD
   */
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Cash on Delivery
    if (paymentMethod === 'COD') {
      await finalizeOrderPlacement();
      return;
    }

    // Razorpay Gateway Flow
    setIsOpeningRazorpay(true);

    try {
      await openRazorpayPayment({
        amountInRupees: inrTotal,
        customerName: address.fullName,
        customerEmail: user?.email || 'user@stylecart.com',
        customerPhone: address.phone.replace(/[^0-9]/g, '').slice(-10) || '9876543210',
        orderNotes,
        onSuccess: (response) => {
          // Razorpay payment was successful!
          setIsOpeningRazorpay(false);
          finalizeOrderPlacement(response);
        },
        onError: (errorMessage) => {
          setIsOpeningRazorpay(false);
          setError(errorMessage);
        },
        onDismiss: () => {
          setIsOpeningRazorpay(false);
        },
      });
    } catch (err: any) {
      setIsOpeningRazorpay(false);
      setError(err?.message || 'Failed to open Razorpay payment popup.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Checkout Breadcrumb / Stepper */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
        <button
          onClick={onNavigateBack}
          className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping Bag</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-mono font-medium">
          <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Delivery Address</span>
          </span>
          <span className="text-neutral-300">/</span>
          <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}>2</span>
            <span>Razorpay Payment & Review</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Payment Notice</p>
            <p>{error}</p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowKeyModal(true)}
                className="underline font-semibold hover:text-rose-900"
              >
                Configure Custom Razorpay Key ID
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  finalizeOrderPlacement({
                    razorpay_payment_id: `pay_sim_${Date.now()}`,
                  });
                }}
                className="underline hover:text-rose-900"
              >
                Proceed with Simulated Test Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opening Razorpay Popup Status Banner */}
      {isOpeningRazorpay && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-center gap-3 animate-pulse">
          <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
          <span className="font-semibold">
            Launching official Razorpay checkout popup window... If the popup doesn't open, please check if your browser blocked popups.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Form: 7 Columns */}
        <div className="lg:col-span-7">
          {step === 1 ? (
            /* Step 1: Address Form */
            <form onSubmit={handleAddressSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">Shipping Address</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Please provide the delivery destination for your garment package.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Full Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number (Required for Razorpay SMS/OTP) *</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    placeholder="House number and street name"
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    value={address.apartment}
                    onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                    placeholder="e.g. Apt 4B"
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Payment Method Selection & Razorpay Checkout Trigger */
            <form onSubmit={handlePlaceOrder} className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h2 className="font-serif text-xl font-bold text-neutral-900">Select Payment Method</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Pay seamlessly with the official Razorpay payment gateway popup.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-neutral-600 hover:underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Address Summary Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3.5 text-xs text-neutral-700 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-neutral-900">{address.fullName} ({address.phone})</span>
                  <p className="text-neutral-500 mt-0.5">
                    {address.streetAddress}{address.apartment ? `, ${address.apartment}` : ''}, {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                  Standard Delivery
                </span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                {/* 1. Official Razorpay Gateway Option */}
                <label
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`block p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-neutral-900 bg-neutral-50/80 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-neutral-900">Razorpay Payment Gateway</p>
                          <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            Official Popup
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5">
                          UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking & Wallets
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 mt-2">
                          <span>UPI QR & VPA</span>
                          <span>·</span>
                          <span>Visa / Mastercard / RuPay</span>
                          <span>·</span>
                          <span>All Indian Banks</span>
                        </div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="accent-neutral-900 mt-1"
                    />
                  </div>

                  {paymentMethod === 'RAZORPAY' && (
                    <div className="mt-4 pt-3.5 border-t border-neutral-200/80 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Key: <strong className="text-neutral-800">{currentKey}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowKeyModal(true);
                        }}
                        className="text-[11px] text-neutral-800 hover:text-neutral-950 font-medium underline flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Change Key</span>
                      </button>
                    </div>
                  )}
                </label>

                {/* 2. Cash on Delivery Option */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`block p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-neutral-900 bg-neutral-50/80 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-neutral-200 text-neutral-800 flex items-center justify-center shrink-0">
                        <Banknote className="w-5 h-5 text-neutral-700" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">Cash on Delivery (COD)</p>
                        <p className="text-xs text-neutral-500">Pay cash upon parcel arrival at your doorstep</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-neutral-900"
                    />
                  </div>
                </label>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Delivery Notes or Special Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Leave with building concierge or front porch..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-neutral-600 hover:text-neutral-900"
                >
                  Back to Address
                </button>

                <button
                  type="submit"
                  disabled={submitting || isOpeningRazorpay}
                  className="w-full sm:w-auto py-3.5 px-8 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isOpeningRazorpay
                      ? 'Opening Razorpay Popup...'
                      : submitting
                      ? 'Finalizing Order...'
                      : paymentMethod === 'RAZORPAY'
                      ? `Open Razorpay & Pay ₹${inrTotal}`
                      : `Place COD Order ($${cart.finalTotal.toFixed(2)})`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary: 5 Columns */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Order Items ({cart.totalItems})
            </h3>

            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3">
                  <div className="w-14 h-16 bg-neutral-100 rounded overflow-hidden shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-900 truncate">{item.productName}</h4>
                    <p className="text-[11px] text-neutral-500">
                      {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                    </p>
                    <span className="text-xs font-bold font-mono tabular-nums text-neutral-900 mt-1 block">
                      ${item.itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900">${cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  {cart.deliveryCharge === 0 ? 'FREE' : `$${cart.deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total Amount</span>
                <div className="text-right">
                  <span className="font-mono tabular-nums block">${cart.finalTotal.toFixed(2)} USD</span>
                  <span className="font-mono text-xs text-emerald-700 font-semibold block">≈ ₹{inrTotal} INR</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Razorpay Official Checkout Guarantee</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                When you click "Open Razorpay & Pay", the official Razorpay Checkout popup will appear directly on screen for secure UPI/Card authorization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-neutral-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-neutral-700" />
                <span>Razorpay Key Configuration</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-xs text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Razorpay Key ID (rzp_test_... or rzp_live_...)
                </label>
                <input
                  type="text"
                  required
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  placeholder="rzp_test_XXXXXXXXXXXXXX"
                  className="w-full text-xs font-mono px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  You can get your test or live Key ID from your Razorpay Dashboard &rarr; Settings &rarr; API Keys.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetKey}
                  className="text-xs text-neutral-600 hover:underline"
                >
                  Reset to Default Test Key
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-3.5 py-2 text-xs text-neutral-700 hover:bg-neutral-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
